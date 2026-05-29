// src/pages/Courses.jsx
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Star, BookOpen, Users, Clock, ChevronDown, Rocket, Award, Code2, Database, Globe, Layers, ChevronLeft, ChevronRight, GraduationCap, MessageSquare, Check } from "lucide-react";
// Uncomment and set your offer image import:
// import offerImage from "../assets/offers/offer-20pct.png";

// ── CAROUSEL DATA ─────────────────────────────────────────────────────────────
const CAROUSEL_SLIDES = [
  {
    id: "offer",
    type: "image",
    // imageSrc: offerImage,   ← uncomment once you import the image above
    imageSrc: null,
    fallback: {
      gradient: "linear-gradient(135deg, #f0fff9 0%, #e0f2fe 40%, #ede9fe 100%)",
      headline: "Congratulations to all +2 Students!",
      body: "Your hard work, dedication and perseverance have paid off. Keep shining and aim higher. The best is yet to come!",
      ctaText: "Enrol Now & Avail 20% OFF",
      ctaColor: "linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)",
      courses: ["Python", "Java", "Web Development"],
      courseLogos: [
        "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
        "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
      ],
      bottomLine: "Offer valid for 2026 12th Passed Students only. *T&C Apply.",
    },
  },
  {
    id: "webdev",
    type: "promo",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c1a2e 100%)",
    badge: "TRENDING COURSE",
    badgeBg: "rgba(255,107,157,0.2)",
    badgeColor: "#FF6B9D",
    headline: "Turn Your Child Into a Developer",
    highlight: "Web Development",
    subheadline: "Intense Training Program",
    body: "From a blank screen to a live website in months. HTML, CSS, JavaScript, React — real skills, real projects, real future. The world runs on the web. Make your child the one who builds it.",
    tag: "Ages 12+ · Classes 7–12",
    stats: [
      { v: "6", l: "Months" },
      { v: "50+", l: "Projects" },
      { v: "Live", l: "Website" },
    ],
    logos: [
      { src: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg", label: "HTML5" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg", label: "CSS3" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png", label: "JS" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg", label: "React" },
    ],
    ctaText: "Enrol Now",
    ctaGradient: "linear-gradient(135deg, #FF6B9D 0%, #A78BFA 100%)",
    ctaShadow: "rgba(255,107,157,0.4)",
  },
];

// ── HERO CAROUSEL COMPONENT ───────────────────────────────────────────────────
const HeroCarousel = ({ openDemoModal }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index, dir) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const prev = () => goTo((current - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length, -1);
  const next = useCallback(() => goTo((current + 1) % CAROUSEL_SLIDES.length, 1), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = CAROUSEL_SLIDES[current];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="relative w-full my-20 overflow-hidden rounded-[2rem] mb-16"
      style={{ height: "clamp(420px, 55vw, 580px)", boxShadow: "0 24px 80px rgba(0,0,0,0.15)" }}>

      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* ── SLIDE 1: Offer image / fallback ── */}
          {slide.type === "image" && (
            slide.imageSrc ? (
              <img src={slide.imageSrc} alt="Special Offer" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full relative overflow-hidden" style={{ background: slide.fallback.gradient }}>
                {/* Decorative blobs */}
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20"
                  style={{ background: "radial-gradient(circle, #10B981, transparent)" }} />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-15"
                  style={{ background: "radial-gradient(circle, #0EA5E9, transparent)" }} />

                <div className="relative z-10 h-full flex flex-col md:flex-row items-center px-8 md:px-14 py-8 gap-6">
                  {/* Left */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-black" style={{ color: "#1a3c5e" }}>Pearlx</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "#e0f7ec", color: "#10B981" }}>Coding for Kids</span>
                    </div>
                    <div className="text-4xl md:text-5xl font-black mb-1 leading-tight"
                      style={{ fontFamily: "Georgia, serif", color: "#1a3c8f" }}>
                      Congratulations
                    </div>
                    <div className="text-2xl md:text-3xl font-black mb-4" style={{ color: "#0F172A" }}>
                      to all <span style={{ color: "#10B981" }}>+2 Students!</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-5 max-w-sm leading-relaxed">
                      {slide.fallback.body}
                    </p>
                    {/* 20% OFF pill */}
                    <div className="flex items-center gap-3 p-3 rounded-2xl mb-4"
                      style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", maxWidth: 380 }}>
                      <div className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-14 rounded-xl font-black text-white"
                        style={{ background: "#10B981" }}>
                        <span className="text-2xl leading-none font-black">20%</span>
                        <span className="text-xs">OFF</span>
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-800">on{" "}
                          <span className="px-2 py-0.5 rounded-lg text-white text-xs"
                            style={{ background: "#2563EB" }}>All Courses Pack!</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Kickstart your tech journey with expert-led training.
                        </div>
                      </div>
                    </div>
                    {/* Course logos */}
                    <div className="flex items-center gap-3 mb-5 flex-wrap">
                      {slide.fallback.courses.map((name, ci) => (
                        <div key={ci} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border"
                          style={{ borderColor: "rgba(16,185,129,0.2)" }}>
                          <img src={slide.fallback.courseLogos[ci]} alt={name} className="w-4 h-4 object-contain" />
                          <span className="text-[11px] font-bold text-slate-700">{name}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => openDemoModal("carousel-offer")}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white border-none cursor-pointer w-fit"
                      style={{ background: slide.fallback.ctaColor, boxShadow: "0 6px 24px rgba(16,185,129,0.35)" }}>
                      {slide.fallback.ctaText} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Right badge */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div className="p-4 rounded-2xl text-center"
                      style={{ background: "white", boxShadow: "0 4px 20px rgba(14,165,233,0.15)", border: "2px solid #BAE6FD" }}>
                      <div className="text-xs font-bold text-slate-500 mb-1">For 2026</div>
                      <div className="font-black text-sm text-slate-800">12th Passed Students</div>
                    </div>
                    <div className="text-[10px] text-slate-400 text-center max-w-[160px]">
                      {slide.fallback.bottomLine}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* ── SLIDE 2: Web Dev promo ── */}
          {slide.type === "promo" && (
            <div className="w-full h-full relative overflow-hidden" style={{ background: slide.gradient }}>
              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="absolute top-0 right-0 w-96 h-96 rounded-full"
                style={{ background: "radial-gradient(circle, #A78BFA, transparent)", filter: "blur(60px)" }} />
              <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 9, repeat: Infinity, delay: 2 }}
                className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
                style={{ background: "radial-gradient(circle, #FF6B9D, transparent)", filter: "blur(50px)" }} />
              <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
              {[
                { t: "<div>", top: "10%", left: "5%", c: "#FF6B9D" },
                { t: "useState()", top: "20%", right: "8%", c: "#A78BFA" },
                { t: "flex-col", bottom: "30%", left: "3%", c: "#0EA5E9" },
                { t: "onClick={}", bottom: "15%", right: "5%", c: "#10B981" },
              ].map((fp, fpi) => (
                <motion.div key={fpi}
                  animate={{ y: [0, -14, 0], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 6 + fpi, repeat: Infinity, delay: fpi * 0.8 }}
                  className="absolute font-mono text-xs font-bold px-3 py-1.5 rounded-xl border backdrop-blur-sm"
                  style={{ top: fp.top, left: fp.left, right: fp.right, bottom: fp.bottom,
                    borderColor: `${fp.c}30`, color: fp.c, background: `${fp.c}10` }}>
                  {fp.t}
                </motion.div>
              ))}
              <div className="relative z-10 h-full flex flex-col md:flex-row items-center px-8 md:px-14 py-10 gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-xs font-black"
                    style={{ background: slide.badgeBg, color: slide.badgeColor, border: `1px solid ${slide.badgeColor}30` }}>
                    {slide.badge}
                  </div>
                  <h2 className="font-black mb-2 leading-tight text-white"
                    style={{ fontSize: "clamp(1.8rem,3.5vw,3rem)", letterSpacing: "-0.03em" }}>
                    {slide.headline}
                  </h2>
                  <div className="font-black mb-1"
                    style={{ fontSize: "clamp(1.4rem,2.8vw,2.2rem)", background: "linear-gradient(135deg, #FF6B9D, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {slide.highlight}
                  </div>
                  <div className="text-slate-300 font-bold text-lg mb-4">{slide.subheadline}</div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">{slide.body}</p>
                  <div className="flex gap-4 mb-6 flex-wrap">
                    {slide.stats.map((s, si) => (
                      <div key={si} className="text-center px-4 py-2 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <div className="font-black text-xl text-white">{s.v}</div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{s.l}</div>
                      </div>
                    ))}
                    <div className="flex items-center">
                      <span className="text-xs font-bold text-slate-400">{slide.tag}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openDemoModal("carousel-webdev")}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white border-none cursor-pointer"
                    style={{ background: slide.ctaGradient, boxShadow: `0 8px 28px ${slide.ctaShadow}` }}>
                    {slide.ctaText} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-shrink-0 grid grid-cols-2 gap-4">
                  {slide.logos.map((logo, li) => (
                    <motion.div key={li}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + li * 0.1 }}
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-2"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                      <img src={logo.src} alt={logo.label} className="w-10 h-10 object-contain"
                        onError={e => { e.target.style.display = "none"; }} />
                      <span className="text-[10px] font-bold text-slate-300">{logo.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 cursor-pointer"
        style={{ background: "rgba(0,0,0,0.35)" }}>
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 cursor-pointer"
        style={{ background: "rgba(0,0,0,0.35)" }}>
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {CAROUSEL_SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i, i > current ? 1 : -1)}
            className="rounded-full transition-all duration-300 cursor-pointer border-none"
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              background: i === current ? "white" : "rgba(255,255,255,0.35)",
            }} />
        ))}
      </div>
    </div>
  );
};

const T = {
  bg: "#F8FAFF", ink: "#0F172A", green: "#10B981", sky: "#0EA5E9",
  yellow: "#FFD166", pink: "#FF6B9D", purple: "#A78BFA", orange: "#FF9F43",
  blue: "#3B82F6"
};

// ── REAL LOGOS ──
const LOGOS = {
  python: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
  java:   "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
  js:     "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
  html:   "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
  css:    "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
  react:  "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  mysql:  "https://www.mysql.com/common/logos/logo-mysql-170x115.png",
  git:    "https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg",
  node:   "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
  cplusplus: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
};

const COURSES = [
  {
    id: "python",
    logo: LOGOS.python,
    name: "Python",
    tagline: "From Scripts to Full Projects",
    desc: "Comprehensive Python training covering basics, OOP, file handling, automation, and project work. Ideal for beginners and intermediate learners.",
    tags: "Classes 7–12 · College Students",
    color: T.green,
    glow: "rgba(16,185,129,0.2)",
    bg: "linear-gradient(145deg,#ECFDF5,#D1FAE5)",
    border: "rgba(16,185,129,0.35)",
    textColor: "#047857",
    icon: <Code2 className="w-5 h-5" />,
    tracks: [
      { name: "Python Launchpad", type: "Bootcamp", duration: "2 Months", badge: "SHORT TERM", badgeColor: T.green },
      { name: "Python Pro Intensive", type: "Intense Training", duration: "6 Months", badge: "LONG TERM", badgeColor: T.blue },
    ],
    skills: ["Variables & Loops", "Functions & OOP", "File I/O", "Libraries", "Mini Projects"],
    boards: ["CBSE", "ICSE", "ISC", "IGCSE"],
    logoStack: [LOGOS.python],
  },
  {
    id: "java",
    logo: LOGOS.java,
    name: "Java",
    tagline: "OOP Mastery for Boards & Beyond",
    desc: "Java fundamentals and OOP concepts tailored for ICSE/ISC board exams. Data structures, algorithms, and real project experience included.",
    tags: "Classes 9–12 · ISC / ICSE",
    color: T.orange,
    glow: "rgba(255,159,67,0.2)",
    bg: "linear-gradient(145deg,#FFF7ED,#FED7AA)",
    border: "rgba(255,159,67,0.35)",
    textColor: "#C2410C",
    icon: <Layers className="w-5 h-5" />,
    tracks: [
      { name: "Java Kickstart Bootcamp", type: "Bootcamp", duration: "2 Months", badge: "SHORT TERM", badgeColor: T.green },
      { name: "Java Mastery Intensive", type: "Intense Training", duration: "6 Months", badge: "LONG TERM", badgeColor: T.blue },
    ],
    skills: ["Java Syntax", "OOP Concepts", "Arrays & Strings", "Data Structures", "Board Prep"],
    boards: ["ICSE", "ISC", "CBSE"],
    logoStack: [LOGOS.java],
  },
  {
    id: "webdev",
    logo: LOGOS.js,
    name: "Web Development",
    tagline: "Build Real Websites from Scratch",
    desc: "HTML to React — a complete web development journey. Students build and deploy real websites with responsive design and modern JavaScript.",
    tags: "Classes 7–12 · All Boards",
    color: T.sky,
    glow: "rgba(14,165,233,0.2)",
    bg: "linear-gradient(145deg,#F0F9FF,#BAE6FD)",
    border: "rgba(14,165,233,0.35)",
    textColor: "#0369A1",
    icon: <Globe className="w-5 h-5" />,
    tracks: [
      { name: "Web Dev Launchpad", type: "Bootcamp", duration: "2 Months", badge: "SHORT TERM", badgeColor: T.green },
      { name: "Full Stack Intensive", type: "Intense Training", duration: "6 Months", badge: "LONG TERM", badgeColor: T.blue },
    ],
    skills: ["HTML5 & CSS3", "Flexbox & Grid", "JavaScript", "React Basics", "Deploy Sites"],
    boards: ["CBSE", "ICSE", "IGCSE", "All Boards"],
    logoStack: [LOGOS.html, LOGOS.css, LOGOS.js, LOGOS.react],
  },
  {
    id: "dbms",
    logo: LOGOS.mysql,
    name: "DBMS & SQL",
    tagline: "Databases Done Right",
    desc: "Relational databases, SQL queries, ER diagrams, normalization and board-level practicals. Covers MySQL for hands-on practice.",
    tags: "Classes 10–12 · CBSE / ISC",
    color: T.purple,
    glow: "rgba(167,139,250,0.2)",
    bg: "linear-gradient(145deg,#F5F3FF,#EDE9FE)",
    border: "rgba(167,139,250,0.35)",
    textColor: "#6D28D9",
    icon: <Database className="w-5 h-5" />,
    tracks: [
      { name: "SQL Foundations", type: "Bootcamp", duration: "2 Months", badge: "SHORT TERM", badgeColor: T.green },
      { name: "DBMS Deep Dive", type: "Intense Training", duration: "4 Months", badge: "LONG TERM", badgeColor: T.blue },
    ],
    skills: ["SQL Queries", "Joins & Subqueries", "ER Diagrams", "Normalization", "Practicals"],
    boards: ["CBSE", "ISC"],
    logoStack: [LOGOS.mysql],
  },
  {
    id: "dsa",
    logo: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
    name: "Data Structures & Algorithms",
    tagline: "Crack Boards & Competitive Coding",
    desc: "Arrays, stacks, queues, linked lists, trees, sorting algorithms — exam-ready DSA with visual explanations and problem-solving drills.",
    tags: "Classes 11–12 · Advanced",
    color: T.pink,
    glow: "rgba(255,107,157,0.2)",
    bg: "linear-gradient(145deg,#FFF0F6,#FFD6E7)",
    border: "rgba(255,107,157,0.35)",
    textColor: "#BE185D",
    icon: <Rocket className="w-5 h-5" />,
    tracks: [
      { name: "DSA Essentials", type: "Bootcamp", duration: "2 Months", badge: "SHORT TERM", badgeColor: T.green },
      { name: "DSA + Algo Mastery", type: "Intense Training", duration: "5 Months", badge: "LONG TERM", badgeColor: T.blue },
    ],
    skills: ["Arrays & Strings", "Stacks & Queues", "Trees & Graphs", "Sorting & Searching", "Complexity"],
    boards: ["CBSE", "ISC", "ICSE"],
    logoStack: [],
  },
  {
    id: "cstuition",
    logo: "https://cdn-icons-png.flaticon.com/512/3426/3426653.png",
    name: "CS / IT Board Tuition",
    tagline: "Ace Your Board Exams",
    desc: "Structured board exam tuition for Computer Science and IT. Past papers, model answers, and chapter-by-chapter coverage for CBSE, ICSE, ISC, and IGCSE.",
    tags: "Classes 6–12 · All Boards",
    color: T.yellow,
    glow: "rgba(255,209,102,0.2)",
    bg: "linear-gradient(145deg,#FFFBEB,#FFF3C4)",
    border: "rgba(255,209,102,0.45)",
    textColor: "#A8760A",
    icon: <BookOpen className="w-5 h-5" />,
    tracks: [
      { name: "Exam Sprint", type: "Short Course", duration: "6 Weeks", badge: "EXAM PREP", badgeColor: T.pink },
      { name: "Full Year Tuition", type: "Annual Plan", duration: "10 Months", badge: "ANNUAL", badgeColor: T.purple },
    ],
    skills: ["Chapter Notes", "Past Papers", "Model Answers", "Weekly Tests", "Doubt Sessions"],
    boards: ["CBSE", "ICSE", "ISC", "IGCSE"],
    logoStack: [],
  },
];

const BOARDS = [
  { name: "CBSE", sub: "CS & IT · Class 6–12", color: "#FFD166", bg: "rgba(255,209,102,0.12)", BIcon: BookOpen },
  { name: "ICSE", sub: "Computer Applications", color: "#FF6B9D", bg: "rgba(255,107,157,0.12)", BIcon: BookOpen },
  { name: "ISC",  sub: "Computer Science", color: "#A78BFA", bg: "rgba(167,139,250,0.12)", BIcon: BookOpen },
  { name: "IGCSE",sub: "Cambridge CS & ICT", color: "#4CC9F0", bg: "rgba(76,201,240,0.12)", BIcon: Globe },
];

const WHY = [
  { Icon: GraduationCap, title: "Expert Mentors", desc: "Industry professionals & experienced teachers for every course" },
  { Icon: Code2, title: "Hands-on Projects", desc: "Every course includes real projects you can add to your portfolio" },
  { Icon: Award, title: "Industry Certificate", desc: "Recognised certificates on course completion" },
  { Icon: Rocket, title: "Career Guidance", desc: "Placement support and interview prep for college students" },
];

const CourseCard = ({ course, i, openDemoModal }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08, duration: 0.6 }}
      className="rounded-[2rem] border-2 overflow-hidden relative group"
      style={{ background: course.bg, borderColor: course.border, boxShadow: `0 8px 32px ${course.glow}` }}
    >
      {/* top accent bar */}
      <div className="h-1.5 w-full" style={{ background: course.color }} />

      <div className="p-7">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/70 border"
            style={{ borderColor: course.border, boxShadow: `0 4px 16px ${course.glow}` }}>
            <img src={course.logo} alt={course.name}
              className="w-9 h-9 object-contain"
              onError={e => { e.target.style.display = "none"; }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-black text-xl leading-tight" style={{ color: T.ink }}>{course.name}</h3>
            </div>
            <p className="text-xs font-bold" style={{ color: course.textColor }}>{course.tagline}</p>
            <div className="mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black inline-block"
              style={{ background: `${course.color}20`, color: course.textColor }}>
              {course.tags}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-5">{course.desc}</p>

        {/* Logo stack for multi-tech courses */}
        {course.logoStack.length > 1 && (
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tech Stack:</span>
            <div className="flex items-center gap-1.5">
              {course.logoStack.map((l, li) => (
                <div key={li} className="w-6 h-6 rounded-md bg-white/80 flex items-center justify-center border"
                  style={{ borderColor: course.border }}>
                  <img src={l} alt="" className="w-4 h-4 object-contain"
                    onError={e => { e.target.style.display = "none"; }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tracks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {course.tracks.map((track, ti) => (
            <div key={ti} className="p-4 rounded-2xl bg-white/60 border"
              style={{ borderColor: course.border }}>
              <div className="px-2 py-0.5 rounded-full text-[9px] font-black inline-block mb-2"
                style={{ background: `${track.badgeColor}20`, color: track.badgeColor }}>
                {track.badge}
              </div>
              <div className="font-bold text-sm leading-tight mb-1" style={{ color: T.ink }}>{track.name}</div>
              <div className="text-xs font-semibold text-slate-400">{track.type} · {track.duration}</div>
            </div>
          ))}
        </div>

        {/* Skills toggle */}
        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-bold mb-3"
          style={{ color: course.textColor }}>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
          {expanded ? "Hide" : "See"} what you'll learn
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
              className="flex flex-wrap gap-2 mb-4 overflow-hidden">
              {course.skills.map((s, si) => (
                <span key={si} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/70 border flex items-center gap-1"
                  style={{ borderColor: course.border, color: course.textColor }}>
                  <Check className="w-3 h-3" /> {s}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Boards */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {course.boards.map((b, bi) => (
            <span key={bi} className="px-2 py-1 rounded-lg text-[10px] font-black bg-white/50 border"
              style={{ borderColor: course.border, color: course.textColor }}>{b}</span>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => openDemoModal("course-" + course.id)}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-white text-sm border-none cursor-pointer"
          style={{ background: `linear-gradient(135deg, ${course.color}, ${course.color}cc)`, boxShadow: `0 6px 20px ${course.glow}` }}
        >
          Enrol Now <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const Courses = ({ openDemoModal }) => (
  <section className="min-h-screen relative overflow-hidden" style={{ background: T.bg }}>

    {/* ── BG ── */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(14,165,233,0.2) 1px, transparent 0)", backgroundSize: "44px 44px" }} />
      {[
        { c: T.sky, x: "-5%", y: "-5%", s: "40vw", dur: 20 },
        { c: T.purple, right: true, y: "10%", s: "35vw", dur: 18 },
        { c: T.green, x: "20%", y: "70%", s: "30vw", dur: 15 },
      ].map((o, i) => (
        <motion.div key={i}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{
            width: o.s, height: o.s,
            left: o.right ? "auto" : o.x, right: o.right ? "-5%" : undefined,
            top: o.y, background: `radial-gradient(circle,${o.c}14 0%,transparent 70%)`, filter: "blur(50px)"
          }} />
      ))}
    </div>

    <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">

      {/* ── BIG OFFER CAROUSEL ── */}
      <HeroCarousel openDemoModal={openDemoModal} />

      {/* ── HERO ── */}
      <div className="text-center mb-16">
        <motion.div initial={{ opacity: 0, y: -12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 border"
          style={{ background: "rgba(14,165,233,0.08)", borderColor: "rgba(14,165,233,0.3)", color: T.sky }}>
          <Rocket className="w-4 h-4" />
          <span className="text-xs font-black tracking-widest uppercase">Tech Courses · Classes 7–12 & College</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-black mb-5 tracking-tight leading-none"
          style={{ fontSize: "clamp(2.4rem,5.5vw,4.2rem)", color: T.ink, letterSpacing: "-0.04em" }}>
          Courses Built for{" "}
          <span style={{
            background: `linear-gradient(135deg,${T.sky},${T.purple})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
          }}>Real Results</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 max-w-2xl mx-auto text-lg font-medium mb-8">
          From Python to Full Stack Web — expert-led courses with real projects, board exam prep, and industry certificates. Your future in tech starts here.
        </motion.p>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-10">
          {[
            { icon: <Users className="w-4 h-4" />, v: "500+", l: "Students", c: T.green },
            { icon: <BookOpen className="w-4 h-4" />, v: "6", l: "Courses", c: T.sky },
            { icon: <Star className="w-4 h-4" />, v: "4.9★", l: "Rating", c: T.yellow },
            { icon: <Award className="w-4 h-4" />, v: "100%", l: "Certified", c: T.purple },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border"
              style={{ borderColor: `${s.c}30`, boxShadow: `0 4px 16px ${s.c}12` }}>
              <span style={{ color: s.c }}>{s.icon}</span>
              <span className="font-black text-sm" style={{ color: T.ink }}>{s.v}</span>
              <span className="text-xs text-slate-400 font-medium">{s.l}</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.4 }} className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => openDemoModal("courses-hero")}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white border-none cursor-pointer"
            style={{ background: `linear-gradient(135deg,${T.sky},${T.purple})`, boxShadow: "0 8px 32px rgba(14,165,233,0.35)" }}>
            <Rocket className="w-4 h-4" /> Book Free Demo Class <ArrowRight className="w-5 h-5" />
          </button>
          <a href="https://wa.link/2sqe3g"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold border-2"
            style={{ borderColor: "rgba(14,165,233,0.3)", color: T.sky, background: "rgba(14,165,233,0.06)" }}>
            WhatsApp Us
          </a>
        </motion.div>
      </div>

      {/* ── COURSES GRID ── */}
      <div className="mb-20">
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-black text-3xl mb-2 text-center" style={{ color: T.ink, letterSpacing: "-0.03em" }}>
          All Courses{" "}
          <span style={{
            background: `linear-gradient(135deg,${T.sky},${T.purple})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
          }}>Available Now</span>
        </motion.h2>
        <p className="text-center text-slate-500 mb-10 text-sm">Choose a track that fits your goal — short bootcamps or long-form intense training.</p>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {COURSES.map((course, i) => (
            <CourseCard key={course.id} course={course} i={i} openDemoModal={openDemoModal} />
          ))}
        </div>
      </div>

      {/* ── WHY PEARLX ── */}
      <div className="mb-20">
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-black text-3xl mb-10 text-center" style={{ color: T.ink, letterSpacing: "-0.03em" }}>
          Why Learn with Pearlx?
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY.map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="p-7 rounded-3xl border-2 text-center bg-white"
              style={{ borderColor: "rgba(15,23,42,0.06)", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ background: `${T.sky}15` }}>
                <w.Icon className="w-7 h-7" style={{ color: T.sky }} />
              </div>
              <div className="font-black text-base mb-2" style={{ color: T.ink }}>{w.title}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{w.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── BOARDS ── */}
      <div className="mb-20">
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-black text-3xl mb-8 text-center" style={{ color: T.ink, letterSpacing: "-0.03em" }}>
          Boards We Cover
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BOARDS.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.04 }}
              className="p-7 rounded-3xl border-2 text-center"
              style={{ background: b.bg, borderColor: `${b.color}35`, boxShadow: `0 4px 20px ${b.color}12` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 mx-auto" style={{ background: `${b.color}18` }}>
                <b.BIcon className="w-6 h-6" style={{ color: b.color }} />
              </div>
              <div className="font-black text-2xl mb-1" style={{ color: b.color }}>{b.name}</div>
              <div className="text-xs font-semibold text-slate-500">{b.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-[2.5rem] overflow-hidden border-2 relative"
        style={{ borderColor: "rgba(14,165,233,0.3)", boxShadow: "0 20px 64px rgba(14,165,233,0.12)" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#F0F9FF,#F5F3FF,#F0FFF9)" }} />
        <div className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: `linear-gradient(90deg,${T.sky},${T.purple},${T.green})` }} />
        <div className="relative z-10 text-center p-12 lg:p-16">
          <div className="flex justify-center mb-4"><Rocket className="w-12 h-12" style={{ color: T.purple }} /></div>
          <h3 className="font-black text-3xl mb-3" style={{ color: T.ink, letterSpacing: "-0.02em" }}>
            Your Future in Tech Starts Here
          </h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            Book a free demo class today — no commitment, no payment. We'll assess your level and show you the path forward.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => openDemoModal("courses-cta")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-white border-none cursor-pointer"
              style={{ background: `linear-gradient(135deg,${T.sky},${T.purple})`, boxShadow: "0 8px 28px rgba(14,165,233,0.35)" }}>
              Book Free Demo Class <ArrowRight className="w-4 h-4" />
            </button>
            <a href="https://wa.link/2sqe3g"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold border-2"
              style={{ color: T.sky, borderColor: "rgba(14,165,233,0.35)", background: "rgba(14,165,233,0.06)" }}>
              <MessageSquare className="w-4 h-4 inline mr-1" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Courses;