import { Router } from "express"
import { createTrip, getTripById, getTrips } from "../controller/tripController"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { UserRole } from "../models/userModel"

const router = Router()

router.get("/", getTrips)
router.get("/:id", getTripById)
router.post("/", authenticate, requireRole([UserRole.ADMIN, UserRole.MANAGER]), createTrip)

export default router