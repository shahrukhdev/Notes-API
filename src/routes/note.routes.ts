import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { noteSchema } from "../validations/note.validation.js";
import { createNote, updateNote, getNotes, deleteNote } from "../controllers/note.controller.js";

const router = Router();

router.use(authenticate);
router.use(requireAuth); 

router.route('/notes').get(getNotes);
router.route('/notes').post(validate(noteSchema), createNote);
router.route('/notes/:id').put(validate(noteSchema), updateNote);
router.route('/notes/:id').delete(deleteNote);

export default router;