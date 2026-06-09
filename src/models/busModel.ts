import { Document, model, Schema } from "mongoose"

export interface IBus extends Document {
  busNumber: string
  busType: "AC" | "Non-AC" | "Luxury"
  totalSeats: number
  licensePhoto: string
}

const busSchema = new Schema<IBus>(
  {
    busNumber: { type: String, required: true, unique: true },
    busType: { type: String, enum: ["AC", "Non-AC", "Luxury"], required: true },
    totalSeats: { type: Number, default: 40 },
    licensePhoto: {type: String,required: true}
  },
  { timestamps: true }
)

export const BusModel = model<IBus>("Bus", busSchema)