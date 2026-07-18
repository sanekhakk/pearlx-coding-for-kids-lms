// src/pages/ComputerScienceClasses.jsx — CODING FOR KIDS ONLY
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Trophy, Zap, Star, BookOpen, Users, Clock, Sprout, Bird, Medal, Code2, FlaskConical, Gamepad2, Smartphone, Globe, Award, Cpu } from "lucide-react";
import { getWhatsAppLink } from "../utils/whatsapp";
import lp1 from "../assets/kids/LP1.webp";
import bp1 from "../assets/kids/BP1.webp";
import rp1 from "../assets/kids/RP1.webp";

const T = {
  bg: "#F0FFFE", ink: "#0F172A", green: "#10B981", sky: "#0EA5E9",
  yellow: "#FFD166", pink: "#FF6B9D", purple: "#A78BFA",
};

const LEVELS = [
  {
    LevelIcon: Sprout, name: "Little Pearls", age: "Ages 5–7", grade: "Grades K–2", tag: "BEGINNER",
    tagline: "Where every coder begins!",
    color: "#FFD166", glow: "rgba(255,209,102,0.28)", border: "rgba(255,209,102,0.45)",
    textColor: "#A8760A", bg: "linear-gradient(145deg,#FFFBEB,#FFF3C4)",
    modules: [
      { ModIcon: Cpu, label: "Coding Fundamentals" }, { ModIcon: FlaskConical, label: "Scientific Exploration" },
      { ModIcon: Gamepad2, label: "Game Development" }, { ModIcon: Smartphone, label: "App Development" },
      { ModIcon: Code2, label: "Python Basics" }, { ModIcon: Globe, label: "HTML & CSS" },
      { ModIcon: Trophy, label: "Capstone Project" },
    ],
    moduleCount: 7, lessonCount: 84,
    tools: ["Scratch Jr", "Code.org", "Trinket.io"],
    highlight: "Drag-and-drop blocks — no typing needed!",
    kidImg: lp1,
    desc: "A magic-first approach where children build logic through animated drag-and-drop blocks. No typing, no syntax stress — pure creative joy that builds real computational thinking.",
    achievement: "Coder Badge", AchieveIcon: Award,
  },
  {
    LevelIcon: BookOpen, name: "Bright Pearls", age: "Ages 8–11", grade: "Grades 3–6", tag: "INTERMEDIATE",
    tagline: "Growing into real projects!",
    color: "#06D6A0", glow: "rgba(6,214,160,0.28)", border: "rgba(6,214,160,0.45)",
    textColor: "#047857", bg: "linear-gradient(145deg,#ECFDF5,#D1FAE5)",
    modules: [
      { ModIcon: Cpu, label: "Coding Fundamentals" }, { ModIcon: FlaskConical, label: "Scientific Exploration" },
      { ModIcon: Gamepad2, label: "Game Development" }, { ModIcon: Smartphone, label: "App Development" },
      { ModIcon: Code2, label: "Python Basics" }, { ModIcon: Globe, label: "HTML & CSS" },
      { ModIcon: Trophy, label: "Capstone Project" },
    ],
    moduleCount: 6, lessonCount: 72,
    tools: ["Scratch", "Code.org App Lab", "Thunkable", "Trinket.io"],
    highlight: "Block coding + intro to real text code!",
    kidImg: bp1,
    desc: "Students start building real games and apps. Advanced Scratch projects transition naturally into Python, creating the confidence needed for text-based programming.",
    achievement: "Builder Badge", AchieveIcon: Medal,
  },
  {
    LevelIcon: Bird, name: "Rising Pearls", age: "Ages 12–15", grade: "Grades 7–10", tag: "ADVANCED",
    tagline: "Building portfolio-ready apps!",
    color: "#A78BFA", glow: "rgba(167,139,250,0.28)", border: "rgba(167,139,250,0.45)",
    textColor: "#6D28D9", bg: "linear-gradient(145deg,#F5F3FF,#EDE9FE)",
    modules: [
      { ModIcon: Cpu, label: "Coding Fundamentals" }, { ModIcon: FlaskConical, label: "Scientific Exploration" },
      { ModIcon: Gamepad2, label: "Game Development" }, { ModIcon: Smartphone, label: "App Development" },
      { ModIcon: Code2, label: "Python Basics" }, { ModIcon: Code2, label: "Python Intermediate" },
      { ModIcon: Code2, label: "Python Advanced" }, { ModIcon: BookOpen, label: "CodiMath" },
      { ModIcon: Globe, label: "HTML & CSS" }, { ModIcon: Zap, label: "JavaScript" },
      { ModIcon: Trophy, label: "Capstone Project" },
    ],
    moduleCount: 10, lessonCount: 120,
    tools: ["Replit", "GitHub Pages", "Thunkable", "VS Code"],
    highlight: "Python, JS, web dev — real text coding!",
    kidImg: rp1,
    desc: "Pro-grade programming that matters. Python OOP, full-stack web development, mobile apps — students graduate with a real portfolio they can show universities and employers.",
    achievement: "Pro Coder Badge", AchieveIcon: Trophy,
  },
];

const FAQ = [
  { q: "What age can my child start?", a: "We accept children from age 5! Little Pearls (5–7) uses pure drag-and-drop — no reading or typing required. The curriculum scales up perfectly by level." },
  { q: "Do you offer a free trial?", a: "Absolutely! Book a free 30-minute demo class with no commitment. We'll assess your child's level and show you exactly how we teach before any payment." },
  { q: "What platform do you use?", a: "All classes are live online via Zoom or Google Meet. Students use age-appropriate platforms: Scratch Jr, Scratch, Replit, and VS Code as they advance." },
  { q: "How many classes per week?", a: "Standard is 2 classes per week (1 hour each), totaling 8 classes per month. We also offer intensive schedules for exam prep." },
  { q: "Is there homework?", a: "Light, fun projects between classes — not heavy homework. Kids are encouraged to explore and build, not grind practice sheets." },
];

const FloatImg = ({ src, FallbackIcon, color, style, delay = 0 }) => (
  <motion.div animate={{ y: [0, -12, 0], rotate: [-1, 1, -1] }}
    transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    className="absolute pointer-events-none select-none" style={style}>
    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.13))" }}
      onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
    <div style={{ display: "none", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
      {FallbackIcon && <FallbackIcon style={{ width: "60%", height: "60%", color: color || "#94a3b8" }} />}
    </div>
  </motion.div>
);

const FaqItem = ({ q, a, i }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: i * 0.06 }}
      className="border-2 rounded-2xl overflow-hidden"
      style={{ borderColor: open ? "rgba(16,185,129,0.35)" : "rgba(15,23,42,0.07)", transition: "border-color 0.3s" }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
        style={{ background: open ? "rgba(16,185,129,0.04)" : "#fff" }}>
        <span className="font-bold text-sm pr-4" style={{ color: T.ink }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: T.green }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="px-5 pb-5 text-sm text-slate-500 leading-relaxed"
            style={{ background: "rgba(16,185,129,0.04)" }}>{a}</motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const LevelCard = ({ level, index }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7 }}
      className="rounded-[2.5rem] overflow-hidden border-2 relative group"
      style={{ background: level.bg, borderColor: level.border, boxShadow: `0 12px 48px ${level.glow}` }}>
      <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: level.color }} />
      <div className="p-8 flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: level.color + "20", border: `2px solid ${level.border}` }}>
              <level.LevelIcon className="w-7 h-7" style={{ color: level.textColor }} />
            </div>
            <div>
              <div className="px-3 py-1 rounded-full text-[10px] font-black text-white inline-block mb-1"
                style={{ background: level.color }}>{level.tag}</div>
              <h3 className="font-black text-2xl" style={{ color: T.ink }}>{level.name}</h3>
              <p className="text-sm font-bold" style={{ color: level.textColor }}>{level.age} · {level.grade}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4 text-sm font-bold"
            style={{ background: `${level.color}18`, color: level.textColor, border: `1px solid ${level.border}` }}>
            <Zap className="w-4 h-4" /> {level.highlight}
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">{level.desc}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {level.tools.map((t, ti) => (
              <span key={ti} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border"
                style={{ borderColor: level.border, color: level.textColor }}>{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold w-fit"
            style={{ background: `${level.color}15`, color: level.textColor }}>
            <Trophy className="w-4 h-4" /> Earn: {level.achievement}
          </div>
        </div>
        <div className="w-full lg:w-52 flex-shrink-0">
          <div className="relative h-48 lg:h-52 rounded-2xl overflow-hidden"
            style={{ background: `${level.color}10`, border: `2px solid ${level.border}` }}>
            <img src={level.kidImg} alt={level.name}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
              onError={e => { e.target.style.display = "none"; }} />
            <div className="absolute bottom-0 left-0 right-0 flex bg-white/80 backdrop-blur-sm p-2">
              {[{ v: `${level.moduleCount}`, l: "Modules" }, { v: `${level.lessonCount}`, l: "Lessons" }, { v: "6+", l: "Projects" }].map((s, si) => (
                <div key={si} className="flex-1 text-center">
                  <div className="font-black text-sm" style={{ color: level.textColor }}>{s.v}</div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 pb-8">
        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-bold mb-4"
          style={{ color: level.textColor }}>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}><ChevronDown className="w-4 h-4" /></motion.div>
          {expanded ? "Hide" : "View"} all {level.moduleCount} modules
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
              className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {level.modules.map((m, mi) => (
                <div key={mi} className="p-3 rounded-2xl text-center bg-white/80 border"
                  style={{ borderColor: `${level.color}25` }}>
                  <div className="flex justify-center mb-1">
                    <m.ModIcon className="w-4 h-4" style={{ color: level.textColor }} />
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 leading-tight">{m.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <a href={getWhatsAppLink(`Hi! I'd like to join ${level.name} (${level.age}) at Pearlx.`)}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-white text-sm mt-4"
          style={{ background: level.color, boxShadow: `0 6px 24px ${level.glow}` }}>
          Join {level.name} <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};

const ComputerScienceClasses = ({ openDemoModal }) => (
  <section className="min-h-screen relative overflow-hidden" style={{ background: T.bg }}>
    {/* ── LIVE BG ── */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(16,185,129,0.14) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      {[
        { c: T.purple, x: "-5%", y: "-5%", s: "40vw", dur: 20 },
        { c: T.green, right: true, y: "10%", s: "35vw", dur: 18 },
        { c: T.yellow, x: "20%", y: "70%", s: "30vw", dur: 15 },
        { c: T.pink, right: true, bottom: true, s: "28vw", dur: 22 },
      ].map((o, i) => (
        <motion.div key={i} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{
            width: o.s, height: o.s, left: o.right ? "auto" : o.x, right: o.right ? "-5%" : undefined,
            top: o.bottom ? "auto" : o.y, bottom: o.bottom ? "-5%" : undefined,
            background: `radial-gradient(circle,${o.c}12 0%,transparent 70%)`, filter: "blur(50px)"
          }} />
      ))}
      {[
        { t: "def hello():", top: "6%", left: "4%", c: T.green },
        { t: "for i in range(10):", top: "18%", right: "3%", c: T.sky },
        { t: "<html>", bottom: "20%", left: "2%", c: T.purple },
        { t: "import scratch", top: "45%", left: "1%", c: T.pink },
      ].map((c, i) => (
        <motion.div key={i} animate={{ y: [0, -18, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7 + i, repeat: Infinity, delay: i * 0.9 }}
          className="absolute font-mono text-xs font-bold px-3 py-1.5 rounded-xl bg-white/70 backdrop-blur-sm border"
          style={{ top: c.top, left: c.left, right: c.right, bottom: c.bottom, borderColor: `${c.c}25`, color: c.c, boxShadow: `0 4px 12px ${c.c}15` }}>
          {c.t}
        </motion.div>
      ))}
    </div>

    {/* Floating kid images */}
    <FloatImg src="/images/kids/cs-hero-kid-1.png" FallbackIcon={Users} color={T.green}
      style={{ width: 120, height: 165, top: "15%", right: "1.5%", zIndex: 1 }} delay={0} />
    <FloatImg src="/images/kids/cs-hero-kid-2.png" FallbackIcon={Users} color={T.sky}
      style={{ width: 100, height: 140, bottom: "20%", left: "0.5%", zIndex: 1 }} delay={1.5} />

    <div className="max-w-7xl mx-auto px-6 py-50 relative z-10">

      {/* ── PAGE HEADER ── */}
      <div className="text-center mb-16">
        <motion.div initial={{ opacity: 0, y: -12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 border"
          style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.3)", color: T.green }}>
          <Zap className="w-4 h-4" />
          <span className="text-xs font-black tracking-widest uppercase">Coding for Kids · Ages 5–15</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }} className="font-black mb-5 tracking-tight leading-none"
          style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", color: T.ink, letterSpacing: "-0.04em" }}>
          Master Logic.<br />
          <span style={{ background: `linear-gradient(135deg,${T.sky},${T.green})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Create with Code
          </span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.2 }} className="text-slate-500 max-w-2xl mx-auto text-lg font-medium mb-8">
          Our project-based curriculum takes kids from zero to confident coder.
          Block coding always comes first — then text code when they're truly ready.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { icon: <Users className="w-4 h-4" />, v: "50+", l: "Kids Taught", c: T.green },
            { icon: <BookOpen className="w-4 h-4" />, v: "200+", l: "Lessons", c: T.sky },
            { icon: <Star className="w-4 h-4" />, v: "4.9★", l: "Parent Rating", c: T.yellow },
            { icon: <Clock className="w-4 h-4" />, v: "3", l: "Age Levels", c: T.purple },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border"
              style={{ borderColor: `${s.c}30`, boxShadow: `0 4px 16px ${s.c}15` }}>
              <span style={{ color: s.c }}>{s.icon}</span>
              <span className="font-black text-sm" style={{ color: T.ink }}>{s.v}</span>
              <span className="text-xs text-slate-400 font-medium">{s.l}</span>
            </div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.4 }} className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => openDemoModal("kids-hero")}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white border-none cursor-pointer"
            style={{ background: `linear-gradient(135deg,${T.green},${T.sky})`, boxShadow: "0 8px 32px rgba(16,185,129,0.35)" }}>
            <Trophy className="w-4 h-4" /> Book Free Trial Class <ArrowRight className="w-5 h-5" />
          </button>
          <a href="#levels"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold border-2"
            style={{ borderColor: "rgba(16,185,129,0.3)", color: T.green, background: "rgba(16,185,129,0.06)" }}>
            View All Levels
          </a>
        </motion.div>
      </div>

      {/* ── LEVEL CARDS ── */}
      <div id="levels" className="mb-20">
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-black text-3xl mb-2 text-center" style={{ color: T.ink, letterSpacing: "-0.03em" }}>
          3 Coding Levels for Kids{" "}
          <span style={{ background: `linear-gradient(135deg,${T.sky},${T.green})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Ages 5–15
          </span>
        </motion.h2>
        <p className="text-center text-slate-500 mb-10">Each level follows our project-based curriculum.</p>
        <div className="grid gap-8">
          {LEVELS.map((level, i) => <LevelCard key={i} level={level} index={i} />)}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="mb-20">
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-black text-3xl mb-8 text-center" style={{ color: T.ink, letterSpacing: "-0.03em" }}>
          Questions parents ask
        </motion.h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {FAQ.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} i={i} />)}
        </div>
      </div>

      {/* ── CAPSTONE CTA ── */}
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-[2.5rem] overflow-hidden border-2 relative"
        style={{ borderColor: "rgba(167,139,250,0.3)", boxShadow: "0 20px 64px rgba(167,139,250,0.15)" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#F5F3FF,#FFF0FB,#F0FFF9)" }} />
        <div className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: `linear-gradient(90deg,${T.yellow},${T.green},${T.sky},${T.purple})` }} />
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 p-10 lg:p-14">
          <div className="lg:w-1/3 flex justify-center">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
              className="relative w-44 h-44">
              <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", position: "absolute", inset: 0 }}>
                <Trophy className="w-24 h-24" style={{ color: "#FFD166" }} />
              </div>
              <motion.div animate={{ rotate: [0, 8, 0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg,#FFD166,#A8760A)`, boxShadow: `0 4px 16px rgba(255,209,102,0.5)` }}>
                <Medal className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>
          </div>
          <div className="lg:w-2/3 text-center lg:text-left">
            <h3 className="font-black text-2xl mb-3" style={{ color: T.ink, letterSpacing: "-0.02em" }}>
              Grand Showcase — Every Level
            </h3>
            <p className="text-sm max-w-md mx-auto lg:mx-0 mb-7 text-slate-500 leading-relaxed">
              Every level ends in a <strong style={{ color: T.ink }}>Capstone Project</strong> — students present their story, game, app, and website to parents and peers. Real certificates. Real pride.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <motion.a href={getWhatsAppLink("Hi! I'd like to join a coding level at Pearlx.")}
                target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04, boxShadow: "0 12px 36px rgba(167,139,250,0.5)" }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg,${T.purple},#7C3AED)`, boxShadow: "0 4px 20px rgba(167,139,250,0.3)" }}>
                Join a Level <ArrowRight className="w-4 h-4" />
              </motion.a>
              <button
                onClick={() => openDemoModal("kids-capstone")}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold border-2 cursor-pointer"
                style={{ color: "#7C3AED", borderColor: "rgba(167,139,250,0.35)", background: "rgba(167,139,250,0.06)" }}>
                Book Free Demo
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ComputerScienceClasses;