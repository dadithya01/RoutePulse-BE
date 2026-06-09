import { Document, model, Schema } from "mongoose"

export interface IRoute extends Document {
  from: string
  to: string
  distanceKm: number
  durationHours: number
}

const routeSchema = new Schema<IRoute>(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    durationHours: { type: Number, required: true }
  },
  { timestamps: true }
)

export const RouteModel = model<IRoute>("Route", routeSchema)