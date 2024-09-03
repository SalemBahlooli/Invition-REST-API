const express = require("express");
const { body, validationResult } = require("express-validator");

const occasionRoutes = require("./app/routes/occasionRoutes");
const invitationRoutes = require("./app/routes/invitationRoutes");
const authRoutes = require("./app/routes/authRoutes");

const authMiddleware = require("./app/middleware/auth");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Invitation System API" });
});

// Auth routes (unprotected)
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/occasions", authMiddleware, occasionRoutes);
app.use("/api/invitations", authMiddleware, invitationRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
