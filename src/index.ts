import { Router } from "express";
import authRoutes from "./routes/auth.routes.js";
import attachmentRoutes from "./routes/attachment.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import noteRoutes from "./routes/note.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import userRoutes from "./routes/user.routes.js";
// import incomeRoutes from "./routes/income.routes.js";
// import recurringExpenseRoutes from "./routes/recurring.expense.routes.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/', attachmentRoutes);
router.use('/', categoryRoutes);
router.use('/', dashboardRoutes);
router.use('/', noteRoutes);
router.use('/', tagRoutes);
router.use('/', userRoutes);
// router.use('/', incomeRoutes);
// router.use('/', recurringExpenseRoutes);

export default router;



