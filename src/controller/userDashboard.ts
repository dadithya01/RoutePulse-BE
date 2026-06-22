import { Request, Response } from "express"
import { BookingModel } from "../models/bookingModel"
import { TripModel } from "../models/tripModel"
import { RouteModel } from "../models/routeModel"
import { UserModel } from "../models/userModel"
import { AuthRequest } from "../middleware/auth"

export const getUserDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.sub

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // 1. USER INFO
    const user = await UserModel.findById(userId).select("-password")

    // 2. BOOKINGS (with trip + route details)
    const bookings = await BookingModel.find({ userId })
      .populate({
        path: "tripId",
        populate: {
          path: "routeId",
          model: "Route"
        }
      })
      .sort({ createdAt: -1 })

    // 3. AVAILABLE TRIPS (simple feed)
    const trips = await TripModel.find({ departureTime: { $gte: new Date() } })
  .populate("routeId")
  .populate("busId")
  .sort({ departureTime: 1 })
  .limit(10)

    return res.status(200).json({
      user,
      bookings,
      trips
    })
  } catch (err) {
    return res.status(500).json({
      message: "Dashboard error",
      error: err
    })
  }
}