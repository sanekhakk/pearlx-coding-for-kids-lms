const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
const nodemailer = require("nodemailer");

// Initialize Google Sheets API
const sheets = google.sheets("v4");

let authClient;

/**
 * Resolves credentials the same way firebaseAdmin.js does, checked in order:
 *   1. FIREBASE_SERVICE_ACCOUNT_KEY — full service-account JSON as a string.
 *   2. GOOGLE_SERVICE_ACCOUNT_KEY_PATH / GOOGLE_APPLICATION_CREDENTIALS — a
 *      path to the downloaded service-account .json key file (what this
 *      project's .env actually sets).
 *
 * Returns GoogleAuth constructor options ({ credentials } or { keyFile }).
 *
 * NOTE: whichever service account this resolves to must be shared as an
 * Editor on the target Google Sheet (GOOGLE_SHEETS_SPREADSHEET_ID) via the
 * Sheet's "Share" dialog, using the service account's client_email — a
 * Firebase Admin key alone doesn't grant Sheets access, that's a separate,
 * explicit grant in Google Sheets itself.
 */
function loadGoogleAuthOptions() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }
    return { credentials: serviceAccount };
  }

  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (keyPath) {
    const resolved = path.resolve(keyPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(
        `Service account key file not found at "${resolved}" (from ${
          process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH ? "GOOGLE_SERVICE_ACCOUNT_KEY_PATH" : "GOOGLE_APPLICATION_CREDENTIALS"
        } in .env).`
      );
    }
    return { keyFile: resolved };
  }

  throw new Error(
    "No Google credentials found. Set FIREBASE_SERVICE_ACCOUNT_KEY (full JSON string) or " +
    "GOOGLE_SERVICE_ACCOUNT_KEY_PATH / GOOGLE_APPLICATION_CREDENTIALS (path to the key file) in .env."
  );
}

// Initialize Google Auth
async function initializeAuth() {
  try {
    const authOptions = loadGoogleAuthOptions();

    // Create auth client
    const auth = new GoogleAuth({
      ...authOptions,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    authClient = await auth.getClient();

    console.log("✅ Google Sheets authentication initialized");
  } catch (err) {
    console.error(
      "❌ Failed to initialize Google Sheets auth:",
      err.message
    );
    // Deliberately not re-thrown here — a broken Sheets integration
    // shouldn't crash the whole server. authClient stays undefined, and
    // the routes below fail fast (instead of hanging) if that happens.
  }
}

// Initialize on startup
initializeAuth();

// Human-readable labels for the programInterest value sent from the modal
const PROGRAM_INTEREST_LABELS = {
  coding: "Coding Classes",
  academic_tuition: "Academic Tuition (Class 1-12)",
  courses: "Courses",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_APP_PASSWORD,
  },
}); 

// Appends one booking row to the sheet, retrying transient Google API errors.
async function appendBookingToSheet(spreadsheetId, rowData) {
  const MAX_ATTEMPTS = 3;
  for (let attempt = 1; ; attempt++) {
    try {
      await sheets.spreadsheets.values.append({
        auth: authClient,
        spreadsheetId,
        range: "Sheet1!A:N",
        valueInputOption: "USER_ENTERED",
        resource: { values: [rowData] },
      });
      return;
    } catch (err) {
      if (attempt >= MAX_ATTEMPTS) throw err;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

// Sends the "new demo booking" notification email.
async function sendBookingEmail({
  source, programInterest, studentName, studentGrade, country, state,
  languages, parentName, email, contactNumber, wantsDemoSession,
  preferredDate, preferredTime,
}) {
  const programName =
    PROGRAM_INTEREST_LABELS[programInterest] || programInterest || "N/A";

  await transporter.sendMail({
    from: `"Pearlx Demo Bookings" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFICATION_EMAIL,
    subject: `🔔 New Pearlx Demo Booking — ${studentName}`,
    html: `
          <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; color: #333;">

            <h2 style="margin-bottom: 5px;">
              🔔 New Pearlx Demo Booking
            </h2>

            <p style="color: #666;">
              A new demo booking has been submitted through the Pearlx website.
            </p>

            <hr>

            <h3>👨‍🎓 Student Details</h3>

            <p><strong>Student Name:</strong> ${studentName || "N/A"}</p>
            <p><strong>Grade:</strong> ${studentGrade || "N/A"}</p>
            <p><strong>Program:</strong> ${programName}</p>

            <h3>👨‍👩‍👧 Parent Details</h3>

            <p><strong>Parent Name:</strong> ${parentName || "N/A"}</p>
            <p><strong>Email:</strong> ${email || "N/A"}</p>
            <p><strong>Contact:</strong> ${contactNumber || "N/A"}</p>

            <h3>📍 Location</h3>

            <p><strong>Country:</strong> ${country || "N/A"}</p>
            <p><strong>State:</strong> ${state || "N/A"}</p>
            <p><strong>Languages:</strong> ${languages || "N/A"}</p>

            <h3>📅 Demo Details</h3>

            <p><strong>Wants Demo:</strong> ${
              wantsDemoSession === "yes" ? "Yes" : "No"
            }</p>

            <p><strong>Preferred Date:</strong> ${
              preferredDate || "N/A"
            }</p>

            <p><strong>Preferred Time:</strong> ${
              preferredTime || "N/A"
            }</p>

            <h3>📌 Booking Source</h3>

            <p><strong>Source:</strong> ${source || "General"}</p>

            <hr>

            <p style="font-size: 13px; color: #777;">
              This notification was automatically generated by the Pearlx website.
            </p>

          </div>
        `,
  });
}

// GET /api/ping — tiny warm-up route. The modal calls it when it opens so a
// sleeping server (e.g. Render free tier) is already awake by submit time.
router.get("/ping", (req, res) => res.status(200).json({ ok: true }));

// POST /api/submit-demo-booking
router.post("/submit-demo-booking", async (req, res) => {
  try {
    if (!authClient) {
      return res.status(503).json({
        success: false,
        error: "Google Sheets is not configured on the server right now. Check the server logs for the Sheets auth error.",
      });
    }

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

    // Respond right away. Everything below (Sheets + email) runs in the
    // background so the parent sees "booked" instantly instead of waiting on
    // Google Sheets and Gmail SMTP. Both jobs run in parallel, each carries
    // the full booking, and failures are logged with the whole payload so a
    // booking can never silently disappear.
    res.status(200).json({
      success: true,
      message: "Demo booking submitted successfully!",
    });

    const booking = {
      source, programInterest, studentName, studentGrade, country, state,
      languages, parentName, email, contactNumber, wantsDemoSession,
      preferredDate, preferredTime,
    };

    Promise.allSettled([
      appendBookingToSheet(spreadsheetId, rowData),
      sendBookingEmail(booking),
    ]).then(([sheetResult, emailResult]) => {
      if (sheetResult.status === "rejected") {
        console.error("❌ Failed to save booking to Google Sheet:", sheetResult.reason, "\nBooking payload:", JSON.stringify(booking));
      }
      if (emailResult.status === "rejected") {
        console.error("❌ Failed to send booking notification email:", emailResult.reason, "\nBooking payload:", JSON.stringify(booking));
      }
      if (sheetResult.status === "fulfilled" && emailResult.status === "fulfilled") {
        console.log("✅ Booking saved to sheet and notification email sent");
      }
    });

    return;
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
    if (!authClient) {
      return res.status(503).json({
        success: false,
        error: "Google Sheets is not configured on the server right now. Check the server logs for the Sheets auth error.",
      });
    }

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