import { Router } from "express"
import { createRoute, getAllRoutes } from "../controller/routeController"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { UserRole } from "../models/userModel"

const router = Router()

router.get("/", authenticate, getAllRoutes)
router.post("/", authenticate, requireRole([UserRole.ADMIN]), createRoute)

export default router