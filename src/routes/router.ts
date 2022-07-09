import { Router } from "express";
import authRouter from "./starRoute.js";

const router = Router();
router.use(authRouter);

export default router;