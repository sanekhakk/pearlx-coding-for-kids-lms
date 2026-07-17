const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");

// Initialize Google Sheets API
const sheets = google.sheets("v4");

let authClient;

// Initialize Google Auth
async function initializeAuth() {
  try {
    // Check if env variable exists
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is missing");
    }

    // Parse service account JSON
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    );

    // Fix private key formatting for Render/Vercel
    if (serviceAccount.private_key) {
      serviceAccount.private_key =
        serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    // Create auth client
    const auth = new GoogleAuth({
      credentials: serviceAccount,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    authClient = await auth.getClient();

    console.log("✅ Google Sheets authentication initialized");
  } catch (err) {
    console.error(
      "❌ Failed to initialize Google Sheets auth:",
      err.message
    );

    throw new Error("Google Sheets authentication failed");
  }
}

// Initialize on startup
initializeAuth().catch((err) => console.error(err));

// Human-readable labels for the programInterest value sent from the modal
const PROGRAM_INTEREST_LABELS = {
  coding: "Coding Classes",
  academic_tuition: "Academic Tuition (Class 1-12)",
  courses: "Courses",
};

// POST /api/submit-demo-booking
router.post("/submit-demo-booking", async (req, res) => {
  try {
    const {
      source,
      programInterest,
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
    if (
      !programInterest ||
      !studentName ||
      !studentGrade ||
      !parentName ||
      !email ||
      !contactNumber
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Get Spreadsheet ID
    const spreadsheetId =
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error(
        "GOOGLE_SHEETS_SPREADSHEET_ID is missing"
      );
    }

    // Timestamp
    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    // Row data
    const rowData = [
      timestamp,
      source || "General",
      PROGRAM_INTEREST_LABELS[programInterest] || programInterest,
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

    // Append to Google Sheet
    await sheets.spreadsheets.values.append({
      auth: authClient,
      spreadsheetId,
      range: "Sheet1!A:N",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [rowData],
      },
    });

    return res.status(200).json({
      success: true,
      message: "Demo booking submitted successfully!",
    });
  } catch (err) {
    console.error(
      "❌ Demo booking submission error:",
      err
    );

    return res.status(500).json({
      success: false,
      error:
        err.message || "Failed to submit demo booking",
    });
  }
});

// GET /api/demo-bookings
router.get("/demo-bookings", async (req, res) => {
  try {
    const spreadsheetId =
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error(
        "GOOGLE_SHEETS_SPREADSHEET_ID is missing"
      );
    }

    const response =
      await sheets.spreadsheets.values.get({
        auth: authClient,
        spreadsheetId,
        range: "Sheet1",
      });

    const rows = response.data.values || [];

    const headers = rows[0] || [];

    const bookings = rows.slice(1).map((row) => {
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
    console.error("❌ Fetch bookings error:", err);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch bookings",
    });
  }
});

module.exports = router;