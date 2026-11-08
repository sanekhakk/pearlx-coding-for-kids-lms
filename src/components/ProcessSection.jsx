import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck, UserRoundCheck, GraduationCap, TrendingUp, Flag } from "lucide-react";
import { FONTS, edgeOf, COLORS } from "../utils/theme";
import { SectionHeader, Wave } from "./ui/Brand";

const STEPS = [
  {
    icon: CalendarCheck,
    n: "01",
    title: "Book a free trial",
    text: "Tell us your child's age, interests and goals.",
    color: "#10B981",
  },
  {
    icon: UserRoundCheck,
    n: "02",
    title: "Find the right class",
    text: "We match the child to the right level and teacher.",
    color: "#0EA5E9",
  },
  {
    icon: GraduationCap,
    n: "03",
    title: "Learn & build",
    text: "Live sessions, practice and projects keep learning active.",
    color: "#7C3AED",
  },
  {
    icon: TrendingUp,
    n: "04",
    title: "See the progress",
    text: "Track understanding, confidence and the next milestone.",
    color: "#D97706",
  },
];

const edge = (c) => ({ "#7C3AED": "#5B21B6", "#D97706": "#92400E" }[c] || edgeOf(c));

const ProcessSection = ({ openDemoModal }) => (
  <section id="how-it-works" className="relative overflow-hidden" style={{ background: COLORS.cyanLight }}>
    <Wave fill="#FFFFFF" flip />
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-20 sm:pb-24">
      <SectionHeader
        eyebrow="How it works"
        eyebrowIcon={Flag}
        color={COLORS.cyan}
        title="Getting started is easy."
        sub="No complicated onboarding. Just a simple first step."
        className="mb-14"
      />

      <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
        {/* dotted trail connecting the stepping stones */}
        <svg aria-hidden="true" className="hidden lg:block absolute left-[10%] right-[10%] top-[34px] w-[80%] h-12" viewBox="0 0 800 50" preserveAspectRatio="none">
          <path d="M0 25 C 100 -5, 170 55, 266 25 S 433 -5, 533 25 S 700 55, 800 25" fill="none" stroke="rgba(15,23,42,0.18)" strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" />
        </svg>

        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 150, damping: 18 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              {/* stepping stone */}
              <div
                className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center text-white"
                style={{ background: step.color, boxShadow: `0 6px 0 ${edge(step.color)}` }}
              >
                <Icon size={30} strokeWidth={2.3} />
                <span
                  className="absolute -top-2 -right-3 rounded-full bg-white px-2 py-0.5 text-xs font-semibold"
                  style={{ fontFamily: FONTS.display, color: step.color, border: `2px solid ${step.color}`, transform: "rotate(8deg)" }}
                >
                  {step.n}
                </span>
              </div>

              <div className="px-card mt-6 w-full p-6" style={{ borderColor: `${step.color}30`, boxShadow: `0 6px 0 ${step.color}22` }}>
                <h3 className="text-xl font-semibold" style={{ fontFamily: FONTS.display, color: COLORS.ink }}>{step.title}</h3>
                <p className="mt-2 text-[15px] font-semibold leading-relaxed" style={{ color: COLORS.textMuted }}>{step.text}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 relative overflow-hidden rounded-[2.25rem] px-6 py-8 sm:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        style={{ background: COLORS.navDark, boxShadow: `0 8px 0 ${COLORS.emerald}` }}
      >
        <span aria-hidden="true" className="absolute -right-10 -top-14 w-44 h-44 rounded-full" style={{ background: `${COLORS.cyan}30` }} />
        <div className="relative">
          <h3 className="text-2xl sm:text-3xl font-semibold text-white" style={{ fontFamily: FONTS.display }}>
            Ready to see if Pearlx is right for your child?
          </h3>
          <p className="mt-1.5 text-base font-semibold text-slate-400">Try a class before you decide.</p>
        </div>
        <button onClick={() => openDemoModal("process")} className="px-btn px-btn--green relative shrink-0">
          Book free trial <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  </section>
);

export default ProcessSection;