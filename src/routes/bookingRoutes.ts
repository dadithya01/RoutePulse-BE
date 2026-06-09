import { Router } from "express"
import { bookSeats, getMyBookings } from "../controller/bookingController"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post("/", authenticate, bookSeats)
router.get("/my-history", authenticate, getMyBookings)

export default router