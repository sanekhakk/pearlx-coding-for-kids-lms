import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, GraduationCap, Globe, Check, MessageCircle, Gift,
  ChevronDown, ChevronUp, Zap, BookOpen, Video, BarChart3, RefreshCw,
  PlayCircle, Award, HelpCircle, Rocket, Lock, Phone, Flame, Cpu,
  Terminal, Users,
} from "lucide-react";

// NOTE: adjust this relative path if Pricing.jsx doesn't live one folder
// below theme.js's location (theme.js is at src/utils/theme.js).
import { COLORS } from "../utils/theme";
import { getWhatsAppLink } from "../utils/whatsapp";

// ─── Theme (pulled from the official PearlX palette) ────────────────────────
const T = {
  bg:            COLORS.bgSecondary,
  ink:           COLORS.ink,
  textMuted:     COLORS.textMuted,
  textSecondary: COLORS.textSecondary,
  border:        COLORS.border,
  green:         COLORS.emerald,
  greenLight:    COLORS.emeraldLight,
  sky:           COLORS.cyan,
  skyLight:      COLORS.cyanLight,
  indigo:        COLORS.indigo,
  indigoLight:   COLORS.indigoLight,
  gold:          COLORS.gold,
  goldDeep:      COLORS.goldDeep,
  goldLight:     COLORS.goldLight,
  silver:        COLORS.silver,
  silverLight:   COLORS.silverLight,
  bronze:        COLORS.bronze,
  bronzeLight:   COLORS.bronzeLight,
};

// ─── Data ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: "coding",   label: "Kids Coding",      icon: Code2,         sub: "Ages 1–15",                    color: T.indigo, light: T.indigoLight },
  { id: "courses",  label: "Courses",     icon: GraduationCap, sub: "12th Passed & Above",          color: T.sky,    light: T.skyLight },
  { id: "academic", label: "Academic Tuition", icon: BookOpen,      sub: "Classes 1–12 · All Subjects",  color: T.green,  light: T.greenLight },
  { id: "web",      label: "Web Dev",          icon: Globe,         sub: "For Brands",                   color: T.gold,   light: T.goldLight },
];

const CODING_TIERS = [
  {
    label: "Ages 1–3", tagline: "First steps into coding — playful & visual",
    hourly: 350, monthly: 2800, grpHourly: 210, grpMonthly: 1680,
    packages:    [{ c: 30, p: 8499,  d: 19, label: "Starter"  },
                  { c: 45, p: 12499, d: 21, label: "Explorer" },
                  { c: 90, p: 23499, d: 23, label: "Builder"  },
                  { c: 150, p: 37499, d: 27, label: "Champion", popular: true }],
    grpPackages: [{ c: 30, p: 5499,  d: 13, label: "Starter"  },
                  { c: 45, p: 8499,  d: 10, label: "Explorer" },
                  { c: 90, p: 17499, d: 7,  label: "Builder"  },
                  { c: 150, p: 28999, d: 8,  label: "Champion", popular: true }],
  },
  {
    label: "Ages 4–6", tagline: "Deeper logic & first real projects",
    hourly: 400, monthly: 3200, grpHourly: 240, grpMonthly: 1920,
    packages:    [{ c: 30, p: 9499,  d: 21, label: "Starter"  },
                  { c: 45, p: 14499, d: 19, label: "Explorer" },
                  { c: 90, p: 27499, d: 24, label: "Builder"  },
                  { c: 150, p: 43999, d: 27, label: "Champion", popular: true }],
    grpPackages: [{ c: 30, p: 6499,  d: 10, label: "Starter"  },
                  { c: 45, p: 9999,  d: 7,  label: "Explorer" },
                  { c: 90, p: 19999, d: 7,  label: "Builder"  },
                  { c: 150, p: 33499, d: 7,  label: "Champion", popular: true }],
  },
  {
    label: "Ages 7+", tagline: "Advanced coding, apps & real-world projects",
    hourly: 500, monthly: 4000, grpHourly: 300, grpMonthly: 2400,
    packages:    [{ c: 30, p: 11999, d: 20, label: "Starter"  },
                  { c: 45, p: 17999, d: 20, label: "Explorer" },
                  { c: 90, p: 33999, d: 24, label: "Builder"  },
                  { c: 150, p: 54999, d: 27, label: "Champion", popular: true }],
    grpPackages: [{ c: 30, p: 7999,  d: 11, label: "Starter"  },
                  { c: 45, p: 12499, d: 7,  label: "Explorer" },
                  { c: 90, p: 24999, d: 7,  label: "Builder"  },
                  { c: 150, p: 41999, d: 7,  label: "Champion", popular: true }],
  },
];

const ACADEMIC_TIERS = [
  { label: "Classes 1–7",   boards: "CBSE · ICSE · State Boards",         hourly: 250, monthly: 2000, grpHourly: 150, grpMonthly: 1200 },
  { label: "Classes 8–10",  boards: "CBSE · ICSE · IGCSE · State Boards", hourly: 300, monthly: 2400, grpHourly: 180, grpMonthly: 1440 },
  { label: "Classes 11–12", boards: "CBSE · ISC · IGCSE · State Boards",  hourly: 350, monthly: 2800, grpHourly: 210, grpMonthly: 1680 },
];

const ACADEMIC_SUBJECTS = [
  "Mathematics", "Science", "English", "Social Science", "Computer Science",
  "Informatics Practices", "Accountancy", "Economics", "Business Studies", "Second Language",
];

const CS_COURSES = [
  {
    lang: "Python", Icon: Code2, color: T.sky,
    bootcamp: { name: "Python Launchpad Bootcamp", duration: "2 Months", price: 4999, offerPrice: 3999, discount: 20 },
    intense: { name: "Python Pro Intensive Program", duration: "6 Months" },
  },
  {
    lang: "Java", Icon: Terminal, color: T.indigo,
    bootcamp: { name: "Java Kickstart Bootcamp", duration: "2 Months", price: 4999, offerPrice: 3999, discount: 20 },
    intense: { name: "Java Mastery Intensive Program", duration: "6 Months" },
  },
  {
    lang: "Web Development", Icon: Globe, color: T.green,
    bootcamp: { name: "Web Dev Launchpad Bootcamp", duration: "2 Months", price: 5999, offerPrice: 4799, discount: 20 },
    intense: { name: "Full Stack Intensive Program", duration: "6 Months" },
  },
];

const WEB_PACKAGES = [
  {
    name: "Starter Site", tier: "Silver", price: 14999, timeline: "2–3 weeks",
    desc: "Personal brands, portfolios & small businesses.",
    color: T.silver, textColor: "#57606F", bgColor: T.silverLight,
    features: ["Up to 5 pages", "Mobile responsive", "Contact form", "Basic SEO", "1-month support"],
  },
  {
    name: "Business Pro", tier: "Gold", price: 29999, timeline: "3–5 weeks", popular: true,
    desc: "Full-featured site for growing businesses.",
    color: T.gold, textColor: T.goldDeep, bgColor: T.goldLight,
    features: ["Up to 12 pages", "Custom UI/UX design", "CMS (admin panel)", "Google SEO setup", "Blog / News section", "3-month support"],
  },
  {
    name: "E-commerce", tier: "Bronze", price: 49999, timeline: "5–7 weeks",
    desc: "Complete shopping experience with payments.",
    color: T.bronze, textColor: "#8A4B22", bgColor: T.bronzeLight,
    features: ["Unlimited products", "Payment gateway", "Order management", "Product catalog", "Inventory tracking", "6-month support"],
  },
];

const ALWAYS_INCLUDED = [
  { icon: Video,         label: "Live Classes" },
  { icon: BarChart3,     label: "Monthly Reports" },
  { icon: RefreshCw,     label: "Free Rescheduling" },
  { icon: PlayCircle,    label: "Session Recordings" },
  { icon: Award,         label: "Certificate" },
  { icon: MessageCircle, label: "WhatsApp Group" },
];

const FAQS = [
  { q: "Will my child get the same teacher every class?", a: "Yes! We assign a dedicated teacher so they can build a comfortable learning relationship. Want to switch? Just let us know." },
  { q: "What happens if my child misses a class?", a: "Every session is recorded, so they can watch the replay anytime. You can also reschedule for free with 24 hours' notice." },
  { q: "Are there any hidden fees or registration charges?", a: "None at all — no registration fee, no material fee. You only pay for the sessions you book." },
  { q: "Is Computer Science / IP tuition available?", a: "Yes — Computer Science and Informatics Practices are covered under Academic Tuition at the same pricing as every other subject for that class. No separate booking needed." },
  { q: "Which boards do you support?", a: "All major Indian boards: CBSE, ICSE, ISC, IGCSE, and state boards (Maharashtra, Karnataka, Tamil Nadu, Gujarat, Rajasthan, UP, and more)." },
  { q: "Can I try before paying?", a: "Yes! Book a free 30-minute demo class — no payment, no commitment." },
];

// ─── Small building blocks ───────────────────────────────────────────────
const SectionBadge = ({ children, color }) => (
  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border"
    style={{ background: `${color}15`, borderColor: `${color}30`, color }}>
    {children}
  </span>
);

const TrustBadge = ({ icon, text }) => (
  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border bg-white/70"
    style={{ borderColor: T.border, color: T.ink }}>
    {icon} {text}
  </div>
);

const IncludedChips = () => (
  <div className="flex flex-wrap justify-center gap-2">
    {ALWAYS_INCLUDED.map((item, i) => (
      <div key={i} className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full text-xs font-bold bg-white border"
        style={{ borderColor: T.border, color: T.textSecondary }}>
        <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: T.greenLight }}>
          <item.icon className="w-3.5 h-3.5" style={{ color: T.green }} />
        </span>
        {item.label}
      </div>
    ))}
  </div>
);

// ─── Compact price row (collapsed by default, expands to show bundles) ──────
const PriceRow = ({ tier, color, mode, expanded, onToggle }) => {
  const hourly = mode === "solo" ? tier.hourly : tier.grpHourly;
  const monthly = mode === "solo" ? tier.monthly : tier.grpMonthly;
  const packages = mode === "solo" ? tier.packages : tier.grpPackages;

  return (
    <div className="rounded-2xl border-2 bg-white overflow-hidden transition-colors"
      style={{ borderColor: expanded ? color : T.border }}>
      <button
        onClick={() => packages && onToggle()}
        className={`w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left ${packages ? "cursor-pointer" : "cursor-default"}`}>
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: color }} />
          <div className="min-w-0">
            <div className="font-black text-sm truncate" style={{ color: T.ink }}>{tier.label}</div>
            <div className="text-xs text-slate-400 truncate">{tier.tagline || tier.boards}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
          <div className="text-right">
            <div className="font-black text-base sm:text-lg leading-tight" style={{ color }}>
              ₹{hourly}<span className="text-[11px] font-semibold text-slate-400">/session</span>
            </div>
            <div className="text-[11px] text-slate-400">₹{monthly}/mo · 8 sessions</div>
          </div>
          {packages && (expanded
            ? <ChevronUp className="w-4 h-4 text-slate-400" />
            : <ChevronDown className="w-4 h-4 text-slate-400" />)}
        </div>
      </button>

      <AnimatePresence>
        {expanded && packages && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t" style={{ borderColor: color + "20" }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-3 mb-2">
                Bundle & Save
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {packages.map((pkg, i) => (
                  <div key={i} className="p-3 rounded-xl text-center"
                    style={{
                      background: pkg.popular ? color + "12" : "#F8FAFC",
                      border: `1.5px solid ${pkg.popular ? color + "50" : T.border}`,
                    }}>
                    {pkg.popular && <div className="text-[9px] font-black mb-0.5" style={{ color }}>BEST VALUE</div>}
                    <div className="font-black text-sm" style={{ color: T.ink }}>₹{pkg.p.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">{pkg.c} sessions</div>
                    <div className="text-[10px] font-bold mt-0.5" style={{ color }}>Save {pkg.d}%</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TierPriceList = ({ tiers, color, showToggle = true }) => {
  const [mode, setMode] = useState("solo");
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div>
      {showToggle && (
        <div className="flex justify-end mb-4">
          <div className="inline-flex p-1 rounded-full bg-white border" style={{ borderColor: T.border }}>
            {["solo", "group"].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5"
                style={{ background: mode === m ? color : "transparent", color: mode === m ? "#fff" : T.textMuted }}>
                <Users className="w-3 h-3" /> {m === "solo" ? "1:1 Solo" : "Group (2–3)"}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-3">
        {tiers.map((tier, i) => (
          <PriceRow key={i} tier={tier} color={color} mode={mode}
            expanded={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
        ))}
      </div>
    </div>
  );
};

// ─── Sections ─────────────────────────────────────────────────────────────
const CodingSection = () => (
  <div>
    <div className="flex items-center gap-3 mb-6">
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: T.indigoLight }}>
        <Code2 className="w-5 h-5" style={{ color: T.indigo }} />
      </div>
      <div>
        <h3 className="font-black text-lg" style={{ color: T.ink }}>Kids Coding — Ages 1 to 15+</h3>
        <p className="text-sm text-slate-500">Tap a tier for bundle pricing · toggle solo or group</p>
      </div>
    </div>
    <TierPriceList tiers={CODING_TIERS} color={T.indigo} />
  </div>
);

const AcademicSection = () => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: T.greenLight }}>
        <BookOpen className="w-5 h-5" style={{ color: T.green }} />
      </div>
      <div>
        <h3 className="font-black text-lg" style={{ color: T.ink }}>Academic Tuition — Classes 1 to 12</h3>
        <p className="text-sm text-slate-500">One price covers every subject — including Computer Science &amp; IP</p>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 mb-6">
      {ACADEMIC_SUBJECTS.map((s, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: T.greenLight, color: "#047857" }}>
          {s === "Computer Science" && <Cpu className="w-3 h-3" />}
          {s}
        </span>
      ))}
    </div>

    <TierPriceList tiers={ACADEMIC_TIERS} color={T.green} />

    <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl" style={{ background: T.greenLight, border: `1px solid ${T.green}30` }}>
      <Zap className="w-4 h-4 flex-shrink-0" style={{ color: T.green }} />
      <p className="text-sm" style={{ color: "#047857" }}>
        <span className="font-black">Bundle 2+ subjects and save up to 20%.</span> Message us on WhatsApp for a custom quote.
      </p>
    </div>
  </div>
);

const CSCoursesSection = ({ openDemoModal }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: T.skyLight }}>
        <GraduationCap className="w-5 h-5" style={{ color: T.sky }} />
      </div>
      <div>
        <h3 className="font-black text-lg" style={{ color: T.ink }}>Computer Science Courses — 12th Passed &amp; Above</h3>
        <p className="text-sm text-slate-500">Flat bootcamp pricing · long-term programs on enquiry</p>
      </div>
    </div>

    <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border mb-5"
      style={{ background: `linear-gradient(105deg,${T.greenLight},${T.skyLight})`, borderColor: T.green + "30" }}>
      <Gift className="w-4 h-4 flex-shrink-0" style={{ color: T.green }} />
      <span className="text-xs sm:text-sm font-black flex-1" style={{ color: "#047857" }}>
        2026 +2 Passed Students get 20% OFF all bootcamps
      </span>
      <a href={getWhatsAppLink("Hi! I'd like to claim the 20% OFF bootcamp offer for +2 passed students at Pearlx.")}
        target="_blank" rel="noopener noreferrer"
        className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-black text-white"
        style={{ background: `linear-gradient(135deg,${T.green},${T.sky})` }}>
        Claim
      </a>
    </div>

    <div className="space-y-3">
      {CS_COURSES.map((course, i) => (
        <div key={i} className="rounded-2xl border-2 bg-white overflow-hidden" style={{ borderColor: course.color + "30" }}>
          <div className="flex items-center gap-3 px-5 pt-4 pb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: course.color + "15" }}>
              <course.Icon className="w-4 h-4" style={{ color: course.color }} />
            </div>
            <span className="font-black text-sm" style={{ color: T.ink }}>{course.lang}</span>
          </div>
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: course.color + "15" }}>
            <div className="p-5 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-black mb-1" style={{ color: course.color }}>
                  <Zap className="w-3 h-3" /> BOOTCAMP · {course.bootcamp.duration}
                </div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs text-slate-400 line-through">₹{course.bootcamp.price.toLocaleString()}</span>
                  <span className="font-black text-xl" style={{ color: T.ink }}>₹{course.bootcamp.offerPrice.toLocaleString()}</span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full text-white" style={{ background: course.color }}>
                    {course.bootcamp.discount}% OFF
                  </span>
                </div>
              </div>
              <button onClick={() => openDemoModal && openDemoModal("courses_bootcamp")}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-black text-white"
                style={{ background: course.color }}>
                Enroll
              </button>
            </div>
            <div className="p-5 flex items-center justify-between gap-3" style={{ background: course.color + "06" }}>
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-black mb-1 text-slate-500">
                  <Flame className="w-3 h-3" /> INTENSIVE · {course.intense.duration}
                </div>
                <div className="font-black text-sm" style={{ color: T.ink }}>Custom Pricing</div>
              </div>
              <a
                href={getWhatsAppLink(`Hi! I'm interested in ${course.intense.name} at Pearlx. Please share details.`)}
                target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-black border-2 flex items-center gap-1.5"
                style={{ borderColor: course.color + "50", color: course.color }}>
                <MessageCircle className="w-3.5 h-3.5" /> Enquire
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const WebDevSection = () => (
  <div>
    <div className="flex items-center gap-3 mb-6">
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: T.goldLight }}>
        <Globe className="w-5 h-5" style={{ color: T.gold }} />
      </div>
      <div>
        <h3 className="font-black text-lg" style={{ color: T.ink }}>Web Development — For Brands</h3>
        <p className="text-sm text-slate-500">Custom websites, designed &amp; built by our developers</p>
      </div>
    </div>

    <div className="grid sm:grid-cols-3 gap-4">
      {WEB_PACKAGES.map((pkg, i) => (
        <div key={i} className="rounded-[1.75rem] border-2 p-6 relative flex flex-col"
          style={{
            borderColor: pkg.popular ? pkg.color : T.border,
            background: pkg.popular ? pkg.bgColor : "#fff",
            boxShadow: pkg.popular ? `0 16px 40px ${pkg.color}25` : "0 4px 16px rgba(15,23,42,0.04)",
          }}>
          {pkg.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black text-white"
              style={{ background: pkg.color }}>MOST POPULAR</div>
          )}
          <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: pkg.color }}>{pkg.tier}</div>
          <h4 className="font-black text-lg mb-1" style={{ color: T.ink }}>{pkg.name}</h4>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">{pkg.desc}</p>
          <div className="mb-5">
            <span className="font-black text-2xl" style={{ color: T.ink }}>₹{pkg.price.toLocaleString()}</span>
            <span className="text-xs text-slate-400 ml-1.5">· {pkg.timeline}</span>
          </div>
          <div className="space-y-2 mb-5 flex-1">
            {pkg.features.map((f, fi) => (
              <div key={fi} className="flex items-start gap-2 text-xs" style={{ color: T.textSecondary }}>
                <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: pkg.color }} />
                {f}
              </div>
            ))}
          </div>
          <a href={getWhatsAppLink(`Hi! I'm interested in the ${pkg.name} (${pkg.tier}) website package at Pearlx. Please share more details.`)}
            target="_blank" rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl text-xs font-black text-center"
            style={{
              background: pkg.popular ? pkg.color : "#fff",
              color: pkg.popular ? "#fff" : pkg.color,
              border: `2px solid ${pkg.color}`,
            }}>
            Get Started
          </a>
        </div>
      ))}
    </div>
  </div>
);

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="space-y-3">
      {FAQS.map((item, i) => (
        <div key={i} className="rounded-2xl border-2 overflow-hidden transition-colors"
          style={{ borderColor: openIdx === i ? T.green : T.border }}>
          <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-sm"
            style={{ background: openIdx === i ? T.greenLight : "#fff", color: T.ink }}>
            <span>{item.q}</span>
            <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform"
              style={{ color: T.green, transform: openIdx === i ? "rotate(180deg)" : "none" }} />
          </button>
          <AnimatePresence>
            {openIdx === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t" style={{ borderColor: T.green + "15" }}>
                  <p className="pt-4">{item.a}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

// ─── Main ───────────────────────────────────────────────────────────────
export default function Pricing({ openDemoModal }) {
  const [activeTab, setActiveTab] = useState("coding");

  return (
    <section className="relative pt-45 pb-20" style={{ background: T.bg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-10">
          <h1 className="font-black mb-3" style={{ color: T.ink, letterSpacing: "-0.03em", fontSize: "clamp(1.9rem,4.5vw,2.75rem)", lineHeight: 1.15 }}>
            Simple, honest{" "}
            <span style={{ background: `linear-gradient(135deg,${T.sky},${T.green})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              fee details
            </span>
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto text-sm mb-5">
            No registration fees. No hidden charges. Pick the right plan for your child — and save with bundles.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <TrustBadge icon={<Lock className="w-3.5 h-3.5" />} text="No hidden fees" />
            <TrustBadge icon={<Gift className="w-3.5 h-3.5" />} text="Free demo class" />
            <TrustBadge icon={<Phone className="w-3.5 h-3.5" />} text="WhatsApp support" />
          </div>
          <IncludedChips />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-8">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2.5 p-3.5 rounded-2xl border-2 text-left transition-all"
              style={{
                background: activeTab === tab.id ? tab.light : "#fff",
                borderColor: activeTab === tab.id ? tab.color : T.border,
              }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: activeTab === tab.id ? tab.color + "20" : tab.light }}>
                <tab.icon className="w-4 h-4" style={{ color: tab.color }} />
              </div>
              <div className="min-w-0">
                <div className="font-black text-xs truncate" style={{ color: activeTab === tab.id ? T.ink : T.textMuted }}>{tab.label}</div>
                <div className="text-[10px] text-slate-400 truncate">{tab.sub}</div>
              </div>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="mb-14">
            {activeTab === "coding" && <CodingSection />}
            {activeTab === "courses" && <CSCoursesSection openDemoModal={openDemoModal} />}
            {activeTab === "academic" && <AcademicSection />}
            {activeTab === "web" && <WebDevSection />}
          </motion.div>
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-14">
          <div className="text-center mb-6">
            <SectionBadge color={T.sky}><HelpCircle className="w-3.5 h-3.5" /> Parent FAQs</SectionBadge>
            <h2 className="font-black text-xl mt-3" style={{ color: T.ink }}>Questions parents always ask</h2>
          </div>
          <FAQ />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="rounded-[2rem] overflow-hidden border-2 relative"
          style={{ borderColor: T.gold + "30" }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg,${T.skyLight},${T.greenLight})` }} />
          <div className="relative z-10 p-8 sm:p-10 text-center">
            <Rocket className="w-8 h-8 mx-auto mb-3" style={{ color: T.green }} />
            <h3 className="font-black text-xl sm:text-2xl mb-2" style={{ color: T.ink }}>
              Not sure which plan? Try a free demo class first
            </h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              30-minute trial session — completely free, no payment, no commitment.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <motion.button
                onClick={() => openDemoModal && openDemoModal("pricing_cta_bottom")}
                whileHover={{ scale: 1.03 }}
                className="px-6 py-3 rounded-2xl text-sm font-black text-white border-none cursor-pointer"
                style={{ background: `linear-gradient(135deg,${T.gold},${T.goldDeep})`, boxShadow: `0 6px 20px ${T.gold}35` }}>
                <Gift className="w-4 h-4 inline mr-1.5" /> Book Free Demo Class
              </motion.button>
              <motion.a href={getWhatsAppLink("Hi! I'd like to know more about Pearlx's programs and book a free demo class.")}
                target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                className="px-6 py-3 rounded-2xl text-sm font-bold border-2 bg-white"
                style={{ color: T.ink, borderColor: T.border }}>
                <MessageCircle className="w-4 h-4 inline mr-1.5" /> Chat on WhatsApp
              </motion.a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}