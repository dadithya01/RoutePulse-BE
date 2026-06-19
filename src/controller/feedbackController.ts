import { Request, Response } from "express"
import { FeedbackModel } from "../models/feedbackModel"

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    // 🌟 1. Add busId to the destructured body parameters
    const { rating, comment, category, busId } = req.body
    const userId = (req as any).user.sub

    const feedback = await FeedbackModel.create({
      user: userId,
      bus: busId || null,
      rating,
      comment,
      category
    })

    res.status(201).json({ 
      message: "Thank you for your feedback!", 
      data: feedback 
    })
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

export const submitQrFeedback = async (req: any, res: Response) => {
  try {
    const { rating, comment, busId } = req.body // 📥 You accept busId from frontend/Postman

    if (!busId) {
      return res.status(400).json({ message: "Bad Request: Bus ID is required for QR feedback." })
    }

    const qrFeedback = await FeedbackModel.create({
      user: null,
      bus: busId, // 🌟 Ensure this matches the key 'bus' defined in your feedbackSchema!
      rating,
      comment,
      category: "Bus"
    })

    res.status(201).json({ 
      message: "Thank you! Your public vehicle feedback has been recorded.", 
      data: qrFeedback 
    })
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message || err })
  }
}

export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const feedbacks = await FeedbackModel.find()
      .populate("user", "name email")
      .populate("bus", "busNumber busType")
      .sort({ createdAt: -1 })

    const appFeedbacks = feedbacks.filter(f => f.user !== null)
    const qrFeedbacks = feedbacks.filter(f => f.user === null)

    res.status(200).json({ 
      message: "success", 
      totalCount: feedbacks.length,
      data: {
        allFeedbacks: feedbacks,
        appFeedbacks: appFeedbacks,
        qrFeedbacks: qrFeedbacks
      }
    })
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}