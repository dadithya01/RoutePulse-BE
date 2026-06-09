import { Document, model, Schema, Types } from "mongoose"

export interface IBooking extends Document {
  userId: Types.ObjectId
  tripId: Types.ObjectId
  seatNumbers: number[]
  totalPaid: number
  status: "CONFIRMED" | "CANCELLED"
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    seatNumbers: { type: [Number], required: true },
    totalPaid: { type: Number, required: true },
    status: { type: String, enum: ["CONFIRMED", "CANCELLED"], default: "CONFIRMED" }
  },
  { timestamps: true }
)

export const BookingModel = model<IBooking>("Booking", bookingSchema)