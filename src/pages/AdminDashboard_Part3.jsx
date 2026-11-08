import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, X, Search, ChevronRight, Loader2, CheckCircle, AlertCircle, ArrowLeft, Sparkles, Link as LinkIcon, GraduationCap } from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const C = {
  bg: "#F2F8FC", card: "#FFFFFF", border: "#E5E9F2",
  textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
  emerald: "#10B981", emeraldLight: "#ECFDF5",
  cyan: "#0EA5E9", cyanLight: "#E0F2FE",
  indigo: "#6366F1", indigoLight: "#EEF2FF",
  red: "#EF4444", redLight: "#FEF2F2",
  amber: "#F59E0B", amberLight: "#FFFBEB",
  violet: "#8B5CF6", violetLight: "#F5F3FF",
  gradPrimary: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
  gradViolet: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
  shadowCard: "0 4px 0 rgba(15,23,42,0.05), 0 8px 22px rgba(15,23,42,0.04)",
  shadowHover: "0 7px 0 rgba(14,165,233,0.16), 0 14px 28px rgba(15,23,42,0.08)",
};

const fieldStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 12, border: `2px solid ${C.border}`,
  background: C.bg, fontSize: 13, color: C.textPrimary, outline: "none",
  fontFamily: "inherit", boxSizing: "border-box",
};

const LabeledField = ({ label, required, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 700, color: C.textSecondary }}>
      {label}{required && <span style={{ color: C.red }}> *</span>}
    </label>
    {children}
  </div>
);
// STUDENT SELECTION VIEW
export function StudentSelectionView({ students, onSelectStudent, setActiveView, onScheduleDemo }) {
  const [search, setSearch] = useState("");

  const filtered = students.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (s.name || "").toLowerCase().includes(q) || (s.customId || "").toLowerCase().includes(q);
  });

  return (
    <div style={{ background: C.card, borderRadius: 20, border: `2px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadowCard }}>
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: C.textPrimary }}>Select Student</h2>
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Choose a student to schedule a class session</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {onScheduleDemo && (
            <motion.button onClick={onScheduleDemo} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10, border: "none", background: C.gradViolet, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              <Sparkles style={{ width: 14, height: 14 }} />Schedule Demo Class
            </motion.button>
          )}
          <motion.button onClick={() => setActiveView("list")} whileHover={{ scale: 1.05 }}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: `2px solid ${C.border}`, background: C.bg, color: C.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            <ArrowLeft style={{ width: 14, height: 14 }} />Back
          </motion.button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "16px 24px", borderBottom: `2px solid ${C.border}` }}>
        <div style={{ position: "relative" }}>
          <Search style={{ width: 15, height: 15, color: C.textMuted, position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID..."
            style={{ ...fieldStyle, paddingLeft: 36 }}
            onFocus={e => { e.target.style.borderColor = C.emerald; }} onBlur={e => { e.target.style.borderColor = C.border; }} />
        </div>
        <p style={{ fontSize: 12, color: C.textMuted, marginTop: 8 }}>{filtered.length} student{filtered.length !== 1 ? "s" : ""} found</p>
      </div>

      {/* Student list */}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: C.textMuted, fontSize: 13 }}>No students found</div>
        ) : filtered.map(student => (
          <motion.div key={student.uid} whileHover={{ x: 4, boxShadow: C.shadowHover }}
            onClick={() => onSelectStudent(student)}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, border: `2px solid ${C.border}`, background: C.bg, cursor: "pointer", transition: "all 0.15s" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: C.gradPrimary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
              {student.name?.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}>{student.name}</p>
              <p style={{ fontSize: 12, color: C.textMuted }}>ID: {student.customId} · Grade {student.classLevel}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                {(student.assignments || []).map((a, idx) => (
                  <span key={idx} style={{ padding: "2px 8px", borderRadius: 20, background: C.cyanLight, color: C.cyan, fontSize: 11, fontWeight: 600 }}>{a.subject}</span>
                ))}
              </div>
            </div>
            <ChevronRight style={{ width: 18, height: 18, color: C.textMuted, flexShrink: 0 }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// CLASS SCHEDULING FORM
export function ClassSchedulingForm({ selectedStudent, onBack, adminScheduleClass, setActiveView }) {
  const [form, setForm]                   = useState({ subject: "", classDate: "", classTime: "", isRescheduled: false, originalClassDate: "" });
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [isLoading, setIsLoading]         = useState(false);
  const [status, setStatus]               = useState(null);
  const [missedClasses, setMissedClasses] = useState([]);
  const [loadingMissed, setLoadingMissed] = useState(false);

  const assignments = selectedStudent.assignments || [];

  useEffect(() => {
    if (form.isRescheduled && selectedStudent.uid && form.subject) {
      setLoadingMissed(true);
      const q = query(collection(db, "classes"), where("studentId", "==", selectedStudent.uid), where("subject", "==", form.subject), where("status", "==", "missed"));
      const unsub = onSnapshot(q, snap => {
        setMissedClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoadingMissed(false);
      });
      return () => unsub();
    } else {
      setMissedClasses([]);
      setForm(prev => ({ ...prev, originalClassDate: "" }));
    }
  }, [form.isRescheduled, form.subject, selectedStudent.uid]);

  const handleSubjectChange = (e) => {
    const subject = e.target.value;
    setForm(prev => ({ ...prev, subject }));
    const assignment = assignments.find(a => a.subject === subject);
    setSelectedTutor(assignment ? { id: assignment.tutorId, name: assignment.tutorName } : null);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const isFormValid = () => {
    if (!form.subject || !form.classDate || !form.classTime || !selectedTutor) return false;
    if (form.isRescheduled && !form.originalClassDate) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setStatus(null);
    if (!isFormValid()) { setStatus({ ok: false, msg: "Please fill all required fields." }); return; }
    setIsLoading(true);

    const classData = {
      studentId: selectedStudent.uid, studentName: selectedStudent.name,
      tutorId: selectedTutor.id, tutorName: selectedTutor.name,
      subject: form.subject, classDate: form.classDate, classTime: form.classTime,
      status: "scheduled", isRescheduled: form.isRescheduled,
      originalClassDate: form.isRescheduled ? form.originalClassDate : "",
      createdAt: new Date(),
    };

    try {
      const result = await adminScheduleClass(classData);
      setIsLoading(false);
      if (result?.success) {
        setStatus({ ok: true, msg: result.message || "Class scheduled successfully!" });
        setTimeout(() => setActiveView("classes-list"), 1500);
      } else {
        setStatus({ ok: false, msg: result?.error || "Failed to schedule class" });
      }
    } catch (err) {
      setIsLoading(false);
      setStatus({ ok: false, msg: err?.message || "Server error" });
    }
  };

  const subjectOptions = assignments.map(a => ({ value: a.subject, label: a.subject }));
  const missedOptions  = missedClasses.map(c => ({ value: c.classDate, label: `${c.classDate} at ${c.classTime}` }));

  return (
    <div style={{ background: C.card, borderRadius: 20, border: `2px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadowCard }}>
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: C.textPrimary }}>Schedule Class</h2>
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
            For <span style={{ color: C.cyan, fontWeight: 700 }}>{selectedStudent.name}</span> · {selectedStudent.customId}
          </p>
        </div>
        <motion.button onClick={onBack} whileHover={{ scale: 1.05 }}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: `2px solid ${C.border}`, background: C.bg, color: C.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          <ArrowLeft style={{ width: 14, height: 14 }} />Back
        </motion.button>
      </div>

      <div style={{ padding: 24 }}>
        <AnimatePresence>
          {status && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ padding: "12px 16px", borderRadius: 12, marginBottom: 16, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
                background: status.ok ? C.emeraldLight : C.redLight,
                color: status.ok ? C.emerald : C.red,
                border: `1px solid ${status.ok ? C.emerald : C.red}25` }}>
              {status.ok ? <CheckCircle style={{ width: 15, height: 15 }} /> : <AlertCircle style={{ width: 15, height: 15 }} />}
              {status.msg}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Subject */}
            <LabeledField label="Subject" required>
              <select name="subject" value={form.subject} onChange={handleSubjectChange} style={{ ...fieldStyle, appearance: "none" }} required
                onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border}>
                <option value="" disabled>Select subject</option>
                {subjectOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </LabeledField>

            {/* Auto tutor */}
            {selectedTutor && (
              <div style={{ padding: "12px 16px", borderRadius: 12, background: C.emeraldLight, border: `1px solid ${C.emerald}25`, display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle style={{ width: 16, height: 16, color: C.emerald }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted }}>Assigned Tutor</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>{selectedTutor.name}</p>
                </div>
              </div>
            )}

            {/* Date and time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <LabeledField label="Class Date" required>
                <input type="date" name="classDate" value={form.classDate} onChange={handleChange} required style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border} />
              </LabeledField>
              <LabeledField label="Class Time (IST)" required>
                <input type="time" name="classTime" value={form.classTime} onChange={handleChange} required style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border} />
              </LabeledField>
            </div>

            {/* Reschedule */}
            <div style={{ padding: "14px 16px", borderRadius: 12, background: C.bg, border: `2px solid ${C.border}` }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" name="isRescheduled" checked={form.isRescheduled} onChange={handleChange}
                  style={{ width: 16, height: 16, accentColor: C.emerald }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>This is a rescheduled class</p>
                  {form.isRescheduled && <p style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Select the original missed class date below</p>}
                </div>
              </label>
            </div>

            {/* Original class picker */}
            {form.isRescheduled && (
              <div>
                {loadingMissed ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 12, background: C.bg }}>
                    <Loader2 style={{ width: 16, height: 16, color: C.cyan, animation: "spin 1s linear infinite" }} />
                    <span style={{ fontSize: 13, color: C.textMuted }}>Loading missed classes...</span>
                  </div>
                ) : missedClasses.length === 0 ? (
                  <div style={{ padding: "12px 16px", borderRadius: 12, background: C.amberLight, border: `1px solid ${C.amber}25`, display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertCircle style={{ width: 16, height: 16, color: C.amber }} />
                    <span style={{ fontSize: 13, color: C.amber, fontWeight: 600 }}>
                      No missed classes found{form.subject ? ` for ${form.subject}` : ""}
                    </span>
                  </div>
                ) : (
                  <LabeledField label="Original Missed Class Date" required>
                    <select name="originalClassDate" value={form.originalClassDate} onChange={handleChange} style={{ ...fieldStyle, appearance: "none" }} required
                      onFocus={e => e.target.style.borderColor = C.emerald} onBlur={e => e.target.style.borderColor = C.border}>
                      <option value="" disabled>Select original date</option>
                      {missedOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </LabeledField>
                )}
              </div>
            )}

            <motion.button type="submit" disabled={!isFormValid() || isLoading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              style={{ padding: "14px", borderRadius: 14, border: "none", background: C.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 14, cursor: isFormValid() && !isLoading ? "pointer" : "not-allowed", opacity: !isFormValid() || isLoading ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {isLoading ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : <><Calendar style={{ width: 16, height: 16 }} />Schedule Class</>}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

// TUTOR SEARCH SELECT
// Small searchable dropdown used to pick a teacher for a demo class.
function TutorSearchSelect({ tutors, selectedTutor, onSelect }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const filtered = (tutors || []).filter(t => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (t.name || "").toLowerCase().includes(q) ||
      (t.tutorTypes || []).some(tt => tt.toLowerCase().includes(q));
  });

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <Search style={{ width: 15, height: 15, color: C.textMuted, position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
        <input
          value={selectedTutor ? selectedTutor.name : query}
          onChange={e => { onSelect(null); setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search teacher by name..."
          style={{ ...fieldStyle, paddingLeft: 36 }}
          onFocusCapture={e => e.target.style.borderColor = C.violet}
          onBlurCapture={e => e.target.style.borderColor = C.border}
        />
        {selectedTutor && (
          <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => { onSelect(null); setQuery(""); }}
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex" }}>
            <X style={{ width: 14, height: 14, color: C.textMuted }} />
          </button>
        )}
      </div>
      {open && !selectedTutor && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, maxHeight: 220, overflowY: "auto", background: C.card, border: `2px solid ${C.border}`, borderRadius: 12, boxShadow: C.shadowHover, zIndex: 20 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 14, fontSize: 12, color: C.textMuted, textAlign: "center" }}>No teachers found</div>
          ) : filtered.map(t => (
            <div key={t.uid} onMouseDown={e => e.preventDefault()} onClick={() => { onSelect(t); setQuery(""); setOpen(false); }}
              style={{ padding: "10px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.textPrimary, borderBottom: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
              onMouseEnter={e => e.currentTarget.style.background = C.bg}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span>{t.name}</span>
              {(t.tutorTypes || []).length > 0 && (
                <span style={{ fontSize: 10, color: C.violet, background: C.violetLight, padding: "2px 8px", borderRadius: 20, fontWeight: 700, flexShrink: 0 }}>
                  {t.tutorTypes.join(", ")}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// DEMO CLASS SCHEDULING FORM
// For prospective/unregistered students. No studentId exists yet, so this
// posts straight to /admin/schedule-demo-class which writes a "classes" doc
// flagged isDemo:true — it shows up in the assigned tutor's dashboard like
// any other class, but clearly marked as a demo.
const demoCategoryOptions = [
  { value: "coding", label: "Coding" },
  { value: "math", label: "Maths" },
  { value: "academic_tuition", label: "Academic Tuition" },
  { value: "courses", label: "Courses" },
];

export function DemoClassSchedulingForm({ tutors, onBack, adminScheduleDemoClass, setActiveView }) {
  const [form, setForm] = useState({
    studentName: "", studentClass: "", demoCategory: "", courseDetails: "",
    classDate: "", classTime: "", meetLink: "", additionalInfo: "",
  });
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    if (!form.studentName.trim() || !form.studentClass.trim() || !form.demoCategory) return false;
    if (form.demoCategory === "courses" && !form.courseDetails.trim()) return false;
    if (!form.classDate || !form.classTime || !form.meetLink.trim() || !selectedTutor) return false;
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isFormValid()) return;
    setIsLoading(true);
    setStatus(null);

    const demoData = {
      studentName: form.studentName.trim(),
      studentClass: form.studentClass.trim(),
      demoCategory: form.demoCategory,
      courseDetails: form.demoCategory === "courses" ? form.courseDetails.trim() : "",
      tutorId: selectedTutor.uid,
      tutorName: selectedTutor.name,
      classDate: form.classDate,
      classTime: form.classTime,
      meetLink: form.meetLink.trim(),
      additionalInfo: form.additionalInfo.trim(),
    };

    try {
      const result = await adminScheduleDemoClass(demoData);
      setIsLoading(false);
      if (result?.success) {
        setStatus({ ok: true, msg: result.message || "Demo class scheduled successfully!" });
        setTimeout(() => setActiveView("classes-list"), 1500);
      } else {
        setStatus({ ok: false, msg: result?.error || "Failed to schedule demo class" });
      }
    } catch (err) {
      setIsLoading(false);
      setStatus({ ok: false, msg: err?.message || "Server error" });
    }
  };

  return (
    <div style={{ background: C.card, borderRadius: 20, border: `2px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadowCard }}>
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: C.violetLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles style={{ width: 17, height: 17, color: C.violet }} />
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: C.textPrimary }}>Schedule Demo Class</h2>
            <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>For a prospective student — no account required</p>
          </div>
        </div>
        <motion.button onClick={onBack} whileHover={{ scale: 1.05 }}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: `2px solid ${C.border}`, background: C.bg, color: C.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          <ArrowLeft style={{ width: 14, height: 14 }} />Back
        </motion.button>
      </div>

      <div style={{ padding: 24 }}>
        <AnimatePresence>
          {status && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ padding: "12px 16px", borderRadius: 12, marginBottom: 16, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
                background: status.ok ? C.emeraldLight : C.redLight,
                color: status.ok ? C.emerald : C.red,
                border: `1px solid ${status.ok ? C.emerald : C.red}25` }}>
              {status.ok ? <CheckCircle style={{ width: 15, height: 15 }} /> : <AlertCircle style={{ width: 15, height: 15 }} />}
              {status.msg}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Student name + class */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <LabeledField label="Student Name" required>
                <input type="text" name="studentName" value={form.studentName} onChange={handleChange} placeholder="e.g. Aarav Sharma" required style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = C.violet} onBlur={e => e.target.style.borderColor = C.border} />
              </LabeledField>
              <LabeledField label="Student Class / Grade" required>
                <input type="text" name="studentClass" value={form.studentClass} onChange={handleChange} placeholder="e.g. Grade 6" required style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = C.violet} onBlur={e => e.target.style.borderColor = C.border} />
              </LabeledField>
            </div>

            {/* Demo category */}
            <LabeledField label="Demo Category" required>
              <select name="demoCategory" value={form.demoCategory} onChange={handleChange} style={{ ...fieldStyle, appearance: "none" }} required
                onFocus={e => e.target.style.borderColor = C.violet} onBlur={e => e.target.style.borderColor = C.border}>
                <option value="" disabled>Select category</option>
                {demoCategoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </LabeledField>

            {/* Course details — only for "courses" */}
            {form.demoCategory === "courses" && (
              <LabeledField label="Course Details" required>
                <input type="text" name="courseDetails" value={form.courseDetails} onChange={handleChange}
                  placeholder="e.g. Python for Data Science, Web Development Bootcamp" required style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = C.violet} onBlur={e => e.target.style.borderColor = C.border} />
              </LabeledField>
            )}

            {/* Date and time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <LabeledField label="Demo Date" required>
                <input type="date" name="classDate" value={form.classDate} onChange={handleChange} required style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = C.violet} onBlur={e => e.target.style.borderColor = C.border} />
              </LabeledField>
              <LabeledField label="Demo Time (IST)" required>
                <input type="time" name="classTime" value={form.classTime} onChange={handleChange} required style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = C.violet} onBlur={e => e.target.style.borderColor = C.border} />
              </LabeledField>
            </div>

            {/* Meet link */}
            <LabeledField label="Meet Link" required>
              <div style={{ position: "relative" }}>
                <LinkIcon style={{ width: 14, height: 14, color: C.textMuted, position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input type="url" name="meetLink" value={form.meetLink} onChange={handleChange} placeholder="https://meet.google.com/xxx-xxxx-xxx" required
                  style={{ ...fieldStyle, paddingLeft: 34 }}
                  onFocus={e => e.target.style.borderColor = C.violet} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
            </LabeledField>

            {/* Select teacher */}
            <LabeledField label="Select Teacher" required>
              <TutorSearchSelect tutors={tutors} selectedTutor={selectedTutor} onSelect={setSelectedTutor} />
            </LabeledField>
            {selectedTutor && (
              <div style={{ marginTop: -8, padding: "10px 14px", borderRadius: 12, background: C.violetLight, border: `1px solid ${C.violet}25`, display: "flex", alignItems: "center", gap: 8 }}>
                <GraduationCap style={{ width: 15, height: 15, color: C.violet }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{selectedTutor.name}</span>
              </div>
            )}

            {/* Additional info */}
            <LabeledField label="Additional Info (optional)">
              <textarea name="additionalInfo" value={form.additionalInfo} onChange={handleChange} rows={3}
                placeholder="Anything the tutor should know before the demo..."
                style={{ ...fieldStyle, resize: "vertical", fontFamily: "inherit" }}
                onFocus={e => e.target.style.borderColor = C.violet} onBlur={e => e.target.style.borderColor = C.border} />
            </LabeledField>

            <motion.button type="submit" disabled={!isFormValid() || isLoading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              style={{ padding: "14px", borderRadius: 14, border: "none", background: C.gradViolet, color: "#fff", fontWeight: 700, fontSize: 14, cursor: isFormValid() && !isLoading ? "pointer" : "not-allowed", opacity: !isFormValid() || isLoading ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {isLoading ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : <><Sparkles style={{ width: 16, height: 16 }} />Schedule Demo Class</>}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}