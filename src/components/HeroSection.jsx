import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, Code2, Calculator, BookOpen, Sparkles } from "lucide-react";
import heroKid from "../assets/kids/heroKid.webp";
import { COLORS, FONTS, edgeOf } from "../utils/theme";
import { HeroStage, Sticker, Scribble, Wave, Pearl } from "./ui/Brand";

const HeroSection = ({ openDemoModal }) => {
  const highlights = [
    { icon: Code2, label: "Coding", color: "#10B981" },
    { icon: Calculator, label: "Maths", color: "#F59E0B" },
    { icon: BookOpen, label: "Academic Tuition", color: "#0EA5E9" },
  ];

  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #F0F9FF 0%, #ECFDF5 100%)" }}>
      <div aria-hidden="true" className="absolute inset-0 px-dots opacity-70" />
      <Pearl size={18} color={COLORS.gold} style={{ top: "26%", left: "3%" }} float />
      <Pearl size={12} color={COLORS.indigo} style={{ bottom: "22%", left: "44%" }} float delay={1.4} />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-40 sm:pt-44 lg:pt-40">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-6 lg:gap-10 items-center lg:min-h-[640px] pb-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1
              className="text-[2.75rem] sm:text-6xl lg:text-[4.6rem] font-semibold leading-[1.02]"
              style={{ fontFamily: FONTS.display, color: COLORS.ink }}
            >
              Help your child
              <span className="block mt-1">
                learn with <Scribble color={COLORS.emerald} textColor={COLORS.cyan}>confidence.</Scribble>
              </span>
            </h1>

            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl font-semibold leading-relaxed" style={{ color: COLORS.textSecondary }}>
              Coding, Maths and Academic Tuition designed around your child's
              age, level and learning pace.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mt-7">
              {highlights.map(({ icon: Icon, label, color }, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.08, type: "spring", stiffness: 300 }}
                  className="inline-flex items-center gap-2 rounded-full bg-white pl-1.5 pr-4 py-1.5 text-[15px] font-semibold"
                  style={{ fontFamily: FONTS.display, color: COLORS.ink, border: `2px solid ${color}40`, boxShadow: `0 4px 0 ${color}30`, transform: `rotate(${[-2, 1.5, -1][i]}deg)` }}
                >
                  <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${color}1f`, color }}>
                    <Icon size={17} strokeWidth={2.5} />
                  </span>
                  {label}
                </motion.span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3.5 mt-9">
              <button onClick={() => openDemoModal("hero")} className="px-btn px-btn--grad px-btn--lg">
                <Sparkles size={18} />
                Book a free trial
                <ArrowRight size={18} />
              </button>
              <a href="#programs" className="px-btn px-btn--white px-btn--lg">
                <Play size={17} className="fill-current" style={{ color: COLORS.emerald }} />
                Explore programs
              </a>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 mt-8 text-sm font-bold" style={{ color: COLORS.textSecondary }}>
              {["Personalised learning", "Small groups", "Parent updates"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={18} className="text-emerald-500" strokeWidth={2.6} />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <HeroStage image={heroKid} alt="Child learning coding" color={COLORS.cyan} second={COLORS.emerald}>
              <Sticker className="top-[10%] right-[0%] sm:right-[2%]" rotate={4}>
                <div className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: COLORS.cyan }}>Learning</div>
                <div className="text-base font-semibold" style={{ fontFamily: FONTS.display, color: COLORS.ink }}>At their own pace</div>
              </Sticker>
              <Sticker className="bottom-[12%] left-[0%]" rotate={-5} delay={1.2} style={{ background: COLORS.emerald, borderColor: COLORS.emerald, boxShadow: `0 5px 0 ${edgeOf(COLORS.emerald)}` }}>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-100">Pearlx</div>
                <div className="text-base font-semibold text-white" style={{ fontFamily: FONTS.display }}>Learn · Build · Grow</div>
              </Sticker>
            </HeroStage>
          </motion.div>
        </div>
      </div>

      <Wave fill="#FFFFFF" className="relative z-10 -mb-px" />
    </section>
  );
};

export default HeroSection;