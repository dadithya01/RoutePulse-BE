import { Document, model, Schema } from "mongoose"

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  DRIVER = "DRIVER"
}

export interface IUser extends Document {
  name: string
  email: string
  password: string
  roles: UserRole[]
  licenseNumber?: string
  licenseExpiry?: Date
  experienceYears?: number
  emergencyContact?: string
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.USER]
    },
    licenseNumber: { type: String, sparse: true }, 
    licenseExpiry: { type: Date },
    experienceYears: { type: Number, default: 0 },
    emergencyContact: { type: String }
  },
  { timestamps: true }
)

export const UserModel = model<IUser>("User", userSchema)