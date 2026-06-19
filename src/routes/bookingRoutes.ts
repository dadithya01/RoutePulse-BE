import { Router } from "express"
import { bookSeats, getMyBookings } from "../controller/bookingController"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { UserRole } from "../models/userModel"

const router = Router()

router.post("/", authenticate, requireRole([UserRole.USER ,UserRole.ADMIN]), bookSeats)
router.get("/my-history", authenticate,requireRole([UserRole.ADMIN, UserRole.USER]), getMyBookings)

export default router