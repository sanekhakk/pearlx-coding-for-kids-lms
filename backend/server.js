// backend/server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware MUST come before routes so request bodies are parsed
app.use(cors({
  origin: [
    "https://pearlx-webstudio.vercel.app",
    "https://www.pearlx.in",
    "https://pearlx.in",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());

app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Routes come AFTER middleware
const adminRoutes = require("./routes/admin");
const demoBookingRoutes = require("./routes/demoBooking");

app.use("/api", demoBookingRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "BrainBugz backend running" });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

// At the bottom of server.js, after app.listen(...)
if (process.env.NODE_ENV === "production") {
  const BACKEND_URL = process.env.RENDER_EXTERNAL_URL || `https://brainbugz-learning-management-system.onrender.com`;
  setInterval(() => {
    fetch(`${BACKEND_URL}/`)
      .then(() => console.log("Keep-alive ping sent"))
      .catch(err => console.error("Keep-alive failed:", err));
  }, 10 * 60 * 1000); // ping every 10 minutes
}