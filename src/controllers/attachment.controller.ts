import fs from "fs";
import path from "path";
import { Request, Response } from 'express';
import attachmentService from '../services/attachment.service.js';
import { getParam } from '../utils/getParam.js';
import AppError from '../utils/AppError.js';

export const getAttachments = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id; 
        const id = getParam(req, 'id');

        const attachments = await attachmentService.fetchAttachments(userId, id);

        return res.status(200).json({
            success: true,
            message: 'Attachments retrieved successfully',
            data: attachments
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

export const uploadAttachment = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const id = getParam(req, 'id');

        if (!req.files || !(req.files instanceof Array)) {
            throw new AppError("No files uploaded", 400);
        }

        const files = req.files as Express.Multer.File[];

        const attachments = await attachmentService.uploadAttachment(userId, id, files);        

        return res.status(201).json({
            success: true,
            message: 'Attachments uploaded successfully',
            data: attachments,
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

export const downlodAttachment = async (req: Request, res: Response) => { 
    try {
        const userId = req.user!.id; 
        const id = getParam(req, 'id');

        const attachment = await attachmentService.downlodAttachment(userId, id);

        const filePath = path.join(process.cwd(), "uploads", path.basename(attachment.fileUrl));

        if (!fs.existsSync(filePath)) {
            throw new AppError("File not found on server", 404);
        }

        return res.download(filePath, attachment.fileName);
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

export const deleteAttachment = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id; 
        const id = getParam(req, 'id');
        const attachmentId = getParam(req, 'attachmentId');

        await attachmentService.deleteAttachment(userId, id, attachmentId);

        return res.status(200).json({
            success: true,
            message: 'Attachment deleted successfully',
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