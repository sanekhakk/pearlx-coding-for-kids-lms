import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { FileText, X, Calendar, User, Loader2, ChevronRight } from "lucide-react";

// npm install react-markdown remark-gfm

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://brainbugz-learning-management-system.onrender.com";

const C = {
  bg: "#F4F6FB", card: "#FFFFFF", border: "#E5E9F2",
  textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
  emerald: "#10B981", emeraldLight: "#ECFDF5", emeraldDark: "#059669",
  cyan: "#0EA5E9", cyanLight: "#E0F2FE",
  indigo: "#6366F1", indigoLight: "#EEF2FF",
  amber: "#F59E0B", amberLight: "#FFFBEB",
  shadowCard: "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
  shadowModal: "0 24px 64px rgba(15,23,42,0.18)",
};

function formatUploadDate(ts) {
  if (!ts) return "";
  // Firestore Timestamp serialized via JSON has _seconds, or may already be an ISO string
  const date = ts._seconds ? new Date(ts._seconds * 1000) : new Date(ts);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const NoteCard = ({ note, onClick }) => (
  <motion.button onClick={onClick} whileHover={{ y: -2, boxShadow: C.shadowCard }} whileTap={{ scale: 0.98 }}
    style={{ textAlign: "left", width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, cursor: "pointer" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, marginBottom: 4 }}>{note.topic}</p>
        {note.subject && <p style={{ fontSize: 11, color: C.cyan, fontWeight: 600, marginBottom: 6 }}>{note.subject}</p>}
      </div>
      <ChevronRight style={{ width: 16, height: 16, color: C.textMuted, flexShrink: 0, marginTop: 2 }} />
    </div>

    <p style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
      <User style={{ width: 11, height: 11 }} /> Uploaded by {note.tutorName} · {formatUploadDate(note.createdAt)}
    </p>

    {note.isClassNote ? (
      <span style={{ fontSize: 10, fontWeight: 700, color: C.indigo, background: C.indigoLight, padding: "3px 8px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>
        <Calendar style={{ width: 10, height: 10 }} /> Class Note{note.classDate ? ` · ${note.classDate}` : ""}
      </span>
    ) : (
      <span style={{ fontSize: 10, fontWeight: 700, color: C.amber, background: C.amberLight, padding: "3px 8px", borderRadius: 6 }}>
        ✨ Extra Note
      </span>
    )}
  </motion.button>
);

const markdownComponents = {
  h1: (p) => <h1 style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary, margin: "16px 0 8px" }} {...p} />,
  h2: (p) => <h2 style={{ fontSize: 17, fontWeight: 800, color: C.textPrimary, margin: "14px 0 6px" }} {...p} />,
  h3: (p) => <h3 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, margin: "12px 0 6px" }} {...p} />,
  p:  (p) => <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7, margin: "8px 0" }} {...p} />,
  ul: (p) => <ul style={{ paddingLeft: 20, margin: "8px 0" }} {...p} />,
  ol: (p) => <ol style={{ paddingLeft: 20, margin: "8px 0" }} {...p} />,
  li: (p) => <li style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7, marginBottom: 4 }} {...p} />,
  strong: (p) => <strong style={{ color: C.textPrimary, fontWeight: 700 }} {...p} />,
  blockquote: (p) => (
    <blockquote style={{ margin: "12px 0", padding: "10px 14px", borderLeft: `3px solid ${C.emerald}`, background: C.emeraldLight, borderRadius: 8, fontSize: 13, color: C.emeraldDark }} {...p} />
  ),
  code: (p) => <code style={{ background: C.bg, padding: "2px 6px", borderRadius: 4, fontSize: 13 }} {...p} />,
  table: (p) => <table style={{ width: "100%", borderCollapse: "collapse", margin: "12px 0", fontSize: 13 }} {...p} />,
  th: (p) => <th style={{ border: `1px solid ${C.border}`, padding: 8, background: C.bg, textAlign: "left" }} {...p} />,
  td: (p) => <td style={{ border: `1px solid ${C.border}`, padding: 8 }} {...p} />,
};

export default function StudentNotesSection() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const { userId: uid } = useAuth();

  useEffect(() => {
    if (!uid) return; // wait until auth is actually ready before fetching
    (async () => {
      setLoading(true);
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch(`${API_BASE}/notes/student`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to load notes");
        setNotes(data.notes);
      } catch (err) {
        console.error("load student notes err:", err);
        setError(err.message);
      } finally {
        setLoading(false); // always clear the spinner, even on error
      }
    })();
  }, [uid]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Loader2 style={{ width: 24, height: 24, color: C.emerald, animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (error) {
    return <p style={{ fontSize: 13, color: "#DC2626", textAlign: "center", padding: 20 }}>{error}</p>;
  }

  if (notes.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", borderRadius: 16, background: C.bg, border: `1px solid ${C.border}` }}>
        <FileText style={{ width: 32, height: 32, color: C.textMuted, opacity: 0.5, margin: "0 auto 10px" }} />
        <p style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>No notes shared with you yet</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {notes.map(note => <NoteCard key={note.id} note={note} onClick={() => setSelected(note)} />)}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: C.card, borderRadius: 20, boxShadow: C.shadowModal, width: "100%", maxWidth: 680, maxHeight: "88vh", overflowY: "auto", padding: 28 }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary }}>{selected.topic}</h2>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  <X style={{ width: 20, height: 20, color: C.textMuted }} />
                </button>
              </div>

              {selected.subject && <p style={{ fontSize: 12, color: C.cyan, fontWeight: 700, marginBottom: 10 }}>{selected.subject}</p>}

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
                <span style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                  <User style={{ width: 12, height: 12 }} /> {selected.tutorName} · {formatUploadDate(selected.createdAt)}
                </span>
                {selected.isClassNote ? (
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.indigo, background: C.indigoLight, padding: "3px 10px", borderRadius: 20 }}>
                    📘 Class Note{selected.classDate ? ` · ${selected.classDate}` : ""}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.amber, background: C.amberLight, padding: "3px 10px", borderRadius: 20 }}>✨ Extra Note</span>
                )}
              </div>

              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {selected.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}