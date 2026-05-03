import { Request, Response } from 'express';
import tagService from '../services/tag.service.js';
import { TagInput } from '../validations/tag.validation.js';
import { getParam } from '../utils/getParam.js';
import AppError from '../utils/AppError.js';

export const getTags = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const search = req.query.search as string;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await tagService.fetchTags(userId, search, page, limit);

        return res.status(200).json({
            success: true,
            message: 'Tags retrieved successfully',
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

export const createTag = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const body = req.body as TagInput;

        const tag = await tagService.addTag(userId, body);

        return res.status(201).json({
            success: true,
            message: 'Tag created successfully',
            data: tag,
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

export const updateTag = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const id = getParam(req, 'id');
        const body = req.body as TagInput;

        const tag = await tagService.updateTag(userId, id, body);

        return res.status(200).json({
            success: true,
            message: 'Tag updated successfully',
            data: tag,
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

export const deleteTag = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id; 
        const id = getParam(req, 'id');

        await tagService.deleteTag(userId, id);

        return res.status(200).json({
            success: true,
            message: 'Tag deleted successfully',
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