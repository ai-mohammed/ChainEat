// backend/server.js

// 1) Load environment variables
require("dotenv").config();

// 2) Import express
const express = require("express");
const app = express();

// 3) Import the db connection (which runs mongoose.connect in db.js)
const db = require("./db");

// 4) Import additional dependencies for sessions
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

// 5) Middleware to parse JSON request bodies
app.use(express.json());

// 6) Parse incoming cookies
app.use(cookieParser());

// 7) Configure session
app.use(
  session({
    // Use an environment variable for security
    secret: process.env.SESSION_SECRET || "someSecretKey",
    resave: false, // Don't save session if not modified
    saveUninitialized: false, // Don't create session until something stored
    store: MongoStore.create({
      // Use the same Mongo URI from your db.js (or client)
      mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
      // Session expires in 1 hour (in milliseconds)
      maxAge: 1000 * 60 * 60
    }
  })
);

// 8) Import your existing restaurant routes
const restaurantRoutes = require("./routes/restaurantRoutes");
// 9) Import the newly created auth routes
const authRoutes = require("./routes/authRoutes");

// 10) Mount the routes
app.use("/restaurants", restaurantRoutes);
app.use("/auth", authRoutes);

// 11) Simple home route or test route
app.get("/", (req, res) => {
  res.send("Welcome to the ChainEats backend!");
});

// 12) Start the server on a port from .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
