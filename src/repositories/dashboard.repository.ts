import Category from "../models/Category.js";
import Note from "../models/Note.js";
import Tag from "../models/Tag.js";
import mongoose from "mongoose";

export const getNotesCount = async (userId: string): Promise<number> => {
    return await Note.countDocuments({ user: userId }); 
};

export const getWeeklyNotesCount = async (userId: string): Promise<number> => {
  const now = new Date();

  // Get start of week (Monday)
  const day = now.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = (day === 0 ? -6 : 1) - day; // adjust so Monday = start
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  // End of week (next Monday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return Note.countDocuments({
    user: userId,
    createdAt: {
      $gte: startOfWeek,
      $lt: endOfWeek,
    },
  });
};

export const getTagsCount = async (userId: string): Promise<number> => {
    return await Tag.countDocuments({ user: userId });
};

export const getCategoriesCount = async (userId: string): Promise<number> => {
    return await Category.countDocuments({ user: userId });
};

export const getRecentNotes = async (userId: string): Promise<any> => {
    return await Note.find({ user: userId }).populate('category', '_id title').sort({ createdAt: -1 }).limit(4);
};

export const getTags = async (userId: string): Promise<any> => {
    return await Tag.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
};
