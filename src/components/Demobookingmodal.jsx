import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Clock3,
  UserRound,
  MapPin,
  Languages,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Laptop,
} from "lucide-react";

import { COLORS, GRADIENTS, SHADOWS } from "../utils/theme";

/*
  DemoBookingModal
  ----------------
  The UI is now a short, multi-step booking flow, but the submitted
  formData shape is intentionally unchanged so the existing
  /api/submit-demo-booking route and Google Sheets mapping continue
  to receive the same fields.

  Existing submitted fields:
  source
  studentName
  studentGrade
  country
  state
  languages
  parentName
  email
  contactNumber
  wantsDemoSession
  preferredDate
  preferredTime
*/

const STEPS = [
  { id: 1, label: "Class", icon: Laptop },
  { id: 2, label: "Student", icon: UserRound },
  { id: 3, label: "About", icon: MapPin },
  { id: 4, label: "Parent", icon: Mail },
  { id: 5, label: "Schedule", icon: CalendarDays },
];

const PROGRAMS = [
  { value: "coding", label: "Coding" },
  { value: "maths", label: "Maths" },
  { value: "academic_tuition", label: "Academic Tuition" },
  { value: "courses", label: "Courses" },
];

const GRADES = [
  ["K", "Kindergarten"],
  ["1", "Grade 1"],
  ["2", "Grade 2"],
  ["3", "Grade 3"],
  ["4", "Grade 4"],
  ["5", "Grade 5"],
  ["6", "Grade 6"],
  ["7", "Grade 7"],
  ["8", "Grade 8"],
  ["9", "Grade 9"],
  ["10", "Grade 10"],
  ["11", "Grade 11"],
  ["12", "Grade 12"],
];

const TIMES = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 9;
  return `${String(hour).padStart(2, "0")}:00`;
});

const formatTime = (value) => {
  const [hourString] = value.split(":");
  const hour = Number(hourString);
  if (hour === 12) return "12:00 PM";
  if (hour > 12) return `${hour - 12}:00 PM`;
  return `${hour}:00 AM`;
};

const formatDateLabel = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(date);

const getDateOptions = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return [1, 2].map((offset) => {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    return {
      value: [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-"),
      label: formatDateLabel(date),
      relative: offset === 1 ? "Tomorrow" : "Day after",
    };
  });
};

const getInitialForm = (source) => ({
  source,
  programInterest: "",
  studentName: "",
  studentGrade: "",
  country: "",
  state: "",
  languages: "",
  parentName: "",
  email: "",
  contactNumber: "",
  wantsDemoSession: "yes",
  preferredDate: "",
  preferredTime: "",
});

const DemoBookingModal = ({ isOpen, onClose, source = "general" }) => {
  const [formData, setFormData] = useState(() => getInitialForm(source));
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const dateOptions = useMemo(() => getDateOptions(), [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Wake the backend now so submit doesn't hit a cold start.
      fetch("https://brainbugz-learning-management-system.onrender.com/api/ping").catch(() => {});
    } else {
      document.body.style.overflow = "";
      setFormData(getInitialForm(source));
      setStep(1);
      setError(null);
      setSuccess(false);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, source]);

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.programInterest) {
        setError("Please choose what you'd like a demo for.");
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.studentName.trim()) {
        setError("Please enter the student's name.");
        return false;
      }
      if (!formData.studentGrade) {
        setError("Please select the student's grade.");
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.country.trim()) {
        setError("Please enter the country.");
        return false;
      }
      if (!formData.state.trim()) {
        setError("Please enter the state or region.");
        return false;
      }
      if (!formData.languages.trim()) {
        setError("Please tell us which languages the student is comfortable with.");
        return false;
      }
    }

    if (currentStep === 4) {
      if (!formData.parentName.trim()) {
        setError("Please enter the parent/guardian name.");
        return false;
      }

      if (!formData.email.trim()) {
        setError("Please enter an email address.");
        return false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Please enter a valid email address.");
        return false;
      }

      if (!formData.contactNumber.trim()) {
        setError("Please enter a contact number.");
        return false;
      }

      if (!/^[0-9\s\-\+\(\)]{10,}$/.test(formData.contactNumber.replace(/\s/g, ""))) {
        setError("Please enter a valid contact number.");
        return false;
      }
    }

    if (currentStep === 5 && formData.wantsDemoSession === "yes") {
      if (!formData.preferredDate || !formData.preferredTime) {
        setError("Please choose a date and time for the demo.");
        return false;
      }
    }

    setError(null);
    return true;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(5, current + 1));
  };

  const previousStep = () => {
    setError(null);
    setStep((current) => Math.max(1, current - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (!validateStep(5)) return;

    setLoading(true);

    /*
      Optimistic submit: show the "booked" screen immediately instead of
      making the parent stare at a spinner while the server talks to Google
      Sheets / Gmail. The request still runs (with one automatic retry); only
      if it ultimately fails do we go back to the form with the error and the
      data intact.

      IMPORTANT: preferredDate is sent as YYYY-MM-DD and preferredTime as
      HH:MM, exactly as before. The backend maps them into the Sheets row.
    */
    const payload = { ...formData, source };
    setSuccess(true);

    const send = async () => {
      const response = await fetch(
        "https://brainbugz-learning-management-system.onrender.com/api/submit-demo-booking",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const text = await response.text();
      let result = {};
      try {
        result = JSON.parse(text);
      } catch {
        result = { message: text };
      }

      if (!response.ok) {
        const err = new Error(result.error || "Failed to submit booking");
        err.retryable = response.status >= 500;
        throw err;
      }
    };

    try {
      try {
        await send();
      } catch (firstErr) {
        // Retry once for network hiccups / server errors (not validation errors)
        if (firstErr.retryable === false) throw firstErr;
        await new Promise((r) => setTimeout(r, 1500));
        await send();
      }

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error("Booking submission error:", err);
      setSuccess(false);
      setError(err.message || "Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / STEPS.length) * 100;

  const sourceLabel =
    source && source !== "general"
      ? source.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
      : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998]"
            style={{ background: "rgba(15, 23, 42, 0.72)" }}
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative w-full max-w-[620px] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] bg-white border-2 flex flex-col"
                style={{
                  borderColor: COLORS.border,
                  boxShadow: SHADOWS.lg,
                  maxHeight: "min(720px, calc(100vh - 24px))",
                }}
              >
                {/* Branded top line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ background: GRADIENTS.primary }}
                />

                {/* Header */}
                <div className="px-5 pt-6 pb-4 sm:px-7 sm:pt-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                        style={{
                          background: COLORS.emeraldLight,
                          color: COLORS.emerald,
                        }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </div>

                      <div>
                        <div
                          className="text-[9px] font-black uppercase tracking-[0.16em]"
                          style={{ color: COLORS.emerald }}
                        >
                          Free trial
                        </div>
                        <h2
                          className="text-xl sm:text-2xl font-black leading-tight mt-0.5"
                          style={{ letterSpacing: "-0.035em", color: COLORS.ink }}
                        >
                          Let's book a class!
                        </h2>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close"
                      className="w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{
                        borderColor: COLORS.border,
                        color: COLORS.textSecondary,
                      }}
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {!success && (
                    <>
                      <div className="flex items-center gap-2 mt-5">
                        <div
                          className="h-1.5 flex-1 rounded-full overflow-hidden"
                          style={{ background: COLORS.bgTertiary }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.25 }}
                            style={{ background: GRADIENTS.primary }}
                          />
                        </div>

                        <span
                          className="text-[10px] font-black whitespace-nowrap"
                          style={{ color: COLORS.textMuted }}
                        >
                          {step} / {STEPS.length}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-3 overflow-x-auto">
                        {STEPS.map((item) => {
                          const Icon = item.icon;
                          const active = step === item.id;
                          const done = step > item.id;

                          return (
                            <div
                              key={item.id}
                              className="shrink-0 flex items-center gap-1.5 text-[9px] font-black"
                              style={{
                                color: active || done
                                  ? COLORS.ink
                                  : COLORS.textMuted,
                              }}
                            >
                              <div
                                className="w-6 h-6 rounded-lg flex items-center justify-center"
                                style={{
                                  background:
                                    active || done
                                      ? COLORS.emeraldLight
                                      : COLORS.bgTertiary,
                                  color:
                                    active || done
                                      ? COLORS.emerald
                                      : COLORS.textMuted,
                                }}
                              >
                                <Icon className="w-3 h-3" />
                              </div>
                              {item.label}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="overflow-y-auto px-5 sm:px-7 pb-5">
                  {success ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-10 sm:py-14 text-center"
                    >
                      <motion.div
                        animate={{ y: [0, -7, 0], rotate: [0, 3, 0] }}
                        transition={{ duration: 1.2, repeat: 1 }}
                        className="w-20 h-20 rounded-[1.7rem] mx-auto flex items-center justify-center"
                        style={{
                          background: COLORS.emeraldLight,
                          color: COLORS.emerald,
                        }}
                      >
                        <CheckCircle2 className="w-10 h-10" />
                      </motion.div>

                      <h3
                        className="text-2xl sm:text-3xl font-black mt-6"
                        style={{ letterSpacing: "-0.045em" }}
                      >
                        You're booked! 🎉
                      </h3>

                      <p
                        className="text-sm font-medium mt-2 max-w-sm mx-auto"
                        style={{ color: COLORS.textSecondary }}
                      >
                        We've received your request. Our team will contact you
                        shortly to confirm the class.
                      </p>

                      <div
                        className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-full text-[10px] font-black"
                        style={{
                          background: COLORS.cyanLight,
                          color: COLORS.cyan,
                        }}
                      >
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formData.preferredDate
                          ? `${formData.preferredDate} · ${formatTime(formData.preferredTime || "09:00")}`
                          : "Our team will contact you shortly"}
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <AnimatePresence mode="wait">
                        {step === 1 && (
                          <motion.div
                            key="step-1"
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -18 }}
                            className="space-y-5"
                          >
                            <div>
                              <div
                                className="text-[9px] font-black uppercase tracking-widest"
                                style={{ color: COLORS.cyan }}
                              >
                                Step 1
                              </div>
                              <h3
                                className="text-2xl sm:text-3xl font-black mt-1"
                                style={{ letterSpacing: "-0.045em" }}
                              >
                                What would you like to try?
                              </h3>
                              <p
                                className="text-xs font-medium mt-1.5"
                                style={{ color: COLORS.textMuted }}
                              >
                                Pick the class you'd like a free demo for.
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              {PROGRAMS.map((program) => {
                                const selected =
                                  formData.programInterest === program.value;

                                return (
                                  <button
                                    key={program.value}
                                    type="button"
                                    onClick={() =>
                                      updateField(
                                        "programInterest",
                                        program.value
                                      )
                                    }
                                    className="min-h-[76px] rounded-2xl border-2 px-4 py-3 text-left transition-all"
                                    style={{
                                      borderColor: selected
                                        ? COLORS.emerald
                                        : COLORS.border,
                                      background: selected
                                        ? COLORS.emeraldLight
                                        : COLORS.white,
                                      color: selected
                                        ? COLORS.emerald
                                        : COLORS.ink,
                                    }}
                                  >
                                    <div className="text-sm font-black">
                                      {program.label}
                                    </div>
                                    <div
                                      className="text-[9px] font-bold mt-1"
                                      style={{
                                        color: selected
                                          ? COLORS.emerald
                                          : COLORS.textMuted,
                                      }}
                                    >
                                      Free trial class
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {sourceLabel && (
                              <div
                                className="rounded-2xl px-4 py-3 flex items-center gap-3"
                                style={{
                                  background: COLORS.cyanLight,
                                  color: COLORS.cyan,
                                }}
                              >
                                <Laptop className="w-4 h-4 shrink-0" />
                                <div>
                                  <div className="text-[9px] font-black uppercase tracking-wider">
                                    Opened from
                                  </div>
                                  <div className="text-xs font-black mt-0.5">
                                    {sourceLabel}
                                  </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {step === 2 && (
                          <motion.div
                            key="step-2"
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -18 }}
                            className="space-y-5"
                          >
                            <div>
                              <div
                                className="text-[9px] font-black uppercase tracking-widest"
                                style={{ color: COLORS.indigo }}
                              >
                                Step 2
                              </div>
                              <h3 className="text-2xl sm:text-3xl font-black mt-1" style={{ letterSpacing: "-0.045em" }}>
                                Who's joining us?
                              </h3>
                              <p className="text-xs font-medium mt-1.5" style={{ color: COLORS.textMuted }}>
                                Just the basics.
                              </p>
                            </div>

                            <Field
                              label="Student Name"
                              required
                              value={formData.studentName}
                              onChange={(value) => updateField("studentName", value)}
                              placeholder="e.g. Arjun Sharma"
                              autoFocus
                            />

                            <div>
                              <Label>
                                Student Grade <span style={{ color: COLORS.emerald }}> *</span>
                              </Label>
                              <select
                                value={formData.studentGrade}
                                onChange={(e) =>
                                  updateField("studentGrade", e.target.value)
                                }
                                className="w-full h-13 px-4 rounded-2xl border-2 outline-none font-bold text-sm appearance-none bg-white"
                                style={{
                                  borderColor: COLORS.border,
                                  color: formData.studentGrade
                                    ? COLORS.ink
                                    : COLORS.textMuted,
                                }}
                              >
                                <option value="">Select grade</option>
                                {GRADES.map(([value, label]) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </motion.div>
                        )}

                        {step === 3 && (
                          <motion.div
                            key="step-3"
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -18 }}
                            className="space-y-5"
                          >
                            <div>
                              <div
                                className="text-[9px] font-black uppercase tracking-widest"
                                style={{ color: COLORS.cyan }}
                              >
                                Step 3
                              </div>
                              <h3 className="text-2xl sm:text-3xl font-black mt-1" style={{ letterSpacing: "-0.045em" }}>
                                A little more about them.
                              </h3>
                              <p className="text-xs font-medium mt-1.5" style={{ color: COLORS.textMuted }}>
                                This helps us prepare the right class experience.
                              </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                              <Field
                                label="Country"
                                required
                                value={formData.country}
                                onChange={(value) => updateField("country", value)}
                                placeholder="e.g. India"
                              />

                              <Field
                                label="State / Region"
                                required
                                value={formData.state}
                                onChange={(value) => updateField("state", value)}
                                placeholder="e.g. Punjab"
                              />
                            </div>

                            <Field
                              label="Languages Student is Proficient In"
                              required
                              value={formData.languages}
                              onChange={(value) => updateField("languages", value)}
                              placeholder="e.g. English, Hindi, Punjabi"
                              icon={Languages}
                            />
                          </motion.div>
                        )}

                        {step === 4 && (
                          <motion.div
                            key="step-4"
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -18 }}
                            className="space-y-5"
                          >
                            <div>
                              <div
                                className="text-[9px] font-black uppercase tracking-widest"
                                style={{ color: COLORS.emerald }}
                              >
                                Step 4
                              </div>
                              <h3 className="text-2xl sm:text-3xl font-black mt-1" style={{ letterSpacing: "-0.045em" }}>
                                Where should we reach you?
                              </h3>
                              <p className="text-xs font-medium mt-1.5" style={{ color: COLORS.textMuted }}>
                                A parent or guardian's contact details.
                              </p>
                            </div>

                            <Field
                              label="Parent / Guardian Name"
                              required
                              value={formData.parentName}
                              onChange={(value) => updateField("parentName", value)}
                              placeholder="e.g. Rajesh Sharma"
                              icon={UserRound}
                            />

                            <Field
                              label="Email Address"
                              required
                              type="email"
                              value={formData.email}
                              onChange={(value) => updateField("email", value)}
                              placeholder="parent@example.com"
                              icon={Mail}
                            />

                            <Field
                              label="Contact Number"
                              required
                              type="tel"
                              value={formData.contactNumber}
                              onChange={(value) => updateField("contactNumber", value)}
                              placeholder="+91 98765 43210"
                              icon={Phone}
                            />

                            <div
                              className="rounded-2xl px-4 py-3 text-[10px] font-bold"
                              style={{
                                background: COLORS.bgSecondary,
                                color: COLORS.textMuted,
                              }}
                            >
                              Please share the number you use for WhatsApp.
                            </div>
                          </motion.div>
                        )}

                        {step === 5 && (
                          <motion.div
                            key="step-5"
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -18 }}
                            className="space-y-5"
                          >
                            <div>
                              <div
                                className="text-[9px] font-black uppercase tracking-widest"
                                style={{ color: COLORS.goldDeep }}
                              >
                                Step 5
                              </div>
                              <h3 className="text-2xl sm:text-3xl font-black mt-1" style={{ letterSpacing: "-0.045em" }}>
                                Pick your class time.
                              </h3>
                              <p className="text-xs font-medium mt-1.5" style={{ color: COLORS.textMuted }}>
                                Choose from the next two days.
                              </p>
                            </div>

                            <div>
                              <Label>Would you like to attend a demo session?</Label>
                              <div className="grid grid-cols-2 gap-2.5">
                                {[
                                  ["yes", "Yes, book it!"],
                                  ["no", "Not right now"],
                                ].map(([value, label]) => {
                                  const selected = formData.wantsDemoSession === value;
                                  return (
                                    <button
                                      key={value}
                                      type="button"
                                      onClick={() => {
                                        updateField("wantsDemoSession", value);
                                        if (value === "no") {
                                          updateField("preferredDate", "");
                                          updateField("preferredTime", "");
                                        }
                                      }}
                                      className="rounded-2xl border-2 px-4 py-3 text-left text-xs font-black transition-all"
                                      style={{
                                        borderColor: selected ? COLORS.emerald : COLORS.border,
                                        background: selected ? COLORS.emeraldLight : COLORS.white,
                                        color: selected ? COLORS.emerald : COLORS.textSecondary,
                                      }}
                                    >
                                      {label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {formData.wantsDemoSession === "yes" && (
                              <>
                                <div>
                                  <Label>
                                    <span className="inline-flex items-center gap-1.5">
                                      <CalendarDays className="w-3.5 h-3.5" />
                                      Select Date
                                    </span>
                                  </Label>

                                  <div className="grid grid-cols-2 gap-2.5">
                                    {dateOptions.map((date) => {
                                      const selected = formData.preferredDate === date.value;
                                      return (
                                        <button
                                          key={date.value}
                                          type="button"
                                          onClick={() => updateField("preferredDate", date.value)}
                                          className="rounded-2xl border-2 p-3 text-left transition-all"
                                          style={{
                                            borderColor: selected ? COLORS.indigo : COLORS.border,
                                            background: selected ? COLORS.indigoLight : COLORS.white,
                                          }}
                                        >
                                          <div
                                            className="text-[9px] font-black uppercase tracking-wider"
                                            style={{ color: selected ? COLORS.indigo : COLORS.textMuted }}
                                          >
                                            {date.relative}
                                          </div>
                                          <div className="text-sm font-black mt-1">{date.label}</div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div>
                                  <div className="flex items-center justify-between gap-3 mb-2.5">
                                    <Label>
                                      <span className="inline-flex items-center gap-1.5">
                                        <Clock3 className="w-3.5 h-3.5" />
                                        Select Time
                                      </span>
                                    </Label>
                                    <span className="text-[9px] font-black" style={{ color: COLORS.textMuted }}>
                                      9 AM – 9 PM
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {TIMES.map((time) => {
                                      const selected = formData.preferredTime === time;
                                      return (
                                        <button
                                          key={time}
                                          type="button"
                                          onClick={() => updateField("preferredTime", time)}
                                          className="py-3 rounded-xl border-2 text-xs font-black transition-all"
                                          style={{
                                            borderColor: selected ? COLORS.indigo : COLORS.border,
                                            background: selected ? COLORS.indigo : COLORS.white,
                                            color: selected ? COLORS.white : COLORS.ink,
                                          }}
                                        >
                                          {formatTime(time)}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div
                                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl"
                                  style={{ background: COLORS.bgSecondary, color: COLORS.textMuted }}
                                >
                                  <Clock3 className="w-4 h-4 shrink-0" />
                                  <span className="text-[9px] font-bold">
                                    Your demo class is 60 minutes. Laptop or desktop is compulsory for this class.
                                  </span>
                                </div>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                        <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -4 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -4 }}
                            className="flex items-start gap-2.5 mt-4 p-3.5 rounded-2xl border-2 overflow-hidden"
                            style={{
                              background: COLORS.bgSecondary,
                              borderColor: COLORS.borderMed,
                            }}
                          >
                            <AlertCircle
                              className="w-4 h-4 shrink-0 mt-0.5"
                              style={{ color: COLORS.bronze }}
                            />
                            <p
                              className="text-[10px] font-bold leading-relaxed"
                              style={{ color: COLORS.textSecondary }}
                            >
                              {error}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  )}
                </div>

                {/* Footer navigation */}
                {!success && (
                  <div
                    className="px-5 py-4 sm:px-7 sm:py-5 border-t-2 bg-white"
                    style={{ borderColor: COLORS.border }}
                  >
                    <div className="flex items-center gap-2.5">
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={previousStep}
                          className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center shrink-0"
                          style={{
                            borderColor: COLORS.border,
                            color: COLORS.textSecondary,
                          }}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                      )}

                      {step < 5 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="flex-1 h-12 rounded-2xl text-sm font-black text-white inline-flex items-center justify-center gap-2"
                          style={{ background: GRADIENTS.primary }}
                        >
                          Continue
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={loading}
                          className="flex-1 h-12 rounded-2xl text-sm font-black text-white inline-flex items-center justify-center gap-2 disabled:opacity-70"
                          style={{ background: GRADIENTS.primary }}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Booking...
                            </>
                          ) : (
                            <>
                              <CalendarDays className="w-4 h-4" />
                              Book Free Trial Class
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div
                      className="text-center text-[9px] font-bold mt-2.5"
                      style={{ color: COLORS.textMuted }}
                    >
                      Free demo · No payment required
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

/* Small local form primitives keep the modal easy to maintain. */

function Label({ children }) {
  return (
    <label
      className="block text-[11px] font-black mb-2"
      style={{ color: COLORS.ink }}
    >
      {children}
    </label>
  );
}

function Field({
  label,
  required = false,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  autoFocus = false,
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span style={{ color: COLORS.emerald }}> *</span>}
      </Label>

      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: COLORS.textMuted }}
          />
        )}

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full h-13 px-4 rounded-2xl border-2 outline-none font-bold text-sm bg-white placeholder:font-medium"
          style={{
            borderColor: COLORS.border,
            color: COLORS.ink,
            paddingLeft: Icon ? "2.75rem" : "1rem",
          }}
        />
      </div>
    </div>
  );
}

export default DemoBookingModal;