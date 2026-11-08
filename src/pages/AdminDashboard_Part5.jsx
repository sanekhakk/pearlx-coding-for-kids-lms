import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle, Pencil, Trash2, ChevronDown, ChevronRight,
  BookOpen, Loader2, CheckCircle, XCircle, X, Link as LinkIcon,
  FileText, ArrowUp, ArrowDown, Users, Image as ImageIcon, Upload,
} from "lucide-react";
import {
  collection, query, where, onSnapshot, doc, getDoc, setDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  COURSES, CATEGORIES, MODULE_ICON, getEffectiveCourse,
  curriculumModulesQuery,
  createCurriculumModule, renameCurriculumModule, deleteCurriculumModule,
  addCurriculumLesson, updateCurriculumLesson, deleteCurriculumLesson,
  uploadLessonBannerImage, deleteLessonBannerImageByUrl,
} from "../utils/curriculumData";

const C = {
  bg: "#F2F8FC", card: "#FFFFFF", border: "#E5E9F2",
  textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
  emerald: "#10B981", emeraldLight: "#ECFDF5", emeraldDark: "#059669",
  cyan: "#0EA5E9", cyanLight: "#E0F2FE",
  indigo: "#6366F1", indigoLight: "#EEF2FF",
  red: "#EF4444", redLight: "#FEF2F2",
  amber: "#F59E0B", amberLight: "#FFFBEB",
  violet: "#8B5CF6", violetLight: "#F5F3FF",
  gradPrimary: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
  gradEmerald: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  shadowCard: "0 4px 0 rgba(15,23,42,0.05), 0 8px 22px rgba(15,23,42,0.04)",
  shadowModal: "0 24px 64px rgba(15,23,42,0.18)",
};

const fieldStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 10, border: `2px solid ${C.border}`,
  background: C.bg, fontSize: 13, color: C.textPrimary, outline: "none",
  fontFamily: "inherit", boxSizing: "border-box",
};

const tierColor = {
  little_pearls: { bg: "#FFF7ED", border: "#FB923C", text: "#EA580C", light: "#FED7AA" },
  bright_pearls: { bg: "#F0FDF4", border: "#22C55E", text: "#16A34A", light: "#BBF7D0" },
  rising_pearls: { bg: "#EFF6FF", border: "#60A5FA", text: "#2563EB", light: "#BFDBFE" },
};

const courseColor = {
  coding: { bg: "#EFF6FF", border: "#60A5FA", text: "#2563EB" },
  math:   { bg: "#FDF4FF", border: "#D946EF", text: "#A21CAF" },
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

/* =========================================================================
   PART A — Coding / Math Module & Lesson curriculum
   Fully automatic visibility: every module/lesson added here shows up for
   every student (and their assigned tutor) enrolled in that course + tier.
   ========================================================================= */

// Modal for creating/editing a module (just a name)
function ModuleModal({ initialName, onClose, onSave }) {
  const [name, setName] = useState(initialName || "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const handleSave = async () => {
    if (!name.trim()) { setErr("Module name is required."); return; }
    setSaving(true); setErr(null);
    try {
      await onSave(name.trim());
      onClose();
    } catch (e) {
      setErr(e.message || "Failed to save module.");
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: C.card, borderRadius: 18, boxShadow: C.shadowModal, width: "100%", maxWidth: 420, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: C.textPrimary }}>{initialName ? "Rename Module" : "Add Module"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X style={{ width: 18, height: 18, color: C.textMuted }} />
          </button>
        </div>
        {err && <Banner status={{ ok: false, msg: err }} />}
        <FieldLabel required>Module Name</FieldLabel>
        <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Coding Fundamentals"
          style={{ ...fieldStyle, marginBottom: 18 }}
          onKeyDown={e => { if (e.key === "Enter") handleSave(); }} />
        <button onClick={handleSave} disabled={saving}
          style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: C.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {saving ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : "Save Module"}
        </button>
      </motion.div>
    </motion.div>
  );
}

// Modal for creating/editing a lesson: title, banner image, + 3 optional resource links
function LessonModal({ lesson, course, category, moduleId, onClose, onSave }) {
  const isEdit = !!lesson;
  const fileInputRef = useRef(null);
  // Stable id for a NEW lesson, generated once, so the uploaded image path
  // matches the lesson id the doc will actually be saved with.
  const [newLessonId] = useState(() => lesson?.id || `${moduleId}_l${Date.now()}`);

  const [form, setForm] = useState({
    title: lesson?.title || "",
    pptLink: lesson?.pptLink || "",
    studentResourceLink: lesson?.studentResourceLink || "",
    teacherResourceLink: lesson?.teacherResourceLink || "",
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(lesson?.bannerImageUrl || "");
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { setErr("Please choose an image file."); return; }
    if (f.size > 5 * 1024 * 1024) { setErr("Image must be under 5MB."); return; }
    setErr(null);
    setFile(f);
    setRemoveImage(false);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl("");
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setErr("Lesson title is required."); return; }
    setSaving(true); setErr(null);
    try {
      let bannerImageUrl = lesson?.bannerImageUrl || "";

      if (file) {
        bannerImageUrl = await uploadLessonBannerImage(file, { course, category, moduleId, lessonId: newLessonId });
      } else if (removeImage) {
        if (lesson?.bannerImageUrl) await deleteLessonBannerImageByUrl(lesson.bannerImageUrl);
        bannerImageUrl = "";
      }

      const payload = { ...form, bannerImageUrl };
      if (!isEdit) payload.id = newLessonId; // forces addCurriculumLesson to use this exact id

      await onSave(payload);
      onClose();
    } catch (e) {
      setErr(e.message || "Failed to save lesson.");
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: C.card, borderRadius: 18, boxShadow: C.shadowModal, width: "100%", maxWidth: 480, maxHeight: "88vh", overflowY: "auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: C.textPrimary }}>{isEdit ? "Edit Lesson" : "Add Lesson"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X style={{ width: 18, height: 18, color: C.textMuted }} />
          </button>
        </div>
        {err && <Banner status={{ ok: false, msg: err }} />}

        <div style={{ marginBottom: 14 }}>
          <FieldLabel required>Lesson Title</FieldLabel>
          <input autoFocus value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Sequences: Step by Step" style={fieldStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <FieldLabel>Banner Image <span style={{ color: C.textMuted, fontWeight: 500 }}>(optional — shown to students &amp; tutors, not in this dashboard's list view)</span></FieldLabel>
          {previewUrl ? (
            <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `2px solid ${C.border}`, aspectRatio: "16 / 9", background: C.bg }}>
              <img src={previewUrl} alt="Lesson banner preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <button onClick={handleRemoveImage} type="button"
                style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: 8, border: "none", background: "rgba(15,23,42,0.7)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X style={{ width: 14, height: 14, color: "#fff" }} />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileInputRef.current?.click()}
              style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 10, border: `1.5px dashed ${C.border}`, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
              <Upload style={{ width: 20, height: 20, color: C.textMuted }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.textSecondary }}>Click to upload banner image</span>
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
          {!previewUrl && (
            <button type="button" onClick={() => fileInputRef.current?.click()}
              style={{ marginTop: 8, fontSize: 11, color: C.indigo, fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              Choose file
            </button>
          )}
          <p style={{ fontSize: 10, color: C.textMuted, marginTop: 6, lineHeight: 1.5 }}>
            Recommended: 1200×675px (16:9), under 500KB (JPG/WebP). It'll display full-width and crop-to-fit automatically on any screen size.
          </p>
        </div>

        <div style={{ marginBottom: 14 }}>
          <FieldLabel>PPT Link <span style={{ color: C.textMuted, fontWeight: 500 }}>(optional, admin reference only)</span></FieldLabel>
          <input value={form.pptLink} onChange={e => set("pptLink", e.target.value)} placeholder="https://docs.google.com/presentation/..." style={fieldStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <FieldLabel>Student Resource Link <span style={{ color: C.textMuted, fontWeight: 500 }}>(optional — shown to students)</span></FieldLabel>
          <input value={form.studentResourceLink} onChange={e => set("studentResourceLink", e.target.value)} placeholder="https://docs.google.com/presentation/..." style={fieldStyle} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <FieldLabel>Teacher Resource Link <span style={{ color: C.textMuted, fontWeight: 500 }}>(optional — shown to tutors)</span></FieldLabel>
          <input value={form.teacherResourceLink} onChange={e => set("teacherResourceLink", e.target.value)} placeholder="https://docs.google.com/presentation/..." style={fieldStyle} />
        </div>

        <button onClick={handleSave} disabled={saving}
          style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: C.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {saving ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : "Save Lesson"}
        </button>
      </motion.div>
    </motion.div>
  );
}

function ConfirmModal({ title, message, onCancel, onConfirm }) {
  const [busy, setBusy] = useState(false);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}
      onClick={onCancel}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: C.card, borderRadius: 18, boxShadow: C.shadowModal, width: "100%", maxWidth: 400, padding: 24, textAlign: "center" }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.textPrimary, marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `2px solid ${C.border}`, background: C.bg, color: C.textSecondary, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button onClick={async () => { setBusy(true); await onConfirm(); }} disabled={busy}
            style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: C.red, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
            {busy ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LessonRow({ lesson, onEdit, onDelete }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 12, background: C.bg, border: `2px solid ${C.border}` }}>
      <div style={{ width: 26, height: 26, borderRadius: 8, background: C.card, border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 800, color: C.textSecondary }}>
        {lesson.lessonNumber}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: 13, color: C.textPrimary }}>{lesson.title}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
          {lesson.bannerImageUrl && <span style={{ fontSize: 10, fontWeight: 700, color: C.amber, background: C.amberLight, padding: "3px 8px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 3 }}><ImageIcon style={{ width: 9, height: 9 }} /> Banner set</span>}
          {lesson.pptLink && <span style={{ fontSize: 10, fontWeight: 700, color: C.violet, background: C.violetLight, padding: "3px 8px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 3 }}><LinkIcon style={{ width: 9, height: 9 }} /> PPT</span>}
          {lesson.studentResourceLink && <span style={{ fontSize: 10, fontWeight: 700, color: C.indigo, background: C.indigoLight, padding: "3px 8px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 3 }}><LinkIcon style={{ width: 9, height: 9 }} /> Student Link</span>}
          {lesson.teacherResourceLink && <span style={{ fontSize: 10, fontWeight: 700, color: C.emeraldDark, background: C.emeraldLight, padding: "3px 8px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 3 }}><LinkIcon style={{ width: 9, height: 9 }} /> Teacher Link</span>}
          {!lesson.bannerImageUrl && !lesson.pptLink && !lesson.studentResourceLink && !lesson.teacherResourceLink && (
            <span style={{ fontSize: 10, color: C.textMuted }}>No resources added yet</span>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        <button onClick={onEdit} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8 }}>
          <Pencil style={{ width: 14, height: 14, color: C.textMuted }} />
        </button>
        <button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8 }}>
          <Trash2 style={{ width: 14, height: 14, color: C.red }} />
        </button>
      </div>
    </div>
  );
}

function ModuleCard({ module, course, category, onRename, onDeleteModule, onAddLesson, onEditLesson, onDeleteLesson }) {
  const [open, setOpen] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [confirmDeleteModule, setConfirmDeleteModule] = useState(false);
  const [confirmDeleteLesson, setConfirmDeleteLesson] = useState(null);

  const lessons = (module.lessons || []).slice().sort((a, b) => a.lessonNumber - b.lessonNumber);

  return (
    <div style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 16, overflow: "hidden", boxShadow: C.shadowCard, marginBottom: 12 }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: C.bg, border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <MODULE_ICON style={{ width: 18, height: 18, color: C.textSecondary }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 800, fontSize: 14, color: C.textPrimary }}>Module {module.moduleNumber}: {module.moduleName}</p>
          <p style={{ fontSize: 12, color: C.textMuted }}>{lessons.length} lesson{lessons.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={e => { e.stopPropagation(); setShowModuleModal(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <Pencil style={{ width: 14, height: 14, color: C.textMuted }} />
        </button>
        <button onClick={e => { e.stopPropagation(); setConfirmDeleteModule(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <Trash2 style={{ width: 14, height: 14, color: C.red }} />
        </button>
        {open ? <ChevronDown style={{ width: 16, height: 16, color: C.textMuted }} /> : <ChevronRight style={{ width: 16, height: 16, color: C.textMuted }} />}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
            <div style={{ borderTop: `2px solid ${C.border}`, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {lessons.length === 0 ? (
                <p style={{ textAlign: "center", fontSize: 12, color: C.textMuted, padding: "8px 0" }}>No lessons yet</p>
              ) : (
                lessons.map(lesson => (
                  <LessonRow key={lesson.id} lesson={lesson}
                    onEdit={() => setEditingLesson(lesson)}
                    onDelete={() => setConfirmDeleteLesson(lesson)} />
                ))
              )}
              <button onClick={() => setShowLessonModal(true)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 10, border: `1.5px dashed ${C.border}`, background: "none", color: C.textSecondary, fontWeight: 700, fontSize: 12, cursor: "pointer", marginTop: 4 }}>
                <PlusCircle style={{ width: 14, height: 14 }} /> Add Lesson
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showModuleModal && (
        <ModuleModal initialName={module.moduleName} onClose={() => setShowModuleModal(false)}
          onSave={(name) => onRename(module.id, name)} />
      )}
      {showLessonModal && (
        <LessonModal course={course} category={category} moduleId={module.id} onClose={() => setShowLessonModal(false)}
          onSave={(data) => onAddLesson(module.id, data)} />
      )}
      {editingLesson && (
        <LessonModal lesson={editingLesson} course={course} category={category} moduleId={module.id} onClose={() => setEditingLesson(null)}
          onSave={(data) => onEditLesson(module.id, editingLesson.id, data)} />
      )}
      {confirmDeleteModule && (
        <ConfirmModal title="Delete this module?" message={`"${module.moduleName}" and all its lessons will be permanently removed for every student and tutor in this tier.`}
          onCancel={() => setConfirmDeleteModule(false)}
          onConfirm={async () => { await onDeleteModule(module.id); setConfirmDeleteModule(false); }} />
      )}
      {confirmDeleteLesson && (
        <ConfirmModal title="Delete this lesson?" message={`"${confirmDeleteLesson.title}" will be permanently removed.`}
          onCancel={() => setConfirmDeleteLesson(null)}
          onConfirm={async () => { await onDeleteLesson(module.id, confirmDeleteLesson.id); setConfirmDeleteLesson(null); }} />
      )}
    </div>
  );
}

// Module/lesson curriculum manager for the Coding and Math courses
function CodingMathCurriculumManager() {
  const tieredCourses = COURSES.filter(c => c.value !== "academic_tuition");
  const [course, setCourse] = useState(tieredCourses[0]?.value || "coding");
  const [category, setCategory] = useState(CATEGORIES[0]?.value || "little_pearls");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [showAddModule, setShowAddModule] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = curriculumModulesQuery(course, category);
    const unsub = onSnapshot(q,
      snap => {
        const mods = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.moduleNumber || 0) - (b.moduleNumber || 0));
        setModules(mods);
        setLoading(false);
      },
      err => {
        console.error("Curriculum snapshot error:", err);
        setStatus({ ok: false, msg: "Failed to load curriculum." });
        setLoading(false);
      }
    );
    return () => unsub();
  }, [course, category]);

  const flash = (ok, msg) => { setStatus({ ok, msg }); setTimeout(() => setStatus(null), 3000); };

  const handleAddModule = async (name) => {
    try { await createCurriculumModule(course, category, name); flash(true, "Module added."); }
    catch (e) { flash(false, e.message || "Failed to add module."); throw e; }
  };
  const handleRenameModule = async (moduleId, name) => {
    try { await renameCurriculumModule(moduleId, name); flash(true, "Module updated."); }
    catch (e) { flash(false, e.message || "Failed to update module."); throw e; }
  };
  const handleDeleteModule = async (moduleId) => {
    try { await deleteCurriculumModule(moduleId); flash(true, "Module deleted."); }
    catch (e) { flash(false, e.message || "Failed to delete module."); }
  };
  const handleAddLesson = async (moduleId, data) => {
    try { await addCurriculumLesson(moduleId, data); flash(true, "Lesson added."); }
    catch (e) { flash(false, e.message || "Failed to add lesson."); throw e; }
  };
  const handleEditLesson = async (moduleId, lessonId, data) => {
    try { await updateCurriculumLesson(moduleId, lessonId, data); flash(true, "Lesson updated."); }
    catch (e) { flash(false, e.message || "Failed to update lesson."); throw e; }
  };
  const handleDeleteLesson = async (moduleId, lessonId) => {
    try { await deleteCurriculumLesson(moduleId, lessonId); flash(true, "Lesson deleted."); }
    catch (e) { flash(false, e.message || "Failed to delete lesson."); }
  };

  const catInfo = CATEGORIES.find(c => c.value === category);
  const courseInfo = COURSES.find(c => c.value === course);
  const totalLessons = modules.reduce((s, m) => s + (m.lessons?.length || 0), 0);

  return (
    <div>
      <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 18 }}>
        Modules and lessons here are shown automatically to every student — and their assigned tutor — enrolled in the matching course and tier. No manual per-student assignment needed.
      </p>

      <Banner status={status} />

      {/* Course selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {tieredCourses.map(c => {
          const selected = course === c.value;
          const col = courseColor[c.value] || courseColor.coding;
          const Icon = c.icon;
          return (
            <button key={c.value} onClick={() => setCourse(c.value)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 12, border: `2px solid ${selected ? col.border : C.border}`, background: selected ? col.bg : C.card, color: selected ? col.text : C.textSecondary, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              <Icon style={{ width: 14, height: 14 }} />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Tier selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {CATEGORIES.map(cat => {
          const selected = category === cat.value;
          const col = tierColor[cat.value];
          const Icon = cat.icon;
          return (
            <button key={cat.value} onClick={() => setCategory(cat.value)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 12, border: `2px solid ${selected ? col.border : C.border}`, background: selected ? col.bg : C.card, color: selected ? col.text : C.textSecondary, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
              <Icon style={{ width: 13, height: 13 }} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Summary bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.card, border: `2px solid ${C.border}`, borderRadius: 14, padding: "14px 18px", marginBottom: 18, boxShadow: C.shadowCard }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: (courseColor[course] || courseColor.coding).bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {courseInfo?.icon ? <courseInfo.icon style={{ width: 20, height: 20, color: (courseColor[course] || courseColor.coding).text }} /> : <BookOpen style={{ width: 20, height: 20, color: (courseColor[course] || courseColor.coding).text }} />}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 800, fontSize: 14, color: C.textPrimary }}>{courseInfo?.label} · {catInfo?.label}</p>
          <p style={{ fontSize: 12, color: C.textMuted }}>{modules.length} modules · {totalLessons} lessons</p>
        </div>
        <button onClick={() => setShowAddModule(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 12, border: "none", background: C.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <PlusCircle style={{ width: 15, height: 15 }} /> Add Module
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <Loader2 style={{ width: 26, height: 26, color: C.emerald, animation: "spin 1s linear infinite" }} />
        </div>
      ) : modules.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", background: C.card, borderRadius: 16, border: `2px solid ${C.border}` }}>
          <BookOpen style={{ width: 36, height: 36, color: C.textMuted, opacity: 0.4, margin: "0 auto 10px" }} />
          <p style={{ fontSize: 13, color: C.textMuted }}>No modules yet for {courseInfo?.label} · {catInfo?.label}. Add the first one above.</p>
        </div>
      ) : (
        modules.map(mod => (
          <ModuleCard key={mod.id} module={mod} course={course} category={category}
            onRename={handleRenameModule}
            onDeleteModule={handleDeleteModule}
            onAddLesson={handleAddLesson}
            onEditLesson={handleEditLesson}
            onDeleteLesson={handleDeleteLesson} />
        ))
      )}

      {showAddModule && (
        <ModuleModal onClose={() => setShowAddModule(false)} onSave={handleAddModule} />
      )}
    </div>
  );
}

/* =========================================================================
   PART B — Academic Tuition custom per-student chapter lists
   Unchanged in behaviour from before: still one custom chapter list per
   student, stored at studentChapters/{uid}. Untouched by the Course/Tier
   changes above.
   ========================================================================= */

function ChapterModal({ chapter, onClose, onSave }) {
  const isEdit = !!chapter;
  const [form, setForm] = useState({ title: chapter?.title || "", content: chapter?.content || "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.title.trim()) { setErr("Chapter title is required."); return; }
    setSaving(true); setErr(null);
    try {
      await onSave({ title: form.title.trim(), content: form.content.trim() });
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
        style={{ background: C.card, borderRadius: 20, width: "100%", maxWidth: 560, boxShadow: C.shadowModal, overflow: "hidden", maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: C.gradPrimary }} />
        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: C.textPrimary }}>{isEdit ? "Edit Chapter" : "Add New Chapter"}</h3>
            <button onClick={onClose} style={{ background: C.bg, border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X style={{ width: 15, height: 15, color: C.textMuted }} />
            </button>
          </div>
          <Banner status={err ? { ok: false, msg: err } : null} />

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <FieldLabel required>Chapter Title</FieldLabel>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Chapter 3: Trigonometry" style={fieldStyle}
                onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
            <div>
              <FieldLabel>Notes / Content</FieldLabel>
              <textarea name="content" value={form.content} onChange={handleChange} rows={6}
                placeholder="Topics to cover, resources, or instructions for the tutor..."
                style={{ ...fieldStyle, resize: "none" }}
                onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 12, border: `2px solid ${C.border}`, background: C.bg, fontSize: 13, fontWeight: 700, color: C.textSecondary, cursor: "pointer" }}>Cancel</button>
            <button onClick={handleSave} disabled={saving}
              style={{ flex: 2, padding: "11px", borderRadius: 12, border: "none", background: C.gradPrimary, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: saving ? 0.7 : 1 }}>
              {saving ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : (isEdit ? "Save Changes" : "Add Chapter")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StudentChaptersManager({ studentId, studentName }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editChapter, setEditChapter] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const snap = await getDoc(doc(db, "studentChapters", studentId));
        if (cancelled) return;
        const data = snap.exists() ? snap.data() : {};
        setChapters((data.chapters || []).slice().sort((a, b) => a.order - b.order));
      } catch (err) {
        console.error("Error loading chapters:", err);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [studentId]);

  const persist = async (nextChapters) => {
    await setDoc(doc(db, "studentChapters", studentId), {
      studentId,
      chapters: nextChapters,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    setChapters(nextChapters);
  };

  const handleSaveChapter = async (form) => {
    if (editChapter) {
      const next = chapters.map(c => c.id === editChapter.id ? { ...c, ...form } : c);
      await persist(next);
      setStatus({ ok: true, msg: "Chapter updated" });
    } else {
      const nextOrder = chapters.length > 0 ? Math.max(...chapters.map(c => c.order)) + 1 : 1;
      const newChapter = { id: `chap_${Date.now()}`, order: nextOrder, ...form };
      await persist([...chapters, newChapter]);
      setStatus({ ok: true, msg: "Chapter added" });
    }
    setTimeout(() => setStatus(null), 2000);
  };

  const handleDelete = async (chapterId) => {
    if (!window.confirm("Delete this chapter?")) return;
    await persist(chapters.filter(c => c.id !== chapterId));
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= chapters.length) return;
    const next = [...chapters];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    const reordered = next.map((c, i) => ({ ...c, order: i + 1 }));
    await persist(reordered);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Loader2 style={{ width: 24, height: 24, color: C.emerald, animation: "spin 1s linear infinite", margin: "0 auto" }} />
      </div>
    );
  }

  return (
    <div>
      <Banner status={status} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary }}>
            Chapters for <span style={{ color: C.indigo }}>{studentName}</span>
          </h3>
          <p style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Academic Tuition · custom syllabus</p>
        </div>
        <button onClick={() => { setEditChapter(null); setShowModal(true); }}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "none", background: C.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
          <PlusCircle style={{ width: 15, height: 15 }} /> Add Chapter
        </button>
      </div>

      {chapters.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, background: C.bg, borderRadius: 12, color: C.textMuted, fontSize: 13 }}>
          No chapters yet. Click "Add Chapter" to build this student's custom syllabus.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 520, overflowY: "auto" }}>
          {chapters.map((chap, i) => (
            <div key={chap.id} style={{ display: "flex", gap: 10, padding: "12px 14px", borderRadius: 12, background: C.bg, border: `2px solid ${C.border}` }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: C.violetLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText style={{ width: 16, height: 16, color: C.violet }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: C.textPrimary }}>Chapter {i + 1}: {chap.title}</p>
                {chap.content && <p style={{ fontSize: 11, color: C.textMuted, marginTop: 3, lineHeight: 1.4, whiteSpace: "pre-wrap" }}>{chap.content}</p>}
              </div>
              <div style={{ display: "flex", gap: 5, flexShrink: 0, alignItems: "flex-start" }}>
                <button onClick={() => handleMove(i, -1)} disabled={i === 0}
                  style={{ padding: "4px 6px", borderRadius: 7, background: C.card, border: `2px solid ${C.border}`, cursor: i === 0 ? "not-allowed" : "pointer", opacity: i === 0 ? 0.4 : 1 }}>
                  <ArrowUp style={{ width: 12, height: 12, color: C.textSecondary }} />
                </button>
                <button onClick={() => handleMove(i, 1)} disabled={i === chapters.length - 1}
                  style={{ padding: "4px 6px", borderRadius: 7, background: C.card, border: `2px solid ${C.border}`, cursor: i === chapters.length - 1 ? "not-allowed" : "pointer", opacity: i === chapters.length - 1 ? 0.4 : 1 }}>
                  <ArrowDown style={{ width: 12, height: 12, color: C.textSecondary }} />
                </button>
                <button onClick={() => { setEditChapter(chap); setShowModal(true); }}
                  style={{ padding: "4px 7px", borderRadius: 7, background: C.indigoLight, border: "none", cursor: "pointer" }}>
                  <Pencil style={{ width: 12, height: 12, color: C.indigo }} />
                </button>
                <button onClick={() => handleDelete(chap.id)}
                  style={{ padding: "4px 7px", borderRadius: 7, background: C.redLight, border: "none", cursor: "pointer" }}>
                  <Trash2 style={{ width: 12, height: 12, color: C.red }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <ChapterModal chapter={editChapter} onClose={() => { setShowModal(false); setEditChapter(null); }} onSave={handleSaveChapter} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Picks an Academic Tuition student, then edits their custom chapter list
function AcademicTuitionManager() {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "userSummaries"), where("role", "==", "student"));
    return onSnapshot(q, snap => {
      const arr = snap.docs
        .map(d => ({ uid: d.id, ...d.data() }))
        .filter(s => getEffectiveCourse(s) === "academic_tuition")
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setStudents(arr);
      setSelectedStudentId(prev => (prev && arr.some(s => s.uid === prev)) ? prev : (arr[0]?.uid || null));
      setLoadingStudents(false);
    }, () => setLoadingStudents(false));
  }, []);

  const selectedStudent = students.find(s => s.uid === selectedStudentId);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, minHeight: 500 }}>
      <div style={{ background: C.card, borderRadius: 14, border: `2px solid ${C.border}`, overflow: "hidden", height: "fit-content", position: "sticky", top: 20 }}>
        <div style={{ padding: 14, borderBottom: `2px solid ${C.border}`, background: C.bg }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase" }}>Academic Tuition Students</p>
        </div>
        {loadingStudents ? (
          <div style={{ padding: 16, textAlign: "center" }}>
            <Loader2 style={{ width: 20, height: 20, color: C.emerald, animation: "spin 1s linear infinite", margin: "0 auto" }} />
          </div>
        ) : students.length === 0 ? (
          <p style={{ padding: 16, fontSize: 12, color: C.textMuted, textAlign: "center" }}>No Academic Tuition students yet</p>
        ) : (
          <div style={{ maxHeight: 600, overflowY: "auto" }}>
            {students.map(s => (
              <button key={s.uid} onClick={() => setSelectedStudentId(s.uid)}
                style={{ width: "100%", padding: "12px 14px", borderBottom: `2px solid ${C.border}`, background: selectedStudentId === s.uid ? C.indigoLight : "transparent", color: C.textPrimary, border: "none", cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: selectedStudentId === s.uid ? 700 : 500 }}>
                <p style={{ fontWeight: 700 }}>{s.name}</p>
                <p style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{s.customId || "—"}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: C.card, borderRadius: 14, border: `2px solid ${C.border}`, padding: 16 }}>
        {!selectedStudent ? (
          <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>Select a student to edit their chapters</div>
        ) : (
          <StudentChaptersManager studentId={selectedStudent.uid} studentName={selectedStudent.name} />
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN CURRICULUM MANAGER — tabs between the two systems above
   ========================================================================= */

export function CurriculumManager() {
  const [tab, setTab] = useState("curriculum"); // "curriculum" | "tuition"

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 24, maxWidth: "100%" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.indigoLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen style={{ width: 20, height: 20, color: C.indigo }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary }}>Curriculum Manager</h2>
        </div>
      </div>

      <div style={{ display: "flex", gap: 2, marginBottom: 20, background: C.bg, padding: 4, borderRadius: 12 }}>
        <button onClick={() => setTab("curriculum")}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 14px", borderRadius: 10, border: "none", background: tab === "curriculum" ? C.card : "transparent", color: tab === "curriculum" ? C.textPrimary : C.textSecondary, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <MODULE_ICON style={{ width: 14, height: 14 }} />
          Coding &amp; Math Curriculum
        </button>
        <button onClick={() => setTab("tuition")}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 14px", borderRadius: 10, border: "none", background: tab === "tuition" ? C.card : "transparent", color: tab === "tuition" ? C.textPrimary : C.textSecondary, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <Users style={{ width: 13, height: 13 }} />
          Academic Tuition Chapters
        </button>
      </div>

      {tab === "curriculum" ? <CodingMathCurriculumManager /> : <AcademicTuitionManager />}
    </motion.div>
  );
}

export default CurriculumManager;