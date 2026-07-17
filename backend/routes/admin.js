const express = require("express");
const router = express.Router();
const { admin, firestore } = require("../firebaseAdmin");
const { verifyIdToken, requireAdmin } = require("../middleware/authMiddleware");

// Function to generate a random ID: e.g., 'STU-A1B2C3D4'
const generateRandomId = (prefix) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix + '-';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};


router.post("/create-user", verifyIdToken, requireAdmin, async (req, res) => {
  try {
    const { 
        name, 
        email, 
        password, 
        role, 
        contactNumber, 
        classLevel,
        grade,         
        emergencyContact, 
        subjects, 
        qualifications, 
        hourlyRate,
        syllabus, 
        mediumOfCommunication,
        assignments,
        permanentClassLink,
        timezone,
        category,       // "little_pearls" | "bright_pearls" | "rising_pearls"
        tutorTypes,     // ["coding"] | ["cs_tuition"] | ["coding", "cs_tuition"]
    } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ success: false, error: "Missing required fields: name, email, password, role" });
    }

    // Validate student category
    if (role === 'student') {
      const validCategories = ['little_pearls', 'bright_pearls', 'rising_pearls', 'academic_tuition', 'courses'];
      if (!category || !validCategories.includes(category)) {
        return res.status(400).json({ success: false, error: "Student category is required (little_pearls, bright_pearls, rising_pearls, academic_tuition, or courses)" });
      }
    }

    // Validate tutor types
    if (role === 'tutor') {
      const validTypes = ['coding', 'cs_tuition'];
      const providedTypes = tutorTypes || [];
      if (providedTypes.length === 0) {
        return res.status(400).json({ success: false, error: "Tutor must have at least one category: coding or cs_tuition" });
      }
      const invalidTypes = providedTypes.filter(t => !validTypes.includes(t));
      if (invalidTypes.length > 0) {
        return res.status(400).json({ success: false, error: `Invalid tutor type(s): ${invalidTypes.join(', ')}` });
      }
    }
    
    // Generate custom ID and tutorUids array
    let customId = "";
    let tutorUids = [];
    
    if (role === 'student') {
        customId = generateRandomId("STU");
        tutorUids = (assignments || []).map(a => a.tutorId).filter(id => id); 
    } else if (role === 'tutor') {
        customId = generateRandomId("TUT");
    }

    // 1) Create the auth account
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    const uid = userRecord.uid;

    // 2) Set custom claims
    await admin.auth().setCustomUserClaims(uid, { role });

    // The effective grade — use `grade` if provided, fall back to classLevel
    const effectiveGrade = grade || classLevel || "";

    // 3) Write profile in /users/{uid}
    const profile = {
      uid,
      name,
      email,
      role,
      contactNumber: contactNumber || "",
      classLevel: effectiveGrade,     
      grade: effectiveGrade,          
      emergencyContact: emergencyContact || "",
      qualifications: qualifications || "",
      hourlyRate: hourlyRate || "",
      subjects: subjects || [],
      customId,
      syllabus: syllabus || "", 
      mediumOfCommunication: mediumOfCommunication || "",
      assignments: assignments || [], 
      tutorUids,
      permanentClassLink: permanentClassLink || "",
      // NEW
      category: role === 'student' ? (category || "") : "",
      tutorTypes: role === 'tutor' ? (tutorTypes || []) : [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      timezone: timezone || "Asia/Kolkata",
    };

    await firestore.collection("users").doc(uid).set(profile);

    // 4) Write summary in /userSummaries/{uid}
    const summary = {
      uid,
      name,
      email,
      role,
      classLevel: effectiveGrade,
      grade: effectiveGrade,
      syllabus: syllabus || "",
      assignments: assignments || [],
      customId,
      tutorUids,
      subjects: role === 'tutor' ? (subjects || []) : [], 
      permanentClassLink: permanentClassLink || "",
      category: role === 'student' ? (category || "") : "",
      tutorTypes: role === 'tutor' ? (tutorTypes || []) : [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      timezone: timezone || "Asia/Kolkata",
    };
    await firestore.collection("userSummaries").doc(uid).set(summary);

    return res.status(200).json({ success: true, message: `${role} created with ID: ${customId}`, uid });
  } catch (err) {
    console.error("create-user err:", err);
    if (err.code === "auth/email-already-exists") {
      return res.status(400).json({ success: false, error: "Email already in use" });
    }
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

// PUT /admin/update-user/:uid
router.put("/update-user/:uid", verifyIdToken, requireAdmin, async (req, res) => {
  const { uid } = req.params;
  const { 
    name, 
    email,
    contactNumber, 
    classLevel,
    grade,         
    emergencyContact, 
    subjects,
    qualifications, 
    hourlyRate,
    syllabus, 
    mediumOfCommunication,
    assignments,
    permanentClassLink,
    role,
    timezone,
    category,
    tutorTypes,
  } = req.body;

  if (!uid) {
    return res.status(400).json({ success: false, error: "Missing User ID (uid)" });
  }

  try {
    const effectiveGrade = grade || classLevel || "";

    const profileUpdates = {
      name,
      contactNumber: contactNumber || "",
      classLevel: effectiveGrade,
      grade: effectiveGrade,
      emergencyContact: emergencyContact || "",
      qualifications: qualifications || "",
      hourlyRate: hourlyRate || "",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      timezone: timezone || "Asia/Kolkata",
    };
    
    let summaryUpdates = { ...profileUpdates, email, role, timezone: timezone || "Asia/Kolkata" };
    let tutorUids = [];

    if (role === 'student') {
        tutorUids = (assignments || []).map(a => a.tutorId).filter(id => id);
        profileUpdates.subjects = (assignments || []).map(a => a.subject);
        profileUpdates.assignments = assignments || [];
        profileUpdates.tutorUids = tutorUids;
        profileUpdates.syllabus = syllabus || "";
        profileUpdates.permanentClassLink = permanentClassLink || "";
        profileUpdates.category = category || ""; 

        summaryUpdates.subjects = profileUpdates.subjects;
        summaryUpdates.assignments = profileUpdates.assignments;
        summaryUpdates.tutorUids = profileUpdates.tutorUids;
        summaryUpdates.syllabus = profileUpdates.syllabus;
        summaryUpdates.permanentClassLink = profileUpdates.permanentClassLink;
        summaryUpdates.category = category || "";  

    } else if (role === 'tutor') {
        profileUpdates.subjects = subjects || [];
        profileUpdates.tutorTypes = tutorTypes || [];  
        summaryUpdates.subjects = profileUpdates.subjects;
        summaryUpdates.tutorTypes = profileUpdates.tutorTypes; 
    }
    
    profileUpdates.email = email;
    summaryUpdates.email = email;

    await firestore.collection("users").doc(uid).update(profileUpdates);
    await firestore.collection("userSummaries").doc(uid).update(summaryUpdates);

    return res.status(200).json({ success: true, message: `${role} profile updated successfully.` });
  } catch (err) {
    console.error("update-user err:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error during user update." });
  }
});

// DELETE /admin/delete-user/:uid
router.delete("/delete-user/:uid", verifyIdToken, requireAdmin, async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ success: false, error: "Missing User ID (uid)" });
  }
  
  if (uid === req.uid) { 
      return res.status(403).json({ success: false, error: "Cannot delete the currently signed-in admin user." });
  }

  try {
    await admin.auth().deleteUser(uid);
    await firestore.collection("users").doc(uid).delete();
    await firestore.collection("userSummaries").doc(uid).delete();
    
    const classesQuery = await firestore.collection("classes").where("studentId", "==", uid).get();
    const classDeletePromises = [];
    classesQuery.forEach(doc => {
        classDeletePromises.push(doc.ref.delete());
    });
    await Promise.all(classDeletePromises);

    return res.status(200).json({ success: true, message: `User ${uid} and associated data deleted successfully.` });
  } catch (err) {
    console.error(`delete-user err for UID ${uid}:`, err);
    if (err.code === 'auth/user-not-found') {
        return res.status(404).json({ success: false, error: "User not found in Firebase Auth." });
    }
    return res.status(500).json({ success: false, error: err.message || "Server error during user deletion." });
  }
});

// DELETE /admin/class/:classId
router.delete("/class/:classId", verifyIdToken, requireAdmin, async (req, res) => {
    const { classId } = req.params;

    if (!classId) {
        return res.status(400).json({ success: false, error: "Missing Class ID" });
    }

    try {
        await firestore.collection("classes").doc(classId).delete();
        return res.status(200).json({ success: true, message: `Class ${classId} deleted successfully.` });
    } catch (err) {
        console.error(`delete-class err for ID ${classId}:`, err);
        return res.status(500).json({ success: false, error: err.message || "Server error during class deletion." });
    }
});

router.post("/schedule-class", verifyIdToken, requireAdmin, async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      tutorId,
      tutorName,
      subject,
      classDate,
      classTime,
      isRescheduled,
      originalClassDate
    } = req.body;

    if (!studentId || !tutorId || !subject || !classDate || !classTime) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required fields: studentId, tutorId, subject, classDate, classTime" 
      });
    }

    if (isRescheduled && !originalClassDate) {
      return res.status(400).json({
        success: false,
        error: "Original class date is required for rescheduled classes"
      });
    }

    const classData = {
      studentId,
      studentName,
      tutorId,
      tutorName,
      subject,
      classDate,
      classTime,
      status: "scheduled",
      isRescheduled: isRescheduled || false,
      originalClassDate: isRescheduled ? originalClassDate : "",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await firestore.collection("classes").add(classData);

    return res.status(200).json({ 
      success: true, 
      message: `Class scheduled successfully for ${studentName}`,
      classId: docRef.id 
    });
  } catch (err) {
    console.error("schedule-class error:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

module.exports = router;