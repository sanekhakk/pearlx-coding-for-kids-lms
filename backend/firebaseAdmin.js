const admin = require("firebase-admin");
require("dotenv").config();

// Use an environment variable for the JSON string to keep it secure
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin Initialized");
}

const firestore = admin.firestore();

// Exporting both as an object
module.exports = {
  admin,
  firestore
};