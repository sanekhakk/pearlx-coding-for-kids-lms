import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Users, Target, Laptop, Clock3, BadgeCheck, ArrowUpRight, Heart } from "lucide-react";
import kidImage from "../assets/kids/RP2.webp";
import { COLORS, FONTS, edgeOf } from "../utils/theme";
import { SectionHeader, Scribble, Pearl, IconBubble } from "./ui/Brand";

const BENEFITS = [
  {
    icon: Users,
    title: "Small batches",
    text: "More attention. More interaction. Less sitting quietly in a crowd.",
    color: COLORS.cyan,
  },
  {
    icon: Target,
    title: "Learning that fits",
    text: "Lessons are adjusted to your child's level, pace, and goals.",
    color: COLORS.indigo,
  },
  {
    icon: Laptop,
    title: "Learn by doing",
    text: "Coding, maths, and academics become practical—not just another class.",
    color: COLORS.emerald,
  },
  {
    icon: Clock3,
    title: "Flexible classes",
    text: "Choose timings that work around school and family life.",
    color: COLORS.goldDeep,
  },
  {
    icon: BadgeCheck,
    title: "Progress you can see",
    text: "Regular practice, projects, and feedback keep learning moving forward.",
    color: COLORS.bronze,
  },
];

const WhyPearlxSection = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="mb-12 md:mb-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            align="left"
            eyebrow="Why Pearlx"
            eyebrowIcon={Heart}
            color={COLORS.emerald}
            title={<>Good learning feels <Scribble color={COLORS.gold} textColor={COLORS.emerald}>simple.</Scribble></>}
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-sm text-base font-semibold leading-relaxed"
            style={{ color: COLORS.textMuted }}
          >
            No complicated systems. Just the right teacher, the right pace,
            and classes your child actually enjoys.
          </motion.p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="relative min-h-[460px] overflow-hidden rounded-[2.25rem] p-7 md:p-9"
            style={{ background: COLORS.emerald, boxShadow: `0 10px 0 ${edgeOf(COLORS.emerald)}` }}
          >
            <div aria-hidden="true" className="absolute -right-20 -bottom-24 h-[380px] w-[380px] rounded-full bg-white/15" />
            <div aria-hidden="true" className="absolute right-10 bottom-10 h-[250px] w-[250px] rounded-full bg-white/20" />
            <Pearl size={28} color={COLORS.gold} style={{ top: 28, right: 32 }} float />
            <Pearl size={14} color={COLORS.cyan} style={{ top: 90, right: 90 }} float delay={1} />

            <img
              src={kidImage}
              alt="Pearlx student smiling with a tablet"
              className="absolute bottom-0 right-[-10%] sm:right-[-6%] h-[70%] w-auto object-contain z-10"
              style={{ filter: "drop-shadow(0 18px 22px rgba(4,47,46,0.3))" }}
            />

            <div className="relative z-20 flex h-full max-w-[66%] sm:max-w-[64%] flex-col justify-between">
              <div>
                <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white" style={{ transform: "rotate(-6deg)", boxShadow: "0 4px 0 rgba(0,0,0,0.12)" }}>
                  <Sparkles className="h-6 w-6" style={{ color: COLORS.emerald }} />
                </span>
                <h3 className="text-[1.65rem] md:text-[2.1rem] font-semibold leading-[1.1] text-white" style={{ fontFamily: FONTS.display }}>
                  We teach the child,
                  <br />
                  not just the subject.
                </h3>
                <p className="mt-4 text-base font-semibold leading-relaxed text-emerald-50">
                  Every child learns differently. Our classes keep that
                  difference at the centre of the experience.
                </p>
              </div>

              <div className="mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 text-[15px] font-semibold" style={{ fontFamily: FONTS.display, color: COLORS.emerald, boxShadow: "0 4px 0 rgba(0,0,0,0.12)" }}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: COLORS.emeraldLight }}>
                  <ArrowUpRight className="h-5 w-5" strokeWidth={2.6} />
                </span>
                Built around your child
              </div>
            </div>
          </motion.div>

          {/* Benefit tiles */}
          <div className="grid gap-4 sm:grid-cols-2">
            {BENEFITS.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07, duration: 0.4 }}
                className={`px-card px-card--lift p-5 sm:p-6 ${index === BENEFITS.length - 1 ? "sm:col-span-2 sm:flex sm:items-center sm:gap-5" : ""}`}
                style={{ borderColor: `${item.color}30`, boxShadow: `0 6px 0 ${item.color}26` }}
              >
                <IconBubble icon={item.icon} color={item.color} size={52} iconSize={24} rotate={index % 2 ? 5 : -5} />
                <div className={index === BENEFITS.length - 1 ? "mt-4 sm:mt-0" : "mt-4"}>
                  <h4 className="text-xl font-semibold" style={{ fontFamily: FONTS.display, color: COLORS.ink }}>
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-[15px] font-semibold leading-relaxed" style={{ color: COLORS.textMuted }}>
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-full px-6 py-4"
          style={{ background: COLORS.cyanLight, border: `2px dashed ${COLORS.cyan}55` }}
        >
          <p className="text-base sm:text-lg font-semibold" style={{ fontFamily: FONTS.display, color: COLORS.ink }}>
            One simple goal: make your child better at learning.
          </p>
          <span className="text-xs font-extrabold tracking-[0.18em]" style={{ color: COLORS.cyan }}>THE PEARLX WAY</span>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyPearlxSection;
export { WhyPearlxSection };