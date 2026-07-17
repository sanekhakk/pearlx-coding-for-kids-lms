import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, AlertCircle, Calendar, Clock } from "lucide-react";

const DemoBookingModal = ({ isOpen, onClose, source = "general" }) => {
  const [formData, setFormData] = useState({
    source: source,
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
  

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showDateTimeFields, setShowDateTimeFields] = useState(formData.wantsDemoSession === "yes");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset form on close
      setFormData({
        source: source,
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
      setError(null);
      setSuccess(false);
      setShowDateTimeFields(true);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, source]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Show/hide date and time fields based on demo session preference
    if (name === "wantsDemoSession") {
      setShowDateTimeFields(value === "yes");
      if (value === "no") {
        setFormData(prev => ({
          ...prev,
          preferredDate: "",
          preferredTime: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const requiredFields = ["programInterest", "studentName", "studentGrade", "country", "state", "languages", "parentName", "email", "contactNumber"];
    
    for (let field of requiredFields) {
      if (!formData[field]?.trim()) {
        setError(`${field.replace(/([A-Z])/g, " $1").trim()} is required`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(formData.contactNumber.replace(/\s/g, ""))) {
      setError("Please enter a valid contact number");
      return false;
    }

    // If demo session is wanted, check date and time
    if (formData.wantsDemoSession === "yes") {
      if (!formData.preferredDate || !formData.preferredTime) {
        setError("Please select preferred date and time for the demo session");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  setError(null);

  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    // backend URL
    const response = await fetch(
  "https://brainbugz-learning-management-system.onrender.com/api/submit-demo-booking",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }
);

const text = await response.text();

let result = {};

try {
  result = JSON.parse(text);
} catch {
  result = { message: text };
}

console.log("API RESPONSE:", result);

if (!response.ok) {
  throw new Error(result.error || "Failed to submit booking");
}

setSuccess(true);

    setTimeout(() => {
      onClose();
    }, 3000);

  } catch (err) {
    console.error("Booking submission error:", err);

    setError(
      err.message ||
      "Failed to submit booking. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9998]"
            style={{ background: "rgba(10, 15, 30, 0.78)" }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.94, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative w-full max-w-xl pointer-events-auto"
              style={{ maxHeight: "90vh" }}
              onClick={e => e.stopPropagation()}
            >
              <div
                className="relative  bg-white flex flex-col"
                style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.08)", maxHeight: "85vh" }}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 z-10"
                  style={{ background: "linear-gradient(90deg, #0EA5E9, #10B981)" }}
                />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="overflow-y-auto flex-1 p-8 md:p-10">
                  {/* Success State */}
                  {success ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
                      >
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed! ✨</h3>
                      <p className="text-slate-600 mb-2">
                        We've received your demo class booking request
                      </p>
                      <p className="text-sm text-slate-500">
                        Our team will contact you shortly to confirm your session details.
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      {/* Header */}
                      <div className="mb-5">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="inline-flex items-center justify-center w-11 h-11 rounded-2xl mb-3"
                          style={{
                            background: "linear-gradient(135deg, #e0f9f4, #e0f2fe)",
                            border: "1px solid rgba(16,185,129,0.2)",
                          }}
                        >
                          <Calendar className="w-7 h-7 text-emerald-600" />
                        </motion.div>
                        <h2 className="text-2xl font-extrabold mb-1 text-slate-900 tracking-tight">
                          🚀 Launch Your Coding Journey
                        </h2>
                        <p className="text-slate-600 font-medium">
                          Book your free demo class and discover how we help kids become confident coders!
                        </p>
                      </div>

                      {/* Error Message */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.18 }}
                            className="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-red-50 border border-red-100 overflow-hidden"
                          >
                            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
                            <p className="text-sm font-semibold text-red-700">{error}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Source (hidden/info field) */}
                        {source !== "general" && (
                          <div className="px-4 py-3 rounded-xl text-sm font-medium bg-blue-50 border border-blue-100 text-blue-700">
                            Interest: <span className="font-bold capitalize">{source.replace("_", " ")}</span>
                          </div>
                        )}

                        {/* What are they booking a demo for? */}
                        <div>
                          <label className="block text-sm font-bold mb-3 text-slate-700">
                            What would you like a demo for? *
                          </label>
                          <div className="grid gap-3 sm:grid-cols-3">
                            {[
                              { value: "coding", label: "Coding Classes" },
                              { value: "academic_tuition", label: "Academic Tuition (Class 1–12)" },
                              { value: "courses", label: "Courses" },
                            ].map(option => (
                              <label
                                key={option.value}
                                className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-xl border text-sm font-semibold transition-colors"
                                style={{
                                  background: formData.programInterest === option.value ? "#e0f9f4" : "#f8fafc",
                                  borderColor: formData.programInterest === option.value ? "#10B981" : "#e2e8f0",
                                  color: formData.programInterest === option.value ? "#047857" : "#334155",
                                }}
                              >
                                <input
                                  type="radio"
                                  name="programInterest"
                                  value={option.value}
                                  checked={formData.programInterest === option.value}
                                  onChange={handleInputChange}
                                  className="w-4 h-4"
                                />
                                {option.label}
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Row 1: Student Name & Grade */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold mb-2 text-slate-700">
                              Student Name *
                            </label>
                            <input
                              type="text"
                              name="studentName"
                              value={formData.studentName}
                              onChange={handleInputChange}
                              placeholder="e.g., Arjun Sharma"
                              className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition-colors focus:bg-white focus:border-cyan-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold mb-2 text-slate-700">
                              Student Grade *
                            </label>
                            <select
                              name="studentGrade"
                              value={formData.studentGrade}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 outline-none transition-colors focus:bg-white focus:border-cyan-500"
                            >
                              <option value="">Select grade</option>
                              <option value="K">Kindergarten</option>
                              <option value="1">Grade 1</option>
                              <option value="2">Grade 2</option>
                              <option value="3">Grade 3</option>
                              <option value="4">Grade 4</option>
                              <option value="5">Grade 5</option>
                              <option value="6">Grade 6</option>
                              <option value="7">Grade 7</option>
                              <option value="8">Grade 8</option>
                              <option value="9">Grade 9</option>
                              <option value="10">Grade 10</option>
                              <option value="11">Grade 11</option>
                              <option value="12">Grade 12</option>
                            </select>
                          </div>
                        </div>

                        {/* Row 2: Country & State */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold mb-2 text-slate-700">
                              Country *
                            </label>
                            <input
                              type="text"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              placeholder="e.g., India"
                              className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition-colors focus:bg-white focus:border-cyan-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold mb-2 text-slate-700">
                              State/Region *
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              placeholder="e.g., Punjab"
                              className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition-colors focus:bg-white focus:border-cyan-500"
                            />
                          </div>
                        </div>

                        {/* Languages */}
                        <div>
                          <label className="block text-sm font-bold mb-2 text-slate-700">
                            Languages Student is Proficient In *
                          </label>
                          <input
                            type="text"
                            name="languages"
                            value={formData.languages}
                            onChange={handleInputChange}
                            placeholder="e.g., English, Hindi, Punjabi"
                            className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition-colors focus:bg-white focus:border-cyan-500"
                          />
                        </div>

                        {/* Row 3: Parent Name & Email */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold mb-2 text-slate-700">
                              Parent/Guardian Name *
                            </label>
                            <input
                              type="text"
                              name="parentName"
                              value={formData.parentName}
                              onChange={handleInputChange}
                              placeholder="e.g., Rajesh Sharma"
                              className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition-colors focus:bg-white focus:border-cyan-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold mb-2 text-slate-700">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="parent@example.com"
                              className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition-colors focus:bg-white focus:border-cyan-500"
                            />
                          </div>
                        </div>

                        {/* Contact Number */}
                        <div>
                          <label className="block text-sm font-bold mb-2 text-slate-700">
                            Contact Number *
                          </label>
                          <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition-colors focus:bg-white focus:border-cyan-500"
                          />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-200 my-6" />

                        {/* Demo Session Question */}
                        <div>
                          <label className="block text-sm font-bold mb-3 text-slate-700">
                            Would you like to attend a demo session? *
                          </label>
                          <div className="flex gap-4">
                            {["yes", "no"].map(option => (
                              <label key={option} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="wantsDemoSession"
                                  value={option}
                                  checked={formData.wantsDemoSession === option}
                                  onChange={handleInputChange}
                                  className="w-4 h-4"
                                />
                                <span className="text-sm font-medium text-slate-700 capitalize">
                                  {option === "yes" ? "Yes, I want a demo!" : "Not right now"}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Conditional: Date & Time fields */}
                        {showDateTimeFields && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-bold mb-2 text-slate-700 flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Preferred Date *
                                </label>
                                <input
                                  type="date"
                                  name="preferredDate"
                                  value={formData.preferredDate}
                                  onChange={handleInputChange}
                                  min={new Date().toISOString().split("T")[0]}
                                  className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 outline-none transition-colors focus:bg-white focus:border-cyan-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold mb-2 text-slate-700 flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  Preferred Time *
                                </label>
                                <input
                                  type="time"
                                  name="preferredTime"
                                  value={formData.preferredTime}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 outline-none transition-colors focus:bg-white focus:border-cyan-500"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-opacity mt-4"
                          style={{
                            background: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
                            boxShadow: "0 6px 20px rgba(16,185,129,0.28)",
                          }}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Booking...
                            </>
                          ) : (
                            "Complete Your Booking 🎉"
                          )}
                        </motion.button>

                        <p className="text-xs text-center text-slate-500 mt-4">
                          Your information is safe with us. We'll contact you within 24 hours.
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DemoBookingModal;