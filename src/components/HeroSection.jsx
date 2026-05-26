// src/components/HeroSection.jsx — PERFORMANCE OPTIMIZED
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MonitorPlay, Sparkles } from "lucide-react";
import kid2 from "../assets/kids/KID2.webp";

const BLOCK_SNIPPETS = [
  { emoji: "🔁", label: "repeat 10 times", color: "#10B981", x: "8%", y: "22%" },
  { emoji: "❓", label: "if touching edge?", color: "#0EA5E9", x: "72%", y: "15%" },
  { emoji: "📢", label: 'say "Hello!"', color: "#6366F1", x: "80%", y: "60%" },
  { emoji: "🖱️", label: "when flag clicked", color: "#10B981", x: "5%", y: "68%" },
  { emoji: "➡️", label: "move 10 steps", color: "#0EA5E9", x: "60%", y: "80%" },
  { emoji: "⚡", label: "if / else block", color: "#6366F1", x: "35%", y: "88%" },
];

const CYCLING_PHRASES = [
  "Start with block coding 🧱",
  "Build real logic 🧠",
  "Create Scratch games 🎮",
  "Excel in school CS 📚",
  "Transition to Python 🐍",
];

const STATS = [
  { value: "50+", label: "Students Taught" },
  { value: "3", label: "Structured Categories" },
  { value: "132", label: "Lessons" },
];

// Reduced to 6 particles from 28, using CSS animations instead of JS
const PARTICLES = [
  { size: 10, left: "15%", top: "20%", color: "#10B981", duration: 18, delay: 0 },
  { size: 7,  left: "80%", top: "35%", color: "#0EA5E9", duration: 22, delay: 3 },
  { size: 12, left: "45%", top: "70%", color: "#6366F1", duration: 16, delay: 1.5 },
  { size: 6,  left: "70%", top: "80%", color: "#10B981", duration: 20, delay: 4 },
  { size: 9,  left: "25%", top: "60%", color: "#0EA5E9", duration: 25, delay: 2 },
  { size: 8,  left: "90%", top: "15%", color: "#6366F1", duration: 19, delay: 0.8 },
];

const HeroSection = ({ openDemoModal }) => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const containerRef = useRef(null);

  // Only use scroll parallax on desktop where GPU can handle it
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 400], [0, -40]);

  useEffect(() => {
    const t = setInterval(() => setPhraseIdx(i => (i + 1) % CYCLING_PHRASES.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-20 bg-white"
    >
      {/* ── STATIC BACKGROUND LAYER (no JS animations) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Static ambient orbs — CSS only, no framer-motion */}
        <div
          className="absolute -top-[15%] -right-[8%] w-[55vw] h-[55vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 70%)",
            filter: "blur(50px)",
            animation: "slowPulse 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[30%] -left-[10%] w-[45vw] h-[45vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%)",
            filter: "blur(50px)",
            animation: "slowPulse 26s ease-in-out infinite reverse",
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Reduced particles — CSS keyframes instead of framer-motion per-particle */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
              backgroundColor: p.color,
              filter: "blur(4px)",
              opacity: 0.15,
              animation: `floatUp ${p.duration}s ease-in-out ${p.delay}s infinite`,
              willChange: "transform, opacity",
            }}
          />
        ))}

        {/* Floating code blocks — reduced from 6 to 4, only on large screens */}
        {BLOCK_SNIPPETS.slice(0, 4).map((b, i) => (
          <div
            key={i}
            className="absolute items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold shadow-xl border hidden lg:flex"
            style={{
              color: b.color,
              left: b.x,
              top: b.y,
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(14px)",
              borderColor: `${b.color}25`,
              zIndex: 5,
              animation: `floatBlock ${10 + i * 2}s ease-in-out ${i * 0.8}s infinite`,
              willChange: "transform",
            }}
          >
            <span className="text-lg">{b.emoji}</span>
            <span style={{ color: "#0F172A", opacity: 0.75 }}>{b.label}</span>
          </div>
        ))}
      </div>

      {/* CSS keyframe animations injected once */}
      <style>{`
        @keyframes slowPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.12); opacity: 0.85; }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); opacity: 0.1; }
          50% { transform: translateY(-80px); opacity: 0.25; }
        }
        @keyframes floatBlock {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(2deg); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>

      {/* ── MAIN CONTENT ── */}
      <motion.div
        style={{ y: contentY }}
        className="max-w-7xl mx-auto px-6 w-full py-20 relative z-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT: Content */}
          <div className="relative">
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold mb-8 bg-white border border-slate-200 text-slate-700 shadow-sm"
            >
              Coding for Kids · Academic Tuition
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="font-extrabold leading-[1.05] mb-6 tracking-tight"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)", color: "#0F172A" }}
            >
              Master logic.{" "}
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Create with code.
              </span>
            </motion.h1>

            {/* Cycling phrase */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="relative overflow-hidden h-10 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phraseIdx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex items-center px-5 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                    style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)" }}
                  >
                    {CYCLING_PHRASES[phraseIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg leading-relaxed mb-10 max-w-lg font-medium"
              style={{ color: "#475569" }}
            >
              We start with{" "}
              <strong className="text-emerald-600">visual block coding</strong> so kids build
              logic effortlessly. Plus, dedicated{" "}
              <strong className="text-slate-900">Academic Tuition</strong> for Classes 6–12 to
              ace board exams.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <motion.button
                onClick={() => openDemoModal("Demo")}
                whileHover={{ scale: 1.05, boxShadow: "0 16px 40px rgba(16,185,129,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
                  boxShadow: "0 8px 28px rgba(16,185,129,0.3)",
                }}
              >
                🚀 Book Free Trial
              </motion.button >
              <motion.a
                href="#curriculum"
                whileHover={{ scale: 1.05, borderColor: "#0EA5E9" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold border-2 transition-colors"
                style={{
                  color: "#0EA5E9",
                  borderColor: "rgba(14,165,233,0.3)",
                  background: "rgba(14,165,233,0.04)",
                }}
              >
                <MonitorPlay className="w-5 h-5" /> View Programs
              </motion.a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8 pt-8 border-t border-slate-100"
            >
              {STATS.map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-extrabold" style={{ color: "#0F172A" }}>
                    {s.value}
                  </div>
                  <div className="text-xs font-semibold" style={{ color: "#64748B" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Visual Panel — simplified rings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full h-[520px] lg:h-[640px] flex items-center justify-center"
          >
            {/* CSS-animated rings instead of framer-motion */}
            <div
              className="absolute inset-4 rounded-full border-2 border-dashed"
              style={{
                borderColor: "rgba(16,185,129,0.2)",
                animation: "spinSlow 60s linear infinite",
                willChange: "transform",
              }}
            />
            <div
              className="absolute inset-16 rounded-full border-2 border-dashed"
              style={{
                borderColor: "rgba(14,165,233,0.2)",
                animation: "spinReverse 40s linear infinite",
                willChange: "transform",
              }}
            />
            <div
              className="absolute inset-28 rounded-full border border-dashed"
              style={{
                borderColor: "rgba(99,102,241,0.15)",
                animation: "spinSlow 25s linear infinite",
                willChange: "transform",
              }}
            />

            {/* Central glow — static */}
            <div
              className="absolute inset-32 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(14,165,233,0.08) 0%, rgba(16,185,129,0.06) 50%, transparent 80%)",
                filter: "blur(20px)",
              }}
            />

            {/* Hero image */}
            <div className="relative z-20 w-full max-w-[440px]">
              <img
                src={kid2}
                alt="Kid Coding"
                className="w-full h-auto object-contain"
                style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.1))" }}
              />
            </div>

            {/* Floating info cards — CSS animation */}
            <div
              className="absolute top-[8%] right-[0%] z-30 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white flex items-center gap-3"
              style={{ animation: "floatBlock 5s ease-in-out infinite", willChange: "transform" }}
            >
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl text-2xl">🏆</div>
              <div>
                <div className="text-sm font-extrabold text-slate-900">Board Excellence</div>
                <div className="text-xs text-slate-500 font-medium">Classes 6–12</div>
              </div>
            </div>

            <div
              className="absolute bottom-[12%] left-[-2%] z-30 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white flex items-center gap-3"
              style={{
                animation: "floatBlock 6s ease-in-out 1s infinite reverse",
                willChange: "transform",
              }}
            >
              <div className="bg-cyan-100 text-cyan-600 p-3 rounded-xl text-2xl">🧱</div>
              <div>
                <div className="text-sm font-extrabold text-slate-900">Block to Text</div>
                <div className="text-xs text-slate-500 font-medium">Smooth Progression</div>
              </div>
            </div>

            <div
              className="absolute bottom-[35%] right-[-4%] z-30 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white flex items-center gap-2"
              style={{ animation: "floatBlock 7s ease-in-out 2s infinite", willChange: "transform" }}
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-extrabold text-slate-900">6+ modules · 132 Lessons</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;