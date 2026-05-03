import fs from "fs";
import path from "path";
import Attachment from '../models/Attachment.js';
import AppError from '../utils/AppError.js';

const fetchAttachments = async (userId: string, noteId: string) => {
  const attachments = await Attachment.find({ user: userId, note: noteId }).sort({ createdAt: -1 });

  return attachments;
};

const uploadAttachment = async (userId: string, noteId: string, files: Express.Multer.File[]) => {
  
    const attachments = files.map((file) => ({
      note: noteId,
      user: userId,
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      fileExtension: path.extname(file.originalname).replace(".", ""),
      fileType: file.mimetype,
      size: file.size
    }));

    return await Attachment.insertMany(attachments);
};

const downlodAttachment = async (userId: string, attachmentId: string) => {
  const attachment = await Attachment.findOne({
    _id: attachmentId,
    user: userId,
  });
  
  if (!attachment) {
    throw new AppError('Attachment not found.', 404);
  }

  return attachment;
};

const deleteAttachment = async (userId: string, noteId: string, attachmentId: string) => {
  const attachment = await Attachment.findOne({
    _id: attachmentId,
    note: noteId,
    user: userId,
  });

  if (!attachment) {
    throw new AppError('Attachment not found.', 404);
  }

  const filePath = path.join(
    process.cwd(),
    "uploads",
    path.basename(attachment.fileUrl)
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await attachment.deleteOne();
};

export default {
  fetchAttachments,
  uploadAttachment,
  downlodAttachment,
  deleteAttachment,
};