import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Calculator, GraduationCap, BookOpen, Users, Sparkles,
  Check, ChevronDown, Gift, MessageCircle, Play,
  Video, BarChart3, RefreshCw, PlayCircle, Award, ShieldCheck,
  Zap, ArrowRight, Clock, Layers3, Heart, Star, User,
} from "lucide-react";
import { COLORS, FONTS, edgeOf } from "../utils/theme";
import { getWhatsAppLink } from "../utils/whatsapp";
import { SectionHeader, Scribble, FaqList, CtaPanel, ColorBtn, Pearl, IconBubble } from "../components/ui/Brand";
import heroKid from "../assets/kids/LP1.webp";

const TABS = [
  {
    id: "coding",
    label: "Kids Coding",
    icon: Code2,
    color: COLORS.indigo,
    light: COLORS.indigoLight,
  },
  {
    id: "maths",
    label: "Maths Classes",
    icon: Calculator,
    color: COLORS.bronze,
    light: COLORS.bronzeLight,
  },
  {
    id: "courses",
    label: "Courses",
    icon: GraduationCap,
    color: COLORS.cyan,
    light: COLORS.cyanLight,
  },
  {
    id: "academic",
    label: "Academic Tuition",
    icon: BookOpen,
    color: COLORS.emerald,
    light: COLORS.emeraldLight,
  },
];

const CODING_TIERS = [
  {
    label: "Little Pearls",
    tagline: "First steps into coding — playful & visual",
    hourly: 350, monthly: 2800, grpHourly: 210, grpMonthly: 1680,
    packages: [
      { c: 30, p: 8499, d: 19, label: "Starter" },
      { c: 45, p: 12499, d: 21, label: "Explorer" },
      { c: 90, p: 23499, d: 23, label: "Builder" },
      { c: 150, p: 37499, d: 27, label: "Champion", popular: true },
    ],
    grpPackages: [
      { c: 30, p: 5499, d: 13, label: "Starter" },
      { c: 45, p: 8499, d: 10, label: "Explorer" },
      { c: 90, p: 17499, d: 7, label: "Builder" },
      { c: 150, p: 28999, d: 8, label: "Champion", popular: true },
    ],
  },
  {
    label: "Bright Pearls",
    tagline: "Deeper logic & first real projects",
    hourly: 400, monthly: 3200, grpHourly: 240, grpMonthly: 1920,
    packages: [
      { c: 30, p: 9499, d: 21, label: "Starter" },
      { c: 45, p: 14499, d: 19, label: "Explorer" },
      { c: 90, p: 27499, d: 24, label: "Builder" },
      { c: 150, p: 43999, d: 27, label: "Champion", popular: true },
    ],
    grpPackages: [
      { c: 30, p: 6499, d: 10, label: "Starter" },
      { c: 45, p: 9999, d: 7, label: "Explorer" },
      { c: 90, p: 19999, d: 7, label: "Builder" },
      { c: 150, p: 33499, d: 7, label: "Champion", popular: true },
    ],
  },
  {
    label: "Rising Pearls",
    tagline: "Advanced coding, apps & real-world projects",
    hourly: 500, monthly: 4000, grpHourly: 300, grpMonthly: 2400,
    packages: [
      { c: 30, p: 11999, d: 20, label: "Starter" },
      { c: 45, p: 17999, d: 20, label: "Explorer" },
      { c: 90, p: 33999, d: 24, label: "Builder" },
      { c: 150, p: 54999, d: 27, label: "Champion", popular: true },
    ],
    grpPackages: [
      { c: 30, p: 7999, d: 11, label: "Starter" },
      { c: 45, p: 12499, d: 7, label: "Explorer" },
      { c: 90, p: 24999, d: 7, label: "Builder" },
      { c: 150, p: 41999, d: 7, label: "Champion", popular: true },
    ],
  },
];

const MATHS_TIERS = [
  {
    label: "Little Pearls",
    tagline: "Number sense through play & pictures",
    hourly: 350, monthly: 2800, grpHourly: 210, grpMonthly: 1680,
    packages: [
      { c: 30, p: 8499, d: 19, label: "Starter" },
      { c: 45, p: 12499, d: 21, label: "Explorer" },
      { c: 90, p: 23499, d: 23, label: "Builder" },
      { c: 150, p: 37499, d: 27, label: "Champion", popular: true },
    ],
    grpPackages: [
      { c: 30, p: 5499, d: 13, label: "Starter" },
      { c: 45, p: 8499, d: 10, label: "Explorer" },
      { c: 90, p: 17499, d: 7, label: "Builder" },
      { c: 150, p: 28999, d: 8, label: "Champion", popular: true },
    ],
  },
  {
    label: "Bright Pearls",
    tagline: "Arithmetic, fractions & first geometry",
    hourly: 400, monthly: 3200, grpHourly: 240, grpMonthly: 1920,
    packages: [
      { c: 30, p: 9499, d: 21, label: "Starter" },
      { c: 45, p: 14499, d: 19, label: "Explorer" },
      { c: 90, p: 27499, d: 24, label: "Builder" },
      { c: 150, p: 43999, d: 27, label: "Champion", popular: true },
    ],
    grpPackages: [
      { c: 30, p: 6499, d: 10, label: "Starter" },
      { c: 45, p: 9999, d: 7, label: "Explorer" },
      { c: 90, p: 19999, d: 7, label: "Builder" },
      { c: 150, p: 33499, d: 7, label: "Champion", popular: true },
    ],
  },
  {
    label: "Rising Pearls",
    tagline: "Algebra, advanced geometry & olympiad math",
    hourly: 500, monthly: 4000, grpHourly: 300, grpMonthly: 2400,
    packages: [
      { c: 30, p: 11999, d: 20, label: "Starter" },
      { c: 45, p: 17999, d: 20, label: "Explorer" },
      { c: 90, p: 33999, d: 24, label: "Builder" },
      { c: 150, p: 54999, d: 27, label: "Champion", popular: true },
    ],
    grpPackages: [
      { c: 30, p: 7999, d: 11, label: "Starter" },
      { c: 45, p: 12499, d: 7, label: "Explorer" },
      { c: 90, p: 24999, d: 7, label: "Builder" },
      { c: 150, p: 41999, d: 7, label: "Champion", popular: true },
    ],
  },
];

const ACADEMIC_TIERS = [
  {
    label: "Classes 1–7",
    boards: "CBSE · ICSE · State Boards",
    hourly: 250, monthly: 2000, grpHourly: 150, grpMonthly: 1200,
  },
  {
    label: "Classes 8–10",
    boards: "CBSE · ICSE · IGCSE · State Boards",
    hourly: 300, monthly: 2400, grpHourly: 180, grpMonthly: 1440,
  },
  {
    label: "Classes 11–12",
    boards: "CBSE · ISC · IGCSE · State Boards",
    hourly: 350, monthly: 2800, grpHourly: 210, grpMonthly: 1680,
  },
];

const ACADEMIC_SUBJECTS = [
  "Mathematics", "Science", "English", "Social Science",
  "Computer Science", "Informatics Practices", "Accountancy",
  "Economics", "Business Studies", "Second Language",
];

const CS_COURSES = [
  {
    lang: "Python",
    bootcamp: {
      name: "Python Launchpad Bootcamp",
      duration: "2 Months",
      price: 4999,
      offerPrice: 3999,
      discount: 20,
    },
    intense: { name: "Python Pro Intensive Program", duration: "6 Months" },
    color: COLORS.cyan,
    light: COLORS.cyanLight,
  },
  {
    lang: "Java",
    bootcamp: {
      name: "Java Kickstart Bootcamp",
      duration: "2 Months",
      price: 4999,
      offerPrice: 3999,
      discount: 20,
    },
    intense: { name: "Java Mastery Intensive Program", duration: "6 Months" },
    color: COLORS.indigo,
    light: COLORS.indigoLight,
  },
  {
    lang: "Web Development",
    bootcamp: {
      name: "Web Dev Launchpad Bootcamp",
      duration: "2 Months",
      price: 5999,
      offerPrice: 4799,
      discount: 20,
    },
    intense: { name: "Full Stack Intensive Program", duration: "6 Months" },
    color: COLORS.emerald,
    light: COLORS.emeraldLight,
  },
];

const INCLUDED = [
  [Video, "Live classes"],
  [BarChart3, "Monthly reports"],
  [RefreshCw, "Free rescheduling"],
  [PlayCircle, "Session recordings"],
  [Award, "Certificate"],
  [MessageCircle, "WhatsApp support"],
];

const FAQS = [
  ["Is there a registration fee?", "No. There are no registration or material fees. You only pay for the sessions or programme you choose."],
  ["Can I try before paying?", "Yes. Book a free 30-minute demo class with no payment or commitment."],
  ["What happens if a class is missed?", "Sessions are recorded, and free rescheduling is available with advance notice."],
  ["Do you support groups?", "Yes. Group pricing is available for 2–3 students."],
  ["Which boards do you support?", "CBSE, ICSE, ISC, IGCSE and State Boards are supported across the relevant academic programmes."],
];

const money = (value) => `₹${value.toLocaleString("en-IN")}`;
const display = { fontFamily: FONTS.display };
const ink = (c) => (c === COLORS.gold ? COLORS.goldDeep : c);
const LEVEL_DOTS = [COLORS.gold, COLORS.emerald, COLORS.indigo];

function Pill({ children, color, light }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold"
      style={{ color, background: light, border: `2px solid ${color}30` }}
    >
      {children}
    </span>
  );
}

function IncludedStrip() {
  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {INCLUDED.map(([Icon, label], i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.05, type: "spring", stiffness: 300 }}
          className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-4"
          style={{ border: `2px solid ${COLORS.border}`, boxShadow: "0 3px 0 rgba(15,23,42,0.05)", transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }}
        >
          <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: COLORS.emeraldLight, color: COLORS.emerald }}>
            <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-extrabold whitespace-nowrap">{label}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* Solo / group switch */
function ModeSwitch({ mode, setMode, color }) {
  return (
    <div className="inline-flex p-1.5 rounded-full bg-white" style={{ border: `2px solid ${COLORS.border}` }}>
      {[
        ["solo", "1:1", User],
        ["group", "Group · 2–3", Users],
      ].map(([id, label, Icon]) => {
        const on = mode === id;
        return (
          <button
            key={id}
            onClick={() => setMode(id)}
            className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ ...display, color: on ? (color === COLORS.gold ? COLORS.navDark : "#fff") : COLORS.textMuted }}
          >
            {on && (
              <motion.span layoutId={`mode-${color}`} className="absolute inset-0 rounded-full" style={{ background: color, boxShadow: `0 3px 0 ${edgeOf(color)}` }} transition={{ type: "spring", bounce: 0.25, duration: 0.4 }} />
            )}
            <Icon className="relative w-4 h-4" />
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PackageGrid({ packages, color }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {packages.map((pkg) => (
        <div
          key={`${pkg.label}-${pkg.c}`}
          className="relative rounded-3xl p-4 text-center"
          style={{
            background: pkg.popular ? color : "#fff",
            color: pkg.popular ? "#fff" : COLORS.ink,
            border: `2px solid ${pkg.popular ? color : COLORS.border}`,
            boxShadow: pkg.popular ? `0 5px 0 ${edgeOf(color)}` : "0 4px 0 rgba(15,23,42,0.04)",
          }}
        >
          {pkg.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold whitespace-nowrap" style={{ background: COLORS.gold, color: COLORS.navDark }}>
              <Star className="w-3 h-3 fill-current" /> BEST VALUE
            </div>
          )}
          <div className="text-[11px] font-extrabold uppercase tracking-wider mt-1" style={{ color: pkg.popular ? "rgba(255,255,255,0.85)" : color }}>
            {pkg.label}
          </div>
          <div className="text-2xl font-semibold mt-2" style={display}>{money(pkg.p)}</div>
          <div className="text-xs font-bold mt-0.5" style={{ opacity: 0.7 }}>{pkg.c} sessions</div>
          <div
            className="inline-block mt-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold"
            style={{ background: pkg.popular ? "rgba(255,255,255,0.2)" : `${color}14`, color: pkg.popular ? "#fff" : color }}
          >
            Save {pkg.d}%
          </div>
        </div>
      ))}
    </div>
  );
}

function TierCard({ tier, color, mode, open, onToggle, index }) {
  const solo = mode === "solo";
  const hourly = solo ? tier.hourly : tier.grpHourly;
  const monthly = solo ? tier.monthly : tier.grpMonthly;
  const packages = solo ? tier.packages : tier.grpPackages;
  const dot = LEVEL_DOTS[index % 3];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-[1.75rem] bg-white overflow-hidden"
      style={{ border: `2px solid ${open ? color : COLORS.border}`, boxShadow: open ? `0 6px 0 ${color}40` : "0 4px 0 rgba(15,23,42,0.04)" }}
    >
      <button onClick={onToggle} aria-expanded={open} className="w-full text-left p-3.5 sm:p-5 flex items-center gap-2.5 sm:gap-4">
        <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 text-white text-lg font-semibold" style={{ ...display, background: dot, transform: "rotate(-5deg)" }}>
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-base sm:text-xl font-semibold leading-tight" style={display}>{tier.label}</div>
          <div className="text-xs sm:text-sm font-bold mt-0.5 truncate" style={{ color: COLORS.textMuted }}>
            {tier.tagline || tier.boards}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xl sm:text-3xl font-semibold leading-none" style={{ ...display, color: ink(color) }}>
            {money(hourly)}
            <span className="hidden sm:inline text-xs font-bold" style={{ color: COLORS.textMuted, fontFamily: FONTS.body }}>/session</span>
          </div>
          <div className="text-[10px] sm:text-xs font-bold mt-1" style={{ color: COLORS.textMuted }}>
            <span className="sm:hidden">per session · </span>{money(monthly)} / 8 sessions
          </div>
        </div>
        <span
          className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center shrink-0 transition-transform duration-300"
          style={{ background: open ? color : `${color}14`, color: open ? "#fff" : color, transform: open ? "rotate(180deg)" : "none" }}
        >
          <ChevronDown className="w-5 h-5" strokeWidth={2.8} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && packages && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 sm:px-5 pb-6 pt-4 border-t-2 border-dashed" style={{ borderColor: `${color}25`, background: `${color}06` }}>
              <div className="flex items-center gap-2 mb-5">
                <Layers3 className="w-4 h-4" style={{ color }} />
                <span className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: COLORS.textMuted }}>
                  Package savings
                </span>
              </div>
              <PackageGrid packages={packages} color={color} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TierList({ tiers, color }) {
  const [mode, setMode] = useState("solo");
  const [open, setOpen] = useState(0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: COLORS.textMuted }}>
          Choose class format
        </div>
        <ModeSwitch mode={mode} setMode={setMode} color={color} />
      </div>
      <div className="space-y-3">
        {tiers.map((tier, index) => (
          <TierCard
            key={tier.label}
            tier={tier}
            color={color}
            mode={mode}
            index={index}
            open={open === index}
            onToggle={() => setOpen(open === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
}

function PanelHeading({ icon, color, title, sub }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <IconBubble icon={icon} color={color} size={56} iconSize={27} rotate={-6} />
      <div>
        <div className="text-2xl sm:text-3xl font-semibold" style={display}>{title}</div>
        <div className="text-sm font-bold mt-0.5" style={{ color: COLORS.textMuted }}>{sub}</div>
      </div>
    </div>
  );
}

function CodingMaths({ type, openDemoModal }) {
  const coding = type === "coding";
  const color = coding ? COLORS.indigo : COLORS.bronze;
  const tiers = coding ? CODING_TIERS : MATHS_TIERS;

  return (
    <div>
      <PanelHeading
        icon={coding ? Code2 : Calculator}
        color={color}
        title={coding ? "Kids Coding" : "Maths Classes"}
        sub={coding ? "Three Pearlx levels. Same simple pricing." : "Three Pearlx levels. Learn at the right pace."}
      />
      <TierList tiers={tiers} color={color} />
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <ColorBtn color={color} className="flex-1" onClick={() => openDemoModal?.(`pricing_${type}`)}>
          <Play className="w-4 h-4 fill-current" />
          Try a free class
        </ColorBtn>
        <a
          href={getWhatsAppLink(`Hi! I'd like to know more about Pearlx ${coding ? "Kids Coding" : "Maths Classes"} pricing.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-btn px-btn--white"
        >
          Ask us
          <MessageCircle className="w-4 h-4" style={{ color: COLORS.emerald }} />
        </a>
      </div>
    </div>
  );
}

function AcademicPricing({ openDemoModal }) {
  const [mode, setMode] = useState("solo");

  return (
    <div>
      <PanelHeading icon={BookOpen} color={COLORS.emerald} title="Academic Tuition" sub="One clear rate for the class band. Subjects can be mixed." />

      <div className="rounded-3xl p-4 mb-5" style={{ background: COLORS.emeraldLight, border: `2px dashed ${COLORS.emerald}50` }}>
        <div className="flex flex-wrap gap-2">
          {ACADEMIC_SUBJECTS.map((subject) => (
            <span key={subject} className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-white" style={{ color: COLORS.emerald }}>
              {subject}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end mb-5">
        <ModeSwitch mode={mode} setMode={setMode} color={COLORS.emerald} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {ACADEMIC_TIERS.map((tier, index) => {
          const hourly = mode === "solo" ? tier.hourly : tier.grpHourly;
          const monthly = mode === "solo" ? tier.monthly : tier.grpMonthly;
          const dot = LEVEL_DOTS[index];
          return (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative rounded-[1.75rem] bg-white p-5 overflow-hidden"
              style={{ border: `2px solid ${COLORS.emerald}35`, boxShadow: `0 6px 0 ${COLORS.emerald}30` }}
            >
              <span aria-hidden="true" className="absolute -right-8 -top-8 w-24 h-24 rounded-full" style={{ background: `${dot}20` }} />
              <div className="relative text-[11px] font-extrabold uppercase tracking-widest" style={{ color: COLORS.emerald }}>
                {tier.label}
              </div>
              <div className="relative text-4xl font-semibold mt-2" style={display}>{money(hourly)}</div>
              <div className="text-xs font-bold mt-0.5" style={{ color: COLORS.textMuted }}>per session</div>
              <div className="mt-4 pt-4 border-t-2 border-dashed" style={{ borderColor: COLORS.border }}>
                <div className="text-sm font-extrabold">{money(monthly)} / 8 sessions</div>
                <div className="text-xs font-bold mt-1" style={{ color: COLORS.textMuted }}>{tier.boards}</div>
              </div>
              <ColorBtn color={COLORS.emerald} className="w-full mt-5 px-btn--sm" onClick={() => openDemoModal?.(`pricing_academic_${index}`)}>
                Try a free class
              </ColorBtn>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 rounded-full px-5 py-3 flex items-center gap-2.5 w-fit" style={{ background: COLORS.goldLight, color: COLORS.goldDeep }}>
        <Gift className="w-4 h-4 shrink-0" />
        <span className="text-sm font-extrabold">Bundle 2+ subjects and save up to 20%.</span>
      </div>
    </div>
  );
}

function CoursePricing() {
  return (
    <div>
      <PanelHeading icon={GraduationCap} color={COLORS.cyan} title="Computer Science Courses" sub="Bootcamp pricing is shown upfront. Intensive programmes are enquiry based." />

      <div className="relative overflow-hidden rounded-3xl p-4 sm:p-5 mb-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)", boxShadow: `0 6px 0 ${edgeOf(COLORS.emerald)}` }}>
        <Pearl size={22} color={COLORS.gold} style={{ top: 12, right: 18 }} float />
        <span className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0" style={{ transform: "rotate(-6deg)" }}>
          <Gift className="w-6 h-6" style={{ color: COLORS.emerald }} />
        </span>
        <div className="flex-1 text-white">
          <div className="text-lg font-semibold" style={display}>2026 +2 Passed Students</div>
          <div className="text-sm font-bold opacity-90">Get 20% OFF all bootcamps.</div>
        </div>
        <a
          href={getWhatsAppLink("Hi! I'd like to claim the 20% OFF bootcamp offer for +2 passed students at Pearlx.")}
          target="_blank"
          rel="noopener noreferrer"
          className="px-btn px-btn--sm relative"
          style={{ "--btn-bg": "#fff", "--btn-fg": COLORS.ink, "--btn-edge": "rgba(0,0,0,0.2)" }}
        >
          Claim offer
        </a>
      </div>

      <div className="space-y-4">
        {CS_COURSES.map((course) => (
          <div
            key={course.lang}
            className="rounded-[1.75rem] bg-white overflow-hidden"
            style={{ border: `2px solid ${course.color}45`, boxShadow: `0 6px 0 ${course.color}30` }}
          >
            <div className="px-4 sm:px-5 py-4 flex items-center gap-3" style={{ background: course.light }}>
              <span className="w-11 h-11 rounded-2xl flex items-center justify-center text-white" style={{ background: course.color, transform: "rotate(-5deg)" }}>
                <span className="text-sm font-semibold" style={display}>{course.lang === "Web Development" ? "</>" : course.lang.slice(0, 2).toUpperCase()}</span>
              </span>
              <div className="text-xl font-semibold" style={display}>{course.lang}</div>
            </div>
            <div className="grid md:grid-cols-2">
              <div className="p-4 sm:p-5">
                <Pill color={course.color} light={course.light}>
                  <Zap className="w-3 h-3" /> BOOTCAMP · {course.bootcamp.duration}
                </Pill>
                <div className="flex flex-wrap items-end gap-2 mt-3">
                  <span className="text-sm font-bold line-through" style={{ color: COLORS.textMuted }}>{money(course.bootcamp.price)}</span>
                  <span className="text-3xl font-semibold leading-none" style={display}>{money(course.bootcamp.offerPrice)}</span>
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full text-white" style={{ background: course.color, transform: "rotate(-4deg)" }}>
                    {course.bootcamp.discount}% OFF
                  </span>
                </div>
                <div className="text-sm font-bold mt-2" style={{ color: COLORS.textMuted }}>{course.bootcamp.name}</div>
              </div>
              <div className="p-4 sm:p-5 border-t-2 md:border-t-0 md:border-l-2 border-dashed" style={{ borderColor: `${course.color}30` }}>
                <Pill color={COLORS.goldDeep} light={COLORS.goldLight}>
                  <Clock className="w-3 h-3" /> INTENSIVE · {course.intense.duration}
                </Pill>
                <div className="text-2xl font-semibold mt-3" style={display}>Custom pricing</div>
                <div className="text-sm font-bold mt-1" style={{ color: COLORS.textMuted }}>{course.intense.name}</div>
                <a
                  href={getWhatsAppLink(`Hi! I'm interested in ${course.intense.name} at Pearlx. Please share details.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full text-sm font-extrabold"
                  style={{ border: `2px solid ${course.color}`, color: course.color }}
                >
                  Enquire <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Pricing({ openDemoModal }) {
  const [activeTab, setActiveTab] = useState("coding");
  const activeTabData = TABS.find((tab) => tab.id === activeTab);

  return (
    <main className="min-h-screen overflow-hidden" style={{ background: COLORS.bgSecondary, color: COLORS.ink }}>
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-[560px]" style={{ background: "linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)" }} />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[560px] px-dots opacity-70" />
        <Pearl size={26} color={COLORS.gold} style={{ top: 220, left: "8%" }} float />
        <Pearl size={16} color={COLORS.indigo} style={{ top: 300, right: "12%" }} float delay={1} />
        <img
          src={heroKid}
          alt=""
          aria-hidden="true"
          className="hidden xl:block absolute right-[3%] top-[150px] h-[300px] w-auto object-contain px-float px-float--slow"
          style={{ "--r": "4deg", filter: "drop-shadow(0 16px 18px rgba(15,23,42,0.15))" }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative pt-40 sm:pt-44 pb-16">
          {/* HERO */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-[3.2rem] sm:text-7xl font-semibold leading-[1]" style={{ ...display, color: COLORS.ink }}>
              Pick a plan.
              <br />
              <Scribble color={COLORS.gold} textColor={COLORS.emerald}>Keep learning.</Scribble>
            </h1>
            <p className="text-lg sm:text-xl font-semibold max-w-xl mx-auto mt-7 leading-relaxed" style={{ color: COLORS.textSecondary }}>
              Clear prices, flexible formats and no surprise charges.
              Choose what fits your child and change it when you need to.
            </p>
            <div className="mt-8">
              <IncludedStrip />
            </div>
          </div>

          {/* CATEGORY PICKER */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="rounded-3xl p-4 text-left transition-all duration-200"
                  style={{
                    background: active ? tab.color : "#fff",
                    color: active ? "#fff" : COLORS.ink,
                    border: `2px solid ${active ? tab.color : COLORS.border}`,
                    boxShadow: active ? `0 6px 0 ${edgeOf(tab.color)}` : "0 4px 0 rgba(15,23,42,0.05)",
                    transform: active ? "translateY(-3px)" : "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: active ? "rgba(255,255,255,0.22)" : tab.light, color: active ? "#fff" : tab.color }}>
                      <tab.icon className="w-5 h-5" strokeWidth={2.4} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-base sm:text-lg font-semibold leading-tight" style={display}>{tab.label}</div>
                      <div className="text-[11px] sm:text-xs font-bold mt-0.5" style={{ opacity: active ? 0.85 : 0.6 }}>
                        {tab.id === "courses" ? "Bootcamps & intensives" : tab.id === "academic" ? "School subjects" : "Flexible classes"}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ACTIVE PRICING */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-6 rounded-[2.25rem] bg-white p-4 sm:p-7 lg:p-8"
            style={{ border: `3px solid ${activeTabData.color}`, boxShadow: `0 9px 0 ${edgeOf(activeTabData.color)}` }}
          >
            {activeTab === "coding" && <CodingMaths type="coding" openDemoModal={openDemoModal} />}
            {activeTab === "maths" && <CodingMaths type="maths" openDemoModal={openDemoModal} />}
            {activeTab === "courses" && <CoursePricing />}
            {activeTab === "academic" && <AcademicPricing openDemoModal={openDemoModal} />}
          </motion.div>

          {/* VALUE NOTE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            {[
              [ShieldCheck, "No hidden fees", "What you see is what you pay", COLORS.emerald],
              [Heart, "Free demo", "Try before you commit", COLORS.cyan],
              [Star, "Flexible learning", "Solo or small group", COLORS.goldDeep],
            ].map(([Icon, title, sub, color]) => (
              <div key={title} className="px-card flex items-center gap-4 p-5" style={{ borderColor: `${color}30`, boxShadow: `0 6px 0 ${color}25` }}>
                <IconBubble icon={Icon} color={color} size={50} iconSize={24} />
                <div>
                  <div className="text-lg font-semibold" style={display}>{title}</div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: COLORS.textMuted }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <section className="max-w-3xl mx-auto mt-20">
            <SectionHeader eyebrow="QUICK ANSWERS" eyebrowIcon={MessageCircle} color={COLORS.cyan} title="Pricing questions, answered." className="mb-9" />
            <FaqList items={FAQS.map(([q, a]) => ({ q, a }))} color={COLORS.cyan} />
          </section>
        </div>

        {/* FINAL CTA */}
        <CtaPanel title="Not sure where to start?" sub="Try one free class. We'll help you pick the right fit." image={heroKid} color={COLORS.gold}>
          <button onClick={() => openDemoModal?.("pricing_cta_bottom")} className="px-btn px-btn--grad px-btn--lg">
            <Play className="w-4 h-4 fill-current" />
            Book Free Demo
            <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href={getWhatsAppLink("Hi! I'd like to know more about Pearlx pricing and book a free demo class.")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-btn px-btn--lg"
            style={{ "--btn-bg": "rgba(255,255,255,0.1)", "--btn-edge": "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.2)" }}
          >
            Chat on WhatsApp
            <MessageCircle className="w-5 h-5" />
          </a>
        </CtaPanel>
      </section>
    </main>
  );
}