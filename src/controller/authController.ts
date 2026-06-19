import { Request, Response } from "express"
import { UserModel, UserRole } from "../models/userModel"
import bcrypt from "bcryptjs"
import { signAccessToken, signRefreshToken } from "../utils/tokens"
import { AuthRequest } from "../middleware/auth"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      roles,
      licenseNumber,
      licenseExpiry,
      experienceYears,
      emergencyContact
    } = req.body

    // 1. check existing user
    const existing = await UserModel.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: "User already exists" })
    }

    // 2. hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. decide role safely
    let finalRoles: UserRole[] = [UserRole.USER]

    if (roles?.includes("DRIVER")) {
      finalRoles = [UserRole.DRIVER]
    }

    if (roles?.includes("ADMIN")) {
      finalRoles = [UserRole.ADMIN]
    }

    // 4. create user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      roles: finalRoles,

      // driver fields (optional)
      licenseNumber,
      licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : undefined,
      experienceYears: Number(experienceYears) || 0,
      emergencyContact
    })

    // 5. return response
    return res.status(201).json({
      message: "Registration successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    })
  } catch (err) {
    return res.status(500).json({
      message: "Registration failed",
      error: err
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })
    if (!user) return res.status(401).json({ message: "Invalid credentials..!" })

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.status(401).json({ message: "Invalid credentials..!" })

    const accessToken = signAccessToken(user)
    const refreshToken = signRefreshToken(user)

    res.status(200).json({
      message: "success",
      data: { email: user.email, roles: user.roles, accessToken, refreshToken }
    })
  } catch (err) {
    res.status(500).json({ message: "Login fail", error: err })
  }
}

export const getMyDetails = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" })
  const user = await UserModel.findById(req.user.sub).select("-password")
  if (!user) return res.status(404).json({ message: "User not found" })
  res.status(200).json({ message: "ok", data: { id: user._id, email: user.email, roles: user.roles } })
}


export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body
  try {
    if (!token) return res.status(400).json({ message: "Token required..!" })
    const payload: any = jwt.verify(token, JWT_REFRESH_SECRET)
    const user = await UserModel.findById(payload.sub)
    if (!user) return res.status(403).json({ message: "Invalid or expired token" })
    
    const newAccessToken = signAccessToken(user)
    res.status(200).json({ message: "", data: { accessToken: newAccessToken } })
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" })
  }
}