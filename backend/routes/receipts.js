const express = require("express");
const router = express.Router();
// Sort newest-first in memory instead of using Firestore orderBy(),
// so these queries don't depend on composite indexes existing.
const toMillis = (v) => (v && typeof v.toMillis === "function" ? v.toMillis() : v && v._seconds ? v._seconds * 1000 : 0);
const newestFirst = (field) => (a, b) => toMillis(b[field]) - toMillis(a[field]);

const { admin, firestore } = require("../firebaseAdmin");
const { verifyIdToken, requireAdmin } = require("../middleware/authMiddleware");

/**
 * Firestore collection: "receipts"
 * {
 *   receiptId: string,          // e.g. "RCPT-A1B2C3D4" — human-facing ID shown on the PDF
 *   studentId: string,
 *   studentName: string,
 *   studentCustomId: string,
 *   classLevel: string,
 *   category: string,
 *   subjects: string[],
 *   feePerHour: number,
 *   currency: "INR",
 *   periodFrom: string | null,  // "YYYY-MM-DD", inclusive
 *   periodTo: string | null,    // "YYYY-MM-DD", inclusive
 *   totalClasses: number,
 *   totalHours: number,         // 1 hour billed per completed class
 *   totalAmount: number,
 *   classes: [{ id, subject, tutorName, classDate, classTime, isRescheduled }],
 *   status: "unpaid" | "paid",
 *   statusUpdatedAt: Timestamp,  // set whenever an admin flips the status
 *   statusUpdatedBy: string,     // admin uid who last changed status
 *   generatedAt: Timestamp,
 *   generatedBy: string,        // admin uid
 *   generatedByName: string,
 * }
 *
 * Suggested Firestore composite index: collection "receipts",
 * fields studentId (Asc) + generatedAt (Desc) — Firestore will prompt
 * for this via a console link the first time /receipts/student is called.
 */

const generateRandomId = (prefix) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = prefix + "-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// POST /receipts/generate — admin generates a fee receipt for a student
router.post("/generate", verifyIdToken, requireAdmin, async (req, res) => {
  try {
    const { studentId, feePerHour, periodFrom, periodTo } = req.body;

    if (!studentId) {
      return res.status(400).json({ success: false, error: "studentId is required" });
    }
    const rate = Number(feePerHour);
    if (!feePerHour || isNaN(rate) || rate <= 0) {
      return res.status(400).json({ success: false, error: "A valid feePerHour is required" });
    }
    if (periodFrom && periodTo && periodFrom > periodTo) {
      return res.status(400).json({ success: false, error: "periodFrom cannot be after periodTo" });
    }

    // 1) Fetch student profile
    const studentDoc = await firestore.collection("users").doc(studentId).get();
    if (!studentDoc.exists) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }
    const student = studentDoc.data();
    if (student.role !== "student") {
      return res.status(400).json({ success: false, error: "This user is not a student" });
    }

    // 2) Fetch completed classes for this student
    let classesQuery = firestore.collection("classes")
      .where("studentId", "==", studentId)
      .where("status", "==", "completed");

    const classesSnap = await classesQuery.get();
    let completedClasses = classesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Optional date range filter (classDate is stored as "YYYY-MM-DD", so string comparison is safe)
    if (periodFrom) {
      completedClasses = completedClasses.filter(c => c.classDate >= periodFrom);
    }
    if (periodTo) {
      completedClasses = completedClasses.filter(c => c.classDate <= periodTo);
    }

    completedClasses.sort((a, b) => (a.classDate || "").localeCompare(b.classDate || "") || (a.classTime || "").localeCompare(b.classTime || ""));

    if (completedClasses.length === 0) {
      return res.status(400).json({ success: false, error: "No completed classes found for this student in the selected period" });
    }

    // 3) Compute totals — 1 hour billed per completed class
    const totalClasses = completedClasses.length;
    const totalHours = totalClasses;
    const totalAmount = Math.round(totalHours * rate * 100) / 100;

    const classesSnapshot = completedClasses.map(c => ({
      id: c.id,
      subject: c.subject || "",
      tutorName: c.tutorName || "",
      classDate: c.classDate || "",
      classTime: c.classTime || "",
      isRescheduled: !!c.isRescheduled,
    }));

    const receiptId = generateRandomId("RCPT");

    const receiptData = {
      receiptId,
      studentId,
      studentName: student.name || "",
      studentCustomId: student.customId || "",
      classLevel: student.classLevel || student.grade || "",
      category: student.category || "",
      subjects: (student.assignments || []).map(a => a.subject).filter(Boolean),
      feePerHour: rate,
      currency: "INR",
      periodFrom: periodFrom || null,
      periodTo: periodTo || null,
      totalClasses,
      totalHours,
      totalAmount,
      classes: classesSnapshot,
      status: "unpaid",
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      generatedBy: req.uid,
      generatedByName: req.adminProfile?.name || "Admin",
    };

    const docRef = await firestore.collection("receipts").add(receiptData);

    // Return the receipt immediately with a client-usable timestamp
    // (the serverTimestamp sentinel above isn't resolved in this response).
    return res.status(200).json({
      success: true,
      message: "Receipt generated successfully",
      receipt: {
        id: docRef.id,
        ...receiptData,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("generate-receipt err:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

// GET /receipts/student — receipts belonging to the logged-in student
router.get("/student", verifyIdToken, async (req, res) => {
  try {
    const snap = await firestore.collection("receipts")
      .where("studentId", "==", req.uid)
      .get();
    const receipts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    receipts.sort(newestFirst("generatedAt"));
    return res.status(200).json({ success: true, receipts });
  } catch (err) {
    console.error("get-student-receipts err:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

// GET /receipts/admin — ALL receipts across every student, newest first.
// Powers the admin "Payment History" view.
router.get("/admin", verifyIdToken, requireAdmin, async (req, res) => {
  try {
    const snap = await firestore.collection("receipts").get();
    const receipts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    receipts.sort(newestFirst("generatedAt"));
    return res.status(200).json({ success: true, receipts });
  } catch (err) {
    console.error("get-all-receipts err:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

// PATCH /receipts/:id/status — admin manually marks a receipt paid/unpaid
// (e.g. once a parent has paid outside the app). This is what flips the
// badge shown in the student's own Fee Receipts view.
router.patch("/:id/status", verifyIdToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["paid", "unpaid"].includes(status)) {
      return res.status(400).json({ success: false, error: "status must be 'paid' or 'unpaid'" });
    }

    const ref = firestore.collection("receipts").doc(req.params.id);
    const docSnap = await ref.get();
    if (!docSnap.exists) {
      return res.status(404).json({ success: false, error: "Receipt not found" });
    }

    await ref.update({
      status,
      statusUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      statusUpdatedBy: req.uid,
    });

    return res.status(200).json({ success: true, message: `Receipt marked as ${status}` });
  } catch (err) {
    console.error("update-receipt-status err:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

// GET /receipts/admin/:studentId — admin views receipt history for a given student
router.get("/admin/:studentId", verifyIdToken, requireAdmin, async (req, res) => {
  try {
    const snap = await firestore.collection("receipts")
      .where("studentId", "==", req.params.studentId)
      .get();
    const receipts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    receipts.sort(newestFirst("generatedAt"));
    return res.status(200).json({ success: true, receipts });
  } catch (err) {
    console.error("get-admin-receipts err:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

// DELETE /receipts/:id — admin deletes a receipt (e.g. generated by mistake)
router.delete("/:id", verifyIdToken, requireAdmin, async (req, res) => {
  try {
    const ref = firestore.collection("receipts").doc(req.params.id);
    const docSnap = await ref.get();
    if (!docSnap.exists) {
      return res.status(404).json({ success: false, error: "Receipt not found" });
    }
    await ref.delete();
    return res.status(200).json({ success: true, message: "Receipt deleted" });
  } catch (err) {
    console.error("delete-receipt err:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

module.exports = router;