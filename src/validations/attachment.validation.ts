import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError.js';
import { MAX_FILE_SIZE, MAX_FILE_COUNT } from '../constants/attachment.constants.js';

export const fileValidation = (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return next(new AppError("No files uploaded", 400));
  }

  if (files.length > MAX_FILE_COUNT) {
    return next(new AppError(`Too many files. Max ${MAX_FILE_COUNT} allowed`, 422));
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return next(new AppError(`File too large: ${file.originalname} (max 10MB)`, 422));
    }
  }

  next();
};