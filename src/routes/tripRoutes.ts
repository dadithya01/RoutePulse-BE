import { Router } from "express"
import { createTrip, getTripById, getTrips } from "../controller/tripController"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { UserRole } from "../models/userModel"

const router = Router()

router.get("/", authenticate, requireRole([UserRole.ADMIN, UserRole.USER]), getTrips)
router.get("/:id", authenticate, requireRole([UserRole.ADMIN, UserRole.USER]), getTripById)
router.post("/", authenticate, requireRole([UserRole.ADMIN]), createTrip)

export default router