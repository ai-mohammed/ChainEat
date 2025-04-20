# Backend Structure Overview (Node.js + Express)

backend/
├── controllers/       # Logic for handling routes (e.g. auth, reservations, restaurants)
├── models/            # Mongoose schemas for User, Restaurant, Reservation
├── routes/            # Route definitions grouped by feature
├── middleware/        # Authentication/authorization logic
├── config/            # MongoDB and environment setup
├── server.js          # Main entry point
├── .env               # Environment variables
└── package.json       # Backend dependencies

## Notable Features
- Auth with JWT + cookie
- Role-based routes (user/admin)
- MongoDB with Mongoose
- RESTful API design



