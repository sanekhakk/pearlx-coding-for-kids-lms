import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { X, Loader2, Mail, Lock, AlertCircle, CheckCircle2, GraduationCap, ArrowRight } from "lucide-react";
import { COLORS, FONTS, BRAND } from "../utils/theme";
import { Pearl } from "./ui/Brand";

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

  const inputCls =
    "w-full pl-12 pr-4 py-3.5 rounded-2xl text-[15px] font-semibold bg-slate-50 text-slate-900 placeholder-slate-400 outline-none transition-all border-2 border-slate-200 focus:border-sky-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(14,165,233,0.15)]";

  return (
    <AnimatePresence>
      {showLoginModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9998]"
            style={{ background: "rgba(11, 17, 32, 0.72)" }}
            onClick={closeLoginModal}
          />

          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, y: 24, opacity: 0, rotate: -1 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.94, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className="relative w-full max-w-md pointer-events-auto"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="pearlx-auth-title"
            >
              <div
                className="relative rounded-[2rem] overflow-hidden bg-white"
                style={{ border: "3px solid #fff", boxShadow: `0 10px 0 ${COLORS.emerald}, 0 30px 70px rgba(0,0,0,0.3)` }}
              >
                {/* Header band */}
                <div className="relative overflow-hidden px-8 pt-8 pb-14 text-center" style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)" }}>
                  <div aria-hidden="true" className="absolute inset-0 px-dots opacity-40" style={{ filter: "invert(1)" }} />
                  <Pearl size={26} color={COLORS.gold} style={{ top: 18, left: 26 }} float />

                  <button
                    onClick={closeLoginModal}
                    aria-label="Close"
                    className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5" strokeWidth={2.6} />
                  </button>

                  <div
                    className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white mb-4"
                    style={{ transform: "rotate(-6deg)", boxShadow: "0 5px 0 rgba(0,0,0,0.15)" }}
                  >
                    {resetMode
                      ? <Lock className="w-8 h-8" style={{ color: COLORS.cyan }} />
                      : <GraduationCap className="w-8 h-8" style={{ color: COLORS.emerald }} />
                    }
                  </div>
                  <h2 id="pearlx-auth-title" className="relative text-3xl font-semibold text-white" style={{ fontFamily: FONTS.display }}>
                    {resetMode ? "Reset Password" : "Welcome back"}
                  </h2>
                  <p className="relative mt-1 text-[15px] font-bold text-white/90">
                    {resetMode ? "Enter your email to receive a reset link" : subtitle}
                  </p>
                </div>

                {/* wave into body */}
                <svg aria-hidden="true" viewBox="0 0 400 30" preserveAspectRatio="none" className="block w-full h-[30px] -mt-[30px] relative">
                  <path d="M0 18 C 80 34, 150 2, 220 14 S 340 30, 400 10 L400 30 L0 30 Z" fill="#fff" />
                </svg>

                <div className="px-7 sm:px-8 pb-8 pt-3 relative">
                  {/* Status Messages */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="flex items-start gap-3 p-4 mb-5 rounded-2xl bg-red-50 border-2 border-red-100 overflow-hidden"
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
                        <p className="text-sm font-bold text-red-700">{error}</p>
                      </motion.div>
                    )}
                    {success && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="flex items-start gap-3 p-4 mb-5 rounded-2xl bg-emerald-50 border-2 border-emerald-100 overflow-hidden"
                      >
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                        <p className="text-sm font-bold text-emerald-700">{success}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={resetMode ? handleReset : handleLogin} className="space-y-5">
                    <div>
                      <label className="block text-sm font-extrabold mb-2 text-slate-700">Email address</label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: COLORS.cyanLight }}>
                          <Mail className="w-4 h-4" style={{ color: COLORS.cyan }} />
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    {!resetMode && (
                      <div>
                        <label className="block text-sm font-extrabold mb-2 text-slate-700">Password</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: COLORS.emeraldLight }}>
                            <Lock className="w-4 h-4" style={{ color: COLORS.emerald }} />
                          </span>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className={inputCls}
                          />
                        </div>
                      </div>
                    )}

                    <button type="submit" disabled={loading} className="px-btn px-btn--grad px-btn--block px-btn--lg">
                      {loading
                        ? <Loader2 className="w-5 h-5 animate-spin" />
                        : <>{resetMode ? "Send Reset Link" : "Log In"} <ArrowRight className="w-5 h-5" /></>
                      }
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => { setResetMode(!resetMode); setError(null); setSuccess(null); }}
                      className="text-sm font-extrabold text-slate-500 hover:text-sky-600 transition-colors"
                    >
                      {resetMode ? "← Back to login" : "Forgot your password?"}
                    </button>
                  </div>

                  <p className="mt-5 text-center text-xs font-bold" style={{ color: COLORS.emerald, fontFamily: FONTS.display }}>
                    {BRAND.tagline}
                  </p>
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