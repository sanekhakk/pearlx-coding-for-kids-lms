// backend/routes/demoBooking.js
const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

// Initialize Google Sheets API
const sheets = google.sheets("v4");

// Load credentials from environment variable or file
let authClient;

async function initializeAuth() {
  try {
    // Option 1: Using service account (recommended for production)
    const { GoogleAuth } = require("google-auth-library");
    
    const auth = new GoogleAuth({
      keyFilename: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || "./service-account-key.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    authClient = await auth.getClient();
    console.log("✅ Google Sheets authentication initialized");
  } catch (err) {
    console.error("❌ Failed to initialize Google Sheets auth:", err.message);
    throw new Error("Google Sheets authentication failed");
  }
}

// Initialize on server startup
initializeAuth().catch(err => console.error(err));

// POST /api/submit-demo-booking
router.post("/submit-demo-booking", async (req, res) => {
  try {
    const {
      source,
      studentName,
      studentGrade,
      country,
      state,
      languages,
      parentName,
      email,
      contactNumber,
      wantsDemoSession,
      preferredDate,
      preferredTime,
    } = req.body;

    // Validate required fields
    if (!studentName || !studentGrade || !parentName || !email || !contactNumber) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Get current timestamp
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // Prepare row data
    const rowData = [
      timestamp,
      source || "General",
      studentName,
      studentGrade,
      country,
      state,
      languages,
      parentName,
      email,
      contactNumber,
      wantsDemoSession === "yes" ? "Yes" : "No",
      preferredDate || "N/A",
      preferredTime || "N/A",
    ];

    // Get spreadsheet ID from environment
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    if (!spreadsheetId) {
      throw new Error("Spreadsheet ID not configured");
    }

    // Append to Google Sheets
    await sheets.spreadsheets.values.append(
      {
        auth: authClient,
        spreadsheetId: spreadsheetId,
        range: "Sheet1!A:M", // Adjust range based on your columns
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [rowData],
        },
      }
    );

    // Optional: Send confirmation email
    // (You can integrate with SendGrid, Nodemailer, etc.)

    return res.status(200).json({
      success: true,
      message: "Demo booking submitted successfully!",
    });
  } catch (err) {
    console.error("Demo booking submission error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to submit demo booking",
    });
  }
});

// Optional: GET /api/demo-bookings (for admin dashboard)
router.get("/demo-bookings", async (req, res) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId: spreadsheetId,
      range: "Sheet1",
    });

    const rows = response.data.values || [];
    const headers = rows[0];
    const bookings = rows.slice(1).map(row => {
      const booking = {};
      headers.forEach((header, i) => {
        booking[header] = row[i] || "";
      });
      return booking;
    });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (err) {
    console.error("Fetch bookings error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch bookings",
    });
  }
});

module.exports = router;