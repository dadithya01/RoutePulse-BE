import dns from "node:dns"
dns.setServers(["8.8.8.8", "8.8.4.4"])

import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

import authRoutes from "./routes/authRoutes"
import busRoutes from "./routes/busRoutes"
import routeRoutes from "./routes/routeRoutes"
import tripRoutes from "./routes/tripRoutes"
import bookingRoutes from "./routes/bookingRoutes"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/buses", busRoutes)
app.use("/api/v1/routes", routeRoutes)
app.use("/api/v1/trips", tripRoutes)
app.use("/api/v1/bookings", bookingRoutes)

const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI as string

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected securely to MongoDB Database Cluster 🔌")
    app.listen(PORT, () => console.log(`Application actively handling streams on port ${PORT} 🚀`))
  })
  .catch((err) => {
    console.error("Database connection configuration failed: ", err)
  })