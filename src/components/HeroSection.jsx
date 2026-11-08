import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, Code2, Calculator, BookOpen } from "lucide-react";
import heroKid from "../assets/kids/heroKid.webp";
import { COLORS } from "../utils/theme";
import { HeroStage, Sticker, Scribble, ChipRow, display } from "./ui/Brand";

const HeroSection = ({ openDemoModal }) => {
  const highlights = [
    [Code2, "Coding", "#10B981"],
    [Calculator, "Maths", "#F59E0B"],
    [BookOpen, "Academic Tuition", "#0EA5E9"],
  ];

  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)" }}>
      <div aria-hidden="true" className="absolute inset-0 px-dots opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-[124px] sm:pt-[132px] lg:pt-[140px] pb-10 sm:pb-14">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <h1
              className="text-[2rem] sm:text-5xl lg:text-[3.6rem] font-extrabold leading-[1.1] tracking-tight"
              style={{ ...display, color: COLORS.ink }}
            >
              Help your child
              <br />
              learn with <Scribble color={COLORS.emerald} textColor={COLORS.cyan}>confidence.</Scribble>
            </h1>

            <p className="mt-3 sm:mt-5 max-w-xl mx-auto lg:mx-0 text-[15px] sm:text-lg font-medium leading-relaxed" style={{ color: COLORS.textSecondary }}>
              Coding, Maths and Academic Tuition designed around your child's
              age, level and learning pace.
            </p>

            <ChipRow items={highlights} className="mt-4 sm:mt-6" />

            <div className="flex flex-row justify-center lg:justify-start gap-2.5 mt-5 sm:mt-7">
              <button onClick={() => openDemoModal("hero")} className="px-btn px-btn--grad px-btn--lg flex-1 sm:flex-none !px-3 sm:!px-6">
                Book a free trial
                <ArrowRight size={16} />
              </button>
              <a href="#programs" className="px-btn px-btn--white px-btn--lg flex-1 sm:flex-none !px-3 sm:!px-6">
                <Play size={14} className="fill-current" style={{ color: COLORS.emerald }} />
                Explore programs
              </a>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-1.5 mt-4 sm:mt-6 text-xs sm:text-sm font-semibold" style={{ color: COLORS.textSecondary }}>
              {["Personalised learning", "Small groups", "Parent updates"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-500" strokeWidth={2.4} />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <HeroStage image={heroKid} alt="Child learning coding" color={COLORS.cyan} second={COLORS.emerald}>
              <Sticker className="top-[12%] right-0 sm:right-[2%]">
                <div className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider" style={{ color: COLORS.cyan }}>Learning</div>
                <div className="text-xs sm:text-sm font-bold" style={{ color: COLORS.ink }}>At their own pace</div>
              </Sticker>
              <Sticker className="bottom-[12%] left-0" style={{ background: COLORS.emerald, borderColor: COLORS.emerald }}>
                <div className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-100">Pearlx</div>
                <div className="text-xs sm:text-sm font-bold text-white">Learn · Build · Grow</div>
              </Sticker>
            </HeroStage>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;