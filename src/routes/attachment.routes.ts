import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { fileValidation } from "../validations/attachment.validation.js";
import { deleteAttachment, downlodAttachment, getAttachments, uploadAttachment } from "../controllers/attachment.controller.js";
import { upload } from "../services/upload.service.js";

const router = Router();

router.use(authenticate);
router.use(requireAuth); 

router.route('/notes/:id/attachments').get(getAttachments);
router.route('/notes/:id/attachments').post(upload.array("files", 5), fileValidation, uploadAttachment);
router.route('/attachments/:id/download').get(downlodAttachment);
router.route('/notes/:id/attachments/:attachmentId').delete(deleteAttachment);

export default router;