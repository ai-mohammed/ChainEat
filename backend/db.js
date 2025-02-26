const mongoose = require("mongoose");

// Use an environment variable for the connection string for security.
const mongoURI = process.env.MONGO_URI;
//  options that avoid deprecation warnings
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // confirms a successful connection
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  //  block logs any connection errors.
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Export the connection for use in other parts of the application (if needed)
module.exports = mongoose.connection;
