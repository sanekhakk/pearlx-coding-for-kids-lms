import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection, query, where, onSnapshot, doc, getDocs,
  getDoc, setDoc,
} from "firebase/firestore";
import {
  Loader2, User, CheckCircle, XCircle, X, Trash2, Calendar, Clock,
  TrendingUp, LogOut, Users, AlertCircle, Video, ArrowRight, Menu,
  Home, BarChart2, Bell, Award, Phone, BookOpen, ChevronDown, ChevronRight,
  GraduationCap, Play, PlayCircle, Zap, FileText, Check, AlertTriangle,
  RefreshCw, CheckCircle2, Link as LinkIcon, Image as ImageIcon, ClipboardCheck,
  ChevronLeft, Sparkles,
} from "lucide-react";
import { getProgressRef } from "../utils/paths";
import { getDisplayTime } from "../utils/timeUtils";
import { CATEGORIES, COURSES, MODULE_ICON, getEffectiveCourse } from "../utils/curriculumData";
import { resolveAvatarUrl } from "../utils/defaultAvatars";
import PearlxLogo from "../assets/flat_logo.webp";
import TutorNotesSection from "./TutorNotesSection";

const C = {
  bg: "#F2F8FC", sidebar: "#FFFFFF", card: "#FFFFFF", border: "#E5E9F2",
  textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
  emerald: "#10B981", emeraldLight: "#ECFDF5", emeraldDark: "#059669",
  cyan: "#0EA5E9", cyanLight: "#E0F2FE",
  indigo: "#6366F1", indigoLight: "#EEF2FF",
  red: "#EF4444", redLight: "#FEF2F2",
  amber: "#F59E0B", amberLight: "#FFFBEB",
  violet: "#8B5CF6", violetLight: "#F5F3FF",
  gradPrimary: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
  gradEmerald: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  gradIndigo: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
  gradRed: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
  gradViolet: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
  gradAmber: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
  shadowCard: "0 4px 0 rgba(15,23,42,0.05), 0 8px 22px rgba(15,23,42,0.04)",
  shadowHover: "0 7px 0 rgba(14,165,233,0.16), 0 14px 28px rgba(15,23,42,0.08)",
  shadowModal: "0 24px 64px rgba(15,23,42,0.18)",
};

const catLabel = {
  little_pearls: { label: "Little Pearls", icon: CATEGORIES.find(c => c.value === "little_pearls")?.icon, color: "#EA580C", bg: "#FFF7ED" },
  bright_pearls: { label: "Bright Pearls", icon: CATEGORIES.find(c => c.value === "bright_pearls")?.icon, color: "#16A34A", bg: "#F0FDF4" },
  rising_pearls: { label: "Rising Pearls", icon: CATEGORIES.find(c => c.value === "rising_pearls")?.icon, color: "#2563EB", bg: "#EFF6FF" },
};

// Helper: get next/ongoing lesson from progress map
function getNextLessonLabel(modules, lessonProgressMap) {
  if (!modules || modules.length === 0) return null;
  for (const mod of modules) {
    const lessons = [...(mod.lessons || [])].sort((a, b) => a.lessonNumber - b.lessonNumber);
    for (const lesson of lessons) {
      const key = `M${mod.moduleNumber}:L${lesson.lessonNumber} ${lesson.title}`;
      const status = lessonProgressMap?.[key];
      if (status === "ongoing") return { label: lesson.title, mod: mod.moduleName, status: "ongoing" };
      if (!status || status === "not_covered") return { label: lesson.title, mod: mod.moduleName, status: "next" };
    }
  }
  return null;
}

const isClassDue = (cls) => {
  if (!cls.classDate || !cls.classTime) return false;
  if (cls.status !== "scheduled" && cls.status !== "pending") return false;
  return new Date(`${cls.classDate}T${cls.classTime}:00+05:30`) < new Date();
};

const Empty = ({ icon: Icon, msg, color }) => (
  <div style={{ textAlign: "center", padding: "40px 20px", borderRadius: 16, background: C.bg, border: `2px solid ${C.border}` }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: color ? `${color}15` : "#F0F2F8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
      <Icon style={{ width: 24, height: 24, color: color || C.textMuted, opacity: 0.5 }} />
    </div>
    <p style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>{msg}</p>
  </div>
);

const StatCard = ({ icon: Icon, label, value, light, iconColor, onClick, badge }) => (
  <motion.div whileHover={{ y: -2, boxShadow: C.shadowHover }} onClick={onClick}
    style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 16, padding: "20px", boxShadow: C.shadowCard, cursor: onClick ? "pointer" : "default", position: "relative", overflow: "hidden" }}>
    {badge && <div style={{ position: "absolute", top: 12, right: 12, background: C.red, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>{badge}</div>}
    <div style={{ width: 40, height: 40, borderRadius: 12, background: light, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
      <Icon style={{ width: 20, height: 20, color: iconColor }} />
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: C.textPrimary, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 500, marginTop: 4 }}>{label}</div>
  </motion.div>
);

// Read-only circular avatar for students — shows their profile photo cropped
// to a circle (overflow:hidden + border-radius:50% clips away any square
// canvas margin), or falls back to an initial on a gradient background.
const Avatar = ({ url, name, size = 44, fontSize, radius }) => {
  const resolvedUrl = resolveAvatarUrl(url);
  return (
    <div style={{
      width: size, height: size, borderRadius: radius ?? "50%", overflow: "hidden", flexShrink: 0,
      background: C.gradPrimary, display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 800, fontSize: fontSize || Math.round(size * 0.42),
    }}>
      {resolvedUrl ? (
        <img src={resolvedUrl} alt={name || "avatar"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        name?.charAt(0)?.toUpperCase() || "S"
      )}
    </div>
  );
};

const SideNavItem = ({ tab, active, onClick }) => (
  <motion.button onClick={onClick} whileTap={{ scale: 0.97, y: 2 }}
    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 12px 8px 8px", borderRadius: 999, border: `2px solid ${active ? C.emerald : "transparent"}`, background: active ? C.emerald : "transparent", boxShadow: active ? "0 6px 16px -8px rgba(16,185,129,0.7)" : "none", cursor: "pointer", transition: "background .2s, box-shadow .2s" }}>
    <div style={{ width: 34, height: 34, borderRadius: "50%", background: active ? "rgba(255,255,255,0.25)" : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <tab.icon style={{ width: 16, height: 16, color: active ? "#fff" : C.textMuted }} />
    </div>
    <span style={{ fontSize: 14, fontWeight: 700, color: active ? "#fff" : C.textSecondary, flex: 1, textAlign: "left" }}>{tab.label}</span>
    {tab.count !== undefined && (
      <span style={{ background: active ? "#fff" : C.border, color: active ? C.emerald : C.textMuted, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{tab.count}</span>
    )}
  </motion.button>
);

// Attendance Modal — lessons with Completed / Ongoing toggle
const AttendanceModal = ({ classItem, onClose, markAttendance }) => {
  const { userId, tutorSaveLessonProgress } = useAuth();
  const [status, setStatus] = useState("completed");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // curriculum
  const [currModules, setCurrModules] = useState([]);
  const [currLoading, setCurrLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [studentCategory, setStudentCategory] = useState(null);

  // lessonStates: { [lessonKey]: "completed" | "ongoing" | null }
  const [lessonStates, setLessonStates] = useState({});

  useEffect(() => {
    const fetchCurriculum = async () => {
      setCurrLoading(true);
      try {
        const snap = await getDoc(doc(db, "userSummaries", classItem.studentId));
        const studentProfile = snap.exists() ? snap.data() : null;
        const category = studentProfile?.category || null;
        const effCourse = getEffectiveCourse(studentProfile);
        setStudentCategory(category);
        if (category && (effCourse === "coding" || effCourse === "math")) {
          const q = query(collection(db, "curriculum"), where("course", "==", effCourse), where("category", "==", category));
          const currSnap = await getDocs(q);
          const mods = currSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => a.moduleNumber - b.moduleNumber);
          setCurrModules(mods);
          if (mods.length > 0) setExpandedModules({ [mods[0].id]: true });
        }
      } catch (e) {
        console.error("Curriculum fetch error:", e);
      }
      setCurrLoading(false);
    };
    fetchCurriculum();
  }, [classItem.studentId]);

  // Cycle: null → "ongoing" → "completed" → null
  const cycleLesson = (key) => {
    setLessonStates(prev => {
      const cur = prev[key] || null;
      const next = cur === null ? "ongoing" : cur === "ongoing" ? "completed" : null;
      return { ...prev, [key]: next };
    });
  };

  const toggleModule = (modId) =>
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));

  const selectedLessons = Object.entries(lessonStates).filter(([, v]) => v !== null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Build human-readable summary
    const completedTitles = Object.entries(lessonStates).filter(([, v]) => v === "completed").map(([k]) => k);
    const ongoingTitles   = Object.entries(lessonStates).filter(([, v]) => v === "ongoing").map(([k]) => k);
    let lessonSummary = summary;
    if (completedTitles.length) lessonSummary = `Completed: ${completedTitles.join(", ")}. ` + lessonSummary;
    if (ongoingTitles.length)   lessonSummary = `Ongoing: ${ongoingTitles.join(", ")}. ` + lessonSummary;

    // 1) Mark attendance as before
    const res = await markAttendance(classItem.id, classItem.studentId, status, lessonSummary.trim());
    if (!res.success) { setError(res.error); setLoading(false); return; }

    // 2) Save structured lesson progress if any lessons selected
    if (selectedLessons.length > 0 && status === "completed") {
      // Build lessonProgress entries: { lessonKey, moduleNumber, lessonNumber, title, platform, lessonStatus }
      const lessonProgressEntries = [];
      currModules.forEach(mod => {
        (mod.lessons || []).forEach(lesson => {
          const key = `M${mod.moduleNumber}:L${lesson.lessonNumber} ${lesson.title}`;
          const st = lessonStates[key];
          if (st) {
            lessonProgressEntries.push({
              lessonKey: key,
              moduleNumber: mod.moduleNumber,
              moduleName: mod.moduleName,
              lessonNumber: lesson.lessonNumber,
              title: lesson.title,
              platform: lesson.platform || "",
              lessonStatus: st, // "completed" or "ongoing"
            });
          }
        });
      });
      await tutorSaveLessonProgress(classItem.studentId, classItem.subject, lessonProgressEntries);
    }

    setLoading(false);
    setSuccess("Attendance marked successfully!");
    setTimeout(onClose, 1400);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }}
        style={{ background: C.card, borderRadius: 24, width: "100%", maxWidth: 580, maxHeight: "90vh", overflow: "hidden", boxShadow: C.shadowModal, display: "flex", flexDirection: "column" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: C.gradPrimary, flexShrink: 0 }} />
        <div style={{ overflowY: "auto", padding: 28 }}>
          <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: C.bg, border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X style={{ width: 16, height: 16, color: C.textMuted }} />
          </button>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: C.textPrimary, marginBottom: 4 }}>Mark Attendance</h3>
          <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 4 }}>
            <span style={{ color: C.emerald, fontWeight: 700 }}>{classItem.subject}</span> · {classItem.studentName}
          </p>
          {studentCategory && catLabel[studentCategory] && (
            <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: catLabel[studentCategory]?.bg, color: catLabel[studentCategory]?.color, marginBottom: 16 }}>
              {catLabel[studentCategory]?.label}
            </span>
          )}

          {error && <div style={{ background: C.redLight, borderRadius: 12, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: C.red, display: "flex", gap: 8, alignItems: "center" }}><AlertCircle style={{ width: 15, height: 15 }} />{error}</div>}
          {success && <div style={{ background: C.emeraldLight, borderRadius: 12, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: C.emerald, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Check style={{ width: 14, height: 14 }} strokeWidth={3} />{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Attendance status */}
            <p style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary, marginBottom: 10 }}>Attendance Status</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
              {[{ val: "completed", label: "Present", icon: Check, color: C.emerald, bg: C.emeraldLight },
                { val: "missed",    label: "Absent",  icon: X,     color: C.red,     bg: C.redLight }].map(opt => {
                const active = status === opt.val;
                const OptIcon = opt.icon;
                return (
                  <button key={opt.val} type="button" onClick={() => setStatus(opt.val)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "14px 10px", borderRadius: 14, border: `2px solid ${active ? opt.color : C.border}`, background: active ? opt.bg : C.bg, color: active ? opt.color : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    <OptIcon style={{ width: 15, height: 15 }} strokeWidth={2.5} />
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Lesson selector — only when present */}
            {status === "completed" && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.textSecondary }}>
                    Lessons Covered
                  </p>
                  {/* Legend */}
                  <div style={{ display: "flex", gap: 10, fontSize: 11 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: C.amber, fontWeight: 600 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.amber, display: "inline-block" }} />Ongoing
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: C.emerald, fontWeight: 600 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.emerald, display: "inline-block" }} />Completed
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: C.textMuted, marginBottom: 10, display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                  Click once = <RefreshCw style={{ width: 10, height: 10 }} /> Ongoing &nbsp;·&nbsp; Click twice = <CheckCircle2 style={{ width: 10, height: 10 }} /> Completed &nbsp;·&nbsp; Click again = clear
                </p>

                {currLoading ? (
                  <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
                    <Loader2 style={{ width: 20, height: 20, color: C.emerald, animation: "spin 1s linear infinite" }} />
                  </div>
                ) : currModules.length === 0 ? (
                  <div style={{ padding: "12px 14px", borderRadius: 10, background: C.amberLight, fontSize: 12, color: C.amber, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <AlertTriangle style={{ width: 14, height: 14, flexShrink: 0 }} /> No curriculum found for this student's category. Ask admin to add curriculum data.
                  </div>
                ) : (
                  <div style={{ border: `2px solid ${C.border}`, borderRadius: 14, overflow: "hidden", maxHeight: 320, overflowY: "auto" }}>
                    {currModules.map((mod, mIdx) => {
                      const isOpen = expandedModules[mod.id];
                      const modOngoing   = (mod.lessons || []).filter(l => lessonStates[`M${mod.moduleNumber}:L${l.lessonNumber} ${l.title}`] === "ongoing").length;
                      const modCompleted = (mod.lessons || []).filter(l => lessonStates[`M${mod.moduleNumber}:L${l.lessonNumber} ${l.title}`] === "completed").length;
                      return (
                        <div key={mod.id} style={{ borderBottom: mIdx < currModules.length - 1 ? `2px solid ${C.border}` : "none" }}>
                          <div onClick={() => toggleModule(mod.id)}
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", cursor: "pointer", background: isOpen ? C.bg : C.card, userSelect: "none" }}>
                            <MODULE_ICON style={{ width: 15, height: 15, color: C.textSecondary, flexShrink: 0 }} />
                            <span style={{ flex: 1, fontWeight: 700, fontSize: 13, color: C.textPrimary }}>
                              M{mod.moduleNumber}: {mod.moduleName}
                            </span>
                            <div style={{ display: "flex", gap: 5 }}>
                              {modOngoing > 0 && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: C.amber, background: C.amberLight, padding: "2px 7px", borderRadius: 20 }}><RefreshCw style={{ width: 9, height: 9 }} /> {modOngoing}</span>
                              )}
                              {modCompleted > 0 && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: C.emerald, background: C.emeraldLight, padding: "2px 7px", borderRadius: 20 }}><CheckCircle2 style={{ width: 9, height: 9 }} /> {modCompleted}</span>
                              )}
                            </div>
                            {isOpen ? <ChevronDown style={{ width: 14, height: 14, color: C.textMuted }} /> : <ChevronRight style={{ width: 14, height: 14, color: C.textMuted }} />}
                          </div>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
                                <div style={{ padding: "6px 14px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                                  {(mod.lessons || []).sort((a, b) => a.lessonNumber - b.lessonNumber).map(lesson => {
                                    const key = `M${mod.moduleNumber}:L${lesson.lessonNumber} ${lesson.title}`;
                                    const st = lessonStates[key] || null;
                                    const isOngoing   = st === "ongoing";
                                    const isCompleted = st === "completed";
                                    const rowBg = isCompleted ? C.emeraldLight : isOngoing ? C.amberLight : "transparent";
                                    const rowBorder = isCompleted ? `${C.emerald}40` : isOngoing ? `${C.amber}40` : "transparent";
                                    return (
                                      <div key={lesson.id} onClick={() => cycleLesson(key)}
                                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: 10, cursor: "pointer", background: rowBg, border: `1px solid ${rowBorder}`, transition: "all 0.12s" }}>
                                        {/* Status indicator */}
                                        <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                                          background: isCompleted ? C.emerald : isOngoing ? C.amber : C.border,
                                          border: `2px solid ${isCompleted ? C.emeraldDark : isOngoing ? "#D97706" : C.border}`,
                                          transition: "all 0.12s" }}>
                                          {isCompleted ? <Check style={{ width: 12, height: 12, color: "#fff" }} strokeWidth={3} />
                                            : isOngoing ? <RefreshCw style={{ width: 11, height: 11, color: "#fff" }} />
                                            : null}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <p style={{ fontSize: 12, fontWeight: st ? 700 : 500, color: C.textPrimary, lineHeight: 1.4 }}>
                                            <span style={{ color: C.textMuted, fontSize: 11 }}>L{lesson.lessonNumber} · </span>{lesson.title}
                                          </p>
                                          <p style={{ fontSize: 11, color: C.cyan, marginTop: 1 }}>{lesson.platform}</p>
                                        </div>
                                        {/* Status badge */}
                                        {isOngoing && <span style={{ fontSize: 10, fontWeight: 700, color: C.amber, whiteSpace: "nowrap", flexShrink: 0 }}>Ongoing</span>}
                                        {isCompleted && <span style={{ fontSize: 10, fontWeight: 700, color: C.emerald, whiteSpace: "nowrap", flexShrink: 0 }}>Completed</span>}
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedLessons.length > 0 && (
                  <div style={{ marginTop: 8, display: "flex", gap: 12, fontSize: 11, fontWeight: 600 }}>
                    {Object.values(lessonStates).filter(v => v === "ongoing").length > 0 && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: C.amber }}><RefreshCw style={{ width: 11, height: 11 }} /> {Object.values(lessonStates).filter(v => v === "ongoing").length} ongoing</span>
                    )}
                    {Object.values(lessonStates).filter(v => v === "completed").length > 0 && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: C.emerald }}><CheckCircle2 style={{ width: 11, height: 11 }} /> {Object.values(lessonStates).filter(v => v === "completed").length} completed</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <label style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary, display: "block", marginBottom: 8 }}>
              {status === "completed" ? "Additional Notes (optional)" : "Reason for Absence (optional)"}
            </label>
            <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={3}
              placeholder={status === "completed" ? "Any extra notes about today's class..." : "Reason for absence..."}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `2px solid ${C.border}`, background: C.bg, fontSize: 13, color: C.textPrimary, resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              onFocus={e => { e.target.style.borderColor = C.emerald; }} onBlur={e => { e.target.style.borderColor = C.border; }} />

            <button type="submit" disabled={loading}
              style={{ width: "100%", marginTop: 16, padding: 14, borderRadius: 14, border: "none", background: C.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
              {loading ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : "Submit Attendance"}
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Progress Detail Modal — curriculum-based lesson progress 
const ProgressUpdateModal = ({ student, onClose }) => {
  const { tutorSaveLessonProgress } = useAuth();
  const [modules, setModules] = useState([]);
  const [loadingCurr, setLoadingCurr] = useState(true);
  const [progress, setProgress] = useState({}); 
  const [expandedMods, setExpandedMods] = useState({});
  const [saving, setSaving] = useState(null); // lessonKey being saved
  const [activeSubject] = useState(
    (student.assignments || [])[0]?.subject || null
  );

  const catInfo = catLabel[student.category];
  const studentEffCourse = getEffectiveCourse(student);
  const isChapterBased = studentEffCourse === "academic_tuition";

  // Chapter-based curriculum (Academic Tuition / Courses)
  const [chapters, setChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [savingChapter, setSavingChapter] = useState(null); // chapter id being toggled

  useEffect(() => {
    if (!isChapterBased) { setLoadingChapters(false); return; }
    setLoadingChapters(true);
    const unsub = onSnapshot(doc(db, "studentChapters", student.uid), snap => {
      const data = snap.exists() ? snap.data() : { chapters: [] };
      setChapters((data.chapters || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0)));
      setLoadingChapters(false);
    }, () => setLoadingChapters(false));
    return () => unsub();
  }, [isChapterBased, student.uid]);

  const toggleChapterComplete = async (chapterId) => {
    setSavingChapter(chapterId);
    const next = chapters.map(c => c.id === chapterId ? { ...c, completed: !c.completed } : c);
    try {
      await setDoc(doc(db, "studentChapters", student.uid), { chapters: next }, { merge: true });
    } catch (e) {
      console.error("toggle chapter complete err:", e);
    }
    setSavingChapter(null);
  };

  // Fetch curriculum for student's course + category (coding/math only)
  useEffect(() => {
    if (!student.category || isChapterBased) { setLoadingCurr(false); return; }
    const q = query(collection(db, "curriculum"), where("course", "==", studentEffCourse), where("category", "==", student.category));
    getDocs(q).then(snap => {
      const mods = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => a.moduleNumber - b.moduleNumber);
      setModules(mods);
      if (mods.length > 0) setExpandedMods({ [mods[0].id]: true });
      setLoadingCurr(false);
    }).catch(() => setLoadingCurr(false));
  }, [student.category, studentEffCourse, isChapterBased]);

  // Listen to progress for each subject the student has
  useEffect(() => {
    const unsubs = [];
    (student.assignments || []).forEach(a => {
      const unsub = onSnapshot(getProgressRef(student.uid, a.subject), snap => {
        const data = snap.exists() ? snap.data() : {};
        setProgress(prev => ({ ...prev, [a.subject]: data }));
      }, () => {});
      unsubs.push(unsub);
    });
    return () => unsubs.forEach(u => u());
  }, [student.uid, student.assignments]);

  // For a given subject, get lessonProgress array (new structured format)
  const getLessonProgress = (subject) =>
    progress[subject]?.lessonProgress || [];

  const getLessonStatus = (subject, lessonKey) => {
    const lp = getLessonProgress(subject);
    const found = lp.find(l => l.lessonKey === lessonKey);
    return found?.lessonStatus || null; // "completed" | "ongoing" | null
  };

  // Cycle status for a lesson directly from progress modal
  const cycleLesson = async (subject, mod, lesson) => {
    const key = `M${mod.moduleNumber}:L${lesson.lessonNumber} ${lesson.title}`;
    const cur = getLessonStatus(subject, key);
    const next = cur === null ? "ongoing" : cur === "ongoing" ? "completed" : null;

    setSaving(key);
    const entry = {
      lessonKey: key,
      moduleNumber: mod.moduleNumber,
      moduleName: mod.moduleName,
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      platform: lesson.platform || "",
      lessonStatus: next, // null means remove
    };
    await tutorSaveLessonProgress(student.uid, subject, [entry]);
    setSaving(null);
  };

  const subjects = (student.assignments || []).map(a => a.subject);
  const [selSubject, setSelSubject] = useState(subjects[0] || null);

  // Count stats for selected subject
  const lessonProg = getLessonProgress(selSubject);
  const completedCount = lessonProg.filter(l => l.lessonStatus === "completed").length;
  const ongoingCount   = lessonProg.filter(l => l.lessonStatus === "ongoing").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }}
        style={{ background: C.card, borderRadius: 24, width: "100%", maxWidth: 560, maxHeight: "90vh", overflow: "hidden", boxShadow: C.shadowModal, display: "flex", flexDirection: "column" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: C.gradEmerald, flexShrink: 0 }} />
        <div style={{ padding: "20px 24px 14px", borderBottom: `2px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: C.textPrimary, display: "flex", alignItems: "center", gap: 7 }}>
                <BookOpen style={{ width: 16, height: 16, color: C.emerald }} />
                Curriculum &amp; Progress
              </h3>
            </div>
            <button onClick={onClose} style={{ background: C.bg, border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X style={{ width: 16, height: 16, color: C.textMuted }} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar url={student.photoURL} name={student.name} size={40} fontSize={17} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}>{student.name}</p>
              <p style={{ fontSize: 12, color: C.textMuted }}>{student.customId} · Grade {student.classLevel || student.grade}</p>
            </div>
            {catInfo ? (
              <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: catInfo.bg, color: catInfo.color, flexShrink: 0 }}>
                {catInfo.label}
              </span>
            ) : (
              <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: C.bg, color: C.textMuted, border: `2px solid ${C.border}`, flexShrink: 0 }}>
                No Category Set
              </span>
            )}
          </div>
        </div>

        {/* Subject tabs */}
        {!isChapterBased && subjects.length > 1 && (
          <div style={{ display: "flex", borderBottom: `2px solid ${C.border}`, flexShrink: 0, overflowX: "auto" }}>
            {subjects.map(subj => (
              <button key={subj} onClick={() => setSelSubject(subj)}
                style={{ padding: "10px 16px", border: "none", cursor: "pointer", fontWeight: selSubject === subj ? 700 : 500, fontSize: 13,
                  background: selSubject === subj ? C.emeraldLight : "transparent",
                  color: selSubject === subj ? C.emerald : C.textMuted,
                  borderBottom: selSubject === subj ? `2px solid ${C.emerald}` : "2px solid transparent",
                  whiteSpace: "nowrap", flexShrink: 0 }}>
                {subj}
              </button>
            ))}
          </div>
        )}

        {/* Stats bar */}
        {isChapterBased ? (
          <div style={{ display: "flex", gap: 16, padding: "12px 24px", background: C.bg, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.emerald, display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.emerald }}>{chapters.filter(c => c.completed).length} of {chapters.length} Completed</span>
            </div>
            <span style={{ fontSize: 11, color: C.textMuted, marginLeft: "auto", lineHeight: 2 }}>Click a chapter to mark it complete</span>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 16, padding: "12px 24px", background: C.bg, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.emerald, display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.emerald }}>{completedCount} Completed</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.amber, display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.amber }}>{ongoingCount} Ongoing</span>
            </div>
            <span style={{ fontSize: 11, color: C.textMuted, marginLeft: "auto", lineHeight: 2 }}>Click to cycle status</span>
          </div>
        )}

        {/* Content list */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {isChapterBased ? (
            loadingChapters ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                <Loader2 style={{ width: 24, height: 24, color: C.emerald, animation: "spin 1s linear infinite" }} />
              </div>
            ) : chapters.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: C.amberLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <BookOpen style={{ width: 22, height: 22, color: C.amber }} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>No Chapters Yet</p>
                <p style={{ fontSize: 12, color: C.textMuted }}>Ask admin to add chapters for this student under Curriculum → Assign to Students.</p>
              </div>
            ) : (
              <div style={{ padding: "12px 24px", display: "flex", flexDirection: "column", gap: 6 }}>
                {chapters.map((chap, i) => {
                  const isSaving = savingChapter === chap.id;
                  return (
                    <div key={chap.id || i}
                      onClick={() => !isSaving && toggleChapterComplete(chap.id)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                        background: chap.completed ? C.emeraldLight : C.bg, border: `1px solid ${chap.completed ? C.emerald + "35" : C.border}`, opacity: isSaving ? 0.6 : 1 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                        background: chap.completed ? C.emerald : "#E2E8F0" }}>
                        {isSaving
                          ? <Loader2 style={{ width: 12, height: 12, color: "#fff", animation: "spin 1s linear infinite" }} />
                          : chap.completed ? <Check style={{ width: 13, height: 13, color: "#fff" }} strokeWidth={3} />
                          : <span style={{ color: "#94A3B8", fontSize: 11 }}>{i + 1}</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: chap.completed ? 700 : 500, color: C.textPrimary }}>{chap.title}</p>
                        {chap.content && <p style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{chap.content}</p>}
                      </div>
                      {chap.completed && <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: C.emerald, background: C.emeraldLight, padding: "3px 8px", borderRadius: 20, flexShrink: 0 }}><CheckCircle2 style={{ width: 10, height: 10 }} /> Done</span>}
                    </div>
                  );
                })}
              </div>
            )
          ) : loadingCurr ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
              <Loader2 style={{ width: 24, height: 24, color: C.emerald, animation: "spin 1s linear infinite" }} />
            </div>
          ) : modules.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: C.amberLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <BookOpen style={{ width: 22, height: 22, color: C.amber }} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>No Curriculum Found</p>
              <p style={{ fontSize: 12, color: C.textMuted }}>
                {student.category
                  ? `No modules found for ${catInfo?.label || student.category}. Ask admin to seed the curriculum.`
                  : "This student has no category assigned. Ask admin to set a category (Little Pearls / Bright Pearls / Rising Pearls)."}
              </p>
            </div>
          ) : (
            modules.map((mod, mIdx) => {
              const isOpen = expandedMods[mod.id];
              const modLessons = mod.lessons || [];
              const modCompleted = modLessons.filter(l => getLessonStatus(selSubject, `M${mod.moduleNumber}:L${l.lessonNumber} ${l.title}`) === "completed").length;
              const modOngoing   = modLessons.filter(l => getLessonStatus(selSubject, `M${mod.moduleNumber}:L${l.lessonNumber} ${l.title}`) === "ongoing").length;

              return (
                <div key={mod.id} style={{ borderBottom: `2px solid ${C.border}` }}>
                  <div onClick={() => setExpandedMods(p => ({ ...p, [mod.id]: !p[mod.id] }))}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 24px", cursor: "pointer", background: isOpen ? C.bg : C.card, userSelect: "none" }}>
                    <MODULE_ICON style={{ width: 16, height: 16, color: C.textSecondary, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: C.textPrimary }}>M{mod.moduleNumber}: {mod.moduleName}</p>
                      <p style={{ fontSize: 11, color: C.textMuted }}>{modLessons.length} lessons</p>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      {modOngoing > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: C.amber, background: C.amberLight, padding: "2px 7px", borderRadius: 20 }}><RefreshCw style={{ width: 9, height: 9 }} /> {modOngoing}</span>}
                      {modCompleted > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: C.emerald, background: C.emeraldLight, padding: "2px 7px", borderRadius: 20 }}><CheckCircle2 style={{ width: 9, height: 9 }} /> {modCompleted}/{modLessons.length}</span>}
                    </div>
                    {isOpen ? <ChevronDown style={{ width: 14, height: 14, color: C.textMuted }} /> : <ChevronRight style={{ width: 14, height: 14, color: C.textMuted }} />}
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
                        <div style={{ padding: "8px 24px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                          {modLessons.sort((a, b) => a.lessonNumber - b.lessonNumber).map(lesson => {
                            const key = `M${mod.moduleNumber}:L${lesson.lessonNumber} ${lesson.title}`;
                            const st = getLessonStatus(selSubject, key);
                            const isSaving = saving === key;
                            const isCompleted = st === "completed";
                            const isOngoing   = st === "ongoing";
                            const rowBg = isCompleted ? C.emeraldLight : isOngoing ? C.amberLight : C.bg;
                            const rowBorder = isCompleted ? `${C.emerald}35` : isOngoing ? `${C.amber}35` : C.border;

                            return (
                              <div key={lesson.id}
                                onClick={() => !isSaving && cycleLesson(selSubject, mod, lesson)}
                                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                                  background: rowBg, border: `1px solid ${rowBorder}`, transition: "all 0.12s", opacity: isSaving ? 0.6 : 1 }}>
                                {/* Status circle */}
                                <div style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                                  background: isCompleted ? C.emerald : isOngoing ? C.amber : "#E2E8F0",
                                  transition: "all 0.12s" }}>
                                  {isSaving
                                    ? <Loader2 style={{ width: 12, height: 12, color: "#fff", animation: "spin 1s linear infinite" }} />
                                    : isCompleted ? <Check style={{ width: 13, height: 13, color: "#fff" }} strokeWidth={3} />
                                    : isOngoing   ? <RefreshCw style={{ width: 12, height: 12, color: "#fff" }} />
                                    : <span style={{ color: "#94A3B8", fontSize: 11 }}>{lesson.lessonNumber}</span>}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ fontSize: 12, fontWeight: st ? 700 : 400, color: C.textPrimary, lineHeight: 1.4 }}>
                                    <span style={{ color: C.textMuted, fontSize: 11 }}>L{lesson.lessonNumber} · </span>
                                    {lesson.title}
                                  </p>
                                </div>
                                {isOngoing   && <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: C.amber,   background: C.amberLight,   padding: "3px 8px", borderRadius: 20, flexShrink: 0 }}><RefreshCw style={{ width: 9, height: 9 }} /> Ongoing</span>}
                                {isCompleted && <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: C.emerald, background: C.emeraldLight, padding: "3px 8px", borderRadius: 20, flexShrink: 0 }}><CheckCircle2 style={{ width: 9, height: 9 }} /> Done</span>}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

//  Class Card 
const ClassCard = ({ cls, onMark, studentLinkMap, timezone, nextLesson }) => {
  const isDemo = !!cls.isDemo;
  const due = !isDemo && isClassDue(cls);
  const time = getDisplayTime(cls.classDate, cls.classTime, timezone);
  const timeParts = time.split(" ");
  const timeNum = timeParts[0];
  const timePeriod = timeParts[1] || "";

  const dateObj = cls.classDate ? new Date(cls.classDate) : null;
  const dayName = dateObj ? dateObj.toLocaleDateString("en-US", { weekday: "long" }) : "TBD";
  const dateStr = dateObj ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
  const isToday = dateObj ? dateObj.toDateString() === new Date().toDateString() : false;
  const isTomorrow = dateObj ? (() => { const t = new Date(); t.setDate(t.getDate()+1); return dateObj.toDateString() === t.toDateString(); })() : false;
  const dayLabel = isToday ? "Today" : isTomorrow ? "Tomorrow" : dayName;

  // Demo classes carry their own meetLink (no registered student to look up).
  const classLink = isDemo ? (cls.meetLink || "") : (studentLinkMap[cls.studentId] || "");

  // Colors
  const accentColor = isDemo ? C.violet : due ? C.red : C.indigo;
  const accentGrad  = isDemo ? C.gradViolet : due ? C.gradRed : C.gradIndigo;
  const accentLight = isDemo ? C.violetLight : due ? C.redLight : C.indigoLight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(15,23,42,0.12)" }}
      style={{
        background: isDemo ? C.violetLight + "55" : C.card,
        border: `1px solid ${isDemo ? C.violet + "50" : due ? C.red + "45" : C.border}`,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: C.shadowCard,
        position: "relative",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: accentGrad }} />

      {/* Badges */}
      <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 6, zIndex: 2 }}>
        {isDemo && (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            style={{ background: C.gradViolet, color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 4 }}>
            <Sparkles style={{ width: 10, height: 10 }} /> DEMO CLASS
          </motion.div>
        )}
        {due && !isDemo && (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            style={{ background: C.red, color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 4 }}>
            <Zap style={{ width: 10, height: 10 }} /> ATTENDANCE DUE
          </motion.div>
        )}
        {cls.isRescheduled && !due && !isDemo && (
          <div style={{ background: C.amberLight, color: C.amber, fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 20 }}>
            RESCHEDULED
          </div>
        )}
      </div>

      <div style={{ display: "flex", minHeight: 130 }}>
        {/* LEFT: Content */}
        <div style={{ flex: 1, padding: "20px 22px 20px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
          <div>
            {/* Subject */}
            <h3 style={{ fontSize: 20, fontWeight: 900, color: C.textPrimary, lineHeight: 1.1, marginBottom: 8, letterSpacing: "-0.02em" }}>
              {cls.subject}
            </h3>

            {/* Student name — prominent */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9, background: accentGrad,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 900, fontSize: 14, flexShrink: 0,
              }}>
                {cls.studentName?.charAt(0)}
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, color: C.textPrimary, lineHeight: 1 }}>{cls.studentName}</p>
                <p style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>
                  {isDemo ? `Demo Student${cls.studentClass ? ` · Grade ${cls.studentClass}` : ""}` : "Student"}
                </p>
              </div>
            </div>

            {/* Additional info — demo classes only */}
            {isDemo && cls.additionalInfo && (
              <div style={{ padding: "8px 12px", borderRadius: 10, background: "#fff", border: `1px solid ${C.violet}25`, marginBottom: 12 }}>
                <p style={{ fontSize: 11, color: C.textSecondary, lineHeight: 1.4 }}>{cls.additionalInfo}</p>
              </div>
            )}

            {/* Next lesson chip — only for coding students */}
            {nextLesson && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 12px", borderRadius: 12,
                background: nextLesson.status === "ongoing" ? C.amberLight : C.indigoLight,
                border: `1px solid ${nextLesson.status === "ongoing" ? C.amber + "40" : C.indigo + "30"}`,
                maxWidth: "100%",
              }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: nextLesson.status === "ongoing" ? C.amber : C.indigo, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MODULE_ICON style={{ width: 13, height: 13, color: "#fff" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 1 }}>
                    {nextLesson.status === "ongoing" ? <Clock style={{ width: 10, height: 10, color: C.amber }} /> : <PlayCircle style={{ width: 10, height: 10, color: C.indigo }} />}
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.05em",
                      color: nextLesson.status === "ongoing" ? C.amber : C.indigo }}>
                      {nextLesson.status === "ongoing" ? "CONTINUING" : "NEXT LESSON"}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 230 }}>
                    {nextLesson.label}
                  </p>
                  <p style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>{nextLesson.mod}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            {classLink ? (
              <a href={classLink} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 12, background: C.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 12, textDecoration: "none", boxShadow: "0 4px 12px rgba(16,185,129,0.25)" }}>
                <Play style={{ width: 13, height: 13 }} /> Join Class
              </a>
            ) : (
              <span style={{ padding: "9px 12px", borderRadius: 12, background: C.redLight, color: C.red, fontSize: 12, fontWeight: 600 }}>No Link</span>
            )}
            {!isDemo && (
              <button onClick={() => onMark(cls)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 12, border: `1px solid ${due ? C.red + "40" : C.border}`, background: due ? C.redLight : C.bg, color: due ? C.red : C.indigo, fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = due ? C.red : C.indigo; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = due ? C.redLight : C.bg; e.currentTarget.style.color = due ? C.red : C.indigo; }}>
                {due && <Zap style={{ width: 12, height: 12 }} />}
                {due ? "Mark Now" : "Mark Attendance"}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Big Time Block  */}
        <div style={{
          flexShrink: 0, width: 120,
          background: `linear-gradient(160deg, ${accentColor}12 0%, ${accentColor}04 100%)`,
          borderLeft: `1px solid ${accentColor}20`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "20px 10px", gap: 2,
        }}>
          <Clock style={{ width: 14, height: 14, color: accentColor, opacity: 0.7, marginBottom: 6 }} />
          <span style={{
            fontSize: 32, fontWeight: 900, color: accentColor,
            lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums",
          }}>
            {timeNum}
          </span>
          {timePeriod && (
            <span style={{ fontSize: 14, fontWeight: 800, color: accentColor, opacity: 0.8, letterSpacing: "0.06em", marginTop: 2 }}>
              {timePeriod}
            </span>
          )}
          <div style={{ marginTop: 10, textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: isToday ? accentColor : C.textPrimary, marginBottom: 2 }}>
              {dayLabel}
            </p>
            <p style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>{dateStr}</p>
          </div>
          {isToday && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              style={{ marginTop: 8, padding: "4px 8px", borderRadius: 20, background: accentColor, color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: "0.06em" }}>
              TODAY
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Tutor's read-only view of an assigned student's curriculum — shows the
// same modules/lessons as the student sees, but with the Teacher Resource
// Link instead of the Student Resource Link.
const tierColorTutor = {
  little_pearls: { bg: "#FFF7ED", border: "#FB923C", text: "#EA580C", light: "#FED7AA" },
  bright_pearls: { bg: "#F0FDF4", border: "#22C55E", text: "#16A34A", light: "#BBF7D0" },
  rising_pearls: { bg: "#EFF6FF", border: "#60A5FA", text: "#2563EB", light: "#BFDBFE" },
};

// Lesson banner thumbnail — uses a padding-top box (not just CSS aspect-ratio,
// which some webviews/older browsers ignore and collapse to 0 height) and
// falls back to the placeholder icon if the image URL 404s / fails to load.
const LessonBanner = ({ url, alt, iconColor, bg }) => {
  const [failed, setFailed] = useState(false);
  const showImage = !!url && !failed;
  return (
    <div style={{ width: "100%", position: "relative", overflow: "hidden", paddingTop: "56.25%", background: bg }}>
      <div style={{ position: "absolute", inset: 0 }}>
        {showImage ? (
          <img
            src={url}
            alt={alt}
            onError={() => setFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImageIcon style={{ width: 20, height: 20, color: iconColor, opacity: 0.35 }} />
          </div>
        )}
      </div>
    </div>
  );
};

function TutorStudentCurriculumModules({ course, category, isMobile }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  // All modules start closed — nothing pre-expanded.
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!course || !category) { setLoading(false); return; }
    setLoading(true);
    setExpanded({});
    const q = query(collection(db, "curriculum"), where("course", "==", course), where("category", "==", category));
    const unsub = onSnapshot(q, snap => {
      const mods = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => a.moduleNumber - b.moduleNumber);
      setModules(mods);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [course, category]);

  const col = tierColorTutor[category] || tierColorTutor.little_pearls;

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 30 }}><Loader2 style={{ width: 22, height: 22, color: C.emerald, animation: "spin 1s linear infinite" }} /></div>;
  }
  if (modules.length === 0) {
    return <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", padding: "20px 0" }}>No curriculum published yet for this course/tier.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {modules.map(mod => {
        const isOpen = !!expanded[mod.id];
        const lessons = (mod.lessons || []).slice().sort((a, b) => a.lessonNumber - b.lessonNumber);
        return (
          <div key={mod.id} style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            {/* Module header — closed by default, click to drop down lessons */}
            <div onClick={() => setExpanded(p => ({ ...p, [mod.id]: !p[mod.id] }))}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", cursor: "pointer", userSelect: "none" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: col.bg, border: `1px solid ${col.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MODULE_ICON style={{ width: 18, height: 18, color: col.text }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 800, fontSize: 14, color: C.textPrimary }}>Module {mod.moduleNumber}: {mod.moduleName}</p>
                <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{lessons.length} lesson{lessons.length !== 1 ? "s" : ""}</p>
              </div>
              {isOpen ? <ChevronDown style={{ width: 18, height: 18, color: C.textMuted }} /> : <ChevronRight style={{ width: 18, height: 18, color: C.textMuted }} />}
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                  {/* Each lesson: medium-size row — banner thumbnail on the left, lesson info on the right */}
                  <div style={{ borderTop: `2px solid ${C.border}`, padding: 14, display: "flex", flexDirection: "column", gap: 12, background: C.bg }}>
                    {lessons.length === 0 ? (
                      <p style={{ fontSize: 12, color: C.textMuted, textAlign: "center", padding: "10px 0" }}>No lessons yet</p>
                    ) : lessons.map(lesson => (
                      <div key={lesson.id} style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 10 : 16, borderRadius: 14, background: C.card, border: `2px solid ${C.border}`, padding: 12 }}>
                        {/* Medium-size banner thumbnail — full width on top for mobile, fixed width on the left for desktop */}
                        <div style={{ width: isMobile ? "100%" : 220, flexShrink: 0, borderRadius: 10, overflow: "hidden" }}>
                          <LessonBanner url={lesson.bannerImageUrl} alt={lesson.title} iconColor={col.text} bg={col.light} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, marginBottom: 4 }}>Lesson {lesson.lessonNumber}</p>
                          <p style={{ fontWeight: 800, fontSize: 16, color: C.textPrimary, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lesson.title}</p>
                          {lesson.teacherResourceLink ? (
                            <a href={lesson.teacherResourceLink} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: 13, color: C.emeraldDark, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                              <LinkIcon style={{ width: 13, height: 13 }} /> Teacher Resource
                              <ArrowRight style={{ width: 13, height: 13 }} />
                            </a>
                          ) : (
                            <p style={{ fontSize: 12, color: C.textMuted }}>No teacher resource shared yet</p>
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
      })}
    </div>
  );
}

// Read-only chapter list for Academic Tuition / Courses students (no banners —
// this course type has never used the banner-based module/lesson structure).
function TutorStudentChapterListReadOnly({ studentUid }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(doc(db, "studentChapters", studentUid), snap => {
      const data = snap.exists() ? snap.data() : { chapters: [] };
      setChapters((data.chapters || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0)));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [studentUid]);

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 30 }}><Loader2 style={{ width: 22, height: 22, color: C.emerald, animation: "spin 1s linear infinite" }} /></div>;
  }
  if (chapters.length === 0) {
    return <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", padding: "20px 0" }}>No chapters assigned yet for this student.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {chapters.map((chap, i) => (
        <div key={chap.id || i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, background: chap.completed ? C.emeraldLight : C.card, border: `1px solid ${chap.completed ? C.emerald + "35" : C.border}` }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: chap.completed ? C.emerald : "#E2E8F0" }}>
            {chap.completed ? <Check style={{ width: 13, height: 13, color: "#fff" }} strokeWidth={3} /> : <span style={{ color: "#94A3B8", fontSize: 11 }}>{i + 1}</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: chap.completed ? 700 : 500, color: C.textPrimary }}>{chap.title}</p>
            {chap.content && <p style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{chap.content}</p>}
          </div>
          {chap.completed && <span style={{ fontSize: 10, fontWeight: 700, color: C.emerald, flexShrink: 0 }}>Done</span>}
        </div>
      ))}
    </div>
  );
}

// Student detail page — shown after clicking a student's square box in the
// Students tab. Shows student details plus their full curriculum (modules
// closed by default, each lesson in its own large div with banner).
function TutorStudentDetailPage({ student, onBack, onOpenProgress, isMobile }) {
  const effCourse = getEffectiveCourse(student);
  const isTiered = effCourse === "coding" || effCourse === "math";
  const courseInfo = COURSES.find(c => c.value === effCourse);
  const tierInfo = CATEGORIES.find(c => c.value === student.category);
  const categoryLabel = !courseInfo
    ? "Uncategorized"
    : effCourse === "academic_tuition"
    ? courseInfo.label
    : (tierInfo ? `${courseInfo.label} \u2022 ${tierInfo.label}` : courseInfo.label);
  const catInfo = catLabel[student.category];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <button onClick={onBack}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: C.textSecondary, fontWeight: 700, fontSize: 13, marginBottom: 18, padding: "8px 4px" }}>
        <ChevronLeft style={{ width: 16, height: 16 }} /> Back to Students
      </button>

      {/* Student header card */}
      <div style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 20, padding: 22, boxShadow: C.shadowCard, marginBottom: 22, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
        <Avatar url={student.photoURL} name={student.name} size={64} fontSize={26} />
        <div style={{ flex: 1, minWidth: 180 }}>
          <p style={{ fontWeight: 800, fontSize: 18, color: C.textPrimary }}>{student.name}</p>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{student.customId} &middot; Class {student.classLevel || student.grade || "\u2014"}</p>
        </div>
        <span style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: catInfo?.bg || C.indigoLight, color: catInfo?.color || C.indigo, flexShrink: 0 }}>
          {categoryLabel}
        </span>
        <button onClick={onOpenProgress}
          style={{ padding: "10px 16px", borderRadius: 12, border: "none", background: C.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <BookOpen style={{ width: 15, height: 15 }} /> Curriculum &amp; Progress
        </button>
      </div>

      {/* Subjects */}
      {(student.assignments || []).length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Subjects</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(student.assignments || []).map((a, i) => (
              <span key={i} style={{ padding: "6px 14px", borderRadius: 20, background: C.bg, border: `2px solid ${C.border}`, fontSize: 12, fontWeight: 600, color: C.textSecondary }}>{a.subject}</span>
            ))}
          </div>
        </div>
      )}

      {/* Curriculum */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.textPrimary, display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <BookOpen style={{ width: 16, height: 16, color: C.emerald }} /> Curriculum
        </h3>
        {isTiered && student.category ? (
          <TutorStudentCurriculumModules course={effCourse} category={student.category} isMobile={isMobile} />
        ) : effCourse === "academic_tuition" ? (
          <TutorStudentChapterListReadOnly studentUid={student.uid} />
        ) : (
          <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", padding: "20px 0" }}>No curriculum available &mdash; this student has no category assigned yet.</p>
        )}
      </div>
    </motion.div>
  );
}

// Main Dashboard 
export default function TutorDashboard() {
  const { userId, logout, tutorMarkAttendance, tutorUpdateChapterProgress, tutorDeleteChapterProgress, tutorSaveLessonProgress } = useAuth();

  const [tutorData, setTutorData]           = useState(null);
  const [students, setStudents]             = useState([]);
  const [studentsWP, setStudentsWP]         = useState([]);
  const [activeClasses, setActiveClasses]   = useState([]);
  const [completedClasses, setCompleted]    = useState([]);
  const [missedClasses, setMissed]          = useState([]);
  const [studentLinkMap, setLinkMap]        = useState({});
  const [loadingStudents, setLS]            = useState(true);
  const [loadingClasses, setLC]             = useState(true);
  const [categoryModulesMap, setCatModules] = useState({});
  const [studentLessonProgress, setStudentLessonProgress] = useState({});
  const [activeTab, setActiveTab]           = useState("overview");
  const [showAttendance, setShowAttendance] = useState(false);
  const [selClass, setSelClass]             = useState(null);
  const [showProgress, setShowProgress]     = useState(false);
  const [selProgress, setSelProgress]       = useState(null);
  const [isMobile, setIsMobile]             = useState(false);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!userId) return;
    return onSnapshot(doc(db, "userSummaries", userId), snap => {
      if (snap.exists()) setTutorData({ uid: snap.id, ...snap.data() });
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    setLS(true);
    return onSnapshot(query(collection(db, "userSummaries"), where("role", "==", "student")), snap => {
      const mine = snap.docs.map(d => ({ uid: d.id, ...d.data() })).filter(s => (s.assignments || []).some(a => a.tutorId === userId));
      setStudents(mine);
      const map = {}; mine.forEach(s => { if (s.permanentClassLink) map[s.uid] = s.permanentClassLink; });
      setLinkMap(map); setLS(false);
    });
  }, [userId]);

  useEffect(() => {
  if (!students.length) { setStudentsWP([]); return; }
  const unsubs = {}; const prog = {};

  students.forEach(st => {
    prog[st.uid] = {};
    const assignments = st.assignments || [];

    if (assignments.length === 0) {
      setStudentsWP(prev => {
        const without = prev.filter(s => s.uid !== st.uid);
        return [...without, { ...st, progress: {} }];
      });
      return;
    }

    assignments.forEach(a => {
      unsubs[`${st.uid}_${a.subject}`] = onSnapshot(
        getProgressRef(st.uid, a.subject),
        snap => {
          prog[st.uid][a.subject] = snap.exists() ? snap.data() : { completedChapters: [] };
          setStudentsWP(students.map(s => ({ ...s, progress: { ...(prog[s.uid] || {}) } })));
        },
        err => {
          console.error("Progress read error:", err);
          setStudentsWP(students.map(s => ({ ...s, progress: { ...(prog[s.uid] || {}) } })));
        }
      );
    });
  });

  return () => Object.values(unsubs).forEach(u => u());
}, [students]);

  useEffect(() => {
    if (!userId) return;
    setLC(true);
    return onSnapshot(query(collection(db, "classes"), where("tutorId", "==", userId)), snap => {
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => new Date(a.classDate + " " + a.classTime) - new Date(b.classDate + " " + b.classTime));
      setActiveClasses(arr.filter(c => c.status === "scheduled" || c.status === "pending"));
      setCompleted(arr.filter(c => c.status === "completed"));
      setMissed(arr.filter(c => c.status === "missed"));
      setLC(false);
    });
  }, [userId]);

  // Load curriculum modules per course+tier (for next-lesson chips)
  useEffect(() => {
    if (!students.length) return;
    const tieredKeys = [...new Set(
      students
        .map(s => {
          const effCourse = getEffectiveCourse(s);
          if ((effCourse === "coding" || effCourse === "math") && s.category) {
            return `${effCourse}::${s.category}`;
          }
          return null;
        })
        .filter(Boolean)
    )];
    const unsubs = tieredKeys.map(key => {
      const [courseVal, cat] = key.split("::");
      const q = query(collection(db, "curriculum"), where("course", "==", courseVal), where("category", "==", cat));
      return onSnapshot(q, snap => {
        const mods = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => a.moduleNumber - b.moduleNumber);
        setCatModules(prev => ({ ...prev, [key]: mods }));
      }, () => {});
    });
    return () => unsubs.forEach(u => u());
  }, [students]);

  // Load per-student per-subject lesson progress
  useEffect(() => {
    if (!students.length) return;
    const unsubs = [];
    students.forEach(st => {
      if (getEffectiveCourse(st) === "academic_tuition") return;
      (st.assignments || []).forEach(a => {
        const unsub = onSnapshot(getProgressRef(st.uid, a.subject), snap => {
          if (snap.exists()) {
            const lessonList = snap.data().lessons || [];
            const map = {};
            lessonList.forEach(l => { map[l.key] = l.status; });
            setStudentLessonProgress(prev => ({
              ...prev,
              [st.uid]: { ...(prev[st.uid] || {}), [a.subject]: map }
            }));
          }
        }, () => {});
        unsubs.push(unsub);
      });
    });
    return () => unsubs.forEach(u => u());
  }, [students]);

  const dueCount = activeClasses.filter(isClassDue).length;
  const totalModules = studentsWP.reduce((s, st) => s + Object.values(st.progress || {}).reduce((s2, p) => s2 + (p.completedChapters?.length || 0), 0), 0);

  const tabs = [
    { id: "overview",      label: "Overview",         icon: Home },
    { id: "students",      label: "My Students",      icon: Users,      count: students.length },
    { id: "activeClasses", label: "Active Classes",   icon: Calendar,   count: activeClasses.length },
    { id: "history",       label: "Class History",    icon: BarChart2 },
    { id: "progress",      label: "Progress Tracker", icon: TrendingUp },
    { id: "notes",         label: "Notes",            icon: FileText },
  ];

  const handleTabChange = (tabId) => { setActiveTab(tabId); setSidebarOpen(false); setSelectedStudentId(null); };

  const SidebarContent = () => (
    <>
      <div style={{ padding: "20px 20px 16px", borderBottom: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <img src={PearlxLogo} alt="Pearlx" style={{ height: 40, width: "auto", objectFit: "contain" }} />
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)} style={{ background: C.bg, border: "none", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X style={{ width: 16, height: 16, color: C.textMuted }} />
          </button>
        )}
      </div>
      <div style={{ padding: "16px 14px", borderBottom: `2px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: C.gradEmerald, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 17, flexShrink: 0 }}>
            {tutorData?.name?.charAt(0) || "T"}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tutorData?.name || "Tutor"}</p>
            <p style={{ fontSize: 12, color: C.textMuted }}>Tutor</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ padding: "9px 6px", borderRadius: 10, background: C.emeraldLight, textAlign: "center" }}>
            <p style={{ fontSize: 17, fontWeight: 800, color: C.emerald }}>{students.length}</p>
            <p style={{ fontSize: 11, color: C.textMuted }}>Students</p>
          </div>
          <div style={{ padding: "9px 6px", borderRadius: 10, background: dueCount > 0 ? C.redLight : C.indigoLight, textAlign: "center" }}>
            <p style={{ fontSize: 17, fontWeight: 800, color: dueCount > 0 ? C.red : C.indigo }}>{dueCount}</p>
            <p style={{ fontSize: 11, color: C.textMuted }}>Due</p>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "10px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 6px 8px" }}>MAIN MENU</p>
        {tabs.map(tab => <SideNavItem key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => handleTabChange(tab.id)} />)}
      </nav>
      <div style={{ padding: "12px 10px", borderTop: `2px solid ${C.border}` }}>
        <motion.button onClick={logout} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 12, border: `1px solid ${C.red}20`, background: C.redLight, color: C.red, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <LogOut style={{ width: 16, height: 16 }} /> Logout
        </motion.button>
      </div>
    </>
  );

  return (
    <div className="px-dash" style={{ display: "flex", height: "100vh", overflow: "hidden", background: C.bg, fontFamily: "'Nunito', system-ui, sans-serif" }}>
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{ position: "fixed", height: "100dvh",overflowY: "auto", overscrollBehavior: "contain", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 999, backdropFilter: "blur(4px)" }} />
        )}
      </AnimatePresence>

      <motion.div initial={false} animate={isMobile ? { x: sidebarOpen ? 0 : -280 } : { x: 0 }} transition={{ type: "spring", damping: 28, stiffness: 300 }}
        style={{
          width: 256, minWidth: 256, height: "100dvh", overflowY: "auto", paddingBottom: 100,
          WebkitOverflowScrolling: "touch", overscrollBehavior: "contain",
          background: C.sidebar, borderRight: `2px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0,
          position: isMobile ? "fixed" : "relative", zIndex: isMobile ? 1000 : "auto", top: 0, left: 0
        }}>
        <SidebarContent />
      </motion.div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <div style={{ height: 62, background: "rgba(242,248,252,0.96)", borderBottom: `2px solid ${C.border}`, backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0, gap: 10, position: "relative", zIndex: 10, transform: "translateZ(0)", WebkitBackfaceVisibility: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)}
                style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <Menu style={{ width: 18, height: 18, color: C.textPrimary }} />
              </button>
            )}
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: C.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tabs.find(t => t.id === activeTab)?.label}</h1>
              <p style={{ fontSize: 12, color: C.textMuted }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {dueCount > 0 && (
              <motion.button initial={{ scale: 0.8 }} animate={{ scale: 1 }} onClick={() => handleTabChange("activeClasses")}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: isMobile ? "7px 10px" : "7px 14px", borderRadius: 20, background: C.redLight, border: `1px solid ${C.red}25`, color: C.red, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                <Bell style={{ width: 14, height: 14 }} />
                {!isMobile && `${dueCount} attendance${dueCount > 1 ? "s" : ""} due`}
                {isMobile && <span style={{ fontSize: 11, fontWeight: 800 }}>{dueCount}</span>}
              </motion.button>
            )}
            <div style={{ width: 36, height: 36, borderRadius: 11, background: C.gradEmerald, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>
              {tutorData?.name?.charAt(0) || "T"}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", padding: isMobile ? 16 : 24 }}>
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ borderRadius: 20, padding: isMobile ? "20px" : "24px 28px", marginBottom: 24, background: C.gradEmerald, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", right: -20, top: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: "#fff", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                      Hello, {tutorData?.name?.split(" ")[0] || "Tutor"}!
                      <GraduationCap style={{ width: isMobile ? 16 : 18, height: isMobile ? 16 : 18 }} />
                    </h2>
                    <p style={{ fontSize: isMobile ? 13 : 14, color: "rgba(255,255,255,0.85)" }}>
                      {activeClasses.length} active {activeClasses.length === 1 ? "class" : "classes"} · {students.length} {students.length === 1 ? "student" : "students"} assigned
                      {dueCount > 0 && (
                        <span style={{ color: "#FDE68A", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          {" · "}<AlertTriangle style={{ width: 12, height: 12 }} /> {dueCount} attendance{dueCount > 1 ? "s" : ""} pending!
                        </span>
                      )}
                    </p>
                    {dueCount > 0 && (
                      <button onClick={() => handleTabChange("activeClasses")}
                        style={{ marginTop: 12, padding: "9px 18px", borderRadius: 12, border: "none", background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                        Mark Attendance Now →
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 10 : 14, marginBottom: 14 }}>
                  <StatCard icon={Users} label="My Students" value={students.length} light={C.emeraldLight} iconColor={C.emerald} onClick={() => handleTabChange("students")} />
                  <StatCard icon={Calendar} label="Active Classes" value={activeClasses.length} light={C.indigoLight} iconColor={C.indigo} onClick={() => handleTabChange("activeClasses")} />
                  <StatCard icon={CheckCircle} label="Completed" value={completedClasses.length} light={C.emeraldLight} iconColor={C.emeraldDark} />
                  <StatCard icon={AlertCircle} label="Attendance Due" value={dueCount} light={dueCount > 0 ? C.redLight : C.bg} iconColor={dueCount > 0 ? C.red : C.textMuted} badge={dueCount > 0 ? "!" : null} onClick={dueCount > 0 ? () => handleTabChange("activeClasses") : null} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
                  <div style={{ background: C.card, borderRadius: 18, padding: 20, border: `2px solid ${C.border}`, boxShadow: C.shadowCard }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, display: "flex", alignItems: "center", gap: 6 }}><Calendar style={{ width: 15, height: 15, color: C.indigo }} />Upcoming Classes</h3>
                      <button onClick={() => handleTabChange("activeClasses")} style={{ fontSize: 12, color: C.indigo, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View all →</button>
                    </div>
                    {loadingClasses ? <div style={{ display: "flex", justifyContent: "center", padding: 24 }}><Loader2 style={{ width: 22, height: 22, color: C.emerald, animation: "spin 1s linear infinite" }} /></div>
                      : activeClasses.length === 0 ? <Empty icon={Calendar} msg="No active classes" /> : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {activeClasses.slice(0, 4).map(cls => {
                            const time = getDisplayTime(cls.classDate, cls.classTime, tutorData?.timezone);
                            const timeParts = time.split(" ");
                            const due = !cls.isDemo && isClassDue(cls);
                            const isToday = cls.classDate ? new Date(cls.classDate).toDateString() === new Date().toDateString() : false;
                            const rowAccent = cls.isDemo ? C.violet : due ? C.red : C.indigo;
                            const rowGrad = cls.isDemo ? C.gradViolet : due ? C.gradRed : C.gradIndigo;
                            const rowBg = cls.isDemo ? C.violetLight : due ? C.redLight : C.bg;
                            return (
                              <div key={cls.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, background: rowBg, border: `1px solid ${cls.isDemo ? C.violet + "30" : due ? C.red + "30" : C.border}`, overflow: "hidden", position: "relative" }}>
                                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: rowGrad, borderRadius: "0 2px 2px 0" }} />
                                <div style={{ flex: 1, minWidth: 0, paddingLeft: 4 }}>
                                  <p style={{ fontWeight: 800, fontSize: 13, color: C.textPrimary, marginBottom: 2 }}>{cls.subject}</p>
                                  <p style={{ fontSize: 12, fontWeight: 600, color: rowAccent, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cls.studentName}</p>
                                  {isToday && <span style={{ fontSize: 9, fontWeight: 800, color: rowAccent, letterSpacing: "0.05em" }}>TODAY</span>}
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                  <p style={{ fontSize: 18, fontWeight: 900, color: rowAccent, lineHeight: 1, letterSpacing: "-0.02em" }}>{timeParts[0]}</p>
                                  <p style={{ fontSize: 11, fontWeight: 700, color: rowAccent, opacity: 0.8 }}>{timeParts[1] || ""}</p>
                                </div>
                                {cls.isDemo && <span style={{ background: C.gradViolet, color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 7px", borderRadius: 20, flexShrink: 0, letterSpacing: "0.04em" }}>DEMO</span>}
                                {due && !cls.isDemo && <span style={{ background: C.red, color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 7px", borderRadius: 20, flexShrink: 0, letterSpacing: "0.04em" }}>DUE</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </div>
                  <div style={{ background: C.card, borderRadius: 18, padding: 20, border: `2px solid ${C.border}`, boxShadow: C.shadowCard }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, display: "flex", alignItems: "center", gap: 6 }}><Users style={{ width: 15, height: 15, color: C.emerald }} />My Students</h3>
                      <button onClick={() => handleTabChange("students")} style={{ fontSize: 12, color: C.emerald, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View all →</button>
                    </div>
                    {loadingStudents ? <div style={{ display: "flex", justifyContent: "center", padding: 24 }}><Loader2 style={{ width: 22, height: 22, color: C.emerald, animation: "spin 1s linear infinite" }} /></div>
                      : students.length === 0 ? <Empty icon={Users} msg="No students assigned" /> : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {studentsWP.slice(0, 4).map(s => {
                            const lp = s.progress || {};
                            const allLessons = Object.values(lp).flatMap(p => p.lessonProgress || []);
                            const totalCompleted = allLessons.filter(l => l.lessonStatus === "completed").length;
                            const totalOngoing   = allLessons.filter(l => l.lessonStatus === "ongoing").length;
                            const catInfo = catLabel[s.category];
                            return (
                              <div key={s.uid} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: C.bg, cursor: "pointer" }}
                                onClick={() => { setSelProgress({ student: s }); setShowProgress(true); }}>
                                <Avatar url={s.photoURL} name={s.name} size={100} fontSize={50} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ fontWeight: 700, fontSize: 13, color: C.textPrimary }}>{s.name}</p>
                                  <p style={{ fontSize: 11, color: catInfo?.color || C.textMuted }}>{catInfo ? catInfo.label : `Grade ${s.classLevel}`}</p>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                  {totalCompleted > 0 && <span style={{ background: C.emeraldLight, color: C.emerald, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, display: "block" }}>{totalCompleted} done</span>}
                                  {totalOngoing > 0 && <span style={{ background: C.amberLight, color: C.amber, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, display: "block", marginTop: 2 }}>{totalOngoing} ongoing</span>}
                                  {totalCompleted === 0 && totalOngoing === 0 && <span style={{ fontSize: 11, color: C.textMuted }}>No progress</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "notes" && <TutorNotesSection />}

            {activeTab === "students" && (
              <motion.div key="st" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {selectedStudentId ? (
                  (() => {
                    const student = studentsWP.find(s => s.uid === selectedStudentId) || students.find(s => s.uid === selectedStudentId);
                    return !student ? (
                      <Empty icon={Users} msg="Student not found" />
                    ) : (
                      <TutorStudentDetailPage
                        student={student}
                        onBack={() => setSelectedStudentId(null)}
                        onOpenProgress={() => { setSelProgress({ student }); setShowProgress(true); }}
                        isMobile={isMobile}
                      />
                    );
                  })()
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 18 }}>
                    {loadingStudents
                      ? <div style={{ gridColumn: "1/-1", display: "flex", justifyContent: "center" }}><Loader2 style={{ width: 28, height: 28, color: C.emerald, animation: "spin 1s linear infinite" }} /></div>
                      : students.length === 0 ? <div style={{ gridColumn: "1/-1" }}><Empty icon={Users} msg="No students assigned yet" /></div>
                      : students.map(s => {
                        const effCourse = getEffectiveCourse(s);
                        const courseInfo = COURSES.find(c => c.value === effCourse);
                        const tierInfo = CATEGORIES.find(c => c.value === s.category);
                        const categoryLabel = !courseInfo
                          ? "Uncategorized"
                          : effCourse === "academic_tuition"
                          ? courseInfo.label
                          : (tierInfo ? `${courseInfo.label} \u2022 ${tierInfo.label}` : courseInfo.label);
                        return (
                          <motion.button key={s.uid} onClick={() => setSelectedStudentId(s.uid)}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -4, boxShadow: C.shadowHover }} whileTap={{ scale: 0.98 }}
                            style={{ aspectRatio: "2 / 1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: C.card, border: `2px solid ${C.border}`, borderRadius: 20, padding: 20, cursor: "pointer", textAlign: "center", boxShadow: C.shadowCard, fontFamily: "inherit" }}>
                            <Avatar url={s.photoURL} name={s.name} size={150} fontSize={22} />
                            <p style={{ fontWeight: 800, fontSize: 20, color: C.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>{s.name}</p>
                            <p style={{ fontSize: 15, color: C.textMuted }}>Class {s.classLevel || s.grade || "\u2014"}</p>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: C.indigoLight, color: C.indigo, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{categoryLabel}</span>
                          </motion.button>
                        );
                      })
                    }
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "activeClasses" && (
              <motion.div key="ac" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {loadingClasses
                  ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Loader2 style={{ width: 28, height: 28, color: C.emerald, animation: "spin 1s linear infinite" }} /></div>
                  : activeClasses.length === 0 ? <Empty icon={Calendar} msg="No active classes" />
                  : activeClasses.map(cls => {
                    // Compute next lesson for this specific student + subject
                    const student = studentsWP.find(s => s.uid === cls.studentId);
                    const studentEffCourse = getEffectiveCourse(student);
                    const isCoding = studentEffCourse === "coding" || studentEffCourse === "math";
                    let nextLesson = null;
                    if (isCoding && student) {
                      const modules = categoryModulesMap[`${studentEffCourse}::${student.category}`] || [];
                      const subjectProgress = studentLessonProgress[student.uid]?.[cls.subject] || {};
                      nextLesson = getNextLessonLabel(modules, subjectProgress);
                    }
                    return (
                      <ClassCard key={cls.id} cls={cls} timezone={tutorData?.timezone} studentLinkMap={studentLinkMap}
                        onMark={c => { setSelClass(c); setShowAttendance(true); }}
                        nextLesson={nextLesson}
                      />
                    );
                  })
                }
              </motion.div>
            )}

            {activeTab === "progress" && (
              <motion.div key="pr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
                {studentsWP.length === 0 ? <div style={{ gridColumn: "1/-1" }}><Empty icon={TrendingUp} msg="No progress data" /></div>
                  : studentsWP.map(s => {
                    const lp = s.progress || {};
                    // Collect all lesson statuses across all subjects
                    const allLessons = Object.values(lp).flatMap(p => p.lessonProgress || []);
                    const totalCompleted = allLessons.filter(l => l.lessonStatus === "completed").length;
                    const totalOngoing   = allLessons.filter(l => l.lessonStatus === "ongoing").length;
                    const catInfo = catLabel[s.category];
                    return (
                      <motion.div key={s.uid} whileHover={{ y: -3, boxShadow: C.shadowHover }}
                        style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 16, padding: 20, boxShadow: C.shadowCard }}>
                        {/* Student header */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                          <Avatar url={s.photoURL} name={s.name} size={38} fontSize={16} />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}>{s.name}</p>
                            <p style={{ fontSize: 11, color: C.textMuted }}>Grade {s.classLevel || s.grade}</p>
                          </div>
                        </div>
                        {catInfo && (
                          <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: catInfo.bg, color: catInfo.color, marginBottom: 12 }}>
                            {catInfo.label}
                          </span>
                        )}
                        {/* Summary stats */}
                        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                          <div style={{ flex: 1, padding: "8px 10px", borderRadius: 10, background: C.emeraldLight, textAlign: "center" }}>
                            <p style={{ fontSize: 18, fontWeight: 800, color: C.emerald }}>{totalCompleted}</p>
                            <p style={{ fontSize: 10, color: C.textMuted }}>Completed</p>
                          </div>
                          <div style={{ flex: 1, padding: "8px 10px", borderRadius: 10, background: C.amberLight, textAlign: "center" }}>
                            <p style={{ fontSize: 18, fontWeight: 800, color: C.amber }}>{totalOngoing}</p>
                            <p style={{ fontSize: 10, color: C.textMuted }}>Ongoing</p>
                          </div>
                        </div>
                        {/* Per-subject recent lessons */}
                        {(s.assignments || []).map((a, i) => {
                          const subjectProgress = lp[a.subject]?.lessonProgress || [];
                          const subjectCompleted = subjectProgress.filter(l => l.lessonStatus === "completed").length;
                          const subjectOngoing   = subjectProgress.filter(l => l.lessonStatus === "ongoing").length;
                          const recentOngoing = subjectProgress.filter(l => l.lessonStatus === "ongoing").slice(-2);
                          const recentCompleted = subjectProgress.filter(l => l.lessonStatus === "completed").slice(-3);
                          return (
                            <div key={i} style={{ marginBottom: i < s.assignments.length - 1 ? 14 : 0 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: C.textSecondary }}>{a.subject}</span>
                                <button onClick={() => { setSelProgress({ student: s, assignment: a }); setShowProgress(true); }}
                                  style={{ padding: "3px 10px", borderRadius: 20, background: C.indigoLight, color: C.indigo, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                                  View All
                                </button>
                              </div>
                              {/* Ongoing lessons */}
                              {recentOngoing.map((l, li) => (
                                <div key={li} style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 8px", borderRadius: 8, background: C.amberLight, marginBottom: 4 }}>
                                  <RefreshCw style={{ width: 11, height: 11, color: "#92400E", flexShrink: 0 }} />
                                  <span style={{ fontSize: 11, color: "#92400E", fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>L{l.lessonNumber} {l.title}</span>
                                </div>
                              ))}
                              {/* Recently completed */}
                              {recentCompleted.map((l, li) => (
                                <div key={li} style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 8px", borderRadius: 8, background: C.emeraldLight, marginBottom: 4 }}>
                                  <CheckCircle2 style={{ width: 11, height: 11, color: C.emeraldDark, flexShrink: 0 }} />
                                  <span style={{ fontSize: 11, color: C.emeraldDark, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>L{l.lessonNumber} {l.title}</span>
                                </div>
                              ))}
                              {subjectCompleted === 0 && subjectOngoing === 0 && (
                                <p style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic" }}>No lessons tracked yet</p>
                              )}
                            </div>
                          );
                        })}
                      </motion.div>
                    );
                  })}
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div key="hi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 20 : 24 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: C.textPrimary, display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <CheckCircle style={{ width: 16, height: 16, color: C.emerald }} />Completed ({completedClasses.length})
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {completedClasses.length === 0 ? <Empty icon={CheckCircle} msg="No completed classes" /> :
                      completedClasses.map(cls => (
                        <div key={cls.id} style={{ background: C.card, border: `1px solid ${C.emerald}25`, borderRadius: 14, padding: "14px 16px", boxShadow: C.shadowCard }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <p style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}>{cls.subject}</p>
                            <span style={{ background: C.emeraldLight, color: C.emerald, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>Done</span>
                          </div>
                          <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 2 }}>{cls.studentName}</p>
                          <p style={{ fontSize: 12, color: C.textMuted, marginBottom: cls.summary ? 8 : 0 }}>{cls.classDate}</p>
                          {cls.summary && (
                            <p style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, padding: "8px 12px", borderRadius: 10, background: C.emeraldLight, color: C.emerald }}>
                              <ClipboardCheck style={{ width: 13, height: 13, flexShrink: 0, marginTop: 1 }} /> <span>{cls.summary}</span>
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: C.textPrimary, display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <XCircle style={{ width: 16, height: 16, color: C.red }} />Missed ({missedClasses.length})
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {missedClasses.length === 0 ? <Empty icon={XCircle} msg="No missed classes" color={C.red} /> :
                      missedClasses.map(cls => (
                        <div key={cls.id} style={{ background: C.card, border: `1px solid ${C.red}25`, borderRadius: 14, padding: "14px 16px", boxShadow: C.shadowCard }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <p style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}>{cls.subject}</p>
                            <span style={{ background: C.redLight, color: C.red, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>Missed</span>
                          </div>
                          <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 2 }}>{cls.studentName}</p>
                          <p style={{ fontSize: 12, color: C.textMuted }}>{cls.classDate}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showAttendance && selClass && (
          <AttendanceModal classItem={selClass}
            onClose={() => { setShowAttendance(false); setSelClass(null); }}
            markAttendance={tutorMarkAttendance} />
        )}
        {showProgress && selProgress && (
          <ProgressUpdateModal student={selProgress.student}
            onClose={() => { setShowProgress(false); setSelProgress(null); }} />
        )}
      </AnimatePresence>

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