// Middleware to check if a user is authenticated
exports.isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
    next(); // Pass control to the next middleware or controller
  };
  
  // Middleware to check if user is an admin
  exports.isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
  };
  