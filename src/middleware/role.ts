import { NextFunction, Response } from "express"
import { AuthRequest } from "./auth"
import { UserRole } from "../models/userModel"

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: "Access denied. No roles specified." })
    }

    const hasRole = req.user.roles.some((role: UserRole) => allowedRoles.includes(role))

    if (!hasRole) {
      return res.status(403).json({ message: "Unauthorized! You lack the clearance for this operation." })
    }

    next()
  }
}