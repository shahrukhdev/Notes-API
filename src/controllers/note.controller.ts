import { Request, Response } from 'express';
import noteService from '../services/note.service.js';
import { NoteInput } from '../validations/note.validation.js';
import { getParam } from '../utils/getParam.js';
import AppError from '../utils/AppError.js';

export const getNotes = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const search = req.query.search as string;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const isPinned = req.query.isPinned ? true : undefined;
        const isArchived = req.query.isArchived ? true: undefined;

        const result = await noteService.fetchNotes(userId, search, page, limit, isPinned, isArchived);

        return res.status(200).json({
            success: true,
            message: 'Notes retrieved successfully',
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again!',
        });
  }
};

export const createNote = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const body = req.body as NoteInput;

        const note = await noteService.addNote(userId, body);

        return res.status(201).json({
            success: true,
            message: 'Note added successfully',
            data: note,
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again!',
        });
   }
};

export const updateNote = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const id = getParam(req, 'id');
        const body = req.body as NoteInput;

        const note = await noteService.updateNote(userId, id, body);

        return res.status(200).json({
            success: true,
            message: 'Note updated successfully',
            data: note,
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again!',
        });
    }
};

export const deleteNote = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id; 
        const id = getParam(req, 'id');

        await noteService.deleteNote(userId, id);

        return res.status(200).json({
            success: true,
            message: 'Note deleted successfully',
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again!',
        });
    }
};