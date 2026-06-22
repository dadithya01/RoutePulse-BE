# RoutePulse BE

The REST API backend for RoutePulse — a bus booking platform. Built with Node.js, Express, and MongoDB (Atlas), it handles authentication, trip management, seat booking, and role-based access control across three user roles: User, Admin, and Driver.

---

## Live URL
https://route-pulse-be.vercel.app/

## Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** for routing and middleware
- **Mongoose** for MongoDB object modelling
- **MongoDB Atlas** as the cloud database
- **JWT** for authentication (access + refresh tokens)
- **bcrypt** for password hashing

---

## Features

- JWT-based authentication with access and refresh token support
- Role-based access control (USER, ADMIN, DRIVER)
- Trip management with route and bus population
- Seat booking with conflict prevention
- User dashboard aggregating bookings and upcoming trips
- RESTful API consumed by the RoutePulse frontend

---

## Project Structure

```
src/
├── controller/
│   ├── authController.ts
│   ├── tripController.ts
│   ├── bookingController.ts
│   └── userDashboard.ts
├── middleware/
│   ├── auth.ts           # JWT authentication (sets req.user)
│   └── role.ts           # Role-based access guard
├── models/
│   ├── userModel.ts      # User schema with roles
│   ├── tripModel.ts      # Trip schema (busId, routeId, times, fare)
│   ├── bookingModel.ts   # Booking schema (userId, tripId, seats, status)
│   ├── routeModel.ts     # Route schema (from, to, distance, duration)
│   └── busModel.ts       # Bus schema (plateNumber, totalSeats, model)
├── routes/
│   ├── authRoutes.ts     # /auth/*
│   ├── tripRoutes.ts     # /trips/*
│   ├── bookingRoutes.ts  # /bookings/*
│   ├── routeRoutes.ts    # /routes/*
│   └── busRoutes.ts      # /buses/*
└── index.ts              # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (free tier works fine)
- The [RoutePulse frontend](https://github.com/dadithya01/RoutePulse-FE) (optional, for full-stack use)

### Installation

```bash
git clone https://github.com/dadithya01/RoutePulse-BE.git
cd RoutePulse-BE
npm install
```

### Environment Setup

Create a `.env` file in the root of the project:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Replace the `MONGO_URI` with your actual Atlas connection string.

### Running the App

**Development** (with auto-reload):
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

The server will start at `http://localhost:5000`.

---

## API Reference

### Auth — `/auth`

| Method | Endpoint              | Auth | Description                  |
|--------|-----------------------|------|------------------------------|
| POST   | /auth/register        | ✗    | Register a new user          |
| POST   | /auth/login           | ✗    | Login and receive tokens     |
| POST   | /auth/refresh         | ✗    | Refresh access token         |
| GET    | /auth/me              | ✓    | Get current user details     |
| GET    | /auth/user/dashboard  | ✓    | User dashboard (bookings + upcoming trips) |

### Trips — `/trips`

| Method | Endpoint      | Auth | Role         | Description              |
|--------|---------------|------|--------------|--------------------------|
| GET    | /trips        | ✓    | USER, ADMIN  | List all upcoming trips  |
| GET    | /trips/:id    | ✓    | USER, ADMIN  | Get trip by ID           |
| POST   | /trips        | ✓    | ADMIN        | Create a new trip        |

### Bookings — `/bookings`

| Method | Endpoint               | Auth | Role         | Description              |
|--------|------------------------|------|--------------|--------------------------|
| POST   | /bookings              | ✓    | USER, ADMIN  | Book seats on a trip     |
| GET    | /bookings/my-history   | ✓    | USER, ADMIN  | Get current user's bookings |

### Routes — `/routes`

| Method | Endpoint   | Auth | Role         | Description         |
|--------|------------|------|--------------|---------------------|
| GET    | /routes    | ✓    | USER, ADMIN  | List all routes     |
| POST   | /routes    | ✓    | ADMIN        | Create a new route  |

### Buses — `/buses`

| Method | Endpoint   | Auth | Role           | Description          |
|--------|------------|------|----------------|----------------------|
| GET    | /buses     | ✓    | USER, ADMIN    | List all buses       |
| POST   | /buses     | ✓    | DRIVER, ADMIN  | Register a new bus   |

---

## Data Models

### User
```ts
{
  name: string
  email: string
  password: string        // bcrypt hashed
  roles: UserRole[]       // "USER" | "ADMIN" | "DRIVER"
}
```

### Trip
```ts
{
  busId: ObjectId         // ref: Bus
  routeId: ObjectId       // ref: Route
  departureTime: Date
  arrivalTime: Date
  fare: number
  bookedSeats: number[]
}
```

### Booking
```ts
{
  userId: ObjectId        // ref: User
  tripId: ObjectId        // ref: Trip
  seatNumbers: number[]
  totalPaid: number
  status: "CONFIRMED" | "CANCELLED"
}
```

### Route
```ts
{
  from: string
  to: string
  distanceKm: number
  durationHours: number
}
```

### Bus
```ts
{
  plateNumber: string
  totalSeats: number
  model?: string
}
```

---

## Role-Based Access

Authentication is handled via the `authenticate` middleware which reads and verifies the JWT from the `Authorization: Bearer <token>` header and sets `req.user`. The `requireRole` middleware then checks `req.user.roles` against the allowed roles for that route.

| Role   | Permissions                                              |
|--------|----------------------------------------------------------|
| USER   | Browse trips, book seats, view own dashboard/bookings    |
| ADMIN  | All USER permissions + create trips, routes              |
| DRIVER | Register buses                                           |

---

## Frontend

This backend is designed to work with the RoutePulse frontend:
[https://github.com/dadithya01/RoutePulse-FE](https://github.com/dadithya01/RoutePulse-FE)

---

## License

MIT