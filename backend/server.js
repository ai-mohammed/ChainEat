// Load the environment variables
require("dotenv").config();

// Import the express package
const express = require("express");
// Create an express application
const app = express();

// Import the db connection (which runs mongoose.connect in db.js)
const db = require("./db");

// Import additional dependencies for sessions
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const cors = require("cors"); // <-- Add this line

// Enable CORS (must be before routes)
app.use(
  cors({
    origin: "https://chaineat-nean.onrender.com", // Allow frontend requests
    credentials: true, // Allow cookies/sessions
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Parse incoming cookies
app.use(cookieParser());

// Configure session
app.use(
  session({
    // Use an environment variable for security
    secret: process.env.SESSION_SECRET,
    resave: false, // Don't save session if not modified
    saveUninitialized: false, // Don't create session until something stored
    store: MongoStore.create({
      // Use the same Mongo URI from your db.js (or client)
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      // Session expires in 1 hour (in milliseconds)
      maxAge: 1000 * 60 * 60,
    },
  })
);

// Import restaurant routes
const restaurantRoutes = require("./routes/restaurantRoutes");
// Import the auth routes
const authRoutes = require("./routes/authRoutes");
// Import the reservation routes
const reservationRoutes = require("./routes/reservationRoutes");

// Mount the routes
app.use("/restaurants", restaurantRoutes);
app.use("/auth", authRoutes);
app.use("/reservations", reservationRoutes);

// Simple home route or test route
app.get("/", (req, res) => {
  res.send("Welcome to the ChainEats backend!");
});

// Start the server on a port from .env
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
