import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Calculator, FlaskConical, Globe, MessageSquare, Monitor,
  Atom, Microscope, DollarSign, ScrollText, Map, Building2, BarChart2,
  Briefcase, GraduationCap, Target, Users, TrendingUp, Clock,
  CheckCircle2, Award, ArrowRight, Wallet, Gift, Play,
  Sparkles, UserRound, CalendarDays, Star, MessageCircle, Check,
} from "lucide-react";
import { COLORS, FONTS, edgeOf } from "../utils/theme";
import { getWhatsAppLink } from "../utils/whatsapp";
import kidImage from "../assets/kids/RP2.webp";
import { HeroStage, Sticker, SectionHeader, Scribble, FaqList, CtaPanel, ColorBtn, Wave, IconBubble, PearlScatter } from "../components/ui/Brand";

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

const SubjectChip = ({ name, Icon, color, i }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: i * 0.035 }}
    className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3"
    style={{ border: `2px solid ${color}30`, boxShadow: `0 3px 0 ${color}20` }}
  >
    <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18`, color }}>
      <Icon className="w-[18px] h-[18px]" strokeWidth={2.4} />
    </span>
    <span className="text-sm font-extrabold leading-tight" style={{ color: COLORS.ink }}>{name}</span>
  </motion.div>
);

/* The "study desk" card that floats on the hero art */
const StudyDesk = () => (
  <div
    className="absolute z-20 left-[-2%] sm:left-[-6%] bottom-[6%] w-[60%] sm:w-[56%] rounded-[1.6rem] bg-white p-3.5 px-float px-float--slow"
    style={{ "--r": "-3deg", border: "2px solid rgba(15,23,42,0.08)", boxShadow: "0 7px 0 rgba(15,23,42,0.08)" }}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="text-[9px] font-extrabold tracking-widest" style={{ color: COLORS.textMuted }}>TODAY'S STUDY DESK</div>
        <div className="text-sm font-semibold" style={{ fontFamily: FONTS.display, color: COLORS.ink }}>Let's get this one.</div>
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
      <div className="text-xl font-semibold text-white mt-1" style={{ fontFamily: FONTS.display }}>3x + 7 = 22</div>
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
            boxShadow: i === 1 ? `0 2px 0 ${edgeOf(COLORS.emerald)}` : "none",
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
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #F0F9FF 0%, #ECFDF5 100%)" }}>
        <div aria-hidden="true" className="absolute inset-0 px-dots opacity-70" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-40 sm:pt-44 lg:pt-40 pb-4">
          <div className="grid lg:grid-cols-[1fr_0.95fr] gap-10 lg:gap-12 items-center lg:min-h-[600px]">
            <div className="text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[3rem] sm:text-7xl lg:text-[5.2rem] font-semibold leading-[1]"
                style={{ fontFamily: FONTS.display, color: COLORS.ink }}
              >
                School work,
                <br />
                <Scribble color={COLORS.gold} textColor={COLORS.cyan}>made simpler.</Scribble>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12 }}
                className="max-w-lg mx-auto lg:mx-0 mt-7 text-lg sm:text-xl font-semibold leading-relaxed"
                style={{ color: COLORS.textSecondary }}
              >
                Live, personalised tuition aligned to your child's school
                curriculum — with the right teacher and the right pace.
              </motion.p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3.5 mt-8">
                <button onClick={() => openDemoModal?.("academic_hero")} className="px-btn px-btn--grad px-btn--lg">
                  <Play className="w-4 h-4 fill-current" />
                  Book a Free Class
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a href="#subjects" className="px-btn px-btn--white px-btn--lg">
                  Explore subjects
                </a>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mt-8">
                {[
                  [UserRound, "1:1 / 2–3 students", COLORS.emerald],
                  [Target, "Board aligned", COLORS.cyan],
                  [CalendarDays, "Flexible slots", COLORS.goldDeep],
                ].map(([Icon, label, color], i) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white pl-1.5 pr-4 py-1.5 text-[15px] font-semibold"
                    style={{ fontFamily: FONTS.display, border: `2px solid ${color}40`, boxShadow: `0 4px 0 ${color}30`, transform: `rotate(${[-2, 1.5, -1][i]}deg)` }}
                  >
                    <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${color}1f`, color }}>
                      <Icon className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.55 }}>
              <HeroStage image={kidImage} alt="Pearlx student smiling" color={COLORS.cyan} second={COLORS.gold}>
                <Sticker className="top-[8%] right-[0%]" rotate={5}>
                  <div className="text-[11px] font-extrabold tracking-widest" style={{ color: COLORS.cyan }}>ONE STEP AT A TIME</div>
                </Sticker>
                <Sticker className="top-[34%] left-[0%]" rotate={-7} delay={1} style={{ background: COLORS.gold, borderColor: COLORS.gold, boxShadow: `0 5px 0 ${edgeOf(COLORS.gold)}` }}>
                  <div className="text-sm font-semibold" style={{ fontFamily: FONTS.display, color: COLORS.navDark }}>NICE WORK! ⭐</div>
                </Sticker>
                
              </HeroStage>
            </motion.div>
          </div>
        </div>
        <Wave fill="#FFFFFF" className="relative z-10 -mb-px" />
      </section>

      {/* CLASS BAND + PRICING */}
      <section className="relative py-14 sm:py-20">
        <PearlScatter variant="b" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="SIMPLE PRICING" eyebrowIcon={Wallet} color={COLORS.goldDeep} title="Pick the right starting point." className="mb-9" />

          {/* class band picker */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {CLASS_BANDS.map((band) => {
              const selected = activeBand === band.id;
              return (
                <button
                  key={band.id}
                  onClick={() => setActiveBand(band.id)}
                  className="text-left rounded-3xl p-3.5 sm:p-5 transition-all duration-200"
                  style={{
                    background: selected ? band.color : "#fff",
                    color: selected ? onColor(band.color) : COLORS.ink,
                    border: `2px solid ${selected ? band.color : COLORS.border}`,
                    boxShadow: selected ? `0 6px 0 ${edgeOf(band.color)}` : "0 4px 0 rgba(15,23,42,0.05)",
                    transform: selected ? "translateY(-3px)" : "none",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider" style={{ opacity: selected ? 0.9 : 0.6 }}>
                      {band.short}
                    </span>
                    <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ background: selected ? "rgba(255,255,255,0.22)" : band.light, color: selected ? "inherit" : band.color }}>
                      <band.Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                  </div>
                  <div className="text-lg sm:text-2xl font-semibold mt-2" style={{ fontFamily: FONTS.display }}>{band.label}</div>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-6 grid lg:grid-cols-[0.75fr_1.25fr] rounded-[2.25rem] overflow-hidden bg-white"
              style={{ border: `3px solid ${active.color}`, boxShadow: `0 9px 0 ${edgeOf(active.color)}` }}
            >
              {/* fee */}
              <div className="relative p-6 sm:p-8 flex flex-col overflow-hidden" style={{ background: active.color, color: onColor(active.color) }}>
                <span aria-hidden="true" className="absolute -right-14 -bottom-14 w-48 h-48 rounded-full bg-white/15" />
                <span className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center" style={{ color: active.color, transform: "rotate(-6deg)" }}>
                  <active.Icon className="w-7 h-7" />
                </span>
                <div className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] opacity-85">{active.short}</div>
                <div className="text-2xl sm:text-3xl font-semibold mt-1" style={{ fontFamily: FONTS.display }}>{active.focus}</div>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-6xl font-semibold leading-none" style={{ fontFamily: FONTS.display }}>{active.fee}</span>
                  <span className="text-sm font-bold opacity-85 pb-1.5">{active.note}</span>
                </div>
                <button
                  onClick={() => openDemoModal?.(`academic-${active.id}`)}
                  className="px-btn mt-8 relative"
                  style={{ "--btn-bg": "#fff", "--btn-fg": COLORS.ink, "--btn-edge": "rgba(0,0,0,0.2)" }}
                >
                  Try a free class
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* subjects */}
              <div id="subjects" className="scroll-mt-40 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-[11px] font-extrabold tracking-[0.16em]" style={{ color: ink(active.color) }}>SUBJECTS</div>
                    <div className="text-2xl font-semibold" style={{ fontFamily: FONTS.display }}>What can we work on?</div>
                  </div>
                  <span className="hidden sm:flex px-3 py-1.5 rounded-full text-sm font-extrabold" style={{ background: active.light, color: active.color }}>
                    {active.subjects.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {active.subjects.map(([name, Icon], i) => (
                    <SubjectChip key={name} name={name} Icon={Icon} color={active.color} i={i} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 mx-auto w-fit flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-extrabold" style={{ background: COLORS.goldLight, color: COLORS.goldDeep, border: `2px dashed ${COLORS.gold}80` }}>
            <Gift className="w-4 h-4" />
            Bundle sessions and save up to 20%
          </div>
        </div>
      </section>

      {/* BOARDS */}
      <section className="relative py-16 sm:py-20" style={{ background: COLORS.bgSecondary }}>
        <Wave fill="#FFFFFF" flip className="absolute top-0 left-0 right-0" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-4">
          <SectionHeader eyebrow="BOARD ALIGNED" eyebrowIcon={GraduationCap} color={COLORS.cyan} title="The syllabus comes with you." className="mb-10" />
          <div className="flex flex-wrap justify-center gap-4">
            {BOARDS.map(([name, sub, color], i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 14, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
                whileHover={{ y: -6, rotate: 0 }}
                className="w-[44%] sm:w-[30%] lg:w-[18%] rounded-[1.75rem] bg-white p-5 text-center"
                style={{ border: `3px solid ${color}`, boxShadow: `0 6px 0 ${edgeOf(color)}` }}
              >
                <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-white text-base font-semibold" style={{ background: color, fontFamily: FONTS.display }}>
                  <Check className="w-6 h-6" strokeWidth={3} />
                </div>
                <div className="text-2xl font-semibold mt-3" style={{ fontFamily: FONTS.display }}>{name}</div>
                <div className="text-xs font-bold mt-1" style={{ color: COLORS.textMuted }}>{sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section className="relative py-16 sm:py-20" style={{ background: COLORS.bgSecondary }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="THE PEARLX WAY" eyebrowIcon={Sparkles} color={COLORS.emerald} title="Support that actually helps." className="mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUPPORT.map(([Icon, title, sub], index) => {
              const color = [COLORS.emerald, COLORS.cyan, COLORS.goldDeep, COLORS.indigo][index % 4];
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="px-card px-card--lift flex items-center gap-4 p-5"
                  style={{ borderColor: `${color}30`, boxShadow: `0 6px 0 ${color}25` }}
                >
                  <IconBubble icon={Icon} color={color} size={54} iconSize={25} rotate={index % 2 ? 5 : -5} />
                  <div>
                    <div className="text-lg font-semibold" style={{ fontFamily: FONTS.display }}>{title}</div>
                    <div className="text-sm font-bold mt-0.5" style={{ color: COLORS.textMuted }}>{sub}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="QUICK ANSWERS" eyebrowIcon={Star} color={COLORS.indigo} title="A few things parents ask." className="mb-9" />
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
          <ArrowRight className="w-5 h-5" />
        </button>
        <a
          href={getWhatsAppLink("Hi! I'd like to know more about Pearlx Academic Tuition.")}
          target="_blank"
          rel="noopener noreferrer"
          className="px-btn px-btn--lg"
          style={{ "--btn-bg": "rgba(255,255,255,0.1)", "--btn-edge": "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.2)" }}
        >
          <MessageCircle className="w-5 h-5" />
          Ask us
        </a>
      </CtaPanel>
    </main>
  );
};

export default AcademicTuition;