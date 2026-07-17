import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Primary app - used by the rest of the app (this is what keeps admin logged in)
 * Secondary app - used only to create new users so the admin session is NOT replaced
 */

const firebaseConfig = {
  apiKey: "AIzaSyAWdvZDFSif-DO8luyeEVqPvMJIJF4ygG8",
  authDomain: "brainbugz-26b5c.firebaseapp.com",
  projectId: "brainbugz-26b5c",
  storageBucket: "brainbugz-26b5c.firebasestorage.app",
  messagingSenderId: "655844832190",
  appId: "1:655844832190:web:70c634c2f0340a65acffef",
  measurementId: "G-551WT02PFN",
};

const app = initializeApp(firebaseConfig);

// create a secondary app instance for creating users so the current auth session isn't replaced
const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");

const auth = getAuth(app);
const secondaryAuth = getAuth(secondaryApp);

const db = getFirestore(app);

const appId = "brainbugz-26b5c";

export { app, auth, secondaryAuth, db, appId };
