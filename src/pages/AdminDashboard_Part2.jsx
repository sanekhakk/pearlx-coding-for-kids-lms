import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Loader2, XCircle, X, CheckCircle, ArrowLeft } from "lucide-react";
import { TIMEZONES } from "../utils/timeUtils";

const C = {
  bg: "#F4F6FB", card: "#FFFFFF", border: "#E5E9F2",
  textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
  emerald: "#10B981", emeraldLight: "#ECFDF5",
  cyan: "#0EA5E9", cyanLight: "#E0F2FE",
  indigo: "#6366F1", indigoLight: "#EEF2FF",
  red: "#EF4444", redLight: "#FEF2F2",
  amber: "#F59E0B", amberLight: "#FFFBEB",
  violet: "#8B5CF6", violetLight: "#F5F3FF",
  gradPrimary: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
  gradEmerald: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  shadowCard: "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
};

export const STUDENT_CATEGORIES = [
  { value: "little_pearls",     label: "🐥 Little Pearls  (Ages 5–7 • Grades K–2)" },
  { value: "bright_pearls",     label: "🌱 Bright Pearls  (Ages 8–11 • Grades 3–6)" },
  { value: "rising_pearls",     label: "🦋 Rising Pearls  (Ages 12–15 • Grades 7–10)" },
  { value: "academic_tuition",  label: "📖 Academic Tuition  (CS Subjects – Custom Syllabus)" },
  { value: "courses",           label: "📘 Courses  (Self-Paced • Custom Chapters)" },
];

// Categories that follow the shared coding Module/Lesson curriculum
export const CODING_CATEGORIES = ["little_pearls", "bright_pearls", "rising_pearls"];
// Categories that get a per-student custom Chapters list instead
export const CUSTOM_CHAPTER_CATEGORIES = ["academic_tuition", "courses"];

const TUTOR_TYPE_OPTIONS = [
  { value: "coding",   label: "💻 Coding Classes" },
  { value: "cs_tuition", label: "📚 Computer Science Tuition" },
];

const fieldStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 12, border: `1px solid ${C.border}`,
  background: C.bg, fontSize: 13, color: C.textPrimary, outline: "none",
  fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.15s",
};

const LabeledInput = ({ label, required, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 700, color: C.textSecondary }}>
      {label}{required && <span style={{ color: C.red }}> *</span>}
    </label>
    {children}
  </div>
);

const TextInput = ({ label, name, value, onChange, type = "text", required, placeholder, readOnly, disabled }) => (
  <LabeledInput label={label} required={required}>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
      readOnly={readOnly} disabled={disabled} required={required}
      style={{ ...fieldStyle, opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "text" }}
      onFocus={e => { if (!disabled) { e.target.style.borderColor = C.emerald; e.target.style.boxShadow = `0 0 0 3px ${C.emerald}18`; }}}
      onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} />
  </LabeledInput>
);

const SelectInput = ({ label, name, value, onChange, options, required }) => (
  <LabeledInput label={label} required={required}>
    <select name={name} value={value} onChange={onChange} required={required}
      style={{ ...fieldStyle, appearance: "none" }}
      onFocus={e => { e.target.style.borderColor = C.emerald; }} onBlur={e => { e.target.style.borderColor = C.border; }}>
      {(!value || value === "") && <option value="" disabled>Select an option</option>}
      {options.map(opt => (
        <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>
      ))}
    </select>
  </LabeledInput>
);

const TutorTypeCheckboxes = ({ selectedTypes, onChange }) => (
  <LabeledInput label="Tutor Category" required>
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.bg }}>
      {TUTOR_TYPE_OPTIONS.map(opt => {
        const checked = selectedTypes.includes(opt.value);
        return (
          <label key={opt.value}
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 10px", borderRadius: 10, background: checked ? C.emeraldLight : "transparent", border: `1px solid ${checked ? C.emerald + "40" : "transparent"}`, transition: "all 0.15s" }}>
            <div onClick={() => onChange(opt.value)}
              style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${checked ? C.emerald : C.border}`, background: checked ? C.emerald : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "all 0.15s" }}>
              {checked && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span onClick={() => onChange(opt.value)} style={{ fontSize: 13, fontWeight: checked ? 700 : 500, color: checked ? C.textPrimary : C.textSecondary }}>{opt.label}</span>
          </label>
        );
      })}
      {selectedTypes.length === 0 && (
        <p style={{ fontSize: 11, color: C.red, margin: "2px 0 0 4px" }}>Please select at least one category</p>
      )}
      {selectedTypes.length === 2 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 8, background: C.amberLight, marginTop: 2 }}>
          <span style={{ fontSize: 11, color: C.amber, fontWeight: 600 }}>⭐ This tutor handles both coding and CS tuition</span>
        </div>
      )}
    </div>
  </LabeledInput>
);

const CategorySelector = ({ value, onChange }) => (
  <div style={{ gridColumn: "1 / -1" }}>
    <label style={{ fontSize: 12, fontWeight: 700, color: C.textSecondary, display: "block", marginBottom: 8 }}>
      Student Category <span style={{ color: C.red }}>*</span>
    </label>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
      {STUDENT_CATEGORIES.map(cat => {
        const selected = value === cat.value;
        const emoji    = cat.label.charAt(0);
        const name     = cat.label.slice(2, cat.label.indexOf("(")).trim();
        const sub      = cat.label.slice(cat.label.indexOf("("));
        const colorMap = {
          little_pearls:    { bg: "#FFF7ED", border: "#FB923C", text: "#EA580C" },
          bright_pearls:    { bg: "#F0FDF4", border: "#22C55E", text: "#16A34A" },
          rising_pearls:    { bg: "#EFF6FF", border: "#60A5FA", text: "#2563EB" },
          academic_tuition: { bg: "#F5F3FF", border: "#8B5CF6", text: "#6D28D9" },
          courses:          { bg: "#FDF2F8", border: "#EC4899", text: "#BE185D" },
        };
        const col = colorMap[cat.value];
        return (
          <motion.div key={cat.value} onClick={() => onChange(cat.value)} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
            style={{ cursor: "pointer", padding: "14px 12px", borderRadius: 14, border: `2px solid ${selected ? col.border : C.border}`, background: selected ? col.bg : C.bg, transition: "all 0.15s", textAlign: "center" }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{emoji}</div>
            <p style={{ fontSize: 12, fontWeight: 800, color: selected ? col.text : C.textPrimary, lineHeight: 1.3 }}>{name}</p>
            <p style={{ fontSize: 10, color: selected ? col.text : C.textMuted, marginTop: 4, lineHeight: 1.4 }}>{sub}</p>
            {selected && (
              <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 20, background: col.border, color: "#fff" }}>
                <CheckCircle style={{ width: 10, height: 10 }} />
                <span style={{ fontSize: 10, fontWeight: 700 }}>Selected</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
    {(value === "academic_tuition" || value === "courses") && (
      <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 12, background: value === "courses" ? "#FDF2F8" : "#F5F3FF", border: `1px solid ${value === "courses" ? "#EC489925" : "#8B5CF625"}`, display: "flex", alignItems: "flex-start", gap: 8 }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>📌</span>
        <p style={{ fontSize: 12, color: value === "courses" ? "#BE185D" : "#6D28D9", lineHeight: 1.6 }}>
          <strong>{value === "courses" ? "Courses" : "Academic Tuition"} students</strong> follow a <strong>custom per-student chapter list</strong> instead of the shared coding curriculum.
          After registering, go to <strong>Curriculum → Assign to Students</strong> to add chapters for this student.
        </p>
      </div>
    )}
  </div>
);

const StatusBanner = ({ status }) => {
  if (!status) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        style={{ padding: "12px 16px", borderRadius: 12, marginBottom: 16, fontSize: 13, fontWeight: 600,
          background: status.ok ? C.emeraldLight : C.redLight,
          color: status.ok ? C.emerald : C.red,
          border: `1px solid ${status.ok ? C.emerald : C.red}25`,
          display: "flex", alignItems: "center", gap: 8 }}>
        {status.ok ? <CheckCircle style={{ width: 15, height: 15 }} /> : <XCircle style={{ width: 15, height: 15 }} />}
        {status.msg}
      </motion.div>
    </AnimatePresence>
  );
};

const Panel = ({ children, title, subtitle, onClose }) => (
  <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadowCard }}>
    <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: C.textPrimary }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{subtitle}</p>}
      </div>
      {onClose && (
        <motion.button onClick={onClose} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          style={{ width: 32, height: 32, borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X style={{ width: 15, height: 15, color: C.textMuted }} />
        </motion.button>
      )}
    </div>
    <div style={{ padding: 24 }}>{children}</div>
  </div>
);

const AssignmentRow = ({ assignment, onRemove, index }) => (
  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 12, background: C.bg, border: `1px solid ${C.border}` }}>
    <div>
      <span style={{ fontWeight: 700, fontSize: 13, color: C.textPrimary }}>{assignment.subject}</span>
      <span style={{ fontSize: 12, color: C.cyan, marginLeft: 10 }}>· {assignment.tutorName}</span>
    </div>
    <motion.button type="button" onClick={() => onRemove(index)} whileHover={{ scale: 1.1 }}
      style={{ background: C.redLight, border: "none", borderRadius: 8, padding: "5px 7px", cursor: "pointer", display: "flex", alignItems: "center" }}>
      <XCircle style={{ width: 14, height: 14, color: C.red }} />
    </motion.button>
  </motion.div>
);

export function RegistrationPanel({ form, regRole, regStatus, regLoading, handleFormChange, setRegRole, setActiveView, setRegStatus, tutors, setForm, initialFormState, adminRegisterUser, setRegLoading }) {
  const [currentSubjectInput, setCurrentSubjectInput] = useState("");
  const [selectedTutor, setSelectedTutor]             = useState({ id: "", name: "" });
  const [assignedSubjects, setAssignedSubjects]       = useState([]);
  // NEW: student category & tutor type state
  const [studentCategory, setStudentCategory]         = useState("");
  const [tutorTypes, setTutorTypes]                   = useState([]);

  const tutorOptions = tutors.map(t => ({ value: t.uid, label: `${t.name} (${(t.subjects || []).join(", ") || "Any"})` }));

  // Toggle a tutor type on/off
  const handleTutorTypeToggle = (type) => {
    setTutorTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleAddAssignment = () => {
    if (currentSubjectInput.trim() && selectedTutor.id) {
      setAssignedSubjects(prev => [...prev, { subject: currentSubjectInput.trim(), tutorId: selectedTutor.id, tutorName: selectedTutor.name }]);
      setCurrentSubjectInput(""); setSelectedTutor({ id: "", name: "" });
    } else {
      setRegStatus({ ok: false, msg: "Please enter a subject and select a tutor." });
      setTimeout(() => setRegStatus(null), 3000);
    }
  };

  const localIsFormValid = () => {
    if (!form.name?.trim() || !form.email?.trim() || !form.password?.trim() || !form.contactNumber?.trim()) return false;
    if (regRole === "student") {
      return (
        studentCategory !== "" &&
        form.grade?.trim() &&
        form.emergencyContact?.trim() &&
        form.permanentClassLink?.trim() &&
        assignedSubjects.length > 0
      );
    }
    if (regRole === "tutor") {
      return (
        tutorTypes.length > 0 &&
        form.qualifications?.trim() &&
        form.hourlyRate?.trim() &&
        form.subjects.length > 0
      );
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setRegStatus(null); setRegLoading(true);
    if (!localIsFormValid()) {
      setRegLoading(false);
      setRegStatus({ ok: false, msg: "Please fill all required fields." });
      return;
    }

    const finalForm = {
      ...Object.fromEntries(Object.entries(form).map(([k, v]) => typeof v === "string" ? [k, v.trim()] : [k, v])),
      role: regRole,
      // Student fields
      category: regRole === "student" ? studentCategory : "",
      classLevel: regRole === "student" ? form.grade : form.classLevel, // keep classLevel in sync
      grade: regRole === "student" ? form.grade : "",
      subjects: regRole === "student" ? assignedSubjects.map(a => a.subject) : form.subjects || [],
      assignments: regRole === "student" ? assignedSubjects : [],
      permanentClassLink: regRole === "student" ? form.permanentClassLink : "",
      // Tutor fields
      tutorTypes: regRole === "tutor" ? tutorTypes : [],
    };

    try {
      const res = await adminRegisterUser(finalForm, regRole);
      setRegLoading(false);
      if (res?.success) {
        setRegStatus({ ok: true, msg: res.message || `${regRole} created successfully!` });
        setAssignedSubjects([]); setCurrentSubjectInput(""); setSelectedTutor({ id: "", name: "" });
        setStudentCategory(""); setTutorTypes([]);
        setForm(initialFormState);
        setTimeout(() => { setRegStatus(null); setActiveView("list"); }, 1200);
      } else {
        setRegStatus({ ok: false, msg: res?.error || "Registration failed" });
      }
    } catch (err) {
      setRegLoading(false);
      setRegStatus({ ok: false, msg: err?.message || "Failed to connect to server." });
    }
  };

  return (
    <Panel title="Register New User" subtitle="Add a student or tutor to the Pearlx platform"
      onClose={() => { setActiveView("list"); setRegStatus(null); }}>

      {/* Role toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, padding: 4, background: C.bg, borderRadius: 14, border: `1px solid ${C.border}` }}>
        {["student", "tutor"].map(r => (
          <button key={r} type="button" onClick={() => { setRegRole(r); setForm(initialFormState); setAssignedSubjects([]); setStudentCategory(""); setTutorTypes([]); }}
            style={{ flex: 1, padding: "10px", borderRadius: 12, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
              background: regRole === r ? C.gradPrimary : "transparent",
              color: regRole === r ? "#fff" : C.textMuted, transition: "all 0.2s" }}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      <StatusBanner status={regStatus} />

      <form onSubmit={handleSubmit}>
        {/* Basic fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <TextInput label="Full Name" name="name" value={form.name} onChange={handleFormChange} required />
          <TextInput label="Email Address" name="email" value={form.email} onChange={handleFormChange} type="email" required />
          <TextInput label="Temporary Password" name="password" value={form.password} onChange={handleFormChange} type="password" required />
          <TextInput label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={handleFormChange} required />
          <SelectInput label="Timezone" name="timezone" value={form.timezone || "Asia/Kolkata"} onChange={handleFormChange} options={TIMEZONES} required />

          {/* ── STUDENT FIELDS ── */}
          {regRole === "student" && (<>
            {/* Category selector spans full width */}
            <CategorySelector value={studentCategory} onChange={setStudentCategory} />

            <TextInput label="Student Grade / Class" name="grade" value={form.grade || ""} onChange={handleFormChange}
              placeholder="e.g. Grade 3, Class 5, KG" required />
            <TextInput label="Emergency Contact" name="emergencyContact" value={form.emergencyContact} onChange={handleFormChange} required />
            <TextInput label="Permanent Class Link (Google Meet / Zoom)" name="permanentClassLink" value={form.permanentClassLink} onChange={handleFormChange} type="url" placeholder="https://meet.google.com/xyz" required />
          </>)}

          {/* ── TUTOR FIELDS ── */}
          {regRole === "tutor" && (<>
            {/* Tutor type checkboxes span full width */}
            <div style={{ gridColumn: "1 / -1" }}>
              <TutorTypeCheckboxes selectedTypes={tutorTypes} onChange={handleTutorTypeToggle} />
            </div>

            <TextInput label="Qualifications" name="qualifications" value={form.qualifications} onChange={handleFormChange} required />
            <TextInput label="Hourly Rate (₹)" name="hourlyRate" value={form.hourlyRate} onChange={handleFormChange} required />
            <TextInput label="Subjects (comma-separated)" name="subjects" value={form.subjects.join(", ")}
              onChange={e => handleFormChange({ target: { name: "subjects", value: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } })} required />
          </>)}
        </div>

        {/* Student assignments */}
        {regRole === "student" && (
          <div style={{ border: `2px dashed ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, marginBottom: 14 }}>
              Assign Subjects & Tutors <span style={{ color: C.red }}>*</span>
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginBottom: 12, alignItems: "flex-end" }}>
              <TextInput label="Subject Name" name="subject" value={currentSubjectInput}
                onChange={e => setCurrentSubjectInput(e.target.value)} placeholder="e.g. Coding, Maths" />
              <SelectInput label="Choose Tutor" name="tutor" value={selectedTutor.id}
                onChange={e => { const t = tutors.find(t => t.uid === e.target.value); setSelectedTutor({ id: e.target.value, name: t?.name || "" }); }}
                options={tutorOptions} />
              <motion.button type="button" onClick={handleAddAssignment} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{ height: 42, paddingInline: 16, borderRadius: 12, border: "none", background: C.gradPrimary, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PlusCircle style={{ width: 18, height: 18 }} />
              </motion.button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
              {assignedSubjects.length === 0
                ? <p style={{ textAlign: "center", fontSize: 13, color: C.textMuted, padding: "12px 0" }}>No subjects assigned yet</p>
                : assignedSubjects.map((a, i) => <AssignmentRow key={i} assignment={a} onRemove={idx => setAssignedSubjects(prev => prev.filter((_, j) => j !== idx))} index={i} />)
              }
            </div>
          </div>
        )}

        <motion.button type="submit" disabled={!localIsFormValid() || regLoading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: C.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 14, cursor: localIsFormValid() && !regLoading ? "pointer" : "not-allowed", opacity: !localIsFormValid() || regLoading ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {regLoading ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : `Create ${regRole.charAt(0).toUpperCase() + regRole.slice(1)}`}
        </motion.button>
      </form>
    </Panel>
  );
}

// ====================================================================
// EDIT USER PANEL
// ====================================================================
export function EditUserPanel({ user, setActiveView, tutors, adminUpdateUser }) {
  const { uid, name, email, role, contactNumber = "", emergencyContact = "", classLevel = "",
    subjects = [], qualifications = "", hourlyRate = "", permanentClassLink = "",
    assignments: initialAssignments = [], syllabus = "",
    category: initialCategory = "", grade: initialGrade = "",
    tutorTypes: initialTutorTypes = [] } = user;

  const [form, setForm] = useState({
    name, email, contactNumber, emergencyContact,
    classLevel, grade: initialGrade || classLevel,  // populate grade from classLevel if not set
    qualifications, hourlyRate, permanentClassLink, syllabus,
    timezone: user.timezone || "Asia/Kolkata",
    tutorSubjectsString: role === "tutor" ? subjects.join(", ") : "",
  });
  const [studentCategory, setStudentCategory]         = useState(initialCategory);
  const [tutorTypes, setTutorTypes]                   = useState(initialTutorTypes);
  const [assignedSubjects, setAssignedSubjects]       = useState(initialAssignments);
  const [currentSubjectInput, setCurrentSubjectInput] = useState("");
  const [selectedTutor, setSelectedTutor]             = useState({ id: "", name: "" });
  const [updateStatus, setUpdateStatus]               = useState(null);
  const [updateLoading, setUpdateLoading]             = useState(false);

  const tutorOptions = tutors.map(t => ({ value: t.uid, label: `${t.name} (${(t.subjects || []).join(", ") || "Any"})` }));

  const handleFormChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleTutorTypeToggle = (type) => {
    setTutorTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleAddAssignment = () => {
    if (currentSubjectInput.trim() && selectedTutor.id) {
      setAssignedSubjects(prev => [...prev, { subject: currentSubjectInput.trim(), tutorId: selectedTutor.id, tutorName: selectedTutor.name }]);
      setCurrentSubjectInput(""); setSelectedTutor({ id: "", name: "" });
    }
  };

  const localIsFormValid = () => {
    if (!form.name || !form.email || !form.contactNumber) return false;
    if (role === "student" && (!studentCategory || !form.grade || !form.emergencyContact || !form.permanentClassLink || assignedSubjects.length === 0)) return false;
    if (role === "tutor" && (!form.qualifications || !form.hourlyRate || tutorTypes.length === 0)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setUpdateStatus(null); setUpdateLoading(true);
    if (!localIsFormValid()) { setUpdateLoading(false); setUpdateStatus({ ok: false, msg: "Fill all required fields." }); return; }

    const tutorSubjectsArray = form.tutorSubjectsString ? form.tutorSubjectsString.split(",").map(s => s.trim()).filter(Boolean) : [];
    const finalForm = {
      ...form, role,
      category: role === "student" ? studentCategory : "",
      classLevel: role === "student" ? form.grade : form.classLevel,
      grade: role === "student" ? form.grade : "",
      subjects: role === "tutor" ? tutorSubjectsArray : assignedSubjects.map(a => a.subject),
      assignments: role === "student" ? assignedSubjects : [],
      tutorTypes: role === "tutor" ? tutorTypes : [],
    };

    try {
      const res = await adminUpdateUser(uid, finalForm);
      setUpdateLoading(false);
      if (res?.success) {
        setUpdateStatus({ ok: true, msg: res.message || `${role} updated successfully!` });
        setTimeout(() => { setUpdateStatus(null); setActiveView("list"); }, 1200);
      } else {
        setUpdateStatus({ ok: false, msg: res?.error || "Update failed" });
      }
    } catch (err) {
      setUpdateLoading(false);
      setUpdateStatus({ ok: false, msg: err?.message || "Failed" });
    }
  };

  const roleCap = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <Panel title={`Edit ${roleCap}: ${name}`} subtitle={`Update ${role} profile and assignments`}
      onClose={() => setActiveView("list")}>
      <StatusBanner status={updateStatus} />

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <TextInput label="Full Name" name="name" value={form.name} onChange={handleFormChange} required />
          <TextInput label="Email (Read-only)" name="email" value={form.email} readOnly disabled />
          <TextInput label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={handleFormChange} required />

          {role === "student" && (<>
            <CategorySelector value={studentCategory} onChange={setStudentCategory} />
            <TextInput label="Student Grade / Class" name="grade" value={form.grade} onChange={handleFormChange}
              placeholder="e.g. Grade 3" required />
            <SelectInput label="Timezone" name="timezone" value={form.timezone} onChange={handleFormChange} options={TIMEZONES} required />
            <TextInput label="Emergency Contact" name="emergencyContact" value={form.emergencyContact} onChange={handleFormChange} required />
            <TextInput label="Permanent Class Link" name="permanentClassLink" value={form.permanentClassLink} onChange={handleFormChange} type="url" required />
            <TextInput label="Syllabus" name="syllabus" value={form.syllabus} onChange={handleFormChange} />
          </>)}

          {role === "tutor" && (<>
            <div style={{ gridColumn: "1 / -1" }}>
              <TutorTypeCheckboxes selectedTypes={tutorTypes} onChange={handleTutorTypeToggle} />
            </div>
            <TextInput label="Qualifications" name="qualifications" value={form.qualifications} onChange={handleFormChange} required />
            <SelectInput label="Timezone" name="timezone" value={form.timezone} onChange={handleFormChange} options={TIMEZONES} required />
            <TextInput label="Hourly Rate (₹)" name="hourlyRate" value={form.hourlyRate} onChange={handleFormChange} required />
            <TextInput label="Subjects Taught (comma-separated)" name="tutorSubjectsString" value={form.tutorSubjectsString} onChange={handleFormChange} required />
          </>)}
        </div>

        {role === "student" && (
          <div style={{ border: `2px dashed ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, marginBottom: 14 }}>
              Assign Subjects <span style={{ color: C.red }}>*</span>
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginBottom: 12, alignItems: "flex-end" }}>
              <TextInput label="Subject" name="sub" value={currentSubjectInput} onChange={e => setCurrentSubjectInput(e.target.value)} placeholder="e.g. Coding" />
              <SelectInput label="Tutor" name="tutor" value={selectedTutor.id}
                onChange={e => { const t = tutors.find(t => t.uid === e.target.value); setSelectedTutor({ id: e.target.value, name: t?.name || "" }); }}
                options={tutorOptions} />
              <motion.button type="button" onClick={handleAddAssignment} whileHover={{ scale: 1.05 }}
                style={{ height: 42, paddingInline: 16, borderRadius: 12, border: "none", background: C.gradPrimary, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <PlusCircle style={{ width: 17, height: 17 }} />
              </motion.button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
              {assignedSubjects.length === 0
                ? <p style={{ textAlign: "center", fontSize: 13, color: C.textMuted, padding: "12px 0" }}>No subjects assigned</p>
                : assignedSubjects.map((a, i) => <AssignmentRow key={i} assignment={a} onRemove={idx => setAssignedSubjects(prev => prev.filter((_, j) => j !== idx))} index={i} />)
              }
            </div>
          </div>
        )}

        <motion.button type="submit" disabled={updateLoading || !localIsFormValid()} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: C.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: !localIsFormValid() || updateLoading ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {updateLoading ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : `Update ${roleCap}`}
        </motion.button>
      </form>
    </Panel>
  );
}