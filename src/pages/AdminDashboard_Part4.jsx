import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, Search, Filter, CheckCircle, XCircle,
  AlertCircle, Trash2, User, BookOpen, Loader2, TrendingUp,
  ArrowLeft, ChevronRight, GraduationCap,
} from "lucide-react";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "../firebase";
import { convertTo12Hour } from "../utils/timeUtils";

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
  gradRed: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
  gradIndigo: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
  gradAmber: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
  gradViolet: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
  shadowCard: "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
  shadowHover: "0 8px 24px rgba(15,23,42,0.1)",
};

const statusCfg = {
  completed: { color: C.emerald, bg: C.emeraldLight, label: "Completed", icon: CheckCircle, border: `${C.emerald}30` },
  missed:    { color: C.red,     bg: C.redLight,     label: "Missed",    icon: XCircle,    border: `${C.red}30` },
  scheduled: { color: C.indigo,  bg: C.indigoLight,  label: "Scheduled", icon: Calendar,   border: `${C.indigo}30` },
  pending:   { color: C.indigo,  bg: C.indigoLight,  label: "Scheduled", icon: Calendar,   border: `${C.indigo}30` },
};

// Stat Card 
const MiniStatCard = ({ icon: Icon, label, value, grad, light, iconColor }) => (
  <motion.div whileHover={{ y: -2 }}
    style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", boxShadow: C.shadowCard }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: light, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
      <Icon style={{ width: 18, height: 18, color: iconColor }} />
    </div>
    <p style={{ fontSize: 24, fontWeight: 800, color: C.textPrimary, lineHeight: 1 }}>{value}</p>
    <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{label}</p>
  </motion.div>
);

// Class Card 
const ClassCard = ({ cls, onDelete, isDeleting }) => {
  const cfg = statusCfg[cls.status] || statusCfg.scheduled;
  const Icon = cfg.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2, boxShadow: C.shadowHover }}
      style={{ background: C.card, border: `1px solid ${cfg.border}`, borderRadius: 16, padding: 18, boxShadow: C.shadowCard, position: "relative" }}>
      {/* Left accent */}
      <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 3, borderRadius: "0 3px 3px 0", background: cfg.color }} />

      <div style={{ paddingLeft: 8 }}>
        {cls.isRescheduled && (
          <div style={{ marginBottom: 8 }}>
            <span style={{ padding: "3px 10px", borderRadius: 20, background: C.amberLight, color: C.amber, fontSize: 11, fontWeight: 700 }}>RESCHEDULED</span>
            {cls.originalClassDate && <p style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Original: {cls.originalClassDate}</p>}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>{cls.subject}</h3>
          <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>
            <Icon style={{ width: 11, height: 11 }} />{cfg.label}
          </span>
        </div>

        <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <BookOpen style={{ width: 13, height: 13 }} />
          Tutor: <span style={{ color: C.violet, fontWeight: 600 }}>{cls.tutorName}</span>
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: C.textMuted }}>
            <Calendar style={{ width: 13, height: 13 }} />{cls.classDate}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: C.textMuted }}>
            <Clock style={{ width: 13, height: 13 }} />{convertTo12Hour(cls.classTime)}
          </span>
        </div>

        {cls.summary && (
          <div style={{ padding: "8px 12px", borderRadius: 10, fontSize: 12, marginBottom: 10,
            background: cls.status === "completed" ? C.emeraldLight : C.redLight,
            color: cls.status === "completed" ? C.emerald : C.red }}>
            <p style={{ fontWeight: 700, marginBottom: 2 }}>{cls.status === "completed" ? "Topics Covered:" : "Reason:"}</p>
            <p>{cls.summary}</p>
          </div>
        )}

        <motion.button onClick={() => onDelete(cls)} disabled={isDeleting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 10, background: C.redLight, border: `1px solid ${C.red}25`, color: C.red, fontWeight: 600, fontSize: 12, cursor: "pointer", opacity: isDeleting ? 0.5 : 1 }}>
          {isDeleting ? <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> : <><Trash2 style={{ width: 13, height: 13 }} />Delete Class</>}
        </motion.button>
      </div>
    </motion.div>
  );
};

// Student Card 
const StudentCard = ({ student, classCount, onSelect }) => {
  const stats = classCount[student.uid] || { total: 0, scheduled: 0, completed: 0, missed: 0 };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: C.shadowHover }}
      onClick={() => onSelect(student)}
      style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, boxShadow: C.shadowCard, cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: C.gradPrimary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 17, flexShrink: 0 }}>
            {student.name?.charAt(0)}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}>{student.name}</p>
            <p style={{ fontSize: 12, color: C.textMuted }}>{student.customId} · Grade {student.classLevel}</p>
          </div>
        </div>
        <ChevronRight style={{ width: 18, height: 18, color: C.textMuted }} />
      </div>

      {/* Subjects */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
        {(student.assignments || []).map((a, i) => (
          <span key={i} style={{ padding: "2px 8px", borderRadius: 20, background: C.cyanLight, color: C.cyan, fontSize: 11, fontWeight: 600 }}>{a.subject}</span>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
        {[
          { label: "Total",  value: stats.total,     color: C.textPrimary, bg: C.bg },
          { label: "Due",    value: stats.scheduled, color: C.indigo,      bg: C.indigoLight },
          { label: "Done",   value: stats.completed, color: C.emerald,     bg: C.emeraldLight },
          { label: "Missed", value: stats.missed,    color: C.red,         bg: C.redLight },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center", padding: "8px 4px", borderRadius: 10, background: s.bg }}>
            <p style={{ fontSize: 17, fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 10, color: C.textMuted }}>{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Student Detail View 
const StudentDetailView = ({ student, classes, onBack, onDeleteClass, isDeletingId }) => {
  const [filterStatus, setFilterStatus] = useState("all");

  const studentClasses = classes.filter(c => c.studentId === student.uid);
  const filtered = studentClasses.filter(c => filterStatus === "all" || c.status === filterStatus);

  const stats = {
    total:      studentClasses.length,
    scheduled:  studentClasses.filter(c => c.status === "scheduled" || c.status === "pending").length,
    completed:  studentClasses.filter(c => c.status === "completed").length,
    missed:     studentClasses.filter(c => c.status === "missed").length,
    rescheduled:studentClasses.filter(c => c.isRescheduled).length,
  };

  const attendancePct = (stats.completed + stats.missed) > 0
    ? Math.round((stats.completed / (stats.completed + stats.missed)) * 100) : 100;

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
      {/* Back + title */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <motion.button onClick={onBack} whileHover={{ scale: 1.05 }}
          style={{ width: 38, height: 38, borderRadius: 11, border: `1px solid ${C.border}`, background: C.card, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft style={{ width: 16, height: 16, color: C.textMuted }} />
        </motion.button>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.textPrimary }}>{student.name}'s Classes</h2>
          <p style={{ fontSize: 12, color: C.textMuted }}>{student.customId} · Grade {student.classLevel}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 20 }}>
        <MiniStatCard icon={Calendar}    label="Total Classes" value={stats.total}       grad={C.gradPrimary} light={C.cyanLight}    iconColor={C.cyan} />
        <MiniStatCard icon={Clock}       label="Scheduled"     value={stats.scheduled}  grad={C.gradIndigo}  light={C.indigoLight}  iconColor={C.indigo} />
        <MiniStatCard icon={CheckCircle} label="Completed"     value={stats.completed}  grad={C.gradEmerald} light={C.emeraldLight} iconColor={C.emerald} />
        <MiniStatCard icon={XCircle}     label="Missed"        value={stats.missed}     grad={C.gradRed}     light={C.redLight}     iconColor={C.red} />
        <MiniStatCard icon={TrendingUp}  label="Rescheduled"   value={stats.rescheduled} grad={C.gradViolet} light={C.violetLight}  iconColor={C.violet} />
      </div>

      {/* Attendance bar */}
      <div style={{ background: C.card, borderRadius: 16, padding: "16px 20px", border: `1px solid ${C.border}`, boxShadow: C.shadowCard, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.textSecondary }}>Attendance Rate</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: attendancePct >= 75 ? C.emerald : C.red }}>{attendancePct}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 8, background: C.bg, overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${attendancePct}%` }} transition={{ duration: 1 }}
            style={{ height: "100%", borderRadius: 8, background: attendancePct >= 75 ? C.gradEmerald : C.gradRed }} />
        </div>
      </div>

      {/* Filter */}
      <div style={{ background: C.card, borderRadius: 16, padding: "14px 16px", border: `1px solid ${C.border}`, boxShadow: C.shadowCard, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <Filter style={{ width: 15, height: 15, color: C.textMuted, flexShrink: 0 }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, fontSize: 13, color: C.textPrimary, outline: "none", fontFamily: "inherit" }}>
          <option value="all">All Status ({stats.total})</option>
          <option value="scheduled">Scheduled ({stats.scheduled})</option>
          <option value="completed">Completed ({stats.completed})</option>
          <option value="missed">Missed ({stats.missed})</option>
        </select>
        <span style={{ fontSize: 12, color: C.textMuted, flexShrink: 0 }}>{filtered.length} classes</span>
      </div>

      {/* Classes grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", borderRadius: 16, background: C.card, border: `1px solid ${C.border}` }}>
          <Calendar style={{ width: 40, height: 40, margin: "0 auto 12px", color: C.textMuted, opacity: 0.4 }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: C.textMuted }}>No classes found</p>
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{filterStatus !== "all" ? "Try a different filter" : "No classes scheduled yet"}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {filtered.map(cls => (
            <ClassCard key={cls.id} cls={cls} onDelete={onDeleteClass} isDeleting={isDeletingId === cls.id} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// MAIN CLASSES OVERVIEW
export function ClassesOverview({ setActiveView, adminDeleteClass }) {
  const [allClasses, setAllClasses]           = useState([]);
  const [students, setStudents]               = useState([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [error, setError]                     = useState(null);
  const [search, setSearch]                   = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDeletingId, setIsDeletingId]       = useState(null);

  useEffect(() => {
    setIsLoadingClasses(true);
    return onSnapshot(query(collection(db, "classes"), orderBy("classDate", "desc")), snap => {
      setAllClasses(snap.docs.map(d => ({ id: d.id, status: d.data().status || "scheduled", ...d.data() })));
      setIsLoadingClasses(false);
    }, err => { setError("Failed to load classes"); setIsLoadingClasses(false); });
  }, []);

  useEffect(() => {
    setIsLoadingStudents(true);
    return onSnapshot(query(collection(db, "userSummaries"), where("role", "==", "student")), snap => {
      const list = snap.docs.map(d => ({ uid: d.id, ...d.data() })).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setStudents(list); setIsLoadingStudents(false);
    }, err => { setError("Failed to load students"); setIsLoadingStudents(false); });
  }, []);

  const filteredStudents = students.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (s.name || "").toLowerCase().includes(q) || (s.customId || "").toLowerCase().includes(q);
  });

  const classCountPerStudent = {};
  students.forEach(s => {
    const sc = allClasses.filter(c => c.studentId === s.uid);
    classCountPerStudent[s.uid] = {
      total: sc.length,
      scheduled: sc.filter(c => c.status === "scheduled" || c.status === "pending").length,
      completed: sc.filter(c => c.status === "completed").length,
      missed: sc.filter(c => c.status === "missed").length,
    };
  });

  const handleDelete = async (cls) => {
    if (!window.confirm(`Delete this class?\n\nSubject: ${cls.subject}\nDate: ${cls.classDate}\n\nThis cannot be undone.`)) return;
    setIsDeletingId(cls.id);
    const result = await adminDeleteClass(cls.id);
    setIsDeletingId(null);
    if (!result.success) alert(`Failed to delete: ${result.error}`);
  };

  const isLoading = isLoadingClasses || isLoadingStudents;

  // Global stats
  const totalScheduled  = allClasses.filter(c => c.status === "scheduled" || c.status === "pending").length;
  const totalCompleted  = allClasses.filter(c => c.status === "completed").length;
  const totalMissed     = allClasses.filter(c => c.status === "missed").length;

  return (
    <AnimatePresence mode="wait">
      {selectedStudent ? (
        <StudentDetailView key="detail" student={selectedStudent} classes={allClasses}
          onBack={() => setSelectedStudent(null)} onDeleteClass={handleDelete} isDeletingId={isDeletingId} />
      ) : (
        <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {/* Summary stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
            <MiniStatCard icon={Calendar}    label="Total Classes"    value={allClasses.length}  light={C.cyanLight}    iconColor={C.cyan} />
            <MiniStatCard icon={Clock}       label="Scheduled"        value={totalScheduled}     light={C.indigoLight}  iconColor={C.indigo} />
            <MiniStatCard icon={CheckCircle} label="Completed"        value={totalCompleted}     light={C.emeraldLight} iconColor={C.emerald} />
            <MiniStatCard icon={XCircle}     label="Missed"           value={totalMissed}        light={C.redLight}     iconColor={C.red} />
          </div>

          {/* Search */}
          <div style={{ background: C.card, borderRadius: 16, padding: "14px 16px", border: `1px solid ${C.border}`, boxShadow: C.shadowCard, marginBottom: 16 }}>
            <div style={{ position: "relative", marginBottom: 8 }}>
              <Search style={{ width: 15, height: 15, color: C.textMuted, position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students by name or ID..."
                style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, fontSize: 13, color: C.textPrimary, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
            <p style={{ fontSize: 12, color: C.textMuted }}>Showing {filteredStudents.length} of {students.length} students · click to view class history</p>
          </div>

          {/* Students grid */}
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
              <Loader2 style={{ width: 28, height: 28, color: C.emerald, animation: "spin 1s linear infinite" }} />
            </div>
          ) : error ? (
            <div style={{ padding: "16px 20px", borderRadius: 14, background: C.redLight, border: `1px solid ${C.red}25`, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle style={{ width: 16, height: 16, color: C.red }} />
              <p style={{ fontSize: 13, color: C.red }}>{error}</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", borderRadius: 16, background: C.card, border: `1px solid ${C.border}` }}>
              <GraduationCap style={{ width: 40, height: 40, margin: "0 auto 12px", color: C.textMuted, opacity: 0.4 }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: C.textMuted }}>{search ? "No students found" : "No students registered yet"}</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
              {filteredStudents.map(student => (
                <StudentCard key={student.uid} student={student} classCount={classCountPerStudent} onSelect={setSelectedStudent} />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}