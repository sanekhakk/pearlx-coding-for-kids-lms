import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ChevronDown, ChevronRight, Loader2,
  AlertCircle, Clock, Award, FileText,
  Link as LinkIcon, ArrowRight, Image as ImageIcon, GraduationCap, Zap, BookMarked,
} from "lucide-react";
import { db } from "../firebase";
import { doc, getDoc, onSnapshot, collection, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES, MODULE_ICON, getEffectiveCourse } from "../utils/curriculumData";

const C = {
  bg: "#F2F8FC", card: "#FFFFFF", border: "#E5E9F2",
  textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
  emerald: "#10B981", emeraldLight: "#ECFDF5", emeraldDark: "#059669",
  cyan: "#0EA5E9", cyanLight: "#E0F2FE",
  indigo: "#6366F1", indigoLight: "#EEF2FF",
  gradPrimary: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
};

const tierColor = {
  little_pearls: { bg: "#FFF7ED", border: "#FB923C", text: "#EA580C", light: "#FED7AA" },
  bright_pearls: { bg: "#F0FDF4", border: "#22C55E", text: "#16A34A", light: "#BBF7D0" },
  rising_pearls: { bg: "#EFF6FF", border: "#60A5FA", text: "#2563EB", light: "#BFDBFE" },
};

/**
 * Lesson Card — banner image (16:9) + title + Student Resource Link only
 * (never the PPT link or the teacher resource link — those are for admins
 * and tutors respectively).
 */
function LessonCard({ lesson, col }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: C.card, borderRadius: 12, border: `2px solid ${C.border}`, overflow: "hidden" }}>
      <div style={{ width: "100%", aspectRatio: "16 / 9", background: col.light, position: "relative", overflow: "hidden" }}>
        {lesson.bannerImageUrl ? (
          <img src={lesson.bannerImageUrl} alt={lesson.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImageIcon style={{ width: 24, height: 24, color: col.text, opacity: 0.35 }} />
          </div>
        )}
        <div style={{ position: "absolute", top: 8, left: 8, width: 24, height: 24, borderRadius: 7, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>
          {lesson.lessonNumber}
        </div>
      </div>
      <div style={{ padding: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, lineHeight: 1.3, marginBottom: 6 }}>
          {lesson.title}
        </h4>
        {lesson.studentResourceLink ? (
          <a href={lesson.studentResourceLink} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: C.indigo, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
            <LinkIcon style={{ width: 12, height: 12 }} /> View Lesson Resource <ArrowRight style={{ width: 12, height: 12 }} />
          </a>
        ) : (
          <p style={{ fontSize: 11, color: C.textMuted }}>No resource shared yet</p>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Module View — collapsible module with a lesson list
 */
function ModuleView({ module, col }) {
  const [open, setOpen] = useState(true);
  const lessons = (module.lessons || []).slice().sort((a, b) => (a.lessonNumber || 0) - (b.lessonNumber || 0));

  return (
    <motion.div style={{ marginBottom: 16 }}>
      <motion.button onClick={() => setOpen(o => !o)} whileTap={{ scale: 0.98 }}
        style={{ width: "100%", padding: "14px 16px", background: C.card, border: `2px solid ${C.border}`, borderRadius: 14, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 12 }}>

        <div style={{ width: 44, height: 44, borderRadius: 12, background: col.light, border: `1px solid ${col.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <MODULE_ICON style={{ width: 20, height: 20, color: col.text }} />
        </div>

        <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary }}>
            Module {module.moduleNumber}: {module.moduleName}
          </p>
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
            {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
          </p>
        </div>

        {open ? <ChevronDown style={{ width: 18, height: 18, color: C.textMuted }} /> : <ChevronRight style={{ width: 18, height: 18, color: C.textMuted }} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}>
            {lessons.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: C.textMuted, background: C.bg, borderRadius: 12 }}>
                <p>No lessons added yet</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                {lessons.map(lesson => (
                  <LessonCard key={lesson.id} lesson={lesson} col={col} />
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
 * Chapters View — for Academic Tuition students (custom per-student list)
 */
function ChaptersView({ studentId }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!studentId) { setLoading(false); return; }
    const unsub = onSnapshot(doc(db, "studentChapters", studentId), snap => {
      const data = snap.exists() ? snap.data() : { chapters: [] };
      setChapters((data.chapters || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0)));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [studentId]);

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Loader2 style={{ width: 26, height: 26, color: C.emerald, animation: "spin 1s linear infinite" }} /></div>;
  }
  if (chapters.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40, background: C.bg, borderRadius: 16 }}>
        <BookOpen style={{ width: 40, height: 40, color: C.textMuted, opacity: 0.5, margin: "0 auto 10px" }} />
        <p style={{ fontSize: 13, color: C.textMuted }}>Your syllabus is being set up. Check back soon!</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {chapters.map((chap, i) => {
        const isOpen = expanded[chap.id];
        return (
          <div key={chap.id} style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div onClick={() => setExpanded(p => ({ ...p, [chap.id]: !p[chap.id] }))}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", cursor: "pointer" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.indigoLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: C.indigo, flexShrink: 0 }}>
                <FileText style={{ width: 16, height: 16 }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 800, fontSize: 14, color: C.textPrimary }}>Chapter {i + 1}: {chap.title}</p>
              </div>
              {isOpen ? <ChevronDown style={{ width: 16, height: 16, color: C.textMuted }} /> : <ChevronRight style={{ width: 16, height: 16, color: C.textMuted }} />}
            </div>
            <AnimatePresence>
              {isOpen && chap.content && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                  <div style={{ borderTop: `2px solid ${C.border}`, padding: "14px 16px" }}>
                    <p style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{chap.content}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Main Student Curriculum View — routes to the shared Module/Lesson
 * curriculum (Coding / Math) or the per-student Chapters list
 * (Academic Tuition), based on the student's profile.
 */
export function StudentCurriculumView() {
  const { userId } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [error, setError] = useState(null);

  // Load the student's own profile to find their course + tier
  useEffect(() => {
    if (!userId) { setLoadingProfile(false); return; }
    const unsub = onSnapshot(doc(db, "userSummaries", userId), snap => {
      setProfile(snap.exists() ? { uid: snap.id, ...snap.data() } : null);
      setLoadingProfile(false);
    }, err => {
      console.error("Error loading student profile:", err);
      setError(err.message);
      setLoadingProfile(false);
    });
    return () => unsub();
  }, [userId]);

  const course = getEffectiveCourse(profile);
  const category = profile?.category || null;
  const isTiered = course === "coding" || course === "math";

  // Load modules for coding/math students
  useEffect(() => {
    if (!isTiered || !category) { setLoadingModules(false); return; }
    setLoadingModules(true);
    const q = query(collection(db, "curriculum"), where("course", "==", course), where("category", "==", category));
    const unsub = onSnapshot(q, snap => {
      const mods = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.moduleNumber || 0) - (b.moduleNumber || 0));
      setModules(mods);
      setLoadingModules(false);
    }, err => {
      console.error("Error loading curriculum:", err);
      setError(err.message);
      setLoadingModules(false);
    });
    return () => unsub();
  }, [isTiered, course, category]);

  if (!userId) return <div style={{ padding: 20, textAlign: "center", color: C.textMuted }}>Please log in</div>;

  if (loadingProfile) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Loader2 style={{ width: 28, height: 28, color: C.emerald, animation: "spin 1s linear infinite", margin: "0 auto" }} />
      </div>
    );
  }

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

  if (!course || (isTiered && !category)) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ padding: 40, textAlign: "center", background: C.bg, borderRadius: 14 }}>
        <BookOpen style={{ width: 48, height: 48, color: C.textMuted, margin: "0 auto", opacity: 0.5 }} />
        <p style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginTop: 12 }}>No Course Assigned Yet</p>
        <p style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>
          Your admin will assign your course shortly. Come back soon!
        </p>
      </motion.div>
    );
  }

  // Academic Tuition — custom per-student chapters
  if (!isTiered) {
    return <ChaptersView studentId={userId} />;
  }

  // Coding / Math — shared Module/Lesson curriculum
  const catInfo = CATEGORIES.find(c => c.value === category);
  const col = tierColor[category] || tierColor.little_pearls;
  const totalLessons = modules.reduce((s, m) => s + (m.lessons?.length || 0), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 28 }}>
        <div style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 28, fontWeight: 800, color: C.indigo }}>{modules.length}</p>
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Modules</p>
            </div>
            <BookOpen style={{ width: 24, height: 24, color: C.indigo, opacity: 0.3 }} />
          </div>
        </div>

        <div style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 28, fontWeight: 800, color: C.emerald }}>{totalLessons}</p>
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Lessons</p>
            </div>
            <Award style={{ width: 24, height: 24, color: C.emerald, opacity: 0.3 }} />
          </div>
        </div>

        <div style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: C.cyan, display: "flex", alignItems: "center", gap: 6 }}>
                {course === "math" ? <Zap style={{ width: 15, height: 15 }} /> : <BookMarked style={{ width: 15, height: 15 }} />}
                {course === "math" ? "Math" : "Coding"}
              </p>
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{catInfo?.label}</p>
            </div>
            <Clock style={{ width: 24, height: 24, color: C.cyan, opacity: 0.3 }} />
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: C.textPrimary, marginBottom: 20 }}>Your Learning Path</h2>
        {loadingModules ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <Loader2 style={{ width: 26, height: 26, color: C.emerald, animation: "spin 1s linear infinite" }} />
          </div>
        ) : modules.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", background: C.bg, borderRadius: 14 }}>
            <p style={{ fontSize: 13, color: C.textMuted }}>Curriculum is being set up. Check back soon!</p>
          </div>
        ) : (
          modules.map(mod => (
            <ModuleView key={mod.id} module={mod} col={col} />
          ))
        )}
      </div>
    </motion.div>
  );
}

export default StudentCurriculumView;