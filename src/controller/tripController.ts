import { Request, Response } from "express"
import { TripModel } from "../models/tripModel"
import { RouteModel } from "../models/routeModel"

export const createTrip = async (req: Request, res: Response) => {
  try {
    const { busId, routeId, departureTime, arrivalTime, fare, totalSeats } = req.body
    
    const trip = await TripModel.create({
      busId,
      routeId,
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
      fare,
      totalSeats: totalSeats || 50, // Ensure this is provided
      bookedSeats: []
    })
    
    const populated = await trip.populate("busId")
    res.status(201).json({ message: "Trip active", data: populated })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err })
  }
}

export const getTrips = async (req: Request, res: Response) => {
  try {
    const trips = await TripModel.find({ departureTime: { $gte: new Date() } })
      .populate("routeId")
      .populate("busId")
      .sort({ departureTime: 1 })
    return res.status(200).json({ message: "success", data: trips })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const getTripById = async (req: Request, res: Response) => {
  try {
    const trip = await TripModel.findById(req.params.id).populate("busId").populate("routeId")
    if (!trip) return res.status(404).json({ message: "Trip context missing" })
    res.status(200).json({ message: "success", data: trip })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
