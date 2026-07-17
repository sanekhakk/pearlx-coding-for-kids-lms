import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { X, Loader2, Mail, Lock, AlertCircle, CheckCircle2, GraduationCap } from "lucide-react";

const AuthModal = () => {
  const { showLoginModal, modalRole, closeLoginModal, loginUser, sendPasswordReset } = useAuth();

  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [resetMode, setResetMode] = useState(false);

  useEffect(() => {
    setEmail(""); setPassword(""); setError(null); setSuccess(null); setLoading(false);
    if (!showLoginModal) setResetMode(false);
  }, [showLoginModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showLoginModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showLoginModal]);

  const handleLogin = async (e) => {
    e.preventDefault(); setError(null); setLoading(true);
    const res = await loginUser(email, password);
    setLoading(false);
    if (!res.success) setError(res.error || "Login failed");
  };

  const handleReset = async (e) => {
    e.preventDefault(); setError(null); setLoading(true);
    const res = await sendPasswordReset(email);
    setLoading(false);
    if (res.success) {
      setSuccess(res.message);
      setTimeout(() => setResetMode(false), 3000);
    } else {
      setError(res.error);
    }
  };

  const subtitle = modalRole === "tutor"
    ? "Access your teaching dashboard"
    : "Continue your learning journey";

  return (
    <AnimatePresence>
      {showLoginModal && (
        <>
          {/* Overlay — NO backdropFilter blur, just opacity */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9998]"
            style={{ background: "rgba(10, 15, 30, 0.78)" }}
            onClick={closeLoginModal}
          />

          
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.94, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative w-full max-w-md pointer-events-auto"
              onClick={e => e.stopPropagation()}
            >
              <div
                className="relative rounded-3xl overflow-hidden bg-white border border-slate-100"
                style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.08)" }}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 z-10"
                  style={{ background: "linear-gradient(90deg, #0EA5E9, #10B981)" }}
                />

                
                <div
                  className="absolute top-0 right-0 w-56 h-56 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
                    transform: "translate(30%, -30%)",
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
                    transform: "translate(-30%, 30%)",
                  }}
                />

                <div className="p-8 relative z-10">
                  {/* Close Button */}
                  <button
                    onClick={closeLoginModal}
                    className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Header */}
                  <div className="text-center mb-8">
                    <div
                      className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                      style={{
                        background: "linear-gradient(135deg, #e0f9f4, #e0f2fe)",
                        border: "1px solid rgba(16,185,129,0.2)",
                      }}
                    >
                      {resetMode
                        ? <Lock className="w-7 h-7 text-cyan-600" />
                        : <GraduationCap className="w-7 h-7 text-emerald-600" />
                      }
                    </div>
                    <h2 className="text-2xl font-extrabold mb-1.5 text-slate-900 tracking-tight">
                      {resetMode ? "Reset Password" : "Welcome back"}
                    </h2>
                    <p className="text-sm font-medium text-slate-500">
                      {resetMode ? "Enter your email to receive a reset link" : subtitle}
                    </p>
                  </div>

                  {/* Status Messages */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="flex items-start gap-3 p-4 mb-5 rounded-2xl bg-red-50 border border-red-100 overflow-hidden"
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
                        <p className="text-sm font-semibold text-red-700">{error}</p>
                      </motion.div>
                    )}
                    {success && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="flex items-start gap-3 p-4 mb-5 rounded-2xl bg-emerald-50 border border-emerald-100 overflow-hidden"
                      >
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                        <p className="text-sm font-semibold text-emerald-700">{success}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form */}
                  <form onSubmit={resetMode ? handleReset : handleLogin} className="space-y-5">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-700">
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition-colors focus:bg-white focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    {!resetMode && (
                      <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition-colors focus:bg-white focus:border-cyan-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-opacity"
                      style={{
                        background: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
                        boxShadow: "0 6px 20px rgba(16,185,129,0.28)",
                      }}
                    >
                      {loading
                        ? <Loader2 className="w-5 h-5 animate-spin" />
                        : resetMode ? "Send Reset Link" : "Log In"
                      }
                    </button>
                  </form>

                  {/* Footer */}
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => { setResetMode(!resetMode); setError(null); setSuccess(null); }}
                      className="text-sm font-bold text-slate-500 hover:text-cyan-600 transition-colors"
                    >
                      {resetMode ? "← Back to login" : "Forgot your password?"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;