const { admin, firestore } = require("../firebaseAdmin");

async function verifyIdToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Missing or invalid Authorization header" });
    }
    const idToken = authHeader.split("Bearer ")[1];

    const decoded = await admin.auth().verifyIdToken(idToken);
    req.decodedToken = decoded;
    req.uid = decoded.uid;
    next();
  } catch (err) {
    console.error("verifyIdToken err:", err);
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

async function requireAdmin(req, res, next) {
  try {
    const uid = req.uid;
    if (!uid) return res.status(401).json({ success: false, error: "No user" });

    const doc = await firestore.collection("users").doc(uid).get();
    if (!doc.exists) return res.status(403).json({ success: false, error: "No profile found for caller" });

    const data = doc.data();
    if (data.role !== "admin") return res.status(403).json({ success: false, error: "Admin role required" });

    // Optionally attach the admin profile
    req.adminProfile = data;
    next();
  } catch (err) {
    console.error("requireAdmin err:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

module.exports = { verifyIdToken, requireAdmin };