import { Router } from "express"
import { getMyDetails, login, refreshToken, registerAdmin, registerUser } from "../controller/authController"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post("/register", registerUser)
router.post("/login", login)
router.get("/me", authenticate, getMyDetails)
router.post("/refresh", refreshToken)
router.post("/admin/register", registerAdmin)
// router.post("/admin/register", authenticate, requireRole([UserRole.ADMIN]), registerAdmin)

export default router