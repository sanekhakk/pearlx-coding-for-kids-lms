// src/pages/Pricing.jsx — WITH ACADEMIC TUITION
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, GraduationCap, Globe, Check, ArrowRight,
  Star, Users, Shield, Clock, MessageCircle, Gift,
  ChevronDown, ChevronUp, Zap, Heart, Trophy, BookOpen
} from "lucide-react";

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

const TABS = [
  { id: "coding", label: "Kids Coding", icon: Code2, emoji: "🎮", sub: "Ages 1–12+", color: T.purple, lightColor: T.purpleLight },
  { id: "courses", label: "CS Courses", icon: GraduationCap, emoji: "🚀", sub: "12th Passed+", color: T.sky, lightColor: T.skyLight },
  { id: "academic", label: "Academic Tuition", icon: BookOpen, emoji: "📚", sub: "Classes 1–12", color: T.green, lightColor: T.greenLight },
  { id: "cs", label: "CS & IP Tuition", icon: GraduationCap, emoji: "🖥️", sub: "Classes 6–12", color: "#4CC9F0", lightColor: "#E0F2FE" },
  { id: "web", label: "Web Dev", icon: Globe, emoji: "🌐", sub: "For Brands", color: T.gold, lightColor: T.goldLight },
];

// ─── CS Courses (Python / Java / Web Dev) ───────────────────────────────────
const WA_LINK = "https://wa.link/2sqe3g";

const CS_COURSES = [
  {
    lang: "Python",
    emoji: "🐍",
    color: "#3B82F6",
    textColor: "#1D4ED8",
    bgColor: "#EFF6FF",
    bootcamp: { name: "Python Launchpad Bootcamp", duration: "2 Months", type: "Short Term", price: 4999, offerPrice: 3999, discount: 20 },
    intense: { name: "Python Pro Intensive Program", duration: "6 Months", type: "Long Term" },
    features: ["Hands-on projects", "Real-world assignments", "Certificate included", "Doubt clearing sessions"],
  },
  {
    lang: "Java",
    emoji: "☕",
    color: "#F97316",
    textColor: "#C2410C",
    bgColor: "#FFF7ED",
    bootcamp: { name: "Java Kickstart Bootcamp", duration: "2 Months", type: "Short Term", price: 4999, offerPrice: 3999, discount: 20 },
    intense: { name: "Java Mastery Intensive Program", duration: "6 Months", type: "Long Term" },
    features: ["OOP concepts", "Mini projects & capstone", "Industry certificate", "Mentor support"],
  },
  {
    lang: "Web Development",
    emoji: "🌐",
    color: "#8B5CF6",
    textColor: "#6D28D9",
    bgColor: "#F5F3FF",
    bootcamp: { name: "Web Dev Launchpad Bootcamp", duration: "2 Months", type: "Short Term", price: 5999, offerPrice: 4799, discount: 20 },
    intense: { name: "Full Stack Intensive Program", duration: "6 Months", type: "Long Term" },
    features: ["HTML · CSS · JS · React", "Backend basics", "Portfolio project", "Career guidance"],
  },
];

const CODING_GRADES = [
  {
    label: "Ages 1–3", emoji: "🐥", age: "Ages 1–3", color: T.yellow, textColor: "#A8760A", bgColor: T.yellowLight,
    tagline: "First steps into coding — super fun & visual!",
    hourly: 350, monthly: 2800, grpHourly: 210, grpMonthly: 1680,
    packages: [
      { c: 30, p: 8499, s: 2001, d: 19, label: "Starter" },
      { c: 45, p: 12499, s: 3251, d: 21, label: "Explorer" },
      { c: 90, p: 23499, s: 7001, d: 23, label: "Builder" },
      { c: 150, p: 37499, s: 14001, d: 27, label: "Champion", popular: true },
    ],
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
    packages: [
      { c: 30, p: 9499, s: 2501, d: 21, label: "Starter" },
      { c: 45, p: 14499, s: 3501, d: 19, label: "Explorer" },
      { c: 90, p: 27499, s: 8501, d: 24, label: "Builder" },
      { c: 150, p: 43999, s: 16001, d: 27, label: "Champion", popular: true },
    ],
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
    packages: [
      { c: 30, p: 11999, s: 3001, d: 20, label: "Starter" },
      { c: 45, p: 17999, s: 4501, d: 20, label: "Explorer" },
      { c: 90, p: 33999, s: 11001, d: 24, label: "Builder" },
      { c: 150, p: 54999, s: 20001, d: 27, label: "Champion", popular: true },
    ],
    grpPackages: [
      { c: 30,  p: 7999,  s: 1001, d: 11, label: "Starter" },
      { c: 45,  p: 12499, s: 1001, d: 7,  label: "Explorer" },
      { c: 90,  p: 24999, s: 2001, d: 7,  label: "Builder" },
      { c: 150, p: 41999, s: 3001, d: 7,  label: "Champion", popular: true },
    ],
  },
];

const ACADEMIC_GRADES = [
  { label: "Classes 1-7", emoji: "🌱", color: T.green, textColor: "#047857", bgColor: T.greenLight, hourly: 250, monthly: 2000, grpHourly: 150, grpMonthly: 1200, boards: "CBSE · ICSE · State Boards" },
  { label: "Classes 8-10", emoji: "📚", color: T.sky, textColor: "#0284C7", bgColor: T.skyLight, hourly: 300, monthly: 2400, grpHourly: 180, grpMonthly: 1440, boards: "CBSE · ICSE · IGCSE · State Boards" },
  { label: "Classes 11-12", emoji: "🎓", color: T.purple, textColor: "#6D28D9", bgColor: T.purpleLight, hourly: 350, monthly: 2800, grpHourly: 210, grpMonthly: 1680, boards: "CBSE · ISC · IGCSE · State Boards" },
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
  { q: "Which boards do you support for academic tuition?", a: "We support all major Indian boards: CBSE, ICSE, ISC, IGCSE, and all state boards (Maharashtra, Karnataka, Tamil Nadu, Gujarat, Rajasthan, UP, etc.)." },
  { q: "Can I book academic tuition for multiple subjects?", a: "Yes! You can book different subjects or even different teachers based on your child's needs. Most students benefit from focused subject tutoring." },
  { q: "How is CS Tuition different from school?", a: "Our CS tutors focus entirely on your child's board syllabus — CBSE, ICSE, ISC, or IGCSE — and ensure they not only pass but score top marks. Very different from a classroom of 40 students!" },
  { q: "Can I try before paying?", a: "Yes! Book a completely free 30-minute demo class. No payment, no commitment. You'll see exactly how we teach before deciding." },
];

// ─── Reusable Components ────────────────────────────────────────────────────

const SectionBadge = ({ children, color }) => (
  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border"
    style={{ background: `${color}15`, borderColor: `${color}30`, color }}>
    {children}
  </motion.div>
);

const TrustBadge = ({ icon, text }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border"
    style={{ background: "rgba(255,255,255,0.4)", borderColor: "rgba(15,23,42,0.1)", color: T.ink }}>
    {icon} {text}
  </div>
);

const IncludedStrip = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {ALWAYS_INCLUDED.map((item, i) => (
      <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: i * 0.05 }}
        className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border"
        style={{ borderColor: "rgba(15,23,42,0.08)" }}>
        <span className="text-2xl flex-shrink-0">{item.icon}</span>
        <div>
          <div className="font-black text-xs text-slate-500 uppercase tracking-widest mb-0.5">{item.title}</div>
          <div className="text-xs text-slate-600">{item.desc}</div>
        </div>
      </motion.div>
    ))}
  </div>
);

const GradeCard = ({ label, emoji, color, textColor, bgColor, hourly, monthly, grpHourly, grpMonthly, boards }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} transition={{ staggerChildren: 0.1 }}
    whileHover={{ y: -4 }}
    className="p-8 rounded-[2rem] border-2 text-center transition-all"
    style={{
      background: bgColor, borderColor: color + "40", boxShadow: `0 12px 40px ${color}20`
    }}>
    <div className="text-4xl mb-3">{emoji}</div>
    <h3 className="font-black text-xl mb-1" style={{ color: textColor }}>{label}</h3>
    <p className="text-xs mb-6" style={{ color: textColor }}>{boards}</p>
    <div className="space-y-2 mb-6 pb-6 border-b" style={{ borderColor: color + "25" }}>
      <div className="flex items-center justify-center gap-2">
        <span className="font-black text-2xl" style={{ color: textColor }}>₹{hourly}</span>
        <span className="text-xs" style={{ color: textColor, opacity: 0.7 }}>per session (1 hr)</span>
      </div>
      <div className="flex items-center justify-center gap-2 text-xs" style={{ color: textColor, opacity: 0.6 }}>
        <span>or ₹{monthly}/month (8 sessions)</span>
      </div>
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between" style={{ color: textColor }}>
        <span className="opacity-70">Solo Classes</span>
        <span className="font-bold">₹{hourly}/hr</span>
      </div>
      <div className="flex items-center justify-between" style={{ color: textColor }}>
        <span className="opacity-70">Group (2-3 students)</span>
        <span className="font-bold">₹{grpHourly}/hr</span>
      </div>
    </div>
  </motion.div>
);

const PackageCard = ({ c, p, s, d, label, popular, color }) => (
  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
    whileHover={{ scale: 1.03, y: -4 }}
    className="p-6 rounded-2xl bg-white border-2 relative overflow-hidden transition-all"
    style={{
      borderColor: popular ? color : "rgba(15,23,42,0.08)",
      boxShadow: popular ? `0 20px 50px ${color}25` : "0 4px 20px rgba(15,23,42,0.04)",
      background: popular ? color + "05" : "#fff"
    }}>
    {popular && (
      <div className="absolute -top-2 -right-2 px-4 py-1 rounded-full text-xs font-black"
        style={{ background: color, color: "#fff", transform: "rotate(12deg)" }}>⭐ POPULAR</div>
    )}
    <h4 className="font-black mb-2" style={{ color }}>{label}</h4>
    <div className="mb-4">
      <span className="font-black text-2xl" style={{ color }}>₹{p}</span>
      <span className="text-xs text-slate-500 ml-2">for {c} sessions</span>
    </div>
    <div className="space-y-1 mb-4 pb-4 border-b" style={{ borderColor: "rgba(15,23,42,0.08)" }}>
      <div className="text-xs text-slate-600">
        <span className="line-through text-slate-400">₹{Math.round(c * (p/c))}</span> → <span className="font-bold" style={{ color }}>Save ₹{s}</span>
      </div>
      <div className="text-xs font-bold text-slate-500">₹{Math.round(p/c)}/session</div>
    </div>
    <div className="text-xs text-slate-500">
      <span className="font-bold text-slate-600">{d}% savings</span> vs hourly rate
    </div>
  </motion.div>
);

const CodingSection = ({ openDemoModal }) => (
  <div className="space-y-12">
    {CODING_GRADES.map((grade, gi) => (
      <div key={gi}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.1 }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{grade.emoji}</span>
            <div>
              <h3 className="font-black text-xl" style={{ color: T.ink }}>{grade.label}</h3>
              <p className="text-sm text-slate-500">{grade.tagline}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="font-bold text-sm mb-4 text-slate-600 uppercase tracking-widest">Solo Classes</h4>
            <div className="grid grid-cols-2 gap-3">
              {grade.packages.map((pkg, pi) => (
                <PackageCard key={pi} {...pkg} color={grade.color} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-slate-600 uppercase tracking-widest">Group Classes (2-3 students)</h4>
            <div className="grid grid-cols-2 gap-3">
              {grade.grpPackages.map((pkg, pi) => (
                <PackageCard key={pi} {...pkg} color={grade.color} />
              ))}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const AcademicSection = ({ openDemoModal }) => (
  <div className="space-y-12">
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <p className="text-slate-600 mb-8">
        Academic tuition for Classes 1-12 • All subjects • All major boards (CBSE, ICSE, ISC, IGCSE, State Boards)
      </p>
    </motion.div>

    {ACADEMIC_GRADES.map((grade, gi) => (
      <motion.div key={gi} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: gi * 0.1 }}>
        <GradeCard {...grade} />
      </motion.div>
    ))}

    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} className="mt-12 p-6 rounded-2xl text-center"
      style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
      <p style={{ color: T.green }} className="font-bold mb-2">💡 Smart Bundles Available</p>
      <p className="text-sm text-slate-600">
        Book multiple sessions and save up to 20%! Contact us on WhatsApp for personalized bundle pricing based on your needs.
      </p>
    </motion.div>
  </div>
);

const CSTuitionSection = ({ openDemoModal }) => (
  <div className="space-y-8">
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <p className="text-slate-600 mb-8">
        Computer Science & Information Practices tuition • Classes 6-12 • All boards • Exam-focused
      </p>
    </motion.div>

    {CS_GRADES.map((grade, gi) => (
      <motion.div key={gi} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: gi * 0.1 }}>
        <GradeCard {...grade} />
      </motion.div>
    ))}
  </div>
);

const WebDevSection = ({ openDemoModal }) => (
  <div className="space-y-8">
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <p className="text-slate-600 mb-8">
        Custom websites designed & built for your brand — by expert developers
      </p>
    </motion.div>

    {WEB_PACKAGES.map((pkg, i) => (
      <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: i * 0.1 }}
        className="p-8 rounded-[2rem] border-2 relative overflow-hidden"
        style={{
          background: pkg.bgColor, borderColor: pkg.color + "40", boxShadow: `0 12px 40px ${pkg.color}20`
        }}>
        {pkg.badge && (
          <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-black bg-white"
            style={{ color: pkg.color }}>
            {pkg.badge}
          </div>
        )}
        <div className="flex items-start gap-6 mb-6">
          <span className="text-4xl">{pkg.emoji}</span>
          <div className="flex-1">
            <h3 className="font-black text-2xl mb-2" style={{ color: pkg.textColor }}>{pkg.name}</h3>
            <p className="text-sm" style={{ color: pkg.textColor, opacity: 0.7 }}>{pkg.desc}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-black text-3xl mb-1" style={{ color: pkg.textColor }}>{pkg.price}</div>
            <div className="text-xs" style={{ color: pkg.textColor, opacity: 0.6 }}>{pkg.timeline}</div>
          </div>
        </div>
        <div className="space-y-2">
          {pkg.features.map((f, fi) => (
            <div key={fi} className="flex items-center gap-3 text-sm" style={{ color: pkg.textColor }}>
              <Check className="w-4 h-4" />
              {f}
            </div>
          ))}
        </div>
      </motion.div>
    ))}
  </div>
);

// ─── CS Courses Section ──────────────────────────────────────────────────────
const CSCoursesSection = ({ openDemoModal }) => (
  <div className="space-y-10">
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">🎓</span>
        <div>
          <h3 className="font-black text-xl" style={{ color: T.ink }}>CS Courses for 12th Passed & Above</h3>
          <p className="text-sm text-slate-500">Bootcamps with flat prices · Long-term programs on enquiry</p>
        </div>
      </div>
      {/* +2 offer banner */}
      <div className="mt-4 flex items-center gap-4 px-5 py-3 rounded-2xl border"
        style={{ background: "linear-gradient(105deg,#ecfdf5,#eff6ff)", borderColor: "rgba(16,185,129,0.25)" }}>
        <span className="text-2xl">🎉</span>
        <div className="flex-1">
          <span className="font-black text-sm" style={{ color: "#047857" }}>2026 +2 Passed Students get 20% OFF on all Bootcamps!</span>
          <span className="ml-2 text-xs text-slate-500">Offer prices shown below.</span>
        </div>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
          className="shrink-0 px-4 py-1.5 rounded-xl text-xs font-black text-white"
          style={{ background: "linear-gradient(135deg,#10B981,#0EA5E9)" }}>
          Claim via WhatsApp
        </a>
      </div>
    </motion.div>

    {CS_COURSES.map((course, ci) => (
      <motion.div key={ci} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: ci * 0.1 }}
        className="rounded-[2rem] border-2 overflow-hidden"
        style={{ borderColor: course.color + "35", boxShadow: `0 12px 40px ${course.color}12`, background: course.bgColor }}>

        {/* Course header */}
        <div className="flex items-center gap-4 px-8 pt-7 pb-5 border-b" style={{ borderColor: course.color + "25" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: course.color + "18", border: `1.5px solid ${course.color}30` }}>
            {course.emoji}
          </div>
          <div className="flex-1">
            <h3 className="font-black text-xl" style={{ color: course.textColor }}>{course.lang}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {course.features.map((f, fi) => (
                <span key={fi} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: course.color + "18", color: course.textColor }}>
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Two tracks side by side */}
        <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: course.color + "20" }}>
          {/* Bootcamp */}
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black"
                style={{ background: course.color + "18", color: course.textColor }}>
                ⚡ Bootcamp · {course.bootcamp.type}
              </span>
              <span className="text-xs text-slate-400">{course.bootcamp.duration}</span>
            </div>
            <div>
              <p className="font-bold text-base mb-3" style={{ color: course.textColor }}>{course.bootcamp.name}</p>
              <div className="flex items-end gap-3">
                <div>
                  <div className="text-xs text-slate-400 line-through mb-0.5">₹{course.bootcamp.price.toLocaleString()}</div>
                  <div className="font-black text-3xl" style={{ color: course.textColor }}>
                    ₹{course.bootcamp.offerPrice.toLocaleString()}
                  </div>
                </div>
                <div className="mb-1 px-3 py-1 rounded-full text-xs font-black text-white"
                  style={{ background: `linear-gradient(135deg,#10B981,#0EA5E9)` }}>
                  {course.bootcamp.discount}% OFF
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">For 2026 +2 Passed Students</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: `0 8px 24px ${course.color}35` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openDemoModal && openDemoModal("courses_bootcamp")}
              className="mt-auto w-full py-3 rounded-2xl text-sm font-black text-white"
              style={{ background: `linear-gradient(135deg,${course.color},${course.textColor})` }}>
              🚀 Enroll Now
            </motion.button>
          </div>

          {/* Intense Training */}
          <div className="p-6 flex flex-col gap-4" style={{ background: course.color + "08" }}>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black"
                style={{ background: course.color + "25", color: course.textColor }}>
                🔥 Intense Training · {course.intense.type}
              </span>
              <span className="text-xs text-slate-400">{course.intense.duration}</span>
            </div>
            <div>
              <p className="font-bold text-base mb-3" style={{ color: course.textColor }}>{course.intense.name}</p>
              <div className="flex items-center gap-3 p-4 rounded-2xl border"
                style={{ background: "#fff", borderColor: course.color + "30" }}>
                <span className="text-2xl">💬</span>
                <div>
                  <div className="font-black text-sm" style={{ color: course.textColor }}>Custom Pricing</div>
                  <div className="text-xs text-slate-500">Tailored to your goals & schedule</div>
                </div>
              </div>
            </div>
            <motion.a
              href={`https://wa.me/91XXXXXXXXXX?text=Hi!%20I'm%20interested%20in%20the%20${encodeURIComponent(course.intense.name)}%20at%20Pearlx.%20Please%20share%20details.`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="mt-auto w-full py-3 rounded-2xl text-sm font-black text-center border-2 flex items-center justify-center gap-2"
              style={{ background: "#fff", color: course.textColor, borderColor: course.color + "50" }}>
              <MessageCircle className="w-4 h-4" />
              Enquire on WhatsApp
            </motion.a>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="space-y-3">
      {FAQS.map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: i * 0.05 }}
          className="rounded-2xl border-2 overflow-hidden transition-all"
          style={{
            borderColor: openIdx === i ? T.green : "rgba(15,23,42,0.08)",
            boxShadow: openIdx === i ? `0 12px 40px rgba(16,185,129,0.15)` : "0 2px 8px rgba(0,0,0,0.02)"
          }}>
          <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between p-6 text-left font-bold transition-all"
            style={{ background: openIdx === i ? "rgba(16,185,129,0.05)" : "#fff", color: T.ink }}>
            <span>{item.q}</span>
            <motion.span animate={{ rotate: openIdx === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-5 h-5" style={{ color: T.green }} />
            </motion.span>
          </button>
          <AnimatePresence>
            {openIdx === i && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t"
                style={{ borderColor: "rgba(16,185,129,0.1)" }}>
                {item.a}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────
export default function Pricing({ openDemoModal }) {
  const [activeTab, setActiveTab] = useState("coding");

  return (
    <section className="relative overflow-hidden pt-40" style={{ background: T.bg }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(14,165,233,0.15) 1px, transparent 0)", backgroundSize: "44px 44px" }} />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-0 left-1/3 w-[55vw] h-[55vw] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)", filter: "blur(64px)" }} />
        {[...Array(8)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width: 6, height: 6, background: i % 3 === 0 ? T.green : i % 3 === 1 ? T.sky : T.yellow, left: `${10 + i * 11}%`, top: `${20 + (i % 4) * 18}%` }}
            animate={{ y: [0, -40, 0], opacity: [0, 0.7, 0] }}
            transition={{ duration: 4 + i * 0.6, repeat: Infinity, delay: i * 0.5 }} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14">
          <h1 className="font-black mt-10 mb-3"
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
            {activeTab === "courses" && <CSCoursesSection openDemoModal={openDemoModal} />}
            {activeTab === "academic" && <AcademicSection openDemoModal={openDemoModal} />}
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
          className="rounded-[2.5rem] overflow-hidden border-2 relative mb-20"
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
}