import fs from "fs"; 
import path from "path";
import { Types } from 'mongoose';
import Note from '../models/Note.js';
import AppError from '../utils/AppError.js';
import { NoteInput } from '../validations/note.validation.js';
import Attachment from '../models/Attachment.js';

const fetchNotes = async (userId: string, search?: string, page: number = 1, limit: number = 10, isPinned ?: boolean, isArchived ?: boolean) => {

  const query: any = { user: userId };

    if (search) {
        query.title = { $regex: search, $options: "i" };
    }
    
    if (isPinned !== undefined) {
      query.isPinned = true;
    }

    if (isArchived !== undefined) {
      query.isArchived = true;
    }

    const total = await Note.countDocuments(query);
    const skip = (page - 1) * limit;

    const notes = await Note.find(query).populate('category', '_id title').sort({ createdAt: -1 }).skip(skip).limit(limit);

    return {
        data: notes,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const addNote = async (userId: string, data: NoteInput) => {
  const { title, content, category, tagIds, isPinned, isArchived } = data;

  const note = await Note.create({
    title,
    content,
    user: userId,
    category: category ? new Types.ObjectId(category): undefined,
    tagIds: tagIds?.map((id: string) => new Types.ObjectId(id)) || [],
    isPinned: isPinned ?? false,
    isArchived: isArchived ?? false
  });

  return note;
};

const updateNote = async (
  userId: string,
  noteId: string,
  data: NoteInput
) => {
  const note = await Note.findOne({ _id: noteId, user: userId });

  if (!note) {
    throw new AppError('Note not found.', 404);
  }

  if (data.title !== undefined) note.title = data.title;
  if (data.content !== undefined) note.content = data.content;
  if (data.category !== undefined) note.category = data.category ? new Types.ObjectId(data.category) : undefined;
  if (data.tagIds !== undefined) note.tagIds = data.tagIds.length ? data.tagIds?.map((id: string) => new Types.ObjectId(id)) : [];
  if (data.isPinned !== undefined) note.isPinned = data.isPinned;
  if (data.isArchived !== undefined) note.isArchived = data.isArchived;

  await note.save();

  return note;
};

const deleteNote = async (userId: string, noteId: string) => {
  const note = await Note.findOneAndDelete({
    _id: noteId,
    user: userId,
  });
  
  if (!note) {
    throw new AppError('Note not found.', 404);
  }

  // 1. Get attachments first
  const attachments = await Attachment.find({
    user: userId,
    note: noteId,
  });

  // 2. Delete files from disk
  for (const file of attachments) {
    const filePath = path.join(
      process.cwd(),
      "uploads",
      path.basename(file.fileUrl)
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  // 3. Delete DB records
  await Attachment.deleteMany({ user: userId, note: noteId });

  return note;
};

export default {
  fetchNotes,
  addNote,
  updateNote,
  deleteNote,
};