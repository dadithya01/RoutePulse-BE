import { Request, Response } from "express"
import { BusModel } from "../models/busModel"

export const addBus = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a license photo." })
    }

    const { busNumber, busType, totalSeats } = req.body

    const exBus = await BusModel.findOne({ busNumber })
    if (exBus) return res.status(400).json({ message: "Bus number already exists" })

    const licensePhotoPath = req.file.path 

    const bus = await BusModel.create({ 
      busNumber, 
      busType, 
      totalSeats,
      licensePhoto: licensePhotoPath
    })

    res.status(201).json({ message: "Bus added successfully", data: bus })
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message || err })
  }
}

export const getAllBuses = async (req: Request, res: Response) => {
  try {
    const buses = await BusModel.find()
    res.status(200).json({ message: "success", data: buses })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}


