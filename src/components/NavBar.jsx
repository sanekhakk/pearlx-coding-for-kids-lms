import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Sparkles, Home, Code2, Calculator, Rocket, BookOpen, Tag, LogIn } from "lucide-react";
import PearlxLogo from "/pearlxlogo.webp";
import { COLORS, FONTS, edgeOf } from "../utils/theme";
import { OFFER_BAR_HEIGHT } from "./OfferCarousel";

const navLinks = [
  { label: "Home", to: "/", Icon: Home, color: COLORS.cyan },
  { label: "Coding", to: "/services/education", Icon: Code2, color: COLORS.emerald },
  { label: "math", to: "/mathsclasses", Icon: Calculator, color: COLORS.gold },
  { label: "Courses", to: "/courses", Icon: Rocket, color: COLORS.indigo },
  { label: "Academic Tuition", to: "/services/academic-tuition", Icon: BookOpen, color: COLORS.cyan },
  { label: "Pricing", to: "/pricing", Icon: Tag, color: COLORS.bronze },
];

const NavBar = ({ openDemoModal }) => {
  const { role = "guest", logout, openLoginModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    h();
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed left-0 right-0 z-50 px-3 sm:px-4"
        style={{ top: OFFER_BAR_HEIGHT + 10 }}
        aria-label="Main navigation"
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between gap-3 rounded-full bg-white pl-4 pr-2 sm:pl-6 py-2 transition-all duration-300"
          style={{
            border: "2px solid rgba(15,23,42,0.08)",
            boxShadow: scrolled ? "0 6px 0 rgba(15,23,42,0.07), 0 18px 40px rgba(15,23,42,0.08)" : "0 5px 0 rgba(15,23,42,0.06)",
          }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0" aria-label="Pearlx home">
            <img src={PearlxLogo} alt="Pearlx — Where Little Gems Shine" className="h-10 sm:h-12 w-auto object-contain" />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ label, to, Icon, color }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={label}
                  to={to}
                  className="group relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[15px] font-semibold capitalize transition-colors duration-200"
                  style={{ fontFamily: FONTS.display, color: isActive ? "#fff" : COLORS.textSecondary }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: color, boxShadow: `0 3px 0 ${edgeOf(color)}` }}
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <Icon
                    className="relative z-10 w-4 h-4 transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110"
                    style={{ color: isActive ? "#fff" : color }}
                    strokeWidth={2.5}
                  />
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA right */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {role === "guest" ? (
              <>
                <button
                  onClick={() => openLoginModal("student")}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[15px] font-semibold transition-colors hover:bg-slate-100"
                  style={{ fontFamily: FONTS.display, color: COLORS.ink }}
                >
                  <LogIn className="w-4 h-4" /> Log in
                </button>
                <button onClick={() => openDemoModal("Demo")} className="px-btn px-btn--grad px-btn--sm">
                  <Sparkles className="w-4 h-4" /> Start Free Trial
                </button>
              </>
            ) : (
              <button onClick={logout} className="px-btn px-btn--white px-btn--sm">
                Dashboard
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="lg:hidden w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{ background: isOpen ? COLORS.ink : COLORS.cyanLight, color: isOpen ? "#fff" : COLORS.cyan }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <X className="w-5 h-5" strokeWidth={2.6} />
                </motion.span>
              ) : (
                <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <Menu className="w-5 h-5" strokeWidth={2.6} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 lg:hidden"
              style={{ background: "rgba(11,17,32,0.35)" }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.97 }}
              transition={{ type: "spring", damping: 26, stiffness: 340 }}
              className="fixed left-3 right-3 z-40 rounded-[2rem] bg-white p-4 lg:hidden"
              style={{
                top: OFFER_BAR_HEIGHT + 84,
                border: "2px solid rgba(15,23,42,0.08)",
                boxShadow: "0 8px 0 rgba(15,23,42,0.08), 0 30px 60px rgba(15,23,42,0.18)",
              }}
            >
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {navLinks.map(({ label, to, Icon, color }, i) => {
                  const isActive = location.pathname === to;
                  return (
                    <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <Link
                        to={to}
                        onClick={() => setIsOpen(false)}
                        className="flex flex-col items-start gap-2 rounded-3xl p-3.5 capitalize"
                        style={{
                          background: isActive ? color : `${color}12`,
                          color: isActive ? "#fff" : COLORS.ink,
                          border: `2px solid ${isActive ? color : `${color}25`}`,
                          boxShadow: isActive ? `0 4px 0 ${edgeOf(color)}` : "none",
                        }}
                      >
                        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: isActive ? "rgba(255,255,255,0.25)" : "#fff", color: isActive ? "#fff" : color }}>
                          <Icon className="w-5 h-5" strokeWidth={2.4} />
                        </span>
                        <span className="text-[15px] font-semibold leading-tight" style={{ fontFamily: FONTS.display }}>{label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 pt-1">
                <button onClick={() => { openLoginModal("student"); setIsOpen(false); }} className="px-btn px-btn--white px-btn--block">
                  <LogIn className="w-4 h-4" /> Log in
                </button>
                <button onClick={() => { openDemoModal("demo"); setIsOpen(false); }} className="px-btn px-btn--grad px-btn--block">
                  Start Free Trial 🚀
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;