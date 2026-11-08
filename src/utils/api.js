import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

/*
  One place for the backend URL.
  Admin actions used VITE_API_URL while notes / receipts used
  VITE_API_BASE_URL, so the two could point at different servers.
  Everything now reads the same value, in this order.
*/
const RENDER_URL = "https://brainbugz-learning-management-system.onrender.com";

const isLocalUrl = (url) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url || "");
const runningLocally =
  typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

// A localhost URL (e.g. from a committed .env.local) must never be used on the
// live site — the visitor's browser would try to call their own computer.
const pick = (...urls) =>
  urls.find((u) => u && (runningLocally || !isLocalUrl(u)));

export const API_BASE = (
  pick(import.meta.env.VITE_API_URL, import.meta.env.VITE_API_BASE_URL) || RENDER_URL
).replace(/\/+$/, "");

// auth.currentUser can briefly be null right after a page refresh.
const getCurrentUser = () =>
  auth.currentUser
    ? Promise.resolve(auth.currentUser)
    : new Promise((resolve) => {
        const stop = onAuthStateChanged(auth, (user) => {
          stop();
          resolve(user);
        });
      });

/**
 * Authenticated request to the PearlX backend.
 * Always returns parsed JSON ({ success: true, ... }) or throws an Error
 * with a message that is safe to show in the UI.
 */
export async function apiRequest(path, { method = "GET", body, headers = {} } = {}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("You're signed out. Please log in again.");
  const token = await user.getIdToken();

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the server right now. It may be starting up — please try again in a minute.");
  }

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // An HTML page came back instead of JSON — usually a missing route on the deployed backend.
    throw new Error(
      res.status === 404
        ? `The server doesn't have ${path.split("?")[0]} yet. Please redeploy the backend.`
        : `Server error (${res.status}). Please try again.`
    );
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}