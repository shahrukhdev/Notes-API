import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { tagSchema } from "../validations/tag.validation.js";
import { createTag, deleteTag, getTags, updateTag } from "../controllers/tag.controller.js";

const router = Router();

router.use(authenticate);
router.use(requireAuth); 

router.route('/tags').get(getTags);
router.route('/tags').post(validate(tagSchema), createTag);
router.route('/tags/:id').put(validate(tagSchema), updateTag);
router.route('/tags/:id').delete(deleteTag);

export default router;