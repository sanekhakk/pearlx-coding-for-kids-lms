const express = require("express");
const router = express.Router();
const { admin, firestore } = require("../firebaseAdmin");
const { verifyIdToken, requireTutor } = require("../middleware/authMiddleware");

/**
 * Firestore collection: "notes"
 * {
 *   tutorId: string,
 *   tutorName: string,
 *   studentIds: string[],       // uids of students who can see this note
 *   subject: string,            // optional
 *   topic: string,              // required — used as the note heading
 *   isClassNote: boolean,
 *   classDate: string,          // "YYYY-MM-DD", only set when isClassNote is true, optional
 *   content: string,            // markdown text
 *   createdAt: Timestamp,
 *   updatedAt: Timestamp,
 * }
 *
 * Suggested Firestore composite index (create when prompted by the console link
 * in the error, or manually): collection "notes", fields studentIds (Arrays) + createdAt (Desc).
 */

// POST /notes — tutor publishes a new note
router.post("/", verifyIdToken, requireTutor, async (req, res) => {
  try {
    const { studentIds, subject, topic, isClassNote, classDate, content } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ success: false, error: "Topic is required" });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: "Note content cannot be empty" });
    }
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, error: "Select at least one student to share this note with" });
    }

    // Only allow sharing with students actually assigned to this tutor
    const tutorUsersSnap = await firestore.collection("users")
      .where("tutorUids", "array-contains", req.uid)
      .get();
    const allowedIds = new Set(tutorUsersSnap.docs.map(d => d.id));
    const invalidIds = studentIds.filter(id => !allowedIds.has(id));
    if (invalidIds.length > 0) {
      return res.status(403).json({ success: false, error: "One or more selected students are not assigned to you" });
    }

    const noteData = {
      tutorId: req.uid,
      tutorName: req.tutorProfile?.name || "Tutor",
      studentIds,
      subject: subject ? subject.trim() : "",
      topic: topic.trim(),
      isClassNote: !!isClassNote,
      classDate: isClassNote && classDate ? classDate : "",
      content,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await firestore.collection("notes").add(noteData);
    return res.status(200).json({ success: true, message: "Note published successfully", noteId: docRef.id });
  } catch (err) {
    console.error("create-note err:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

// GET /notes/mine — notes created by the logged-in tutor
router.get("/mine", verifyIdToken, requireTutor, async (req, res) => {
  try {
    const snap = await firestore.collection("notes")
      .where("tutorId", "==", req.uid)
      .orderBy("createdAt", "desc")
      .get();
    const notes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ success: true, notes });
  } catch (err) {
    console.error("get-tutor-notes err:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

// GET /notes/student — notes visible to the logged-in student
router.get("/student", verifyIdToken, async (req, res) => {
  try {
    const snap = await firestore.collection("notes")
      .where("studentIds", "array-contains", req.uid)
      .orderBy("createdAt", "desc")
      .get();
    const notes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ success: true, notes });
  } catch (err) {
    console.error("get-student-notes err:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

// DELETE /notes/:id — tutor deletes their own note
router.delete("/:id", verifyIdToken, requireTutor, async (req, res) => {
  try {
    const ref = firestore.collection("notes").doc(req.params.id);
    const docSnap = await ref.get();
    if (!docSnap.exists) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }
    if (docSnap.data().tutorId !== req.uid) {
      return res.status(403).json({ success: false, error: "You can only delete your own notes" });
    }
    await ref.delete();
    return res.status(200).json({ success: true, message: "Note deleted" });
  } catch (err) {
    console.error("delete-note err:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

module.exports = router;