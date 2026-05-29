// src/components/NavBar.jsx - WITH COURSES LINK
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Sparkles } from "lucide-react";
import PearlxLogo from "../assets/flat_logo_dark.webp";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Coding for Kids", to: "/services/education" },
  { label: "Courses", to: "/courses" },
  { label: "Academic Tuition", to: "/services/academic-tuition" },
  { label: "Pricing", to: "/pricing" },
  { label: "Web Dev", to: "/services/web-development" },
];

// ✅ Accept openDemoModal as prop
const NavBar = ({ openDemoModal }) => {
  const { role = "guest", logout, openLoginModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
      >
        <div className="max-w-7xl mx-auto relative">
          {/* Neon underline on scroll */}
          <AnimatePresence>
            {scrolled && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                className="absolute -bottom-px left-12 right-12 h-px"
                style={{ background: "linear-gradient(90deg, transparent, #10B981, #0EA5E9, transparent)", filter: "blur(1px)" }}
              />
            )}
          </AnimatePresence>

          <div
            className="flex items-center justify-between px-6 py-3 mt-15 rounded-2xl relative overflow-hidden"
            style={{
              background: scrolled ? "rgba(10,14,28,0.88)" : "rgba(10,14,28,0.96)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: scrolled ? "0 24px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.07)" : "0 12px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06)",
              transition: "all 0.35s ease",
            }}
          >
            {/* Animated top shimmer */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.6), rgba(14,165,233,0.6), transparent)" }}
            />

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 z-10">
              <img src={PearlxLogo} alt="Pearlx" className="h-12 w-auto object-contain" style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.25))" }} />
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1 z-10">
              {navLinks.map(link => {
                const isActive = location.pathname === link.to;
                // Highlight "Courses" with a special accent
                const isCourses = link.to === "/courses";
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 group"
                    style={{ color: isActive ? "#fff" : isCourses ? "rgba(167,139,250,0.9)" : "rgba(255,255,255,0.6)" }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    {/* "Courses" gets a subtle pill highlight */}
                    {isCourses && !isActive && (
                      <span className="absolute inset-0 rounded-xl"
                        style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)" }} />
                    )}
                    <span className="relative z-10">{link.label}</span>
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300"
                      style={{
                        background: isCourses
                          ? "linear-gradient(90deg, #A78BFA, #0EA5E9)"
                          : "linear-gradient(90deg, #10B981, #0EA5E9)",
                        width: isActive ? "60%" : "0%",
                        filter: "blur(0.5px)",
                        boxShadow: isActive ? "0 0 8px rgba(16,185,129,0.7)" : "none",
                      }}
                    />
                  </Link>
                );
              })}
            </div>

            {/* CTA right */}
            <div className="hidden md:flex items-center gap-4 z-10">
              {role === "guest" ? (
                <>
                  <button
                    onClick={() => openLoginModal("student")}
                    className="text-sm font-semibold transition-colors cursor-pointer"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                  >
                    Log in
                  </button>
                  <motion.button
                    onClick={() => openDemoModal("Demo")}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(16,185,129,0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-900 border-none cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)", boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}
                  >
                    <Sparkles className="w-4 h-4" /> Start Free Trial
                  </motion.button>
                </>
              ) : (
                <button
                  onClick={logout}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold border transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}
                >
                  Dashboard
                </button>
              )}
            </div>

            {/* Mobile toggle */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2 rounded-xl z-10"
              style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}
            >
              <AnimatePresence mode="wait">
                {isOpen
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X className="w-5 h-5" /></motion.span>
                  : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu className="w-5 h-5" /></motion.span>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="fixed top-24 left-4 right-4 z-40 rounded-2xl p-6 shadow-2xl"
            style={{ background: "rgba(10,14,28,0.97)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
              style={{ background: "linear-gradient(90deg, transparent, #10B981, #0EA5E9, transparent)" }} />

            <div className="space-y-1 mb-6">
              {navLinks.map((link, i) => {
                const isCourses = link.to === "/courses";
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200"
                      style={{
                        color: location.pathname === link.to ? "#fff" : isCourses ? "rgba(167,139,250,0.9)" : "rgba(255,255,255,0.6)",
                        background: location.pathname === link.to ? "rgba(255,255,255,0.08)" : isCourses ? "rgba(167,139,250,0.07)" : "transparent",
                        border: isCourses && location.pathname !== link.to ? "1px solid rgba(167,139,250,0.15)" : "1px solid transparent",
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-4 border-t flex flex-col gap-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <button
                onClick={() => { openLoginModal("student"); setIsOpen(false); }}
                className="w-full py-3 rounded-xl font-bold border"
                style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.15)" }}
              >
                Log in
              </button>
              <button
                onClick={() => { openDemoModal("demo"); setIsOpen(false); }}
                className="w-full py-3 rounded-xl font-bold text-slate-900 border-none cursor-pointer"
                style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)" }}
              >
                Start Free Trial 🚀
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;