import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Users, Target, Laptop, Clock3, BadgeCheck, ArrowUpRight, Heart } from "lucide-react";
import kidImage from "../assets/kids/RP2.webp";
import { COLORS } from "../utils/theme";
import { SectionHeader, Scribble, IconBubble, display } from "./ui/Brand";

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
    <section className="relative overflow-hidden bg-white py-12 sm:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        {/* Header */}
        <div className="mb-7 sm:mb-12 flex flex-col gap-2 sm:gap-4 md:flex-row md:items-end md:justify-between text-center md:text-left">
          <SectionHeader
            align="left"
            eyebrow="Why Pearlx"
            eyebrowIcon={Heart}
            color={COLORS.emerald}
            title={<>Good learning feels <Scribble color={COLORS.gold} textColor={COLORS.emerald}>simple.</Scribble></>}
            className="mx-auto md:mx-0"
          />
          <p className="max-w-sm mx-auto md:mx-0 text-sm sm:text-base font-medium leading-relaxed" style={{ color: COLORS.textMuted }}>
            No complicated systems. Just the right teacher, the right pace,
            and classes your child actually enjoys.
          </p>
        </div>

        <div className="grid gap-3 sm:gap-5 lg:grid-cols-[1fr_1.15fr]">
          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative min-h-[300px] sm:min-h-[400px] overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8"
            style={{ background: "linear-gradient(140deg, #10B981 0%, #0EA5E9 130%)" }}
          >
            <div aria-hidden="true" className="absolute -right-16 -bottom-20 h-[260px] w-[260px] sm:h-[340px] sm:w-[340px] rounded-full bg-white/15" />

            <img
              src={kidImage}
              alt="Pearlx student smiling with a tablet"
              className="absolute bottom-0 right-[-8%] h-[52%] sm:h-[72%] w-auto object-contain z-10"
              style={{ filter: "drop-shadow(0 14px 18px rgba(4,47,46,0.25))" }}
            />

            <div className="relative z-20 flex h-full max-w-[100%] sm:max-w-[60%] flex-col justify-between">
              <div>
                <span className="mb-3 sm:mb-5 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-white/20 text-white">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <h3 className="text-lg sm:text-3xl font-extrabold leading-tight tracking-tight text-white" style={display}>
                  We teach the child,
                  <br />
                  not just the subject.
                </h3>
                <p className="mt-2 sm:mt-3 max-w-[68%] sm:max-w-none text-[13px] sm:text-base font-medium leading-relaxed text-emerald-50">
                  Every child learns differently. Our classes keep that
                  difference at the centre of the experience.
                </p>
              </div>

              <div className="mt-4 sm:mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3 sm:pr-4 text-xs sm:text-sm font-bold" style={{ color: COLORS.emerald }}>
                <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full" style={{ background: COLORS.emeraldLight }}>
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
                </span>
                Built around your child
              </div>
            </div>
          </motion.div>

          {/* Benefit tiles */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {BENEFITS.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.35 }}
                className={`px-card px-card--lift p-3.5 sm:p-5 ${index === BENEFITS.length - 1 ? "col-span-2 sm:flex sm:items-center sm:gap-4" : ""}`}
              >
                <IconBubble icon={item.icon} color={item.color} size={36} iconSize={18} />
                <div className={index === BENEFITS.length - 1 ? "mt-2.5 sm:mt-0" : "mt-2.5 sm:mt-3.5"}>
                  <h4 className="text-sm sm:text-lg font-bold leading-snug" style={{ color: COLORS.ink }}>
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed" style={{ color: COLORS.textMuted }}>
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="mt-4 sm:mt-8 flex flex-wrap items-center justify-center sm:justify-between gap-1.5 sm:gap-3 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-center"
          style={{ background: COLORS.cyanLight }}
        >
          <p className="text-[13px] sm:text-base font-bold" style={{ color: COLORS.ink }}>
            One simple goal: make your child better at learning.
          </p>
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.16em]" style={{ color: COLORS.cyan }}>THE PEARLX WAY</span>
        </div>
      </div>
    </section>
  );
};

export default WhyPearlxSection;
export { WhyPearlxSection };