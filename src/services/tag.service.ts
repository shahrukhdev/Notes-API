import Tag from '../models/Tag.js';
import Note from '../models/Note.js';
import AppError from '../utils/AppError.js';
import { TagInput } from '../validations/tag.validation.js';
import slugify from "slugify";
import { Types } from 'mongoose';

const fetchTags = async (
  userId: string,
  search?: string,
  page: number = 1,
  limit: number = 10
) => {
  const match: any = { user: new Types.ObjectId(userId) };

  if (search) {
    match.name = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [result] = await Tag.aggregate([
    { $match: match },

    {
      $lookup: {
        from: "notes", // collection name (lowercase plural usually)
        localField: "_id",
        foreignField: "tagIds",
        as: "notes"
      }
    },

    {
      $addFields: {
        noteCount: { $size: "$notes" }
      }
    },

    {
      $project: {
        notes: 0 // remove heavy array
      }
    },

    { $sort: { createdAt: -1 } },

    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit }
        ],
        pagination: [
          { $count: "total" }
        ]
      }
    }
  ]);

  const total = result.pagination[0]?.total || 0;

  return {
    data: result.data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const addTag = async (userId: string, data: TagInput) => {
  const { name, isActive } = data;

  const existing = await Tag.findOne({ user: userId, name });

  if (existing) {
    throw new AppError('Tag already exists.', 409);
  }

  const tag = await Tag.create({
    name,
    slug: name ? slugify(name, { lower: true, strict: true }) : "",
    user: userId,
    isActive: isActive ?? false
  });

  return tag;
};

const updateTag = async (
  userId: string,
  tagId: string,
  data: TagInput
) => {
  const tag = await Tag.findOne({ _id: tagId, user: userId });

  if (!tag) {
    throw new AppError('Tag not found.', 404);
  }

  if (data.name && data.name !== tag.name) {
    const existing = await Tag.findOne({
      user: userId,
      name: data.name,
    });

    if (existing) {
      throw new AppError('Tag name already exists.', 409);
    }
  }

  if (data.name !== undefined) tag.name = data.name;
  if (data.name !== undefined) tag.slug = slugify(data.name, { lower: true, strict: true });
  if (data.isActive !== undefined) tag.isActive = data.isActive;

  await tag.save();

  return tag;
};

const deleteTag = async (userId: string, tagId: string) => {
  const tag = await Tag.findOneAndDelete({
    _id: tagId,
    user: userId,
  });
  
  if (!tag) {
    throw new AppError('Tag not found.', 404);
  }

  // Remove Tag ID from relevant documents

  await Note.updateMany({ tagIds: new Types.ObjectId(tagId) }, { $pull: { tagIds: new Types.ObjectId(tagId) } } );

  return tag;
};

export default {
  fetchTags,
  addTag,
  updateTag,
  deleteTag,
};