// backend/firebaseAdmin.js

const path = require("path");
require("dotenv").config();

const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./serviceAccountKey.json";

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;


const firestore = admin.firestore();

module.exports = {
  admin,
  firestore
};
