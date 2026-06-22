import { Response } from "express"
import { AuthRequest } from "../middleware/auth"
import { TripModel } from "../models/tripModel"
import { BookingModel } from "../models/bookingModel"

export const bookSeats = async (req: AuthRequest, res: Response) => {
  try {
    const { tripId, seatNumbers } = req.body
    const userId = req.user.sub

    const trip = await TripModel.findById(tripId)
    if (!trip) return res.status(404).json({ message: "Trip context missing" })

    const updatedTrip = await TripModel.findOneAndUpdate(
      {
        _id: tripId,
        bookedSeats: { $nin: seatNumbers }
      },
      {
        $push: { bookedSeats: { $each: seatNumbers } }
      },
      { new: true }
    )

    if (!updatedTrip) {
      return res.status(400).json({ message: "Booking conflict! Selected seats are already booked." })
    }

    const totalPaid = seatNumbers.length * trip.fare
    const booking = await BookingModel.create({
      userId,
      tripId,
      seatNumbers,
      totalPaid
    })

    res.status(201).json({ message: "Seats locked successfully", data: booking })
  } catch (err) {
    res.status(500).json({ message: "Transaction failed", error: err })
  }
}

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await BookingModel.find({ userId: req.user.sub })
      .populate({
        path: "tripId",
        populate: [{ path: "busId" }, { path: "routeId" }]
      })
    res.status(200).json({ message: "success", data: bookings })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// controllers/bookingController.ts
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId } = req.params;
    
    // 1. Find the booking
    const booking = await BookingModel.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // 2. Update status
    booking.status = "CANCELLED";
    await booking.save();

    // 3. Remove seats from the Trip document
    await TripModel.findByIdAndUpdate(booking.tripId, {
      $pull: { bookedSeats: { $in: booking.seatNumbers } }
    });

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Cancellation failed", error: err });
  }
};