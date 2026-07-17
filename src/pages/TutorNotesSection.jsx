import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import {
  FileText, Plus, X, Trash2, Loader2, CheckCircle, AlertCircle,
  Calendar, BookOpen, Info, Users, ChevronDown,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://brainbugz-learning-management-system.onrender.com";

const C = {
  bg: "#F4F6FB", card: "#FFFFFF", border: "#E5E9F2",
  textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
  emerald: "#10B981", emeraldLight: "#ECFDF5", emeraldDark: "#059669",
  cyan: "#0EA5E9", cyanLight: "#E0F2FE",
  indigo: "#6366F1", indigoLight: "#EEF2FF",
  amber: "#F59E0B", amberLight: "#FFFBEB",
  red: "#EF4444", redLight: "#FEF2F2",
  shadowCard: "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
  shadowModal: "0 24px 64px rgba(15,23,42,0.18)",
};

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: `1px solid ${C.border}`, fontSize: 13, color: C.textPrimary,
  background: "#fff", outline: "none", fontFamily: "inherit",
};
const labelStyle = { fontSize: 12, fontWeight: 700, color: C.textSecondary, marginBottom: 6, display: "block" };

async function authedFetch(path, options = {}) {
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Request failed");
  return data;
}

const emptyForm = {
  studentIds: [], subject: "", topic: "", isClassNote: false, classDate: "", content: "",
};

export default function TutorNotesSection() {
  const [students, setStudents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { userId: uid } = useAuth();

  const loadStudents = async () => {
    const q = query(collection(db, "userSummaries"), where("tutorUids", "array-contains", uid), where("role", "==", "student"));
    const snap = await getDocs(q);
    setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const loadNotes = async () => {
    const data = await authedFetch("/notes/mine");
    setNotes(data.notes);
  };

  useEffect(() => {
    if (!uid) return; // wait until auth is actually ready before querying anything
    (async () => {
      setLoading(true);
      try {
        await Promise.all([loadStudents(), loadNotes()]);
      } catch (err) {
        console.error("load notes/students err:", err);
      } finally {
        setLoading(false); // always clear the spinner, even on error
      }
    })();
  }, [uid]);

  const toggleStudent = (id) => {
    setForm(f => ({
      ...f,
      studentIds: f.studentIds.includes(id) ? f.studentIds.filter(x => x !== id) : [...f.studentIds, id],
    }));
  };

  const resetForm = () => { setForm(emptyForm); setError(null); setSuccess(null); };

  const handleSubmit = async () => {
    setError(null);
    if (!form.topic.trim()) return setError("Topic is required.");
    if (!form.content.trim()) return setError("Please write the note content.");
    if (form.studentIds.length === 0) return setError("Select at least one student.");

    setSubmitting(true);
    try {
      await authedFetch("/notes", { method: "POST", body: JSON.stringify(form) });
      setSuccess("Note published! Students can see it now.");
      await loadNotes();
      setTimeout(() => { setShowForm(false); resetForm(); }, 1200);
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note? Students will no longer be able to see it.")) return;
    setDeletingId(id);
    try {
      await authedFetch(`/notes/${id}`, { method: "DELETE" });
      setNotes(n => n.filter(x => x.id !== id));
    } catch (err) {
      alert(err.message);
    }
    setDeletingId(null);
  };

  const subjectOptions = Array.from(new Set(
    students.flatMap(s => (s.assignments || []).map(a => a.subject)).filter(Boolean)
  ));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: C.textPrimary }}>Notes</h2>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => { resetForm(); setShowForm(true); }}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 12, border: "none", background: C.emerald, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <Plus style={{ width: 15, height: 15 }} /> New Note
        </motion.button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center" }}>
          <Loader2 style={{ width: 24, height: 24, color: C.emerald, animation: "spin 1s linear infinite" }} />
        </div>
      ) : notes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", borderRadius: 16, background: C.bg, border: `1px solid ${C.border}` }}>
          <FileText style={{ width: 32, height: 32, color: C.textMuted, opacity: 0.5, margin: "0 auto 10px" }} />
          <p style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>No notes published yet</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {notes.map(note => (
            <div key={note.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, boxShadow: C.shadowCard, position: "relative" }}>
              <button onClick={() => handleDelete(note.id)} disabled={deletingId === note.id}
                style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", color: C.textMuted }}>
                {deletingId === note.id ? <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> : <Trash2 style={{ width: 14, height: 14 }} />}
              </button>
              <p style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, marginBottom: 6, paddingRight: 20 }}>{note.topic}</p>
              {note.subject && <p style={{ fontSize: 11, color: C.cyan, fontWeight: 600, marginBottom: 6 }}>{note.subject}</p>}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                {note.isClassNote ? (
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.indigo, background: C.indigoLight, padding: "3px 8px", borderRadius: 6 }}>
                    📘 Class Note{note.classDate ? ` · ${note.classDate}` : ""}
                  </span>
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.amber, background: C.amberLight, padding: "3px 8px", borderRadius: 6 }}>✨ Extra Note</span>
                )}
              </div>
              <p style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                <Users style={{ width: 11, height: 11 }} /> Shared with {note.studentIds.length} student{note.studentIds.length !== 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: C.card, borderRadius: 20, boxShadow: C.shadowModal, width: "100%", maxWidth: 620, maxHeight: "88vh", overflowY: "auto", padding: 24 }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: C.textPrimary }}>New Note</h3>
                <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <X style={{ width: 20, height: 20, color: C.textMuted }} />
                </button>
              </div>

              {/* Students */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Share with students</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 140, overflowY: "auto", padding: 10, border: `1px solid ${C.border}`, borderRadius: 10 }}>
                  {students.length === 0 ? (
                    <p style={{ fontSize: 12, color: C.textMuted }}>No students assigned to you yet.</p>
                  ) : students.map(s => {
                    const checked = form.studentIds.includes(s.id);
                    return (
                      <button key={s.id} type="button" onClick={() => toggleStudent(s.id)}
                        style={{
                          padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                          border: `1px solid ${checked ? C.emerald : C.border}`,
                          background: checked ? C.emeraldLight : "#fff",
                          color: checked ? C.emeraldDark : C.textSecondary,
                        }}>
                        {checked ? "✓ " : ""}{s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subject + Topic */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Subject <span style={{ color: C.textMuted, fontWeight: 500 }}>(optional)</span></label>
                  <input list="subject-options" style={inputStyle} value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Python" />
                  <datalist id="subject-options">
                    {subjectOptions.map(s => <option key={s} value={s} />)}
                  </datalist>
                </div>
                <div>
                  <label style={labelStyle}>Topic <span style={{ color: C.red }}>*</span></label>
                  <input style={inputStyle} value={form.topic}
                    onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="e.g. Loops in Python" />
                </div>
              </div>

              {/* Class note toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: form.isClassNote ? 12 : 16, padding: "10px 12px", background: C.bg, borderRadius: 10 }}>
                <input type="checkbox" id="isClassNote" checked={form.isClassNote}
                  onChange={e => setForm(f => ({ ...f, isClassNote: e.target.checked, classDate: e.target.checked ? f.classDate : "" }))}
                  style={{ width: 16, height: 16, cursor: "pointer" }} />
                <label htmlFor="isClassNote" style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, cursor: "pointer" }}>
                  This is a Class Note <span style={{ fontWeight: 400, color: C.textMuted }}>(unchecked = Extra Note)</span>
                </label>
              </div>

              {form.isClassNote && (
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Date of Class <span style={{ color: C.textMuted, fontWeight: 500 }}>(optional)</span></label>
                  <input type="date" style={{ ...inputStyle, maxWidth: 200 }} value={form.classDate}
                    onChange={e => setForm(f => ({ ...f, classDate: e.target.value }))} />
                </div>
              )}

              {/* Formatting instructions */}
              <div style={{ display: "flex", gap: 10, padding: "12px 14px", background: C.cyanLight, borderRadius: 10, marginBottom: 10, border: `1px solid ${C.cyan}30` }}>
                <Info style={{ width: 16, height: 16, color: C.cyan, flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 12, color: "#0C4A6E", lineHeight: 1.7 }}>
                  <strong>Formatting guide</strong> — type the note using these simple rules; it will show up nicely formatted for the student:
                  <br />• <code># Heading</code> for a big heading, <code>## Subheading</code> for a smaller one
                  <br />• <code>**bold text**</code> and <code>*italic text*</code>
                  <br />• <code>- point</code> for a bullet list, <code>1. point</code> for a numbered list
                  <br />• Leave a blank line between paragraphs
                  <br />• <code>&gt; text</code> for a highlighted callout box (great for "common mistakes")
                  <br />• Emojis (🧪 ✅ 📌) can be typed directly
                </div>
              </div>

              {/* Editor */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Note Content</label>
                <textarea rows={10} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                  value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder={"# Loops in Python\n\nA loop lets you repeat an action...\n\n- **for loop** — used when you know how many times\n- **while loop** — used when it depends on a condition\n\n> Common mistake: forgetting to update the loop variable, causing an infinite loop."} />
              </div>

              {error && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 12px", background: C.redLight, borderRadius: 10, marginBottom: 12 }}>
                  <AlertCircle style={{ width: 15, height: 15, color: C.red, flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: C.red }}>{error}</p>
                </div>
              )}
              {success && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 12px", background: C.emeraldLight, borderRadius: 10, marginBottom: 12 }}>
                  <CheckCircle style={{ width: 15, height: 15, color: C.emerald, flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: C.emeraldDark }}>{success}</p>
                </div>
              )}

              <motion.button whileTap={{ scale: 0.98 }} disabled={submitting} onClick={handleSubmit}
                style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: C.emerald, color: "#fff", fontWeight: 700, fontSize: 14, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {submitting ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Publishing...</> : "Publish Note"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}