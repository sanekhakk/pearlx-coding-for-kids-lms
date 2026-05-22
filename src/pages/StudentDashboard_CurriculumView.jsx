// src/pages/StudentDashboard_CurriculumView.jsx
// Shows student their personalized curriculum with lesson thumbnails

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ChevronDown, ChevronRight, Loader2,
  AlertCircle, Image as ImageIcon, Clock, Award,
} from "lucide-react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { getStudentCurriculumWithDetails } from "../utils/curriculumData";

const C = {
  bg: "#F4F6FB", card: "#FFFFFF", border: "#E5E9F2",
  textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
  emerald: "#10B981", emeraldLight: "#ECFDF5", emeraldDark: "#059669",
  cyan: "#0EA5E9", cyanLight: "#E0F2FE",
  indigo: "#6366F1", indigoLight: "#EEF2FF",
  gradPrimary: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
};

const catColor = {
  little_pearls:    { bg: "#FFF7ED", border: "#FB923C", text: "#EA580C", light: "#FED7AA" },
  bright_pearls:    { bg: "#F0FDF4", border: "#22C55E", text: "#16A34A", light: "#BBF7D0" },
  rising_pearls:    { bg: "#EFF6FF", border: "#60A5FA", text: "#2563EB", light: "#BFDBFE" },
};

const catLabel = {
  little_pearls: "🐥 Little Pearls",
  bright_pearls: "🌱 Bright Pearls",
  rising_pearls: "🦋 Rising Pearls",
};

/**
 * Lesson Card - displays lesson with thumbnail
 */
function LessonCard({ lesson }) {
  const col = catColor[lesson.category];
  
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadowCard }}>
      
      {/* Lesson Image / Thumbnail - bigger section */}
      <div style={{ width: "100%", height: 140, background: col.light, border: `1px solid ${col.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
        {lesson.thumbnailUrl ? (
          <img src={lesson.thumbnailUrl} alt={lesson.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: col.text, opacity: 0.6 }}>
            <ImageIcon style={{ width: 32, height: 32 }} />
            <p style={{ fontSize: 10, fontWeight: 600 }}>No Thumbnail</p>
          </div>
        )}
      </div>

      {/* Lesson Details */}
      <div style={{ padding: 14 }}>
        {/* Lesson Title - Prominent */}
        <h4 style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, marginBottom: 8, lineHeight: 1.3 }}>
          {lesson.title}
        </h4>

        {/* Category badge */}
        <div style={{ display: "inline-block", background: col.bg, border: `1px solid ${col.border}`, color: col.text, padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, marginBottom: 10 }}>
          {catLabel[lesson.category]}
        </div>

        {/* Platform */}
        {lesson.platform && (
          <p style={{ fontSize: 11, color: C.cyan, fontWeight: 600, marginBottom: 6 }}>
            📱 {lesson.platform}
          </p>
        )}

        {/* Description */}
        {lesson.description && (
          <p style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.4, marginBottom: 10 }}>
            {lesson.description}
          </p>
        )}

        {/* Meta info */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {lesson.pptLink && (
            <a href={lesson.pptLink} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 11, color: C.indigo, fontWeight: 600, padding: "4px 8px", background: C.indigoLight, borderRadius: 4, textDecoration: "none" }}>
              🔗 Resource
            </a>
          )}
          {lesson.notes && (
            <div style={{ fontSize: 11, color: C.textMuted, padding: "4px 8px", background: C.bg, borderRadius: 4 }}>
              📝 Has tutor notes
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Module View - collapsible module with lessons grid
 */
function ModuleView({ module, lessons }) {
  const [open, setOpen] = useState(true);
  const col = catColor[module.category];
  
  const moduleLessons = lessons.filter(l => l.moduleId === module.id)
    .sort((a, b) => (a.lessonNumber || 0) - (b.lessonNumber || 0));

  return (
    <motion.div
      style={{ marginBottom: 20 }}>
      {/* Module Header */}
      <motion.button onClick={() => setOpen(o => !o)} whileTap={{ scale: 0.98 }}
        style={{ width: "100%", padding: "14px 16px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 12 }}>
        
        <div style={{ width: 48, height: 48, borderRadius: 12, background: col.light, border: `1px solid ${col.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
          {module.moduleEmoji}
        </div>
        
        <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary }}>
            Module {module.moduleNumber}: {module.moduleName}
          </p>
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
            {moduleLessons.length} lessons
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ padding: "6px 12px", background: col.bg, borderRadius: 8, border: `1px solid ${col.border}` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: col.text }}>
              {catLabel[module.category]}
            </p>
          </div>
          {open ? <ChevronDown style={{ width: 18, height: 18, color: C.textMuted }} /> : <ChevronRight style={{ width: 18, height: 18, color: C.textMuted }} />}
        </div>
      </motion.button>

      {/* Lessons Grid */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}>
            {moduleLessons.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: C.textMuted, background: C.bg, borderRadius: 12 }}>
                <p>No lessons assigned yet</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                {moduleLessons.map(lesson => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Main Student Curriculum View
 */
export function StudentCurriculumView() {
  const { uid } = useAuth();
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCurriculum = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }
      try {
        const { modules: mods, lessons: less } = await getStudentCurriculumWithDetails(uid);
        setModules(mods.sort((a, b) => a.moduleNumber - b.moduleNumber));
        setLessons(less);
      } catch (err) {
        console.error("Error loading student curriculum:", err);
        setError(err.message);
      }
      setLoading(false);
    };

    loadCurriculum();
  }, [uid]);

  if (!uid) return <div style={{ padding: 20, textAlign: "center", color: C.textMuted }}>Please log in</div>;
  if (loading) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <Loader2 style={{ width: 28, height: 28, color: C.emerald, animation: "spin 1s linear infinite", margin: "0 auto" }} />
    </div>
  );

  if (error) {
    return (
      <div style={{ padding: 20, background: "#FEF2F2", border: "1px solid #EF4444", borderRadius: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <AlertCircle style={{ width: 20, height: 20, color: "#EF4444", flexShrink: 0 }} />
        <div>
          <p style={{ fontWeight: 700, color: "#EF4444" }}>Error loading curriculum</p>
          <p style={{ fontSize: 13, color: "#DC2626", marginTop: 4 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (modules.length === 0 && lessons.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ padding: 40, textAlign: "center", background: C.bg, borderRadius: 14 }}>
        <BookOpen style={{ width: 48, height: 48, color: C.textMuted, margin: "0 auto", opacity: 0.5 }} />
        <p style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginTop: 12 }}>No Curriculum Assigned Yet</p>
        <p style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>
          Your admin will customize your curriculum shortly. Come back soon!
        </p>
      </motion.div>
    );
  }

  const totalLessons = lessons.length;
  const categories = new Set(modules.map(m => m.category));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 28 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 28, fontWeight: 800, color: C.indigo }}>{modules.length}</p>
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Modules</p>
            </div>
            <BookOpen style={{ width: 24, height: 24, color: C.indigo, opacity: 0.3 }} />
          </div>
        </div>
        
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 28, fontWeight: 800, color: C.emerald }}>{totalLessons}</p>
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Lessons</p>
            </div>
            <Award style={{ width: 24, height: 24, color: C.emerald, opacity: 0.3 }} />
          </div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 28, fontWeight: 800, color: C.cyan }}>{categories.size}</p>
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Categories</p>
            </div>
            <Clock style={{ width: 24, height: 24, color: C.cyan, opacity: 0.3 }} />
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: C.textPrimary, marginBottom: 20 }}>Your Learning Path</h2>
        {modules.map(mod => (
          <ModuleView key={mod.id} module={mod} lessons={lessons} />
        ))}
      </div>
    </motion.div>
  );
}

export default StudentCurriculumView;