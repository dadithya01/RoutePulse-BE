import { Router } from "express"
import { addBus, getAllBuses } from "../controller/busController"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { UserRole } from "../models/userModel"
import { uploadLicense } from "../middleware/upload"

const router = Router()

router.get("/", authenticate,requireRole([UserRole.ADMIN]), getAllBuses)
router.post("/", authenticate, requireRole([UserRole.DRIVER]), uploadLicense.single('licensePhoto'), addBus)

export default router