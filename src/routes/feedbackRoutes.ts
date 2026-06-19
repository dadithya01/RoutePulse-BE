import { Router } from "express"
import { getAllFeedback, submitFeedback, submitQrFeedback } from "../controller/feedbackController"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { UserRole } from "../models/userModel"

const router = Router()

router.post("/", authenticate, requireRole([UserRole.USER]), submitFeedback)

router.post("/qr", submitQrFeedback)

router.get("/", authenticate, requireRole([UserRole.ADMIN]), getAllFeedback)

export default router