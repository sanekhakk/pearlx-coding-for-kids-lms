// src/pages/Pricing.jsx — ENHANCED PARENT-FRIENDLY VERSION
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, GraduationCap, Globe, Check, ArrowRight,
  Star, Users, Shield, Clock, MessageCircle, Gift,
  ChevronDown, ChevronUp, Zap, Heart, Trophy, BookOpen
} from "lucide-react";

// ─── Theme (matches PearlX homepage) ───────────────────────────────────────
const T = {
  bg: "#F0FFFE",
  ink: "#0F172A",
  green: "#10B981",
  greenLight: "#D1FAE5",
  sky: "#0EA5E9",
  skyLight: "#E0F2FE",
  yellow: "#FFD166",
  yellowLight: "#FEF9C3",
  pink: "#FF6B9D",
  purple: "#A78BFA",
  purpleLight: "#EDE9FE",
  gold: "#C9A84C",
  goldLight: "#FEF3C7",
  teal: "#14B8A6",
};

// ─── Data ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: "coding", label: "Kids Coding", icon: Code2, emoji: "🎮", sub: "Ages 1–12+", color: T.purple, lightColor: T.purpleLight },
  { id: "cs", label: "CS & IP Tuition", icon: GraduationCap, emoji: "📚", sub: "Classes 6–12", color: T.sky, lightColor: T.skyLight },
  { id: "web", label: "Web Dev", icon: Globe, emoji: "🌐", sub: "For Brands", color: T.gold, lightColor: T.goldLight },
];

const CODING_GRADES = [
  {
    label: "Ages 1–3", emoji: "🐥", age: "Ages 1–3", color: T.yellow, textColor: "#A8760A", bgColor: T.yellowLight,
    tagline: "First steps into coding — super fun & visual!",
    hourly: 350, monthly: 2800, grpHourly: 210, grpMonthly: 1680,
    // Solo bundles (based on ₹350/hr)
    packages: [
      { c: 30, p: 8499, s: 2001, d: 19, label: "Starter" },
      { c: 45, p: 12499, s: 3251, d: 21, label: "Explorer" },
      { c: 90, p: 23499, s: 7001, d: 23, label: "Builder" },
      { c: 150, p: 37499, s: 14001, d: 27, label: "Champion", popular: true },
    ],
    // Group bundles (based on ₹210/hr — full: 30×210=6300, 45×210=9450, 90×210=18900, 150×210=31500)
    grpPackages: [
      { c: 30,  p: 5499,  s: 801,  d: 13, label: "Starter" },
      { c: 45,  p: 8499,  s: 951,  d: 10, label: "Explorer" },
      { c: 90,  p: 17499, s: 1401, d: 7,  label: "Builder" },
      { c: 150, p: 28999, s: 2501, d: 8,  label: "Champion", popular: true },
    ],
  },
  {
    label: "Ages 4–6", emoji: "🌱", age: "Ages 4–6", color: T.green, textColor: "#047857", bgColor: T.greenLight,
    tagline: "Deeper logic & first real projects",
    hourly: 400, monthly: 3200, grpHourly: 240, grpMonthly: 1920,
    // Solo bundles (based on ₹400/hr)
    packages: [
      { c: 30, p: 9499, s: 2501, d: 21, label: "Starter" },
      { c: 45, p: 14499, s: 3501, d: 19, label: "Explorer" },
      { c: 90, p: 27499, s: 8501, d: 24, label: "Builder" },
      { c: 150, p: 43999, s: 16001, d: 27, label: "Champion", popular: true },
    ],
    // Group bundles (based on ₹240/hr — full: 30×240=7200, 45×240=10800, 90×240=21600, 150×240=36000)
    grpPackages: [
      { c: 30,  p: 6499,  s: 701,  d: 10, label: "Starter" },
      { c: 45,  p: 9999,  s: 801,  d: 7,  label: "Explorer" },
      { c: 90,  p: 19999, s: 1601, d: 7,  label: "Builder" },
      { c: 150, p: 33499, s: 2501, d: 7,  label: "Champion", popular: true },
    ],
  },
  {
    label: "Ages 7+", emoji: "🦋", age: "Ages 7+", color: T.purple, textColor: "#6D28D9", bgColor: T.purpleLight,
    tagline: "Advanced coding, apps & real-world projects",
    hourly: 500, monthly: 4000, grpHourly: 300, grpMonthly: 2400,
    // Solo bundles (based on ₹500/hr)
    packages: [
      { c: 30, p: 11999, s: 3001, d: 20, label: "Starter" },
      { c: 45, p: 17999, s: 4501, d: 20, label: "Explorer" },
      { c: 90, p: 33999, s: 11001, d: 24, label: "Builder" },
      { c: 150, p: 54999, s: 20001, d: 27, label: "Champion", popular: true },
    ],
    // Group bundles (based on ₹300/hr — full: 30×300=9000, 45×300=13500, 90×300=27000, 150×300=45000)
    grpPackages: [
      { c: 30,  p: 7999,  s: 1001, d: 11, label: "Starter" },
      { c: 45,  p: 12499, s: 1001, d: 7,  label: "Explorer" },
      { c: 90,  p: 24999, s: 2001, d: 7,  label: "Builder" },
      { c: 150, p: 41999, s: 3001, d: 7,  label: "Champion", popular: true },
    ],
  },
];

const CS_GRADES = [
  { label: "Grades 5–8", emoji: "📘", color: "#4CC9F0", textColor: "#0284C7", bgColor: "#E0F2FE", hourly: 200, monthly: 1600, grpHourly: 120, grpMonthly: 960, boards: "CBSE · ICSE" },
  { label: "Grades 9–10", emoji: "📗", color: T.green, textColor: "#047857", bgColor: T.greenLight, hourly: 250, monthly: 2000, grpHourly: 150, grpMonthly: 1200, boards: "CBSE · ICSE · IGCSE" },
  { label: "Grades 11–12", emoji: "📕", color: T.purple, textColor: "#6D28D9", bgColor: T.purpleLight, hourly: 300, monthly: 2400, grpHourly: 180, grpMonthly: 1440, boards: "CBSE · ISC · IGCSE" },
];

const WEB_PACKAGES = [
  {
    name: "Starter Site", price: "₹14,999", desc: "Perfect for personal brands, portfolios, and small businesses.",
    color: T.gold, textColor: "#92400E", bgColor: T.goldLight,
    features: ["Up to 5 pages", "Mobile responsive", "Contact form", "Basic SEO", "1-month support"],
    emoji: "🚀", timeline: "2–3 weeks",
  },
  {
    name: "Business Pro", price: "₹29,999", desc: "Full-featured website for growing businesses.",
    badge: "⭐ Most Popular", color: T.green, textColor: "#065F46", bgColor: T.greenLight,
    features: ["Up to 12 pages", "Custom UI/UX design", "CMS (admin panel)", "Google SEO setup", "Blog/News section", "3-month support"],
    emoji: "💼", timeline: "3–5 weeks",
  },
  {
    name: "E-commerce", price: "₹49,999", desc: "Complete shopping experience with payments.",
    color: T.sky, textColor: "#0369A1", bgColor: T.skyLight,
    features: ["Unlimited products", "Payment gateway", "Order management", "Product catalog", "Inventory tracking", "6-month support"],
    emoji: "🛒", timeline: "5–7 weeks",
  },
];

const ALWAYS_INCLUDED = [
  { icon: "🎥", title: "Live Online Classes", desc: "Real teacher, real time — never pre-recorded" },
  { icon: "📊", title: "Monthly Progress Report", desc: "Parents get detailed updates every month" },
  { icon: "🔄", title: "Free Rescheduling", desc: "Cancel/reschedule 24 hrs before class, no charge" },
  { icon: "📹", title: "Session Recordings", desc: "Watch missed classes anytime, forever" },
  { icon: "📝", title: "Learning Materials", desc: "Worksheets, notes & projects included" },
  { icon: "🏆", title: "Completion Certificate", desc: "Awarded upon finishing each level" },
  { icon: "💬", title: "WhatsApp Parent Group", desc: "Stay connected with updates & tips" },
  { icon: "🙋", title: "Doubt Clearing", desc: "Personalised help every session" },
];

const FAQS = [
  { q: "Will my child get the same teacher every class?", a: "Yes! We assign a dedicated teacher to your child so they can build a comfortable learning relationship. If you'd like to switch, just let us know." },
  { q: "What happens if my child misses a class?", a: "Every session is recorded. Your child can watch the replay anytime. You can also reschedule for free with 24 hours notice." },
  { q: "Are there any hidden fees or registration charges?", a: "Absolutely none. No registration fee, no material fee, no hidden charges. You pay only for the sessions you book — that's it." },
  { q: "What age group is best for coding classes?", a: "We welcome kids from age 5 (Grade 1). The earlier they start, the better! Our curriculum is designed specifically for each age group — playful for younger kids, project-focused for older ones." },
  { q: "How is CS Tuition different from school?", a: "Our CS tutors focus entirely on your child's board syllabus — CBSE, ICSE, ISC, or IGCSE — and ensure they not only pass but score top marks. Very different from a classroom of 40 students!" },
  { q: "Can I try before paying?", a: "Yes! Book a completely free 30-minute demo class. No payment, no commitment. You'll see exactly how we teach before deciding." },
];

// ─── Reusable Components ────────────────────────────────────────────────────

const SectionBadge = ({ children, color }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
    style={{ background: color + "20", color }}>
    {children}
  </span>
);

const TrustBadge = ({ icon, text }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border text-xs font-bold text-slate-600"
    style={{ borderColor: "rgba(15,23,42,0.07)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
    <span className="text-base">{icon}</span>{text}
  </div>
);

const PriceCard = ({ emoji, amount, label, sublabel, color }) => (
  <div className="p-5 rounded-2xl border-2 bg-white relative"
    style={{ borderColor: color + "30", boxShadow: `0 6px 24px ${color}12` }}>
    <div className="text-2xl mb-3">{emoji}</div>
    <div className="font-black text-3xl leading-none mb-1" style={{ color: T.ink }}>{amount}</div>
    <div className="text-sm font-bold mb-0.5" style={{ color }}>{label}</div>
    {sublabel && <div className="text-xs text-slate-400">{sublabel}</div>}
  </div>
);

// ─── What's Included Strip ──────────────────────────────────────────────────
const IncludedStrip = () => (
  <div className="rounded-[1.8rem] border-2 overflow-hidden"
    style={{ borderColor: T.green + "30", boxShadow: `0 8px 32px ${T.green}10` }}>
    <div className="px-6 py-4 flex items-center gap-3"
      style={{ background: `linear-gradient(135deg, ${T.green}, #059669)` }}>
      <div>
        <div className="font-black text-white text-lg">Included in EVERY plan — no surprises</div>
        <div className="text-green-100 text-xs">Everything below comes with your subscription, whatever plan you choose</div>
      </div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 bg-white">
      {ALWAYS_INCLUDED.map((item, i) => (
        <div key={i} className="p-4 border-b border-r last:border-r-0"
          style={{ borderColor: "rgba(16,185,129,0.1)" }}>
          <div className="text-xs font-black text-slate-800 mb-0.5">{item.title}</div>
          <div className="text-xs text-slate-400 leading-relaxed">{item.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Coding Section ─────────────────────────────────────────────────────────
const CodingSection = ({ openDemoModal }) => {
  const [gradeIdx, setGradeIdx] = useState(1);
  const [mode, setMode] = useState("solo");
  const g = CODING_GRADES[gradeIdx];
  const isGrp = mode === "group";
  const hrPrice = isGrp ? g.grpHourly : g.hourly;
  const moPrice = isGrp ? g.grpMonthly : g.monthly;
  const activePkgs = isGrp ? g.grpPackages : g.packages;

  return (
    <div className="space-y-8">
      {/* Parent explainer banner */}
      <div className="rounded-2xl p-5 border-2 flex flex-col sm:flex-row gap-4 items-start"
        style={{ background: T.purpleLight, borderColor: T.purple + "30" }}>
        <div>
          <div className="font-black text-slate-800 mb-1">How it works for parents</div>
          <div className="text-sm text-slate-600 leading-relaxed">
            Choose your child's grade → pick <b>1-on-1</b> (dedicated teacher) or <b>Group</b> (2–4 kids, more affordable) →
            pay monthly <b>or</b> save big with a class bundle. All classes are live, online & 1 hour each.
          </div>
        </div>
      </div>

      {/* Step 1: Choose Grade */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
            style={{ background: T.purple }}>1</span>
          <span className="font-black text-slate-700">Choose your child's grade</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {CODING_GRADES.map((gr, i) => (
            <motion.button key={i} onClick={() => setGradeIdx(i)} whileTap={{ scale: 0.97 }}
              className="p-4 rounded-2xl border-2 text-left transition-all"
              style={{
                background: gradeIdx === i ? gr.color + "15" : "#fff",
                borderColor: gradeIdx === i ? gr.color : "rgba(15,23,42,0.08)",
                boxShadow: gradeIdx === i ? `0 4px 20px ${gr.color}25` : "0 2px 8px rgba(0,0,0,0.03)"
              }}>
              <div className="text-2xl mb-1">{gr.emoji}</div>
              <div className="font-black text-sm" style={{ color: gradeIdx === i ? gr.textColor : T.ink }}>{gr.label}</div>
              <div className="text-xs text-slate-400">{gr.age}</div>
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={gradeIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-3 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: g.bgColor, color: g.textColor }}>
            💡 {g.tagline}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step 2: Class type */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
            style={{ background: T.purple }}>2</span>
          <span className="font-black text-slate-700">Pick class type</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "solo", emoji: "🎯", label: "1-on-1 (Private)", desc: "Dedicated teacher, full attention. Best results.", highlight: true },
            { id: "group", emoji: "👫", label: "Group Class", desc: "2–4 kids per batch. More affordable, still effective." },
          ].map(m => (
            <motion.button key={m.id} onClick={() => setMode(m.id)} whileTap={{ scale: 0.97 }}
              className="p-4 rounded-2xl border-2 text-left transition-all"
              style={{
                background: mode === m.id ? (m.highlight ? T.purple + "12" : T.green + "12") : "#fff",
                borderColor: mode === m.id ? (m.highlight ? T.purple : T.green) : "rgba(15,23,42,0.08)",
              }}>
              <div className="text-xl mb-1">{m.emoji}</div>
              <div className="font-black text-sm text-slate-800">{m.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{m.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Step 3: See prices */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
            style={{ background: T.purple }}>3</span>
          <span className="font-black text-slate-700">Your pricing</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={gradeIdx + mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} className="grid grid-cols-2 gap-4">
            <PriceCard emoji="🎯" amount={`₹${hrPrice}`} label="Per Class" sublabel="1 hour session" color={g.color} />
            <PriceCard emoji="📅" amount={`₹${moPrice.toLocaleString()}`} label="Per Month" sublabel="8 sessions · 2 per week" color={g.color} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Packages — save more */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="font-black text-slate-800 flex items-center gap-2">
            💰 Buy a bundle & save more
          </div>
          <span className="text-xs text-slate-400">One-time payment</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={gradeIdx + mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {activePkgs.map((pkg, pi) => (
              <motion.div key={pi} whileHover={{ y: -6, scale: 1.02 }}
                className="p-5 rounded-2xl border-2 bg-white relative overflow-hidden"
                style={{
                  borderColor: pkg.popular ? g.color : g.color + "30",
                  boxShadow: pkg.popular ? `0 8px 28px ${g.color}30` : `0 4px 16px ${g.color}10`,
                }}>
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: g.color }} />
                {pkg.popular && (
                  <div className="absolute top-3 right-3 text-[9px] font-black text-white px-2 py-0.5 rounded-full"
                    style={{ background: g.color }}>BEST VALUE</div>
                )}
                <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: g.textColor }}>
                  {pkg.label}
                </div>
                <div className="text-2xl font-black leading-none mb-1" style={{ color: T.ink }}>
                  ₹{pkg.p.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mb-1">{pkg.c} classes total</div>
                <div className="flex items-center gap-1 text-xs font-black mb-3" style={{ color: g.textColor }}>
                  <span>💚 Save ₹{pkg.s.toLocaleString()}</span>
                  <span className="opacity-50">·</span>
                  <span>{pkg.d}% off</span>
                </div>
                <button
                  onClick={() => openDemoModal(`Coding - ${g.label} - ${pkg.label} (${pkg.c} classes · ₹${pkg.p})`)}
                  className="flex items-center justify-center gap-1 w-full py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer border-none"
                  style={{ background: g.color }}>
                  Get This <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── CS Tuition Section ─────────────────────────────────────────────────────
const CSTuitionSection = ({ openDemoModal }) => {
  const [idx, setIdx] = useState(0);
  const g = CS_GRADES[idx];
  return (
    <div className="space-y-8">
      <div className="rounded-2xl p-5 border-2 flex flex-col sm:flex-row gap-4 items-start"
        style={{ background: T.skyLight, borderColor: T.sky + "30" }}>
        <span className="text-3xl">🎓</span>
        <div>
          <div className="font-black text-slate-800 mb-1">Academic CS & IP Tuition — why it matters</div>
          <div className="text-sm text-slate-600 leading-relaxed">
            CS & Informatics Practices is a high-scoring subject for Class 9–12. Our tutors are board specialists
            who know exactly what examiners want. Small groups or private sessions — both available.
          </div>
        </div>
      </div>

      <div>
        <div className="font-black text-slate-700 mb-3">Select your child's class</div>
        <div className="grid grid-cols-3 gap-3">
          {CS_GRADES.map((gr, i) => (
            <motion.button key={i} onClick={() => setIdx(i)} whileTap={{ scale: 0.97 }}
              className="p-4 rounded-2xl border-2 text-left transition-all"
              style={{
                background: idx === i ? gr.color + "15" : "#fff",
                borderColor: idx === i ? gr.color : "rgba(15,23,42,0.08)",
              }}>
              <div className="text-2xl mb-1">{gr.emoji}</div>
              <div className="font-black text-sm" style={{ color: idx === i ? gr.textColor : T.ink }}>{gr.label}</div>
              <div className="text-xs text-slate-400">{gr.boards}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { emoji: "🎯", amount: `₹${g.hourly}`, label: "1-on-1 / session", sublabel: "Private class" },
            { emoji: "👫", amount: `₹${g.grpHourly}`, label: "Group / session", sublabel: "2–4 students" },
            { emoji: "📅", amount: `₹${g.monthly.toLocaleString()}`, label: "1-on-1 / month", sublabel: "8 sessions" },
            { emoji: "🗓️", amount: `₹${g.grpMonthly.toLocaleString()}`, label: "Group / month", sublabel: "8 sessions" },
          ].map((r, ri) => <PriceCard key={ri} {...r} color={g.color} />)}
        </motion.div>
      </AnimatePresence>

      <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: g.color + "30" }}>
        <div className="grid grid-cols-2">
          {[
            { label: "1-on-1 (Private)", emoji: "🎯", pros: ["Full teacher attention", "Pace set by your child", "Better for struggling students"], color: g.color },
            { label: "Group Class", emoji: "👫", pros: ["More affordable", "Peer learning energy", "Same board syllabus"], color: g.textColor },
          ].map((opt, oi) => (
            <div key={oi} className="p-5" style={{ background: oi === 0 ? g.bgColor : "#fff" }}>
              <div className="text-xl mb-2">{opt.emoji}</div>
              <div className="font-black text-sm text-slate-800 mb-3">{opt.label}</div>
              {opt.pros.map((p, pi) => (
                <div key={pi} className="flex items-start gap-2 text-xs text-slate-600 mb-1.5">
                  <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: opt.color }} />{p}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => openDemoModal(`CS Tuition - ${g.label} (${g.boards})`)}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-white text-sm cursor-pointer border-none"
        style={{ background: `linear-gradient(135deg,${g.color},${g.textColor})`, boxShadow: `0 8px 28px ${g.color}30` }}>
        📚 Book CS Tuition Session <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Web Dev Section ────────────────────────────────────────────────────────
const WebDevSection = ({ openDemoModal }) => (
  <div className="space-y-6">
    <div className="rounded-2xl p-5 border-2 flex flex-col sm:flex-row gap-4 items-start"
      style={{ background: T.goldLight, borderColor: T.gold + "40" }}>
      <span className="text-3xl">🌐</span>
      <div>
        <div className="font-black text-slate-800 mb-1">Professional websites for your business</div>
        <div className="text-sm text-slate-600 leading-relaxed">
          Need a website for your brand or business? Our team builds beautiful, fast, mobile-friendly sites.
          Get a free quote in 24 hours — no commitment needed.
        </div>
      </div>
    </div>
    <div className="grid sm:grid-cols-3 gap-5">
      {WEB_PACKAGES.map((pkg, i) => (
        <motion.div key={i} whileHover={{ y: -8 }}
          className="rounded-[1.8rem] border-2 bg-white relative overflow-hidden flex flex-col"
          style={{ borderColor: pkg.color + "35", boxShadow: `0 8px 28px ${pkg.color}12` }}>
          <div className="h-1 w-full" style={{ background: pkg.color }} />
          <div className="p-6 flex-1 flex flex-col">
            {pkg.badge && (
              <div className="self-start mb-3 px-3 py-1 rounded-full text-[10px] font-black text-white"
                style={{ background: pkg.color }}>{pkg.badge}</div>
            )}
            <div className="text-3xl mb-3">{pkg.emoji}</div>
            <h4 className="font-black text-lg mb-1" style={{ color: T.ink }}>{pkg.name}</h4>
            <div className="font-black text-2xl mb-1" style={{ color: pkg.color }}>{pkg.price}</div>
            <div className="text-xs text-slate-400 mb-3">⏱ Delivered in {pkg.timeline}</div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">{pkg.desc}</p>
            <ul className="space-y-2 mb-5 flex-1">
              {pkg.features.map((f, fi) => (
                <li key={fi} className="flex items-center gap-2 text-xs text-slate-600">
                  <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: pkg.color }} />{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => openDemoModal(`Web Dev - ${pkg.name} (${pkg.price})`)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white cursor-pointer border-none"
              style={{ background: pkg.color }}>
              Get Quote <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ─── FAQ ────────────────────────────────────────────────────────────────────
const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => (
        <motion.div key={i} layout className="rounded-2xl border-2 overflow-hidden bg-white"
          style={{ borderColor: open === i ? T.green + "50" : "rgba(15,23,42,0.07)" }}>
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 p-5 text-left">
            <span className="font-bold text-sm text-slate-800">{faq.q}</span>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: open === i ? T.green : T.greenLight }}>
              {open === i
                ? <ChevronUp className="w-3.5 h-3.5 text-white" />
                : <ChevronDown className="w-3.5 h-3.5" style={{ color: T.green }} />}
            </span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t"
                  style={{ borderColor: T.green + "20" }}>
                  <div className="pt-4">{faq.a}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

// ─── Main Pricing Component ─────────────────────────────────────────────────
const Pricing = ({ openDemoModal }) => {
  const [activeTab, setActiveTab] = useState("coding");

  return (
    <section className="min-h-screen relative overflow-hidden py-40" style={{ background: T.bg }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(16,185,129,0.14) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        {[
          { c: T.gold, x: "auto", y: "-5%", s: "35vw", right: true, dur: 18 },
          { c: T.green, x: "-5%", y: "20%", s: "30vw", dur: 22 },
          { c: T.purple, x: "auto", bottom: true, s: "28vw", right: true, dur: 16 },
        ].map((o, i) => (
          <motion.div key={i} animate={{ scale: [1, 1.18, 1] }} transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full"
            style={{
              width: o.s, height: o.s, left: o.right ? "auto" : o.x, right: o.right ? "-5%" : undefined,
              top: o.bottom ? "auto" : o.y, bottom: o.bottom ? "-5%" : undefined,
              background: `radial-gradient(circle,${o.c}12 0%,transparent 70%)`, filter: "blur(50px)"
            }} />
        ))}
        {[
          { t: "🔒 No hidden fees", top: "12%", left: "2%", c: T.green },
          { t: "🎁 Free demo class", top: "22%", right: "2%", c: T.purple },
          { t: "⭐ 500+ happy kids", bottom: "20%", left: "1.5%", c: T.gold },
          { t: "💬 WhatsApp support", bottom: "9%", right: "2%", c: T.sky },
        ].map((c, i) => (
          <motion.div key={i} animate={{ y: [0, -14, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 6 + i, repeat: Infinity, delay: i * 0.9 }}
            className="absolute text-xs font-black px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-sm border hidden lg:block"
            style={{ top: c.top, left: c.left, right: c.right, bottom: c.bottom, borderColor: c.c + "25", color: c.c }}>
            {c.t}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14">
          <SectionBadge color={T.gold}>💎 Transparent Pricing</SectionBadge>
          <h1 className="font-black mt-4 mb-3"
            style={{ color: T.ink, letterSpacing: "-0.04em", fontSize: "clamp(2rem,5vw,3.2rem)", lineHeight: 1.1 }}>
            Simple, honest{" "}
            <span style={{
              background: `linear-gradient(135deg,${T.gold},${T.green})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>fee details</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed mb-6">
            No registration fees. No hidden charges. No tricks. Pick the right plan for your child — and save big with bundles.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <TrustBadge icon="🔒" text="No hidden fees" />
            <TrustBadge icon="🎁" text="Free demo class" />
            <TrustBadge icon="📞" text="WhatsApp support" />
            <TrustBadge icon="🔄" text="Flexible rescheduling" />
            <TrustBadge icon="📊" text="Monthly reports" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-10">
          <IncludedStrip />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-8">
          <div className="text-center text-sm font-black text-slate-500 uppercase tracking-widest mb-4">
            What are you looking for?
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TABS.map(tab => (
              <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-4 rounded-2xl border-2 text-center sm:text-left transition-all"
                style={{
                  background: activeTab === tab.id ? tab.color + "15" : "#fff",
                  borderColor: activeTab === tab.id ? tab.color : "rgba(15,23,42,0.08)",
                  boxShadow: activeTab === tab.id ? `0 8px 32px ${tab.color}20` : "0 2px 8px rgba(0,0,0,0.03)"
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: activeTab === tab.id ? tab.color + "20" : tab.lightColor }}>
                  <tab.icon className="w-5 h-5" style={{ color: tab.color }} />
                </div>
                <div>
                  <div className="font-black text-sm" style={{ color: activeTab === tab.id ? T.ink : "#64748B" }}>{tab.label}</div>
                  <div className="text-xs text-slate-400">{tab.sub}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
            className="mb-14">
            {activeTab === "coding" && <CodingSection openDemoModal={openDemoModal} />}
            {activeTab === "cs" && <CSTuitionSection openDemoModal={openDemoModal} />}
            {activeTab === "web" && <WebDevSection openDemoModal={openDemoModal} />}
          </motion.div>
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-14">
          <div className="text-center mb-8">
            <SectionBadge color={T.sky}>❓ Parent FAQs</SectionBadge>
            <h2 className="font-black text-2xl mt-3 mb-2" style={{ color: T.ink }}>
              Questions parents always ask us
            </h2>
            <p className="text-slate-400 text-sm">We've answered them all — nothing hidden here</p>
          </div>
          <FAQ />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2.5rem] overflow-hidden border-2 relative"
          style={{ borderColor: T.gold + "30", boxShadow: `0 16px 60px ${T.gold}15` }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#FFFDF5,#F5FFFC)" }} />
          <div className="absolute top-0 left-0 right-0 h-1.5"
            style={{ background: `linear-gradient(90deg,${T.purple},${T.green},${T.gold},${T.pink})` }} />
          <div className="relative z-10 p-8 sm:p-12 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <SectionBadge color={T.gold}>Not sure which plan?</SectionBadge>
            <h3 className="font-black mt-4 mb-3"
              style={{ fontSize: "clamp(1.5rem,3.5vw,2rem)", color: T.ink, letterSpacing: "-0.03em" }}>
              Try a{" "}
              <span style={{
                background: `linear-gradient(135deg,${T.gold},${T.green})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>free demo class first</span>
            </h3>
            <p className="text-sm text-slate-500 mb-2 max-w-md mx-auto leading-relaxed">
              30-minute trial session — completely free, no payment, no commitment.
            </p>
            <p className="text-xs text-slate-400 mb-8 max-w-sm mx-auto">
              We'll understand your child's grade, board, and learning goals before recommending the perfect plan.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <motion.button
                onClick={() => openDemoModal("pricing_cta_bottom")}
                whileHover={{ scale: 1.03, boxShadow: `0 8px 30px ${T.gold}40` }}
                className="px-7 py-3.5 rounded-2xl text-sm font-black text-slate-900 border-none cursor-pointer"
                style={{ background: `linear-gradient(135deg,${T.gold},#A07830)`, boxShadow: `0 4px 20px ${T.gold}30` }}>
                🎁 Book Free Demo Class
              </motion.button>
              <motion.a href="https://wa.link/2sqe3g"
                whileHover={{ scale: 1.03 }}
                className="px-7 py-3.5 rounded-2xl text-sm font-bold border-2 transition-all bg-white"
                style={{ color: T.ink, borderColor: "rgba(15,23,42,0.15)" }}>
                💬 Chat on WhatsApp
              </motion.a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Pricing;