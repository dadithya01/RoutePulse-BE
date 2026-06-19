import { Document, model, Schema } from "mongoose"

export interface IFeedback extends Document {
  user: Schema.Types.ObjectId | null
  bus: Schema.Types.ObjectId | null
  rating: number
  comment: string
  category: "Bus" | "Driver" | "App Experience" | "Other"
}

const feedbackSchema = new Schema<IFeedback>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
    bus: { type: Schema.Types.ObjectId, ref: "Bus", required: false, default: null },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    category: {
      type: String,
      enum: ["Bus", "Driver", "App Experience", "Other"],
      default: "Other"
    }
  },
  { timestamps: true }
)

export const FeedbackModel = model<IFeedback>("Feedback", feedbackSchema)