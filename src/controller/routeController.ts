import { Request, Response } from "express"
import { RouteModel } from "../models/routeModel"

export const createRoute = async (req: Request, res: Response) => {
  try {
    const { from, to, distanceKm, durationHours } = req.body
    const route = await RouteModel.create({ from, to, distanceKm, durationHours })
    res.status(201).json({ message: "Route configured", data: route })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const getAllRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await RouteModel.find()
    res.status(200).json({ message: "success", data: routes })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}