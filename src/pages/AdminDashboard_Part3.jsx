import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, X, Search, ChevronRight, Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const C = {
  bg: "#F4F6FB", card: "#FFFFFF", border: "#E5E9F2",
  textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
  emerald: "#10B981", emeraldLight: "#ECFDF5",
  cyan: "#0EA5E9", cyanLight: "#E0F2FE",
  indigo: "#6366F1", indigoLight: "#EEF2FF",
  red: "#EF4444", redLight: "#FEF2F2",
  amber: "#F59E0B", amberLight: "#FFFBEB",
  gradPrimary: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
  shadowCard: "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
  shadowHover: "0 8px 24px rgba(15,23,42,0.1)",
};

const fieldStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 12, border: `1px solid ${C.border}`,
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
export function StudentSelectionView({ students, onSelectStudent, setActiveView }) {
  const [search, setSearch] = useState("");

  const filtered = students.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (s.name || "").toLowerCase().includes(q) || (s.customId || "").toLowerCase().includes(q);
  });

  return (
    <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadowCard }}>
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: C.textPrimary }}>Select Student</h2>
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Choose a student to schedule a class session</p>
        </div>
        <motion.button onClick={() => setActiveView("list")} whileHover={{ scale: 1.05 }}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          <ArrowLeft style={{ width: 14, height: 14 }} />Back
        </motion.button>
      </div>

      {/* Search */}
      <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}` }}>
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
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, border: `1px solid ${C.border}`, background: C.bg, cursor: "pointer", transition: "all 0.15s" }}>
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
    <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadowCard }}>
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: C.textPrimary }}>Schedule Class</h2>
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
            For <span style={{ color: C.cyan, fontWeight: 700 }}>{selectedStudent.name}</span> · {selectedStudent.customId}
          </p>
        </div>
        <motion.button onClick={onBack} whileHover={{ scale: 1.05 }}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
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
            <div style={{ padding: "14px 16px", borderRadius: 12, background: C.bg, border: `1px solid ${C.border}` }}>
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