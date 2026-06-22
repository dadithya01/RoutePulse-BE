import { Document, model, Schema, Types } from "mongoose"

export interface ITrip extends Document {
  busId: Types.ObjectId
  routeId: Types.ObjectId
  departureTime: Date
  arrivalTime: Date
  fare: number
  bookedSeats: number[]
  totalSeats: number
}

const tripSchema = new Schema<ITrip>(
  {
    busId: { type: Schema.Types.ObjectId, ref: "Bus", required: true },
    routeId: { type: Schema.Types.ObjectId, ref: "Route", required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    fare: { type: Number, required: true },
    bookedSeats: { type: [Number], default: [] },
    totalSeats: { type: Number, required: true }
  },
  { timestamps: true }
)

export const TripModel = model<ITrip>("Trip", tripSchema)