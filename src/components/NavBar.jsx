import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Home, Code2, Calculator, Rocket, BookOpen, Tag, LogIn, ChevronRight } from "lucide-react";
import PearlxLogo from "/pearlxlogo.webp";
import { COLORS } from "../utils/theme";
import { OFFER_BAR_HEIGHT } from "./OfferCarousel";

const navLinks = [
  { label: "Home", to: "/", Icon: Home, color: COLORS.cyan },
  { label: "Coding", to: "/services/education", Icon: Code2, color: COLORS.emerald },
  { label: "math", to: "/mathsclasses", Icon: Calculator, color: COLORS.goldDeep },
  { label: "Courses", to: "/courses", Icon: Rocket, color: COLORS.indigo },
  { label: "Academic Tuition", to: "/services/academic-tuition", Icon: BookOpen, color: COLORS.cyan },
  { label: "Pricing", to: "/pricing", Icon: Tag, color: COLORS.bronze },
];

// Total height of the fixed header (offer bar + nav) — pages use this as top padding.
export const NAV_HEIGHT = 60;

const NavBar = ({ openDemoModal }) => {
  const { role = "guest", logout, openLoginModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    h();
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);

  return (
    <>
      <nav
        className="fixed left-0 right-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300"
        style={{
          top: OFFER_BAR_HEIGHT,
          borderBottom: "1px solid #E2E8F0",
          boxShadow: scrolled ? "0 6px 24px -12px rgba(15,23,42,0.18)" : "none",
        }}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 h-[60px] lg:h-[68px]">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0" aria-label="Pearlx home">
            <img src={PearlxLogo} alt="Pearlx — Where Little Gems Shine" className="h-9 lg:h-11 w-auto object-contain" />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(({ label, to, color }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={label}
                  to={to}
                  className="relative px-3 py-2 rounded-lg text-[14px] font-semibold capitalize transition-colors duration-200 hover:bg-slate-50"
                  style={{ color: isActive ? COLORS.ink : COLORS.textSecondary }}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-3 right-3 -bottom-[13px] h-[3px] rounded-full"
                      style={{ background: color }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA right */}
          <div className="flex items-center gap-2 shrink-0">
            {role === "guest" ? (
              <>
                <button
                  onClick={() => openLoginModal("student")}
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-slate-50"
                  style={{ color: COLORS.ink }}
                >
                  <LogIn className="w-4 h-4" /> Log in
                </button>
                <button onClick={() => openDemoModal("Demo")} className="px-btn px-btn--grad px-btn--sm">
                  Start Free Trial
                </button>
              </>
            ) : (
              <button onClick={logout} className="px-btn px-btn--white px-btn--sm">
                Dashboard
              </button>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ border: "1px solid #E2E8F0", color: COLORS.ink }}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

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
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="fixed left-0 right-0 z-40 bg-white lg:hidden"
              style={{ top: OFFER_BAR_HEIGHT + NAV_HEIGHT, borderBottom: "1px solid #E2E8F0", boxShadow: "0 20px 40px -20px rgba(15,23,42,0.3)" }}
            >
              <div className="max-w-7xl mx-auto px-4 py-2">
                {navLinks.map(({ label, to, Icon, color }) => {
                  const isActive = location.pathname === to;
                  return (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg capitalize"
                      style={{ background: isActive ? `${color}10` : "transparent" }}
                    >
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}14`, color }}>
                        <Icon className="w-4 h-4" strokeWidth={2.3} />
                      </span>
                      <span className="flex-1 text-[15px] font-semibold" style={{ color: COLORS.ink }}>{label}</span>
                      <ChevronRight className="w-4 h-4" style={{ color: COLORS.textMuted }} />
                    </Link>
                  );
                })}
                <div className="grid grid-cols-2 gap-2 pt-2 pb-2 mt-1 border-t" style={{ borderColor: "#E2E8F0" }}>
                  <button onClick={() => { openLoginModal("student"); setIsOpen(false); }} className="px-btn px-btn--white">
                    <LogIn className="w-4 h-4" /> Log in
                  </button>
                  <button onClick={() => { openDemoModal("demo"); setIsOpen(false); }} className="px-btn px-btn--grad">
                    Start Free Trial
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;