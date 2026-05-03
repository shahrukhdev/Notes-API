import Category from '../models/Category.js';
import Note from '../models/Note.js';
import AppError from '../utils/AppError.js';
import type { CategoryInput } from '../validations/category.validation.js';
import type { UpdateCategoryInput } from '../validations/category.validation.js';

const getCategories = async (userId: string, search?: string, page: number = 1, limit: number = 10) => {

  const query: any = { user: userId };

    if (search) {
        query.title = { $regex: search, $options: "i" };
    }

    const total = await Category.countDocuments(query);
    const skip = (page - 1) * limit;

    const categories = await Category.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    return {
        data: categories,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const addCategory = async (userId: string, data: CategoryInput) => {
  const { title } = data;

  const existing = await Category.findOne({ user: userId, title });

  if (existing) {
    throw new AppError('Category already exists.', 409);
  }

  const category = await Category.create({
    user: userId,
    title,
  });

  return category;
};

const updateCategory = async (
  userId: string,
  categoryId: string,
  data: UpdateCategoryInput
) => {
  const category = await Category.findOne({ _id: categoryId, user: userId });

  if (!category) {
    throw new AppError('Category not found.', 404);
  }

  if (data.title && data.title !== category.title) {
    const existing = await Category.findOne({
      user: userId,
      title: data.title,
    });

    if (existing) {
      throw new AppError('Category name already exists.', 409);
    }
  }

  if (data.title !== undefined) category.title = data.title;

  await category.save();

  return category;
};

const deleteCategory = async (userId: string, categoryId: string) => {
  const category = await Category.findOneAndDelete({
    _id: categoryId,
    user: userId,
  });
  
  if (!category) {
    throw new AppError('Category not found.', 404);
  }

  // Remove Category ID from relevant documents

  await Note.updateMany({ category: categoryId }, { $unset: { category: "" } } );

  return category;
};

export default {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};