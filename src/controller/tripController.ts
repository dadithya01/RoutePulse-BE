import { Request, Response } from "express"
import { TripModel } from "../models/tripModel"
import { RouteModel } from "../models/routeModel"

export const createTrip = async (req: Request, res: Response) => {
  try {
    const { busId, routeId, departureTime, arrivalTime, fare } = req.body
    const trip = await TripModel.create({
      busId,
      routeId,
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
      fare
    })
    res.status(201).json({ message: "Trip active", data: trip })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err })
  }
}

export const getTrips = async (req: Request, res: Response) => {
  try {
    const { from, to, date } = req.query
    if (!from || !to || !date) {
      return res.status(400).json({ message: "Missing lookup params (from, to, date)." })
    }

    const route = await RouteModel.findOne({ from: String(from), to: String(to) })
    if (!route) return res.status(200).json({ message: "success", data: [] })

    const start = new Date(String(date))
    start.setHours(0, 0, 0, 0)
    const end = new Date(String(date))
    end.setHours(23, 59, 59, 999)

    const trips = await TripModel.find({
      routeId: route._id,
      departureTime: { $gte: start, $lte: end }
    }).populate("busId").populate("routeId")

    res.status(200).json({ message: "success", data: trips })
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