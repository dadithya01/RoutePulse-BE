import { Router } from "express"
import { getMyDetails, login, refreshToken, register} from "../controller/authController"
import { authenticate } from "../middleware/auth"
import { getUserDashboard } from "../controller/userDashboard"

const router = Router()

router.post("/login", login)
router.get("/me", authenticate, getMyDetails)
router.post("/refresh", refreshToken)
router.post("/register", register)
router.get("/user/dashboard", authenticate, getUserDashboard)
// router.post("/admin/register", authenticate, requireRole([UserRole.ADMIN]), registerAdmin)

export default router