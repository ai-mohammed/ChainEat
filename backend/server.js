const express = require("express");
const app = express();
require("dotenv").config(); // Ensure env variables are loaded

// Import database connection (this also connects to MongoDB)
const db = require("./db");

// Middleware to parse JSON request bodies
app.use(express.json());

// Import and use restaurant routes
const restaurantRoutes = require("./routes/restaurantRoutes");
app.use("/restaurants", restaurantRoutes);

// Define a port and start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
