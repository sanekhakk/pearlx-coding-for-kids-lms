import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  where,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  BookOpen, User, Loader2, CheckCircle, XCircle, TrendingUp,
  Calendar, Clock, LogOut, Award, Target, Video, ArrowRight,
  Bell, Home, BarChart2, Star, Menu, X, ChevronDown, ChevronRight,
  Zap, BookMarked, GraduationCap, Play,FileText
} from "lucide-react";
import { CATEGORIES } from "../utils/curriculumData";
import { getProgressRef } from "../utils/paths";
import { getDisplayTime } from "../utils/timeUtils";
import PearlxLogo from "../assets/flat_logo.webp";
import StudentNotesSection from "./StudentNotesSection";

const C = {
  bg: "#F4F6FB",
  sidebar: "#FFFFFF",
  card: "#FFFFFF",
  border: "#E5E9F2",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  emerald: "#10B981",
  emeraldLight: "#ECFDF5",
  emeraldDark: "#059669",
  cyan: "#0EA5E9",
  cyanLight: "#E0F2FE",
  indigo: "#6366F1",
  indigoLight: "#EEF2FF",
  red: "#EF4444",
  redLight: "#FEF2F2",
  amber: "#F59E0B",
  amberLight: "#FFFBEB",
  violet: "#8B5CF6",
  violetLight: "#F5F3FF",
  gradPrimary: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
  gradEmerald: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  gradIndigo: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
  gradRed: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
  shadowCard: "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
  shadowHover: "0 8px 24px rgba(15,23,42,0.1)",
};

const statusCfg = {
  upcoming:  { border: `#6366F125`, accent: "#6366F1", badgeBg: "#EEF2FF", badgeText: "#6366F1", label: "Upcoming",  icon: Calendar,     grad: "linear-gradient(135deg,#6366F1,#4F46E5)" },
  completed: { border: `#10B98130`, accent: "#10B981", badgeBg: "#ECFDF5", badgeText: "#10B981", label: "Completed", icon: CheckCircle,  grad: "linear-gradient(135deg,#10B981,#059669)" },
  missed:    { border: `#EF444430`, accent: "#EF4444", badgeBg: "#FEF2F2", badgeText: "#EF4444", label: "Missed",    icon: XCircle,      grad: "linear-gradient(135deg,#EF4444,#DC2626)" },
};

const Empty = ({ icon: Icon, msg, color }) => (
  <div style={{ textAlign: "center", padding: "40px 20px", borderRadius: 16, background: C.bg, border: `1px solid ${C.border}` }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: color ? `${color}15` : "#F0F2F8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
      <Icon style={{ width: 24, height: 24, color: color || C.textMuted, opacity: 0.5 }} />
    </div>
    <p style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>{msg}</p>
  </div>
);

const StatCard = ({ icon: Icon, label, value, light, iconColor }) => (
  <motion.div whileHover={{ y: -2, boxShadow: C.shadowHover }}
    style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", boxShadow: C.shadowCard }}>
    <div style={{ width: 40, height: 40, borderRadius: 12, background: light, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
      <Icon style={{ width: 20, height: 20, color: iconColor }} />
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: C.textPrimary, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 500, marginTop: 4 }}>{label}</div>
  </motion.div>
);

// Helper: get the next lesson to cover from progress data 
function getNextLessonLabel(modules, lessonProgressMap) {
  if (!modules || modules.length === 0) return null;
  for (const mod of modules) {
    const lessons = [...(mod.lessons || [])].sort((a, b) => a.lessonNumber - b.lessonNumber);
    for (const lesson of lessons) {
      const key = `M${mod.moduleNumber}:L${lesson.lessonNumber} ${lesson.title}`;
      const status = lessonProgressMap?.[key];
      if (status === "ongoing") return { label: lesson.title, mod: mod.moduleName, status: "ongoing", emoji: mod.moduleEmoji };
      if (!status || status === "not_covered") return { label: lesson.title, mod: mod.moduleName, status: "next", emoji: mod.moduleEmoji };
    }
  }
  return null; // all done
}

const ClassCard = ({ cls, type, permanentClassLink, timezone, nextLesson }) => {
  const cfg = statusCfg[type];
  const Icon = cfg.icon;
  const time = getDisplayTime(cls.classDate, cls.classTime, timezone);
  const timeParts = time.split(" ");
  const timeNum = timeParts[0];   
  const timePeriod = timeParts[1] || ""; 

  const dateObj = cls.classDate ? new Date(cls.classDate) : null;
  const dayName  = dateObj ? dateObj.toLocaleDateString("en-US", { weekday: "long" }) : "TBD";
  const dateStr  = dateObj ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
  const isToday  = dateObj ? dateObj.toDateString() === new Date().toDateString() : false;
  const isTomorrow = dateObj ? (() => { const t = new Date(); t.setDate(t.getDate()+1); return dateObj.toDateString() === t.toDateString(); })() : false;

  const dayLabel = isToday ? "Today" : isTomorrow ? "Tomorrow" : dayName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(15,23,42,0.12)" }}
      style={{
        background: C.card,
        border: `1px solid ${cfg.border}`,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: C.shadowCard,
        position: "relative",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: cfg.grad }} />

      {/* Rescheduled badge */}
      {cls.isRescheduled && (
        <div style={{ position: "absolute", top: 16, right: 16, background: C.amberLight, color: C.amber, fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.04em", zIndex: 2 }}>
          RESCHEDULED
        </div>
      )}

      <div style={{ display: "flex", minHeight: 120 }}>

        {/* LEFT: Subject + Tutor + Lesson chip */}
        <div style={{ flex: 1, padding: "20px 22px 20px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
          <div>
            {/* Status badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: cfg.badgeBg, marginBottom: 10 }}>
              <Icon style={{ width: 11, height: 11, color: cfg.badgeText }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: cfg.badgeText, letterSpacing: "0.04em" }}>{cfg.label.toUpperCase()}</span>
            </div>

            {/* Subject */}
            <h3 style={{ fontSize: 20, fontWeight: 900, color: C.textPrimary, lineHeight: 1.1, marginBottom: 6, letterSpacing: "-0.02em" }}>
              {cls.subject}
            </h3>

            {/* Tutor name */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: type === "upcoming" ? 14 : 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: 7, background: cfg.grad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <GraduationCap style={{ width: 12, height: 12, color: "#fff" }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>with <span style={{ color: C.textPrimary, fontWeight: 700 }}>{cls.tutorName}</span></span>
            </div>

            {/* Next lesson chip — only for upcoming coding classes */}
            {type === "upcoming" && nextLesson && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 12px", borderRadius: 12,
                background: nextLesson.status === "ongoing" ? C.amberLight : C.indigoLight,
                border: `1px solid ${nextLesson.status === "ongoing" ? C.amber + "40" : C.indigo + "30"}`,
                maxWidth: "100%",
              }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{nextLesson.emoji}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 1 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.05em",
                      color: nextLesson.status === "ongoing" ? C.amber : C.indigo }}>
                      {nextLesson.status === "ongoing" ? "⏳ CONTINUING" : "▶ NEXT UP"}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>
                    {nextLesson.label}
                  </p>
                  <p style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>{nextLesson.mod}</p>
                </div>
              </div>
            )}

            {/* Completed/missed summary */}
            {cls.summary && (type === "completed" || type === "missed") && (
              <div style={{ padding: "9px 13px", borderRadius: 12, fontSize: 12, background: cfg.badgeBg, color: cfg.badgeText, lineHeight: 1.5, marginTop: 4 }}>
                {type === "completed" ? "📋 " : "⚠️ "}{cls.summary}
              </div>
            )}
          </div>

          {/* Join button */}
          {type === "upcoming" && permanentClassLink && (
            <div style={{ marginTop: 14 }}>
              <a href={permanentClassLink} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 12, background: cfg.grad, color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none", boxShadow: `0 4px 14px ${cfg.accent}35` }}>
                <Play style={{ width: 13, height: 13 }} /> Join Class <ArrowRight style={{ width: 13, height: 13 }} />
              </a>
            </div>
          )}
        </div>

        {/* RIGHT: Big Time Block  */}
        <div style={{
          flexShrink: 0, width: 120,
          background: `linear-gradient(160deg, ${cfg.accent}12 0%, ${cfg.accent}05 100%)`,
          borderLeft: `1px solid ${cfg.accent}20`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "20px 10px", gap: 2,
        }}>
          <Clock style={{ width: 14, height: 14, color: cfg.accent, opacity: 0.7, marginBottom: 6 }} />
          <span style={{
            fontSize: 32, fontWeight: 900, color: cfg.accent,
            lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums",
          }}>
            {timeNum}
          </span>
          {timePeriod && (
            <span style={{ fontSize: 14, fontWeight: 800, color: cfg.accent, opacity: 0.8, letterSpacing: "0.06em", marginTop: 2 }}>
              {timePeriod}
            </span>
          )}
          <div style={{ marginTop: 10, textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: isToday ? cfg.accent : C.textPrimary, marginBottom: 2 }}>
              {dayLabel}
            </p>
            <p style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>{dateStr}</p>
          </div>
          {isToday && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ marginTop: 8, padding: "4px 8px", borderRadius: 20, background: cfg.accent, color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: "0.06em" }}>
              TODAY
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SideNavItem = ({ tab, active, onClick }) => (
  <motion.button onClick={onClick} whileTap={{ scale: 0.97 }}
    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, border: `1px solid ${active ? C.emerald + "30" : "transparent"}`, background: active ? C.emeraldLight : "transparent", cursor: "pointer", transition: "all 0.15s" }}>
    <div style={{ width: 34, height: 34, borderRadius: 10, background: active ? C.emerald : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <tab.icon style={{ width: 16, height: 16, color: active ? "#fff" : C.textMuted }} />
    </div>
    <span style={{ fontSize: 13, fontWeight: 600, color: active ? C.textPrimary : C.textSecondary, flex: 1, textAlign: "left" }}>{tab.label}</span>
    {tab.count !== undefined && (
      <span style={{ background: active ? C.emerald : C.border, color: active ? "#fff" : C.textMuted, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{tab.count}</span>
    )}
  </motion.button>
);

// Categories that use a per-student custom Chapters list (studentChapters/{uid})
// instead of the shared coding Module/Lesson curriculum (curriculum/{docId}).
const CHAPTER_BASED_CATEGORIES = ["academic_tuition", "courses"];

// Student Curriculum View — Chapters variant (Academic Tuition / Courses)
function StudentChaptersView({ studentId, category }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!studentId) { setLoading(false); return; }
    setLoading(true);
    const ref = doc(db, "studentChapters", studentId);
    const unsub = onSnapshot(ref,
      snap => {
        const data = snap.exists() ? snap.data() : { chapters: [] };
        const chaps = (data.chapters || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
        setChapters(chaps);
        setLoading(false);
      },
      err => {
        console.error("Student chapters snapshot error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [studentId]);

  const catInfo = CATEGORIES.find(c => c.value === category);
  const col = { bg: "#EEF2FF", border: "#6366F1", text: "#4F46E5", light: "#E0E7FF" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: C.card, borderRadius: 18, border: `2px solid ${col.border}`, padding: "18px 22px", boxShadow: C.shadowCard }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: col.bg, border: `1px solid ${col.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
            {catInfo?.label.charAt(0) || "📘"}
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: col.text }}>{catInfo?.label || "Custom Curriculum"}</p>
            <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{chapters.length} chapters</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Loader2 style={{ width: 24, height: 24, color: C.emerald, animation: "spin 1s linear infinite" }} /></div>
      ) : chapters.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 13, color: C.textMuted }}>Curriculum is being set up. Check back soon!</p>
        </div>
      ) : (
        chapters.map((chap, i) => {
          const isOpen = expanded[chap.id];
          return (
            <div key={chap.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", boxShadow: C.shadowCard }}>
              <div onClick={() => setExpanded(p => ({ ...p, [chap.id]: !p[chap.id] }))}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", cursor: "pointer" }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: col.bg, border: `1px solid ${col.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: col.text, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 800, fontSize: 14, color: C.textPrimary }}>{chap.title}</p>
                </div>
                {isOpen ? <ChevronDown style={{ width: 16, height: 16, color: C.textMuted }} /> : <ChevronRight style={{ width: 16, height: 16, color: C.textMuted }} />}
              </div>
              <AnimatePresence>
                {isOpen && chap.content && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                    <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 18px" }}>
                      <p style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{chap.content}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })
      )}
    </div>
  );
}

// Student Curriculum View — routes to the Chapters view or the Module/Lesson view
function StudentCurriculumView({ category, studentName, studentId }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  const catColors = {
    little_pearls: { bg: "#FFF7ED", border: "#FB923C", text: "#EA580C", light: "#FED7AA" },
    bright_pearls: { bg: "#F0FDF4", border: "#22C55E", text: "#16A34A", light: "#BBF7D0" },
    rising_pearls: { bg: "#EFF6FF", border: "#60A5FA", text: "#2563EB", light: "#BFDBFE" },
  };

  const isChapterBased = CHAPTER_BASED_CATEGORIES.includes(category);

  useEffect(() => {
    if (!category || isChapterBased) { setLoading(false); return; }
    setLoading(true);
    const q = query(collection(db, "curriculum"), where("category", "==", category));
    const unsub = onSnapshot(q, 
      snap => {
        const mods = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => a.moduleNumber - b.moduleNumber);
        setModules(mods);
        if (mods.length > 0) setExpandedModules({ [mods[0].id]: true });
        setLoading(false);
      },
      err => {
        console.error("Curriculum snapshot error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [category, isChapterBased]);

  if (!category) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px", background: C.card, borderRadius: 20, border: `1px solid ${C.border}` }}>
        <BookOpen style={{ width: 36, height: 36, color: C.textMuted, margin: "0 auto 12px", display: "block", opacity: 0.4 }} />
        <p style={{ fontSize: 14, color: C.textMuted }}>No category assigned yet. Contact your admin.</p>
      </div>
    );
  }

  // Academic Tuition / Courses students use the per-student Chapters list
  if (isChapterBased) {
    return <StudentChaptersView studentId={studentId} category={category} />;
  }

  const catInfo = CATEGORIES.find(c => c.value === category);
  const col = catColors[category] || catColors.little_pearls;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Category header banner */}
      <div style={{ background: C.card, borderRadius: 18, border: `2px solid ${col.border}`, padding: "18px 22px", boxShadow: C.shadowCard }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: col.bg, border: `1px solid ${col.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
            {catInfo?.label.charAt(0)}
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: col.text }}>{catInfo?.label}</p>
            <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{catInfo?.ages} · {modules.length} modules · {modules.reduce((s, m) => s + (m.lessons?.length || 0), 0)} lessons</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Loader2 style={{ width: 24, height: 24, color: C.emerald, animation: "spin 1s linear infinite" }} /></div>
      ) : modules.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 13, color: C.textMuted }}>Curriculum is being set up. Check back soon!</p>
        </div>
      ) : (
        modules.map(mod => {
          const isOpen = expandedModules[mod.id];
          return (
            <div key={mod.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", boxShadow: C.shadowCard }}>
              <div onClick={() => setExpandedModules(p => ({ ...p, [mod.id]: !p[mod.id] }))}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", cursor: "pointer" }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: col.bg, border: `1px solid ${col.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {mod.moduleEmoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 800, fontSize: 14, color: C.textPrimary }}>Module {mod.moduleNumber}: {mod.moduleName}</p>
                  <p style={{ fontSize: 12, color: C.textMuted }}>{mod.lessons?.length || 0} lessons</p>
                </div>
                {isOpen ? <ChevronDown style={{ width: 16, height: 16, color: C.textMuted }} /> : <ChevronRight style={{ width: 16, height: 16, color: C.textMuted }} />}
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                    <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                      {(mod.lessons || []).sort((a, b) => a.lessonNumber - b.lessonNumber).map(lesson => (
                        <div key={lesson.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 12, background: C.bg, border: `1px solid ${C.border}` }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: col.light, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 800, color: col.text }}>
                            {lesson.lessonNumber}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 700, fontSize: 13, color: C.textPrimary, marginBottom: 3 }}>{lesson.title}</p>
                            <p style={{ fontSize: 11, color: C.cyan, fontWeight: 600 }}>📱 {lesson.platform}</p>
                            {lesson.description && <p style={{ fontSize: 11, color: C.textSecondary, marginTop: 5, lineHeight: 1.6 }}>{lesson.description}</p>}
                            {lesson.pptLink && (
                              <a href={lesson.pptLink} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize: 11, color: C.indigo, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 5, textDecoration: "none" }}>
                                🔗 View Lesson Resource →
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })
      )}
    </div>
  );
}

export default function StudentDashboard() {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile]         = useState(null);
  const [loadingProfile, setLP]       = useState(true);
  const [upcoming, setUpcoming]       = useState([]);
  const [completed, setCompleted]     = useState([]);
  const [missed, setMissed]           = useState([]);
  const [loadingClasses, setLC]       = useState(true);
  const [progressData, setProgress]   = useState({});
  const [activeTab, setActiveTab]     = useState("overview");
  const [isMobile, setIsMobile]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Curriculum & lesson state for next-lesson chips
  const [currModules, setCurrModules]         = useState([]);  // for coding students
  const [lessonProgressMap, setLessonProgress] = useState({}); // { key: status }
  const [academicLessons, setAcademicLessons] = useState({}); // { subject: [lesson] }
  const [chapterList, setChapterList] = useState([]); // studentChapters, for academic_tuition/courses

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!userId) return;
    return onSnapshot(doc(db, "userSummaries", userId), snap => {
      if (snap.exists()) setProfile({ uid: snap.id, ...snap.data() });
      setLP(false);
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    setLC(true);
    return onSnapshot(query(collection(db, "classes"), where("studentId", "==", userId)), snap => {
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => new Date(a.classDate + " " + a.classTime) - new Date(b.classDate + " " + b.classTime));
      setUpcoming(arr.filter(c => c.status === "scheduled" || c.status === "pending"));
      setCompleted(arr.filter(c => c.status === "completed"));
      setMissed(arr.filter(c => c.status === "missed"));
      setLC(false);
    });
  }, [userId]);

  useEffect(() => {
    if (!userId || !profile) return;
    const subjects = (profile.assignments || []).map(a => a.subject);
    const unsubs = subjects.map(sub =>
      onSnapshot(getProgressRef(userId, sub), snap => {
        setProgress(prev => ({ ...prev, [sub]: snap.exists() ? snap.data() : { completedChapters: [] } }));
      })
    );
    return () => unsubs.forEach(u => u());
  }, [userId, profile]);

  // Load the actual curriculum (chapters) for Academic Tuition / Courses students
  useEffect(() => {
    if (!userId || !CHAPTER_BASED_CATEGORIES.includes(profile?.category)) { setChapterList([]); return; }
    const unsub = onSnapshot(doc(db, "studentChapters", userId), snap => {
      const data = snap.exists() ? snap.data() : { chapters: [] };
      setChapterList((data.chapters || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0)));
    }, () => {});
    return () => unsub();
  }, [userId, profile?.category]);

  // Load curriculum modules for coding students (for next-lesson chip) 
  useEffect(() => {
    const isCoding = profile?.category && profile.category !== "academic_tuition";
    if (!isCoding) return;
    const q = query(collection(db, "curriculum"), where("category", "==", profile.category));
    const unsub = onSnapshot(q, snap => {
      const mods = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => a.moduleNumber - b.moduleNumber);
      setCurrModules(mods);
    }, () => {});
    return () => unsub();
  }, [profile?.category]);

  // Load per-lesson progress for coding students
  useEffect(() => {
    if (!userId || !profile) return;
    const isCoding = profile?.category && profile.category !== "academic_tuition";
    if (!isCoding) return;
    // Listen to all subjects' lesson progress
    const subjects = (profile.assignments || []).map(a => a.subject);
    const unsubs = subjects.map(sub =>
      onSnapshot(getProgressRef(userId, sub), snap => {
        if (snap.exists()) {
          const lessons = snap.data().lessons || [];
          const map = {};
          lessons.forEach(l => { map[l.key] = l.status; });
          setLessonProgress(prev => ({ ...prev, ...map }));
        }
      }, () => {})
    );
    return () => unsubs.forEach(u => u());
  }, [userId, profile]);

  const assignments = profile?.assignments || [];
  const permanentClassLink = profile?.permanentClassLink || "";
  const isChapterBasedStudent = CHAPTER_BASED_CATEGORIES.includes(profile?.category);
  const chapterCompletedCount = chapterList.filter(c => c.completed).length;
  const totalModules = isChapterBasedStudent
    ? chapterCompletedCount
    : Object.values(progressData).reduce((s, p) => s + (p.completedChapters?.length || 0), 0);
  const attendanceRate = completed.length + missed.length > 0
    ? Math.round((completed.length / (completed.length + missed.length)) * 100) : 100;
  const nextClass = upcoming[0];
  const isCodingStudent = profile?.category && profile.category !== "academic_tuition";
  // Compute the single "next lesson" across all modules for the coding curriculum
  const nextLessonInfo = isCodingStudent ? getNextLessonLabel(currModules, lessonProgressMap) : null;

  const tabs = [
    { id: "overview",    label: "Overview",    icon: Home },
    { id: "upcoming",    label: "Upcoming",    icon: Calendar,    count: upcoming.length },
    { id: "progress",    label: "Progress",    icon: TrendingUp },
    { id: "notes", label: "Notes", icon: FileText, icon: BookOpen },
    { id: "completed",   label: "Completed",   icon: CheckCircle, count: completed.length },
    { id: "missed",      label: "Missed",      icon: XCircle,     count: missed.length },
    { id: "curriculum",  label: "My Curriculum", icon: BookOpen },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <img src={PearlxLogo} alt="Pearlx" style={{ height: 40, width: "auto", objectFit: "contain" }} />
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)} style={{ background: C.bg, border: "none", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X style={{ width: 16, height: 16, color: C.textMuted }} />
          </button>
        )}
      </div>

      <div style={{ padding: "16px 14px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: C.gradPrimary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 17, flexShrink: 0 }}>
            {profile?.name?.charAt(0) || "S"}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile?.name || "Student"}</p>
            <p style={{ fontSize: 12, color: C.textMuted }}>{profile?.customId || ""} · Student</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ padding: "9px 6px", borderRadius: 10, background: C.emeraldLight, textAlign: "center" }}>
            <p style={{ fontSize: 17, fontWeight: 800, color: C.emerald }}>{attendanceRate}%</p>
            <p style={{ fontSize: 11, color: C.textMuted }}>Attendance</p>
          </div>
          <div style={{ padding: "9px 6px", borderRadius: 10, background: C.indigoLight, textAlign: "center" }}>
            <p style={{ fontSize: 17, fontWeight: 800, color: C.indigo }}>{totalModules}</p>
            <p style={{ fontSize: 11, color: C.textMuted }}>Modules</p>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column", gap: 3 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 6px 8px" }}>MAIN MENU</p>
        {tabs.map(tab => <SideNavItem key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => handleTabChange(tab.id)} />)}
      </nav>

      {profile?.classLevel && (
        <div style={{ margin: "0 10px 8px", padding: "12px 14px", borderRadius: 12, background: C.violetLight, border: `1px solid ${C.violet}20` }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 4 }}>CLASS DETAILS</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.violet }}>Grade {profile.classLevel}</p>
          {profile.syllabus && <p style={{ fontSize: 12, color: C.textMuted }}>{profile.syllabus}</p>}
        </div>
      )}

      <div style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}` }}>
        <motion.button onClick={async () => { await logout(); navigate("/"); }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 12, border: `1px solid ${C.red}20`, background: C.redLight, color: C.red, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <LogOut style={{ width: 16, height: 16 }} /> Logout
        </motion.button>
      </div>
    </>
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>

      {/*  MOBILE BACKDROP  */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{ position: "fixed",height: "100dvh",overflowY: "auto", overscrollBehavior: "contain", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 999, backdropFilter: "blur(4px)" }} />
        )}
      </AnimatePresence>

      {/*  SIDEBAR  */}
      <motion.div
        initial={false}
        animate={isMobile ? { x: sidebarOpen ? 0 : -280 } : { x: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        style={{
          width: 256, minWidth: 256, height: "100dvh",overflowY: "auto",paddingBottom: 100,
          WebkitOverflowScrolling: "touch", overscrollBehavior: "contain",
          background: C.sidebar, borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column", flexShrink: 0,
          position: isMobile ? "fixed" : "relative",
          zIndex: isMobile ? 1000 : "auto",
          top: 0, left: 0,
        }}>
        <SidebarContent />
      </motion.div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ height: 62, background: "rgba(244,246,251,0.96)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 0 16px", flexShrink: 0, gap: 10, position: "relative", zIndex: 10, transform: "translateZ(0)", WebkitBackfaceVisibility: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <Menu style={{ width: 18, height: 18, color: C.textPrimary }} />
              </button>
            )}
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: C.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tabs.find(t => t.id === activeTab)?.label}</h1>
              <p style={{ fontSize: 12, color: C.textMuted }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {nextClass && !isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, background: C.indigoLight, border: `1px solid ${C.indigo}25` }}>
                <Bell style={{ width: 14, height: 14, color: C.indigo }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: C.indigo }}>
                  Next: {nextClass.subject} · {getDisplayTime(nextClass.classDate, nextClass.classTime, profile?.timezone)}
                </span>
              </div>
            )}
            {nextClass && isMobile && (
              <div style={{ padding: "6px 10px", borderRadius: 20, background: C.indigoLight, border: `1px solid ${C.indigo}25` }}>
                <Bell style={{ width: 14, height: 14, color: C.indigo }} />
              </div>
            )}
            <div style={{ width: 36, height: 36, borderRadius: 11, background: C.gradPrimary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>
              {profile?.name?.charAt(0) || "S"}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", padding: isMobile ? 16 : 24 }}>
          {loadingProfile ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Loader2 style={{ width: 28, height: 28, color: C.emerald, animation: "spin 1s linear infinite" }} /></div>
          ) : (
            <AnimatePresence mode="wait">

              {/* OVERVIEW  */}
              {activeTab === "overview" && (
                <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {/* Banner */}
                  <div style={{ borderRadius: 20, padding: isMobile ? "20px 20px" : "24px 28px", marginBottom: 24, background: C.gradPrimary, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", right: -20, top: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
                    <div style={{ position: "absolute", right: 30, bottom: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Welcome back, {profile?.name?.split(" ")[0] || "Student"}! 👋</h2>
                      <p style={{ fontSize: isMobile ? 13 : 14, color: "rgba(255,255,255,0.85)" }}>
                        You have <strong>{upcoming.length}</strong> upcoming {upcoming.length === 1 ? "class" : "classes"} and completed <strong>{totalModules}</strong> modules so far.
                      </p>
                      {nextClass && permanentClassLink && (
                        <a href={permanentClassLink} target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 14, padding: "9px 18px", borderRadius: 12, background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none", border: "1px solid rgba(255,255,255,0.3)" }}>
                          <Video style={{ width: 15, height: 15 }} />Join Next Class <ArrowRight style={{ width: 14, height: 14 }} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 10 : 14, marginBottom: 24 }}>
                    <StatCard icon={Calendar}    label="Upcoming Classes"  value={upcoming.length}   light={C.indigoLight}  iconColor={C.indigo} />
                    <StatCard icon={CheckCircle} label="Classes Completed" value={completed.length}  light={C.emeraldLight} iconColor={C.emerald} />
                    <StatCard icon={Target}      label="Modules Done"      value={totalModules}       light={C.cyanLight}    iconColor={C.cyan} />
                    <StatCard icon={Award}       label="Subjects"          value={assignments.length} light={C.amberLight}   iconColor={C.amber} />
                  </div>

                  {/* Two col */}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
                    {/* Next class */}
                    <div style={{ background: C.card, borderRadius: 18, padding: 20, border: `1px solid ${C.border}`, boxShadow: C.shadowCard }}>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                        <Calendar style={{ width: 15, height: 15, color: C.indigo }} />Next Class
                      </h3>
                      {loadingClasses ? <div style={{ display: "flex", justifyContent: "center", padding: 24 }}><Loader2 style={{ width: 22, height: 22, color: C.emerald, animation: "spin 1s linear infinite" }} /></div>
                        : nextClass ? <ClassCard cls={nextClass} type="upcoming" permanentClassLink={permanentClassLink} timezone={profile?.timezone} nextLesson={isCodingStudent ? nextLessonInfo : null} />
                        : <Empty icon={Calendar} msg="No upcoming classes scheduled" />}
                    </div>

                    {/* Subject progress */}
                    <div style={{ background: C.card, borderRadius: 18, padding: 20, border: `1px solid ${C.border}`, boxShadow: C.shadowCard }}>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                        <TrendingUp style={{ width: 15, height: 15, color: C.emerald }} />Subject Progress
                      </h3>
                      {assignments.length === 0 ? <Empty icon={TrendingUp} msg="No subjects assigned yet" /> : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          {assignments.map((a, i) => {
                            const done = progressData[a.subject]?.completedChapters?.length || 0;
                            return (
                              <div key={i}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: C.gradPrimary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12 }}>{a.subject?.charAt(0)}</div>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{a.subject}</span>
                                  </div>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: C.emerald }}>{done} done</span>
                                </div>
                                <div style={{ height: 6, borderRadius: 6, background: C.emeraldLight, overflow: "hidden" }}>
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, done * 10)}%` }} transition={{ duration: 0.7, delay: i * 0.1 }}
                                    style={{ height: "100%", borderRadius: 6, background: C.gradEmerald }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attendance summary */}
                  <div style={{ marginTop: 20, background: C.card, borderRadius: 18, padding: 20, border: `1px solid ${C.border}`, boxShadow: C.shadowCard }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, marginBottom: 14 }}>Attendance Summary</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                      {[
                        { label: "Total Classes", value: completed.length + missed.length, color: C.indigo, bg: C.indigoLight },
                        { label: "Attended", value: completed.length, color: C.emerald, bg: C.emeraldLight },
                        { label: "Missed", value: missed.length, color: C.red, bg: C.redLight },
                      ].map((item, i) => (
                        <div key={i} style={{ padding: isMobile ? "10px 8px" : "14px 16px", borderRadius: 14, background: item.bg, textAlign: "center" }}>
                          <p style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: item.color }}>{item.value}</p>
                          <p style={{ fontSize: isMobile ? 10 : 12, color: C.textMuted, marginTop: 2 }}>{item.label}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>Attendance Rate</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: C.emerald }}>{attendanceRate}%</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 8, background: C.emeraldLight, overflow: "hidden" }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${attendanceRate}%` }} transition={{ duration: 1 }}
                          style={{ height: "100%", borderRadius: 8, background: C.gradEmerald }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "notes" && <StudentNotesSection />}

              {/* UPCOMING  */}
              {activeTab === "upcoming" && (
                <motion.div key="up" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {loadingClasses ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
                      <Loader2 style={{ width: 28, height: 28, color: C.emerald, animation: "spin 1s linear infinite" }} />
                    </div>
                  ) : upcoming.length === 0 ? (
                    <Empty icon={Calendar} msg="No upcoming classes scheduled" />
                  ) : (
                    <>
                      {/* Summary header */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                        <div>
                          <h2 style={{ fontSize: 18, fontWeight: 900, color: C.textPrimary, marginBottom: 3, letterSpacing: "-0.02em" }}>
                            {upcoming.length} Upcoming {upcoming.length === 1 ? "Class" : "Classes"}
                          </h2>
                          <p style={{ fontSize: 13, color: C.textMuted }}>
                            {upcoming.filter(c => {
                              const d = new Date(c.classDate);
                              return d.toDateString() === new Date().toDateString();
                            }).length > 0
                              ? `${upcoming.filter(c => new Date(c.classDate).toDateString() === new Date().toDateString()).length} class${upcoming.filter(c => new Date(c.classDate).toDateString() === new Date().toDateString()).length > 1 ? "es" : ""} today`
                              : "Next: " + new Date(upcoming[0].classDate).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
                            }
                          </p>
                        </div>
                        {/* Next lesson summary pill — coding students only */}
                        {isCodingStudent && nextLessonInfo && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 14, background: nextLessonInfo.status === "ongoing" ? C.amberLight : C.indigoLight, border: `1px solid ${nextLessonInfo.status === "ongoing" ? C.amber + "30" : C.indigo + "20"}` }}>
                            <Zap style={{ width: 14, height: 14, color: nextLessonInfo.status === "ongoing" ? C.amber : C.indigo }} />
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 800, color: nextLessonInfo.status === "ongoing" ? C.amber : C.indigo, letterSpacing: "0.05em" }}>
                                {nextLessonInfo.status === "ongoing" ? "IN PROGRESS" : "UP NEXT"}
                              </p>
                              <p style={{ fontSize: 12, fontWeight: 700, color: C.textPrimary }}>{nextLessonInfo.label}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {upcoming.map(cls => (
                          <ClassCard
                            key={cls.id}
                            cls={cls}
                            type="upcoming"
                            permanentClassLink={permanentClassLink}
                            timezone={profile?.timezone}
                            nextLesson={isCodingStudent ? nextLessonInfo : null}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* PROGRESS  */}
              {activeTab === "progress" && (
                <motion.div key="pr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {isChapterBasedStudent ? (
                    // Chapter-based curriculum progress (Academic Tuition / Courses)
                    chapterList.length === 0 ? (
                      <Empty icon={TrendingUp} msg="No curriculum assigned yet" />
                    ) : (
                      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, boxShadow: C.shadowCard, maxWidth: 520 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                          <div>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>Curriculum Progress</h3>
                            <p style={{ fontSize: 12, color: C.textMuted }}>{chapterCompletedCount} of {chapterList.length} chapters completed</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: 24, fontWeight: 800, color: C.emerald }}>{chapterCompletedCount}/{chapterList.length}</p>
                          </div>
                        </div>
                        <div style={{ height: 6, borderRadius: 6, background: C.emeraldLight, overflow: "hidden", marginBottom: 16 }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${chapterList.length ? Math.round((chapterCompletedCount / chapterList.length) * 100) : 0}%` }} transition={{ duration: 0.8 }}
                            style={{ height: "100%", borderRadius: 6, background: C.gradEmerald }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {chapterList.map((chap, i) => (
                            <div key={chap.id || i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: chap.completed ? C.emeraldLight : C.bg, border: `1px solid ${chap.completed ? C.emerald + "35" : C.border}` }}>
                              <div style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: chap.completed ? C.emerald : "#E2E8F0" }}>
                                {chap.completed ? <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>✓</span> : <span style={{ color: "#94A3B8", fontSize: 10 }}>{i + 1}</span>}
                              </div>
                              <p style={{ fontSize: 13, fontWeight: chap.completed ? 700 : 500, color: C.textPrimary }}>{chap.title}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
                      {assignments.length === 0
                        ? <div style={{ gridColumn: "1/-1" }}><Empty icon={TrendingUp} msg="No progress data available" /></div>
                        : assignments.map((a, i) => {
                            const data = progressData[a.subject] || { completedChapters: [] };
                            const done = data.completedChapters?.length || 0;
                            return (
                              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, boxShadow: C.shadowCard }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                  <div>
                                    <h3 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>{a.subject}</h3>
                                    <p style={{ fontSize: 12, color: C.textMuted }}>with {a.tutorName}</p>
                                  </div>
                                  <div style={{ textAlign: "right" }}>
                                    <p style={{ fontSize: 24, fontWeight: 800, color: C.emerald }}>{done}</p>
                                    <p style={{ fontSize: 11, color: C.textMuted }}>chapters</p>
                                  </div>
                                </div>
                                <div style={{ height: 6, borderRadius: 6, background: C.emeraldLight, overflow: "hidden", marginBottom: 12 }}>
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, done * 10)}%` }} transition={{ duration: 0.8 }}
                                    style={{ height: "100%", borderRadius: 6, background: C.gradEmerald }} />
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                  {data.completedChapters?.map((ch, ci) => (
                                    <span key={ci} style={{ padding: "4px 10px", borderRadius: 20, background: C.emeraldLight, color: C.emerald, fontSize: 12, fontWeight: 600 }}>✓ {ch}</span>
                                  ))}
                                  {done === 0 && <p style={{ fontSize: 13, color: C.textMuted }}>No chapters completed yet</p>}
                                </div>
                              </div>
                            );
                          })
                      }
                    </div>
                  )}
                </motion.div>
              )}

              {/*  COMPLETED  */}
              {activeTab === "completed" && (
                <motion.div key="co" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {completed.length === 0 ? <Empty icon={CheckCircle} msg="No completed classes yet" />
                    : completed.map(cls => <ClassCard key={cls.id} cls={cls} type="completed" permanentClassLink={permanentClassLink} timezone={profile?.timezone} nextLesson={null} />)}
                </motion.div>
              )}

              {/*  MISSED  */}
              {activeTab === "missed" && (
                <motion.div key="mi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {missed.length === 0 ? <Empty icon={CheckCircle} msg="No missed classes — great work! 🎉" color={C.emerald} />
                    : missed.map(cls => <ClassCard key={cls.id} cls={cls} type="missed" permanentClassLink={permanentClassLink} timezone={profile?.timezone} nextLesson={null} />)}
                </motion.div>
              )}

              {activeTab === "curriculum" && (
                <motion.div key="cu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <StudentCurriculumView category={profile?.category} studentName={profile?.name} studentId={userId} />
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:10px}
      `}</style>
    </div>
  );
}