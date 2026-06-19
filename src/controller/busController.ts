import { Request, Response } from "express"
import { BusModel } from "../models/busModel"
import QRCode from "qrcode"
import mongoose from "mongoose"
import { AuthRequest } from "../middleware/auth"

export const addBus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Session missing" })
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a license photo." })
    }

    const { busNumber, busType, totalSeats } = req.body
    const driverId = req.user.sub

    const exBus = await BusModel.findOne({ busNumber })
    if (exBus) return res.status(400).json({ message: "Bus number already exists" })

    const licensePhotoPath = req.file.path 
    const busId = new mongoose.Types.ObjectId()

    const publicFeedbackUrl = `http://localhost:5000/api/v1/feedback/qr?busId=${busId}&busNumber=${encodeURIComponent(busNumber)}&busType=${encodeURIComponent(busType)}`
    const generatedQrCode = await QRCode.toDataURL(publicFeedbackUrl)

    const bus = await BusModel.create({
      _id: busId, 
      busNumber, 
      busType, 
      totalSeats,
      licensePhoto: licensePhotoPath,
      qrCode: generatedQrCode,
      assignedDriver: driverId
    })

    res.status(201).json({ message: "Bus added successfully", publicFeedbackUrl: publicFeedbackUrl, data: bus })
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message || err })
  }
}

export const getAllBuses = async (req: Request, res: Response) => {
  try {
    const buses = await BusModel.find().populate("assignedDriver", "name email")
    res.status(200).json({ message: "success", data: buses })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}


