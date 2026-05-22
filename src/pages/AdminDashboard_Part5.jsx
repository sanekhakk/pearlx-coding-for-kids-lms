// src/pages/AdminDashboard_Part5_Updated.jsx
// Enhanced Curriculum Manager with lesson thumbnails & per-student assignment

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle, Pencil, Trash2, ChevronDown, ChevronRight,
  BookOpen, Loader2, CheckCircle, XCircle, X, Database, AlertCircle,
  Image as ImageIcon, Upload, Users, ArrowRight,
} from "lucide-react";
import {
  collection, query, where, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp, orderBy, getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { CATEGORIES, seedCurriculumToFirestore, fetchAllCurriculumModules, fetchAllCurriculumLessons, saveStudentCurriculumOverride } from "../utils/curriculumData";

const C = {
  bg: "#F4F6FB", card: "#FFFFFF", border: "#E5E9F2",
  textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
  emerald: "#10B981", emeraldLight: "#ECFDF5", emeraldDark: "#059669",
  cyan: "#0EA5E9", cyanLight: "#E0F2FE",
  indigo: "#6366F1", indigoLight: "#EEF2FF",
  red: "#EF4444", redLight: "#FEF2F2",
  amber: "#F59E0B", amberLight: "#FFFBEB",
  violet: "#8B5CF6", violetLight: "#F5F3FF",
  gradPrimary: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
  gradEmerald: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  shadowCard: "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
  shadowModal: "0 24px 64px rgba(15,23,42,0.18)",
};

const fieldStyle = {
  width: "100%", padding: "9px 12px", borderRadius: 10, border: `1px solid ${C.border}`,
  background: C.bg, fontSize: 13, color: C.textPrimary, outline: "none",
  fontFamily: "inherit", boxSizing: "border-box",
};

const catColor = {
  little_pearls:    { bg: "#FFF7ED", border: "#FB923C", text: "#EA580C", light: "#FED7AA" },
  bright_pearls:    { bg: "#F0FDF4", border: "#22C55E", text: "#16A34A", light: "#BBF7D0" },
  rising_pearls:    { bg: "#EFF6FF", border: "#60A5FA", text: "#2563EB", light: "#BFDBFE" },
  academic_tuition: { bg: "#F5F3FF", border: "#8B5CF6", text: "#6D28D9", light: "#DDD6FE" },
};

const Banner = ({ status }) => {
  if (!status) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      style={{ padding: "10px 14px", borderRadius: 10, marginBottom: 12, fontSize: 13, fontWeight: 600,
        background: status.ok ? C.emeraldLight : C.redLight, color: status.ok ? C.emerald : C.red,
        display: "flex", alignItems: "center", gap: 8 }}>
      {status.ok ? <CheckCircle style={{ width: 14, height: 14 }} /> : <XCircle style={{ width: 14, height: 14 }} />}
      {status.msg}
    </motion.div>
  );
};

const FieldLabel = ({ children, required }) => (
  <label style={{ fontSize: 11, fontWeight: 700, color: C.textSecondary, display: "block", marginBottom: 5 }}>
    {children}{required && <span style={{ color: C.red }}> *</span>}
  </label>
);

// ─────────────────────────────────────────────────────────────────────────────
// ENHANCED LESSON MODAL WITH THUMBNAIL UPLOAD
// ─────────────────────────────────────────────────────────────────────────────
function LessonModal({ moduleDoc, lesson, onClose, onSave }) {
  const isEdit = !!lesson;
  const blankLesson = { title: "", platform: "", description: "", notes: "", pptLink: "", thumbnailUrl: "" };
  const [form, setForm] = useState(isEdit ? { ...lesson } : blankLesson);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(lesson?.thumbnailUrl || "");

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setThumbnailPreview(base64);
      setForm(p => ({ ...p, thumbnailUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.platform.trim()) { setErr("Title and Platform are required."); return; }
    setSaving(true); setErr(null);
    try {
      const lessons = [...(moduleDoc.lessons || [])];
      if (isEdit) {
        const idx = lessons.findIndex(l => l.id === lesson.id);
        if (idx >= 0) lessons[idx] = { ...lessons[idx], ...form };
      } else {
        const nextNum = lessons.length > 0 ? Math.max(...lessons.map(l => l.lessonNumber)) + 1 : 1;
        lessons.push({
          id: `${moduleDoc.category}_m${moduleDoc.moduleNumber}_l${nextNum}_${Date.now()}`,
          lessonNumber: nextNum,
          ...form,
        });
      }
      await updateDoc(doc(db, "curriculum", moduleDoc.id), { lessons, updatedAt: serverTimestamp() });
      onSave();
      onClose();
    } catch (e) {
      setErr(e.message);
    }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }}
        style={{ background: C.card, borderRadius: 20, width: "100%", maxWidth: 580, boxShadow: C.shadowModal, overflow: "hidden", maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: C.gradPrimary }} />
        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: C.textPrimary }}>{isEdit ? "Edit Lesson" : "Add New Lesson"}</h3>
            <button onClick={onClose} style={{ background: C.bg, border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X style={{ width: 15, height: 15, color: C.textMuted }} />
            </button>
          </div>
          <Banner status={err ? { ok: false, msg: err } : null} />

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Thumbnail Upload */}
            <div style={{ background: C.bg, padding: 14, borderRadius: 12, border: `2px dashed ${C.border}` }}>
              <FieldLabel>Lesson Thumbnail (Optional)</FieldLabel>
              {thumbnailPreview && (
                <div style={{ marginBottom: 10, borderRadius: 8, overflow: "hidden", maxWidth: "100%", maxHeight: 120 }}>
                  <img src={thumbnailPreview} alt="Thumbnail" style={{ width: "100%", height: "auto", objectFit: "cover" }} />
                </div>
              )}
              <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, background: C.cyanLight, color: C.cyan, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>
                <Upload style={{ width: 14, height: 14 }} />
                Upload Image
                <input type="file" accept="image/*" onChange={handleThumbnailChange} style={{ display: "none" }} />
              </label>
              <p style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>Will appear in lesson cards alongside lesson title</p>
            </div>

            <div>
              <FieldLabel required>Lesson Title</FieldLabel>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. What is a Computer?" style={fieldStyle}
                onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
            <div>
              <FieldLabel required>Platform Used</FieldLabel>
              <input name="platform" value={form.platform} onChange={handleChange} placeholder="e.g. Code.org + Scratch" style={fieldStyle}
                onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
            <div>
              <FieldLabel>Lesson Description</FieldLabel>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                placeholder="What will the student learn and build in this lesson?"
                style={{ ...fieldStyle, resize: "none" }}
                onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
            <div>
              <FieldLabel>Tutor Notes</FieldLabel>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                placeholder="Tips, prerequisites, or special instructions for the tutor..."
                style={{ ...fieldStyle, resize: "none" }}
                onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
            <div>
              <FieldLabel>PPT / Resource Link</FieldLabel>
              <input name="pptLink" value={form.pptLink} onChange={handleChange} placeholder="https://docs.google.com/..." style={fieldStyle}
                onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.bg, fontSize: 13, fontWeight: 700, color: C.textSecondary, cursor: "pointer" }}>Cancel</button>
            <button onClick={handleSave} disabled={saving}
              style={{ flex: 2, padding: "11px", borderRadius: 12, border: "none", background: C.gradPrimary, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: saving ? 0.7 : 1 }}>
              {saving ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : (isEdit ? "Save Changes" : "Add Lesson")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE MODAL (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
function ModuleModal({ category, existingModule, onClose, onSave }) {
  const isEdit = !!existingModule;
  const [form, setForm] = useState({
    moduleName: existingModule?.moduleName || "",
    moduleEmoji: existingModule?.moduleEmoji || "📚",
    moduleNumber: existingModule?.moduleNumber || "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.moduleName.trim() || !form.moduleNumber) { setErr("Module name and number are required."); return; }
    setSaving(true); setErr(null);
    try {
      if (isEdit) {
        await updateDoc(doc(db, "curriculum", existingModule.id), {
          moduleName: form.moduleName.trim(),
          moduleEmoji: form.moduleEmoji.trim() || "📚",
          moduleNumber: Number(form.moduleNumber),
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "curriculum"), {
          category,
          moduleName: form.moduleName.trim(),
          moduleEmoji: form.moduleEmoji.trim() || "📚",
          moduleNumber: Number(form.moduleNumber),
          lessons: [],
          createdAt: serverTimestamp(),
        });
      }
      onSave();
      onClose();
    } catch (e) {
      setErr(e.message);
    }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }}
        style={{ background: C.card, borderRadius: 20, width: "100%", maxWidth: 420, boxShadow: C.shadowModal, overflow: "hidden" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: C.gradEmerald }} />
        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: C.textPrimary }}>{isEdit ? "Edit Module" : "Add New Module"}</h3>
            <button onClick={onClose} style={{ background: C.bg, border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X style={{ width: 15, height: 15, color: C.textMuted }} /></button>
          </div>
          <Banner status={err ? { ok: false, msg: err } : null} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 10 }}>
              <div>
                <FieldLabel>Emoji</FieldLabel>
                <input name="moduleEmoji" value={form.moduleEmoji} onChange={handleChange} style={{ ...fieldStyle, textAlign: "center", fontSize: 20 }} />
              </div>
              <div>
                <FieldLabel required>Module Number</FieldLabel>
                <input name="moduleNumber" value={form.moduleNumber} onChange={handleChange} type="number" min="1" placeholder="e.g. 12" style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
            </div>
            <div>
              <FieldLabel required>Module Name</FieldLabel>
              <input name="moduleName" value={form.moduleName} onChange={handleChange} placeholder="e.g. Advanced Game Design" style={fieldStyle}
                onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.bg, fontSize: 13, fontWeight: 700, color: C.textSecondary, cursor: "pointer" }}>Cancel</button>
            <button onClick={handleSave} disabled={saving}
              style={{ flex: 2, padding: "11px", borderRadius: 12, border: "none", background: C.gradEmerald, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {saving ? <Loader2 style={{ width: 15, height: 15, animation: "spin 1s linear infinite" }} /> : (isEdit ? "Save Changes" : "Add Module")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE ROW (enhanced to show lesson thumbnails)
// ─────────────────────────────────────────────────────────────────────────────
function ModuleRow({ mod, col }) {
  const [open, setOpen] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const deleteLesson = async (lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;
    const lessons = mod.lessons.filter(l => l.id !== lessonId);
    await updateDoc(doc(db, "curriculum", mod.id), { lessons });
  };

  const deleteModule = async () => {
    if (!window.confirm(`Delete Module ${mod.moduleNumber}: ${mod.moduleName} and ALL its lessons?`)) return;
    setDeleting(true);
    await deleteDoc(doc(db, "curriculum", mod.id));
  };

  return (
    <>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", boxShadow: C.shadowCard }}>
        {/* Module header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: col.bg, border: `1px solid ${col.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
            {mod.moduleEmoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}>Module {mod.moduleNumber}: {mod.moduleName}</p>
            <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{mod.lessons?.length || 0} lessons</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button onClick={e => { e.stopPropagation(); setShowModuleModal(true); }}
              style={{ padding: "5px 8px", borderRadius: 8, background: C.indigoLight, border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <Pencil style={{ width: 13, height: 13, color: C.indigo }} />
            </button>
            <button onClick={e => { e.stopPropagation(); deleteModule(); }} disabled={deleting}
              style={{ padding: "5px 8px", borderRadius: 8, background: C.redLight, border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <Trash2 style={{ width: 13, height: 13, color: C.red }} />
            </button>
            {open ? <ChevronDown style={{ width: 16, height: 16, color: C.textMuted }} /> : <ChevronRight style={{ width: 16, height: 16, color: C.textMuted }} />}
          </div>
        </div>

        {/* Lesson list with thumbnails */}
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ borderTop: `1px solid ${C.border}`, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                {(mod.lessons || []).length === 0 ? (
                  <p style={{ textAlign: "center", fontSize: 13, color: C.textMuted, padding: "12px 0" }}>No lessons yet — add one below</p>
                ) : (
                  (mod.lessons || []).sort((a, b) => a.lessonNumber - b.lessonNumber).map(lesson => (
                    <div key={lesson.id} style={{ display: "flex", gap: 10, padding: "10px", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}` }}>
                      {/* Thumbnail or placeholder */}
                      <div style={{ width: 80, height: 80, borderRadius: 8, background: col.light, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", border: `1px solid ${col.border}` }}>
                        {lesson.thumbnailUrl ? (
                          <img src={lesson.thumbnailUrl} alt={lesson.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <ImageIcon style={{ width: 24, height: 24, color: col.text, opacity: 0.5 }} />
                        )}
                      </div>
                      
                      {/* Lesson details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary, marginBottom: 2 }}>{lesson.title}</p>
                        <p style={{ fontSize: 11, color: C.cyan, fontWeight: 600, marginBottom: 4 }}>📱 {lesson.platform}</p>
                        {lesson.description && <p style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.4, marginBottom: 3 }}>{lesson.description}</p>}
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                          {lesson.notes && <p style={{ fontSize: 10, color: C.amber }}>📝 Notes added</p>}
                          {lesson.pptLink && (
                            <a href={lesson.pptLink} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: 10, color: C.indigo, fontWeight: 600 }}>🔗 View Resource</a>
                          )}
                          {lesson.thumbnailUrl && <p style={{ fontSize: 10, color: C.emerald }}>🖼️ Thumbnail</p>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button onClick={() => { setEditLesson(lesson); setShowLessonModal(true); }}
                          style={{ padding: "4px 7px", borderRadius: 7, background: C.indigoLight, border: "none", cursor: "pointer" }}>
                          <Pencil style={{ width: 12, height: 12, color: C.indigo }} />
                        </button>
                        <button onClick={() => deleteLesson(lesson.id)}
                          style={{ padding: "4px 7px", borderRadius: 7, background: C.redLight, border: "none", cursor: "pointer" }}>
                          <Trash2 style={{ width: 12, height: 12, color: C.red }} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <button onClick={() => { setEditLesson(null); setShowLessonModal(true); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10, border: `1px dashed ${col.border}`, background: col.bg, color: col.text, fontWeight: 700, fontSize: 12, cursor: "pointer", width: "100%", justifyContent: "center" }}>
                  <PlusCircle style={{ width: 14, height: 14 }} /> Add Lesson
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showLessonModal && (
          <LessonModal moduleDoc={mod} lesson={editLesson} onClose={() => { setShowLessonModal(false); setEditLesson(null); }} onSave={() => {}} />
        )}
        {showModuleModal && (
          <ModuleModal category={mod.category} existingModule={mod} onClose={() => setShowModuleModal(false)} onSave={() => {}} />
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY PANEL (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
function CategoryPanel({ cat }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModule, setShowAddModule] = useState(false);
  const col = catColor[cat.value];

  useEffect(() => {
    const q = query(collection(db, "curriculum"), where("category", "==", cat.value));
    return onSnapshot(q, 
        snap => {
            setModules(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => a.moduleNumber - b.moduleNumber));
            setLoading(false);
        },
        err => {
            console.error("Curriculum snapshot error:", err);
            setLoading(false);
        }
        );
  }, [cat.value]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary }}>{cat.label}</p>
          <p style={{ fontSize: 12, color: C.textMuted }}>{cat.ages} · {modules.length} modules · {modules.reduce((s, m) => s + (m.lessons?.length || 0), 0)} lessons</p>
        </div>
        <button onClick={() => setShowAddModule(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "none", background: C.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
          <PlusCircle style={{ width: 15, height: 15 }} /> Add Module
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Loader2 style={{ width: 24, height: 24, color: C.emerald, animation: "spin 1s linear infinite", margin: "0 auto" }} />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {modules.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, background: C.bg, borderRadius: 12, color: C.textMuted }}>
              No modules yet. Click "Add Module" to get started!
            </div>
          ) : (
            modules.map(mod => <ModuleRow key={mod.id} mod={mod} col={col} />)
          )}
        </div>
      )}

      <AnimatePresence>
        {showAddModule && (
          <ModuleModal category={cat.value} existingModule={null} onClose={() => setShowAddModule(false)} onSave={() => {}} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CURRICULUM MANAGER
// ─────────────────────────────────────────────────────────────────────────────
export function CurriculumManager() {
  const [tab, setTab] = useState("upload"); // "upload" | "assign"
  const [seedStatus, setSeedStatus] = useState(null);

  const handleSeedCurriculum = async () => {
    setSeedStatus({ msg: "Seeding curriculum...", ok: null });
    try {
      const result = await seedCurriculumToFirestore((msg) => {
        setSeedStatus({ msg, ok: null });
      });
      setSeedStatus({ msg: `✅ Seeded: ${result.seeded}, Skipped: ${result.skipped}`, ok: true });
    } catch (err) {
      setSeedStatus({ msg: `Error: ${err.message}`, ok: false });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ padding: 24, maxWidth: "100%" }}>
      
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.indigoLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen style={{ width: 20, height: 20, color: C.indigo }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary }}>Curriculum Manager</h2>
        </div>
        <p style={{ fontSize: 13, color: C.textMuted }}>Upload modules & lessons by category, then assign them to individual students</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 20, background: C.bg, padding: 4, borderRadius: 12 }}>
        <button onClick={() => setTab("upload")}
          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "none", background: tab === "upload" ? C.card : "transparent", color: tab === "upload" ? C.textPrimary : C.textSecondary, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
          📚 Upload Curriculum
        </button>
        <button onClick={() => setTab("assign")}
          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "none", background: tab === "assign" ? C.card : "transparent", color: tab === "assign" ? C.textPrimary : C.textSecondary, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
          👥 Assign to Students
        </button>
      </div>

      {/* Upload Curriculum Tab */}
      {tab === "upload" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Seed button */}
          <div style={{ marginBottom: 24, padding: 16, background: C.bg, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>Initialize Curriculum Database</p>
                <p style={{ fontSize: 12, color: C.textMuted }}>Run this once to populate all default modules & lessons</p>
              </div>
              <button onClick={handleSeedCurriculum}
                style={{ padding: "10px 18px", borderRadius: 10, background: C.gradEmerald, color: "#fff", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Database style={{ width: 14, height: 14 }} /> Seed Now
              </button>
            </div>
            {seedStatus && <Banner status={seedStatus} />}
          </div>

          {/* Categories */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {CATEGORIES.map(cat => (
              <CategoryPanel key={cat.value} cat={cat} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Assign to Students Tab */}
      {tab === "assign" && (
        <StudentCurriculumAssignment />
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT CURRICULUM ASSIGNMENT (NEW COMPONENT)
// ─────────────────────────────────────────────────────────────────────────────
function StudentCurriculumAssignment() {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [allModules, setAllModules] = useState([]);
  const [allLessons, setAllLessons] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [loadingCurr, setLoadingCurr] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Load students
  useEffect(() => {
    const q = query(collection(db, "userSummaries"), where("role", "==", "student"));
    return onSnapshot(q, snap => {
      const arr = snap.docs.map(d => ({ uid: d.id, ...d.data() })).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setStudents(arr);
      if (arr.length > 0 && !selectedStudentId) setSelectedStudentId(arr[0].uid);
      setLoadingStudents(false);
    }, () => setLoadingStudents(false));
  }, []);

  // Load all curriculum
  useEffect(() => {
    const loadCurr = async () => {
      setLoadingCurr(true);
      try {
        const [mods, lessons] = await Promise.all([
          fetchAllCurriculumModules(),
          fetchAllCurriculumLessons(),
        ]);
        setAllModules(mods);
        setAllLessons(lessons);
      } catch (err) {
        console.error("Error loading curriculum:", err);
      }
      setLoadingCurr(false);
    };
    loadCurr();
  }, []);

  // Load student's current curriculum
  useEffect(() => {
    if (!selectedStudentId) return;
    const loadStudentCurr = async () => {
      try {
        const docRef = doc(db, "studentCurriculum", selectedStudentId);
        const snap = await getDocs(query(collection(db, "studentCurriculum"), where("studentId", "==", selectedStudentId)));
        if (snap.docs.length > 0) {
          const data = snap.docs[0].data();
          setSelectedModules((data.assignedModules || []).map(m => m.moduleDocId));
          setSelectedLessons((data.assignedLessons || []).map(l => l.lessonId));
        } else {
          setSelectedModules([]);
          setSelectedLessons([]);
        }
      } catch (err) {
        console.error("Error loading student curriculum:", err);
      }
    };
    loadStudentCurr();
  }, [selectedStudentId]);

  const selectedStudent = students.find(s => s.uid === selectedStudentId);

  const toggleModule = (moduleId) => {
    setSelectedModules(prev =>
      prev.includes(moduleId) ? prev.filter(m => m !== moduleId) : [...prev, moduleId]
    );
  };

  const toggleLesson = (lessonId) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId) ? prev.filter(l => l !== lessonId) : [...prev, lessonId]
    );
  };

  const handleSave = async () => {
    if (!selectedStudentId) { setStatus({ ok: false, msg: "Select a student first" }); return; }
    if (selectedModules.length === 0 && selectedLessons.length === 0) { setStatus({ ok: false, msg: "Select at least one module or lesson" }); return; }
    
    setSaving(true);
    setStatus(null);
    try {
      // Get full lesson data for lessons array
      const lessonsForSave = selectedLessons
        .map(lessonId => allLessons.find(l => l.id === lessonId))
        .filter(Boolean);

      await saveStudentCurriculumOverride(selectedStudentId, selectedModules, lessonsForSave);
      setStatus({ ok: true, msg: `✅ Curriculum saved for ${selectedStudent?.name || "student"}` });
    } catch (err) {
      setStatus({ ok: false, msg: `Error: ${err.message}` });
    }
    setSaving(false);
  };

  // Group lessons by category
  const lessonsByCategory = {};
  allLessons.forEach(lesson => {
    if (!lessonsByCategory[lesson.category]) {
      lessonsByCategory[lesson.category] = [];
    }
    lessonsByCategory[lesson.category].push(lesson);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, minHeight: "500px" }}>
        {/* Student list */}
        <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden", height: "fit-content", position: "sticky", top: 20 }}>
          <div style={{ padding: 14, borderBottom: `1px solid ${C.border}`, background: C.bg }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase" }}>Students</p>
          </div>
          {loadingStudents ? (
            <div style={{ padding: 16, textAlign: "center" }}>
              <Loader2 style={{ width: 20, height: 20, color: C.emerald, animation: "spin 1s linear infinite", margin: "0 auto" }} />
            </div>
          ) : (
            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
              {students.map(s => (
                <button key={s.uid} onClick={() => setSelectedStudentId(s.uid)}
                  style={{ width: "100%", padding: "12px 14px", borderBottom: `1px solid ${C.border}`, background: selectedStudentId === s.uid ? C.indigoLight : "transparent", color: C.textPrimary, border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.2s", fontSize: 13, fontWeight: selectedStudentId === s.uid ? 700 : 500 }}>
                  <p style={{ fontWeight: 700 }}>{s.name}</p>
                  <p style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{s.customId || "—"}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Curriculum selector */}
        <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16 }}>
          {!selectedStudent ? (
            <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
              Select a student to customize their curriculum
            </div>
          ) : loadingCurr ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Loader2 style={{ width: 24, height: 24, color: C.emerald, animation: "spin 1s linear infinite", margin: "0 auto" }} />
            </div>
          ) : (
            <>
              <Banner status={status} />
              
              <h3 style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, marginBottom: 12 }}>
                Customize curriculum for <span style={{ color: C.indigo }}>{selectedStudent.name}</span>
              </h3>

              {/* Tabs for modules and lessons */}
              <div style={{ display: "flex", gap: 2, marginBottom: 16, background: C.bg, padding: 4, borderRadius: 10 }}>
                <button onClick={() => setExpandedCategory(null)}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", background: expandedCategory === null ? C.card : "transparent", color: C.textPrimary, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  Modules ({selectedModules.length})
                </button>
                <button onClick={() => setExpandedCategory("lessons")}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", background: expandedCategory === "lessons" ? C.card : "transparent", color: C.textPrimary, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  Lessons ({selectedLessons.length})
                </button>
              </div>

              {expandedCategory === null && (
                <div style={{ maxHeight: "500px", overflowY: "auto", marginBottom: 16 }}>
                  <p style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>Select entire modules to assign to this student:</p>
                  {CATEGORIES.map(cat => {
                    const categoryModules = allModules.filter(m => m.category === cat.value);
                    const col = catColor[cat.value];
                    return (
                      <div key={cat.value} style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: col.text, background: col.bg, padding: "6px 10px", borderRadius: 6, marginBottom: 8 }}>
                          {cat.label}
                        </p>
                        {categoryModules.map(mod => (
                          <label key={mod.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, cursor: "pointer", background: selectedModules.includes(mod.id) ? C.indigoLight : "transparent", marginBottom: 6 }}>
                            <input type="checkbox" checked={selectedModules.includes(mod.id)} onChange={() => toggleModule(mod.id)} style={{ cursor: "pointer" }} />
                            <span style={{ fontSize: 13, fontWeight: selectedModules.includes(mod.id) ? 700 : 500, color: C.textPrimary }}>
                              {mod.moduleEmoji} Module {mod.moduleNumber}: {mod.moduleName}
                            </span>
                            <span style={{ fontSize: 10, color: C.textMuted, marginLeft: "auto" }}>({mod.lessons?.length} lessons)</span>
                          </label>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              {expandedCategory === "lessons" && (
                <div style={{ maxHeight: "500px", overflowY: "auto", marginBottom: 16 }}>
                  <p style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>Select specific lessons to assign (sometimes a student from one category needs lessons from another):</p>
                  {Object.entries(lessonsByCategory).map(([cat, lessons]) => {
                    const category = CATEGORIES.find(c => c.value === cat);
                    const col = catColor[cat];
                    return (
                      <div key={cat} style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: col.text, background: col.bg, padding: "6px 10px", borderRadius: 6, marginBottom: 8 }}>
                          {category?.label}
                        </p>
                        {lessons.map(lesson => (
                          <label key={lesson.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, cursor: "pointer", background: selectedLessons.includes(lesson.id) ? C.indigoLight : "transparent", marginBottom: 6 }}>
                            <input type="checkbox" checked={selectedLessons.includes(lesson.id)} onChange={() => toggleLesson(lesson.id)} style={{ cursor: "pointer" }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 13, fontWeight: selectedLessons.includes(lesson.id) ? 700 : 500, color: C.textPrimary }}>{lesson.title}</p>
                              <p style={{ fontSize: 11, color: C.textMuted }}>Module: {lesson.moduleName}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleSave} disabled={saving}
                  style={{ flex: 1, padding: "12px", borderRadius: 10, background: C.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: saving ? 0.7 : 1 }}>
                  {saving ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : <>
                    <CheckCircle style={{ width: 16, height: 16 }} /> Save Curriculum
                  </>}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default CurriculumManager;