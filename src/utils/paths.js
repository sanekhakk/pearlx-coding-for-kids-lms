import { doc, collection } from "firebase/firestore";
import { db } from "../firebase";

// USERS 
export const getUserProfileRef = (uid) =>
  doc(db, "users", uid); // /users/{uid}

export const getUserSummaryRef = (uid) =>
  doc(db, "userSummaries", uid); // /userSummaries/{uid}

// ASSIGNMENTS
export const getAssignmentsCollection = () =>
  collection(db, "assignments"); // /assignments

// CLASSES
export const getClassesCollection = () =>
  collection(db, "classes"); // /classes

//ATTENDANCE
export const getAttendanceCollection = () =>
  collection(db, "attendance"); // /attendance

//PROGRESS
export const getProgressRef = (uid, subject) =>
  doc(db, "progress", `${uid}_${subject}`);

//FEEDBACK
export const getFeedbackCollection = () =>
  collection(db, "feedback");

// SUBJECT OPTIONS
export const SUBJECT_OPTIONS = [
  "Maths",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Computer Science"
];

// CURRICULUM 
export const CURRICULUM = {
  Maths: ["Chapter 1", "Chapter 2", "Chapter 3"],
  Physics: ["Chapter 1", "Chapter 2", "Chapter 3"],
  Chemistry: ["Chapter 1", "Chapter 2"],
  Biology: ["Chapter 1", "Chapter 2"],
  English: ["Chapter 1", "Chapter 2"],
  History: ["Chapter 1", "Chapter 2"],
  Geography: ["Chapter 1", "Chapter 2"],
  "Computer Science": ["Chapter 1", "Chapter 2"]
};
