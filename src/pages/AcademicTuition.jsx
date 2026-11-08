import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Calculator, FlaskConical, Globe, MessageSquare, Monitor,
  Atom, Microscope, DollarSign, ScrollText, Map, Building2, BarChart2,
  Briefcase, GraduationCap, Target, Users, TrendingUp, Clock,
  CheckCircle2, Award, ArrowRight, Wallet, Gift, Play,
  Sparkles, UserRound, CalendarDays, Star, MessageCircle, Check,
} from "lucide-react";
import { COLORS, FONTS } from "../utils/theme";
import { getWhatsAppLink } from "../utils/whatsapp";
import kidImage from "../assets/kids/RP2.webp";
import { HeroStage, Sticker, SectionHeader, Scribble, FaqList, CtaPanel, IconBubble, PearlScatter, ChipRow, display, glow } from "../components/ui/Brand";

const CLASS_BANDS = [
  {
    id: "foundation",
    label: "Classes 1–7",
    short: "Foundation",
    fee: "₹250",
    note: "per 1-hour session",
    color: COLORS.emerald,
    light: COLORS.emeraldLight,
    Icon: BookOpen,
    focus: "Build strong basics",
    subjects: [
      ["English", BookOpen],
      ["Mathematics", Calculator],
      ["Science", FlaskConical],
      ["Social Studies", Globe],
      ["Hindi", MessageSquare],
      ["Computer Basics", Monitor],
    ],
  },
  {
    id: "middle",
    label: "Classes 8–10",
    short: "Board Focus",
    fee: "₹300",
    note: "per 1-hour session",
    color: COLORS.cyan,
    light: COLORS.cyanLight,
    Icon: Target,
    focus: "Learn. Practise. Prepare.",
    subjects: [
      ["English", BookOpen],
      ["Mathematics", Calculator],
      ["Physics · Chemistry · Biology", FlaskConical],
      ["History · Geography · Civics", Globe],
      ["Hindi / Regional Language", MessageSquare],
      ["Computer Science", Monitor],
      ["Accountancy", BarChart2],
    ],
  },
  {
    id: "senior",
    label: "Classes 11–12",
    short: "Senior School",
    fee: "₹350",
    note: "per 1-hour session",
    color: COLORS.indigo,
    light: COLORS.indigoLight,
    Icon: GraduationCap,
    focus: "Go deeper with confidence",
    subjects: [
      ["Physics", Atom],
      ["Chemistry", FlaskConical],
      ["Mathematics", Calculator],
      ["Biology", Microscope],
      ["English", BookOpen],
      ["Economics", DollarSign],
      ["History", ScrollText],
      ["Geography", Map],
      ["Civics / Political Science", Building2],
      ["Computer Science", Monitor],
      ["Accountancy", BarChart2],
      ["Business Studies", Briefcase],
    ],
  },
];

const BOARDS = [
  ["CBSE", "Central Board", COLORS.emerald],
  ["ICSE", "School curriculum", COLORS.cyan],
  ["ISC", "Senior school", COLORS.indigo],
  ["IGCSE", "International", COLORS.gold],
  ["State Boards", "Across India", COLORS.bronze],
];

const SUPPORT = [
  [Users, "Small batches", "1:1 or 2–3 students"],
  [Target, "Board aligned", "Your exact syllabus"],
  [TrendingUp, "Progress reports", "Clear monthly updates"],
  [Clock, "Flexible slots", "Weekdays or weekends"],
  [CheckCircle2, "Doubt support", "Quick help when needed"],
  [Award, "Certificates", "Celebrate completion"],
];

const FAQS = [
  {
    q: "Which boards do you support?",
    a: "CBSE, ICSE, ISC, IGCSE and State Boards across India.",
  },
  {
    q: "Can I choose more than one subject?",
    a: "Yes. Choose the subjects your child needs and arrange them around your preferred schedule.",
  },
  {
    q: "How does pricing work?",
    a: "Classes 1–7 are ₹250/session, Classes 8–10 are ₹300/session and Classes 11–12 are ₹350/session. Each session is 1 hour.",
  },
  {
    q: "What happens in the first class?",
    a: "We understand the student's level, identify gaps and use that to plan the right learning path.",
  },
  {
    q: "What if my child misses a class?",
    a: "Sessions are recorded, and free rescheduling is available with advance notice.",
  },
];

const onColor = (c) => (c === COLORS.gold ? COLORS.navDark : COLORS.white);
const ink = (c) => (c === COLORS.gold ? COLORS.goldDeep : c);

const SubjectChip = ({ name, Icon, color }) => (
  <div className="flex items-center gap-2 rounded-lg bg-white px-2 py-1.5 sm:px-3 sm:py-2.5" style={{ border: "1px solid #E2E8F0" }}>
    <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: `${color}18`, color: ink(color) }}>
      <Icon className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.4} />
    </span>
    <span className="text-[11px] sm:text-sm font-semibold leading-tight" style={{ color: COLORS.ink }}>{name}</span>
  </div>
);

/* The "study desk" card that floats on the hero art */
const StudyDesk = () => (
  <div
    className="absolute z-20 left-[-2%] sm:left-[-6%] bottom-[6%] w-[60%] sm:w-[56%] rounded-[1.6rem] bg-white p-3.5"
    style={{ border: "2px solid rgba(15,23,42,0.08)", boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 10px 24px -14px rgba(15,23,42,0.28)" }}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="text-[9px] font-extrabold tracking-widest" style={{ color: COLORS.textMuted }}>TODAY'S STUDY DESK</div>
        <div className="text-sm font-bold" style={{ fontFamily: FONTS.display, color: COLORS.ink }}>Let's get this one.</div>
      </div>
      <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: COLORS.emeraldLight, color: COLORS.emerald }}>
        <BookOpen className="w-4 h-4" />
      </span>
    </div>
    <div className="mt-2.5 rounded-2xl p-3" style={{ background: COLORS.navDark }}>
      <div className="flex justify-between text-[9px] font-extrabold tracking-wider">
        <span style={{ color: COLORS.cyan }}>MATHS</span>
        <span style={{ color: COLORS.silver }}>PRACTICE 04</span>
      </div>
      <div className="text-xl font-bold text-white mt-1" style={{ fontFamily: FONTS.display }}>3x + 7 = 22</div>
      <div className="text-[10px] font-bold" style={{ color: COLORS.silver }}>Find x</div>
    </div>
    <div className="mt-2 grid grid-cols-3 gap-1.5">
      {["x = 3", "x = 5", "x = 7"].map((answer, i) => (
        <div
          key={answer}
          className="rounded-xl py-1.5 text-center text-[11px] font-extrabold"
          style={{
            background: i === 1 ? COLORS.emerald : COLORS.bgSecondary,
            color: i === 1 ? "#fff" : COLORS.textSecondary,
            boxShadow: i === 1 ? `0 1px 2px rgba(15,23,42,0.04), 0 10px 24px -14px rgba(15,23,42,0.28)` : "none",
          }}
        >
          {answer}
        </div>
      ))}
    </div>
    <div className="mt-2 grid grid-cols-2 gap-1.5">
      <div className="rounded-xl p-2" style={{ background: COLORS.goldLight }}>
        <div className="text-[8px] font-extrabold tracking-wider" style={{ color: COLORS.goldDeep }}>NEXT UP</div>
        <div className="text-[11px] font-extrabold">Science</div>
      </div>
      <div className="rounded-xl p-2" style={{ background: COLORS.cyanLight }}>
        <div className="text-[8px] font-extrabold tracking-wider" style={{ color: COLORS.cyan }}>PROGRESS</div>
        <div className="text-[11px] font-extrabold">2 concepts done ✓</div>
      </div>
    </div>
  </div>
);

const AcademicTuition = ({ openDemoModal }) => {
  const [activeBand, setActiveBand] = useState("foundation");
  const active = CLASS_BANDS.find((item) => item.id === activeBand);

  return (
    <main className="min-h-screen overflow-hidden bg-white" style={{ color: COLORS.ink }}>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)" }}>
        <div aria-hidden="true" className="absolute inset-0 px-dots opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-[124px] sm:pt-[132px] lg:pt-[140px] pb-8 sm:pb-14">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[2rem] sm:text-5xl lg:text-[3.6rem] font-extrabold leading-[1.08] tracking-tight"
                style={{ ...display, color: COLORS.ink }}
              >
                School work,
                <br />
                <Scribble color={COLORS.gold} textColor={COLORS.cyan}>made simpler.</Scribble>
              </motion.h1>

              <p className="max-w-lg mx-auto lg:mx-0 mt-3 sm:mt-5 text-[15px] sm:text-lg font-medium leading-relaxed" style={{ color: COLORS.textSecondary }}>
                Live, personalised tuition aligned to your child's school
                curriculum — with the right teacher and the right pace.
              </p>

              <div className="flex flex-row justify-center lg:justify-start gap-2.5 mt-5 sm:mt-7">
                <button onClick={() => openDemoModal?.("academic_hero")} className="px-btn px-btn--grad px-btn--lg flex-1 sm:flex-none !px-3 sm:!px-6">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Book a Free Class
                </button>
                <a href="#subjects" className="px-btn px-btn--white px-btn--lg flex-1 sm:flex-none !px-3 sm:!px-6">
                  Explore subjects
                </a>
              </div>

              <ChipRow
                className="mt-4 sm:mt-6"
                items={[
                  [UserRound, "1:1 / 2–3 students", COLORS.emerald],
                  [Target, "Board aligned", COLORS.cyan],
                  [CalendarDays, "Flexible slots", COLORS.goldDeep],
                ]}
              />
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
              <HeroStage image={kidImage} alt="Pearlx student smiling" color={COLORS.cyan} second={COLORS.gold}>
                <Sticker className="top-[8%] right-0">
                  <div className="text-[9px] sm:text-[11px] font-bold tracking-widest" style={{ color: COLORS.cyan }}>ONE STEP AT A TIME</div>
                </Sticker>
                <Sticker className="top-[34%] left-0" style={{ background: COLORS.gold, borderColor: COLORS.gold }}>
                  <div className="text-xs sm:text-sm font-bold" style={{ color: COLORS.navDark }}>NICE WORK! ⭐</div>
                </Sticker>
              </HeroStage>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CLASS BAND + PRICING */}
      <section className="relative py-10 sm:py-16">
        <PearlScatter variant="b" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="SIMPLE PRICING" eyebrowIcon={Wallet} color={COLORS.goldDeep} title="Pick the right starting point." className="mb-5 sm:mb-8" />

          {/* class band picker — all three always visible */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1.5 rounded-2xl max-w-3xl mx-auto" style={{ background: "#F1F5F9", border: "1px solid #E2E8F0" }}>
            {CLASS_BANDS.map((band) => {
              const selected = activeBand === band.id;
              return (
                <button
                  key={band.id}
                  onClick={() => setActiveBand(band.id)}
                  aria-pressed={selected}
                  className="flex flex-col sm:flex-row items-center sm:justify-center gap-1 sm:gap-2.5 rounded-xl px-1.5 py-2 sm:px-3 sm:py-2.5 transition-all"
                  style={{
                    background: selected ? "#fff" : "transparent",
                    boxShadow: selected ? glow(band.color, "40") : "none",
                    border: `1px solid ${selected ? `${band.color}66` : "transparent"}`,
                  }}
                >
                  <span className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: selected ? band.color : band.light, color: selected ? (band.color === COLORS.gold ? COLORS.navDark : "#fff") : ink(band.color) }}>
                    <band.Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                  <span className="text-center sm:text-left leading-tight">
                    <span className="block text-[12px] sm:text-[15px] font-bold" style={{ color: selected ? COLORS.ink : COLORS.textSecondary }}>{band.label}</span>
                    <span className="block text-[10px] sm:text-xs font-semibold mt-0.5" style={{ color: COLORS.textMuted }}>{band.short}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] rounded-2xl sm:rounded-3xl overflow-hidden bg-white"
              style={{ border: `1px solid ${active.color}55`, boxShadow: glow(active.color, "30") }}
            >
              {/* fee */}
              <div className="relative p-4 sm:p-7 flex flex-col overflow-hidden" style={{ background: `linear-gradient(160deg, ${active.color}14, ${active.color}2e)` }}>
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center" style={{ background: active.color, color: active.color === COLORS.gold ? COLORS.navDark : "#fff" }}>
                    <active.Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <div>
                    <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em]" style={{ color: ink(active.color) }}>{active.short}</div>
                    <div className="text-base sm:text-xl font-extrabold leading-tight">{active.focus}</div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-6 flex items-end gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold leading-none tracking-tight">{active.fee}</span>
                  <span className="text-xs sm:text-sm font-semibold pb-1" style={{ color: COLORS.textMuted }}>{active.note}</span>
                </div>
                <button onClick={() => openDemoModal?.(`academic-${active.id}`)} className="px-btn px-btn--grad mt-4 sm:mt-6 w-full sm:w-fit">
                  Try a free class
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* subjects */}
              <div id="subjects" className="scroll-mt-32 p-4 sm:p-7">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.14em]" style={{ color: ink(active.color) }}>SUBJECTS</div>
                    <div className="text-base sm:text-xl font-extrabold">What can we work on?</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: active.light, color: ink(active.color) }}>
                    {active.subjects.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {active.subjects.map(([name, Icon]) => (
                    <SubjectChip key={name} name={name} Icon={Icon} color={active.color} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 mx-auto w-fit flex items-center gap-2 rounded-full px-3.5 py-2 text-xs sm:text-sm font-bold" style={{ background: COLORS.goldLight, color: COLORS.goldDeep }}>
            <Gift className="w-4 h-4" />
            Bundle sessions and save up to 20%
          </div>
        </div>
      </section>

      {/* BOARDS */}
      <section className="relative py-10 sm:py-16" style={{ background: COLORS.bgSecondary }}>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="BOARD ALIGNED" eyebrowIcon={GraduationCap} color={COLORS.cyan} title="The syllabus comes with you." className="mb-5 sm:mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {BOARDS.map(([name, sub, color]) => (
              <div key={name} className="px-card flex items-center gap-2.5 p-3 sm:p-4">
                <span className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 text-white" style={{ background: color }}>
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3} />
                </span>
                <div className="min-w-0">
                  <div className="text-sm sm:text-lg font-extrabold leading-tight">{name}</div>
                  <div className="text-[10px] sm:text-xs font-medium leading-snug" style={{ color: COLORS.textMuted }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section className="relative pb-10 sm:pb-16" style={{ background: COLORS.bgSecondary }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="THE PEARLX WAY" eyebrowIcon={Sparkles} color={COLORS.emerald} title="Support that actually helps." className="mb-5 sm:mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {SUPPORT.map(([Icon, title, sub], index) => {
              const color = [COLORS.emerald, COLORS.cyan, COLORS.goldDeep, COLORS.indigo][index % 4];
              return (
                <div key={title} className="px-card flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 p-3.5 sm:p-5">
                  <IconBubble icon={Icon} color={color} size={36} iconSize={18} />
                  <div>
                    <div className="text-sm sm:text-base font-bold leading-snug">{title}</div>
                    <div className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: COLORS.textMuted }}>{sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-10 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="QUICK ANSWERS" eyebrowIcon={Star} color={COLORS.indigo} title="A few things parents ask." className="mb-5 sm:mb-8" />
          <FaqList items={FAQS} color={COLORS.indigo} />
        </div>
      </section>

      {/* CTA */}
      <CtaPanel
        title="Let's make school feel easier."
        sub="Start with one free class. We'll take it from there."
        image={kidImage}
        color={COLORS.cyan}
      >
        <button onClick={() => openDemoModal?.("academic_cta")} className="px-btn px-btn--grad px-btn--lg">
          Book a Free Class
          <ArrowRight className="w-4 h-4" />
        </button>
        <a
          href={getWhatsAppLink("Hi! I'd like to know more about Pearlx Academic Tuition.")}
          target="_blank"
          rel="noopener noreferrer"
          className="px-btn px-btn--lg"
          style={{ "--btn-bg": "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
        >
          <MessageCircle className="w-4 h-4" />
          Ask us
        </a>
      </CtaPanel>
    </main>
  );
};

export default AcademicTuition;