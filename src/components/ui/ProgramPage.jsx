import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Zap, Medal, MessageCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getWhatsAppLink } from "../../utils/whatsapp";
import { COLORS, FONTS, edgeOf } from "../../utils/theme";
import {
  HeroStage, Sticker, SectionHeader, LevelTab, FaqList, CtaPanel, ColorBtn, Wave, Pearl, IconBubble,
} from "./Brand";

/* =========================================================
   PROGRAM PAGE
   Shared layout for the level-based programmes (Coding and
   Maths). Each page passes in its own content.
========================================================= */

const onColor = (c) => (c === COLORS.gold ? COLORS.navDark : COLORS.white);

/* ---------- Hero ---------- */
const ProgramHero = ({ hero, openDemoModal }) => (
  <section className="relative overflow-hidden" style={{ background: hero.wash }}>
    <div aria-hidden="true" className="absolute inset-0 px-dots opacity-70" />
    {hero.doodles?.map(([ch, color, pos], i) => (
      <span
        key={i}
        aria-hidden="true"
        className="absolute hidden sm:block px-float select-none text-4xl font-semibold"
        style={{ ...pos, color, fontFamily: FONTS.display, "--r": `${i % 2 ? 10 : -10}deg`, animationDelay: `${i * 0.5}s`, opacity: 0.55 }}
      >
        {ch}
      </span>
    ))}

    <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-40 sm:pt-44 lg:pt-40 pb-4">
      <div className="grid lg:grid-cols-[1fr_0.95fr] gap-8 lg:gap-12 items-center lg:min-h-[600px]">
        <div className="text-center lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-[3.2rem] sm:text-7xl lg:text-[5.4rem] font-semibold leading-[0.98]"
            style={{ fontFamily: FONTS.display, color: COLORS.ink }}
          >
            {hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="max-w-lg mx-auto lg:mx-0 mt-6 text-lg sm:text-xl font-semibold leading-relaxed"
            style={{ color: COLORS.textSecondary }}
          >
            {hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3.5 mt-8"
          >
            <button onClick={() => openDemoModal?.(hero.ctaSource)} className="px-btn px-btn--grad px-btn--lg">
              <Play className="w-4 h-4 fill-current" />
              {hero.ctaLabel}
              <ArrowRight className="w-5 h-5" />
            </button>
            <a href="#levels" className="px-btn px-btn--white px-btn--lg">
              Explore levels
            </a>
          </motion.div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mt-8">
            {hero.chips.map(([I, label, color], i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.07, type: "spring", stiffness: 300 }}
                className="inline-flex items-center gap-2 rounded-full bg-white pl-1.5 pr-4 py-1.5 text-[15px] font-semibold"
                style={{ fontFamily: FONTS.display, color: COLORS.ink, border: `2px solid ${color}40`, boxShadow: `0 4px 0 ${color}30`, transform: `rotate(${[-2, 1.5, -1][i % 3]}deg)` }}
              >
                <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${color}1f`, color }}>
                  <I className="w-4 h-4" strokeWidth={2.5} />
                </span>
                {label}
              </motion.span>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.55 }}
        >
          <HeroStage image={hero.image} alt={hero.imageAlt} color={hero.stageColor} second={hero.stageSecond} fade={false} mask={hero.mask}>
            <Sticker className="top-[6%] left-[2%]" rotate={-6}>
              <div className="flex items-center gap-2">
                <span className="flex gap-1">
                  {hero.dots.map((c) => <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
                </span>
                <span className="text-[11px] font-extrabold tracking-widest" style={{ color: COLORS.textMuted }}>{hero.labTitle}</span>
              </div>
            </Sticker>
            <Sticker className="top-[14%] right-[4%] !p-0 w-16 h-16 flex items-center justify-center" rotate={8} delay={0.8}>
              <span className="text-3xl">{hero.sticker}</span>
            </Sticker>
          </HeroStage>
        </motion.div>
      </div>
    </div>
    <Wave fill={COLORS.white} className="relative z-10 -mb-px" />
  </section>
);

/* ---------- Level board ---------- */
const LevelBoard = ({ level, onNext, onPrev, openDemoModal, cfg }) => {
  const Icon = level.LevelIcon;
  const modules = cfg.moduleLimit ? level.modules.slice(0, cfg.moduleLimit) : level.modules;
  const fg = onColor(level.color);

  return (
    <motion.div
      key={level.id}
      initial={{ opacity: 0, y: 18, rotate: -0.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
      className="mt-6 rounded-[2.5rem] overflow-hidden bg-white"
      style={{ border: `3px solid ${level.color}`, boxShadow: `0 10px 0 ${edgeOf(level.color)}` }}
    >
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        {/* VISUAL */}
        <div className="relative min-h-[360px] sm:min-h-[420px] lg:min-h-[540px] overflow-hidden" style={{ background: level.color }}>
          <div aria-hidden="true" className="absolute inset-0 px-dots opacity-30" style={{ filter: "invert(1)" }} />
          <div aria-hidden="true" className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 w-[86%] aspect-square rounded-full bg-white/20" />
          <div aria-hidden="true" className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 w-[62%] aspect-square rounded-full bg-white/25" />
          <Pearl size={22} color="#ffffff" style={{ top: "38%", left: "8%", opacity: 0.8 }} float />

          <span
            className="absolute top-5 left-5 z-20 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider"
            style={{ background: "#fff", color: level.color === COLORS.gold ? COLORS.goldDeep : level.color, transform: "rotate(-3deg)" }}
          >
            {level.tag}
          </span>

          <div
            className="absolute right-5 top-5 z-20 w-16 h-16 rounded-2xl flex items-center justify-center bg-white px-float"
            style={{ "--r": "8deg", boxShadow: "0 4px 0 rgba(0,0,0,0.12)" }}
          >
            <span className="text-3xl">{level.sticker}</span>
          </div>

          <img
            src={level.image}
            alt={level.name}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 h-[86%] max-w-[92%] object-contain object-bottom"
            style={{ filter: "drop-shadow(0 18px 22px rgba(0,0,0,0.22))" }}
          />

          {/* achievement medal */}
          <div
            className="absolute left-4 bottom-4 z-20 flex items-center gap-2 rounded-full bg-white pl-1.5 pr-4 py-1.5"
            style={{ boxShadow: "0 4px 0 rgba(0,0,0,0.14)" }}
          >
            <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: COLORS.goldLight, color: COLORS.goldDeep }}>
              <Medal className="w-4 h-4" />
            </span>
            <span className="text-sm font-semibold" style={{ fontFamily: FONTS.display, color: COLORS.ink }}>
              {cfg.achievementPrefix && <span style={{ color: COLORS.textMuted }}>{cfg.achievementPrefix} </span>}
              <span style={{ color: COLORS.goldDeep }}>{level.achievement}</span>
            </span>
          </div>

          <div className="absolute right-4 bottom-4 z-20 flex gap-2">
            <button
              onClick={onPrev}
              aria-label="Previous level"
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center active:translate-y-0.5"
              style={{ color: level.color === COLORS.gold ? COLORS.goldDeep : level.color, boxShadow: "0 4px 0 rgba(0,0,0,0.14)" }}
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2.8} />
            </button>
            <button
              onClick={onNext}
              aria-label={cfg.nextLabel}
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center active:translate-y-0.5"
              style={{ color: level.color === COLORS.gold ? COLORS.goldDeep : level.color, boxShadow: "0 4px 0 rgba(0,0,0,0.14)" }}
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2.8} />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-extrabold tracking-[0.16em]" style={{ color: level.color === COLORS.gold ? COLORS.goldDeep : level.color }}>
                {level.tag}
              </div>
              <h3 className="text-4xl sm:text-5xl font-semibold leading-tight mt-1" style={{ fontFamily: FONTS.display, color: COLORS.ink }}>
                {level.name}
              </h3>
            </div>
            <IconBubble icon={Icon} color={level.color} size={54} iconSize={26} rotate={6} />
          </div>

          <p className="text-xl font-semibold mt-3" style={{ fontFamily: FONTS.display, color: COLORS.textSecondary }}>
            {level.tagline}
          </p>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-4 text-sm font-extrabold"
            style={{ background: level.color, color: fg, boxShadow: `0 3px 0 ${edgeOf(level.color)}` }}
          >
            <Zap className="w-4 h-4" />
            {level.highlight}
          </div>

          {level.description && (
            <p className="text-base font-semibold leading-relaxed mt-4" style={{ color: COLORS.textMuted }}>
              {level.description}
            </p>
          )}

          {/* modules as lesson tiles */}
          <div className="grid grid-cols-2 gap-2.5 mt-6">
            {modules.map((m, i) => {
              const ModIcon = m.icon;
              return (
                <motion.div
                  key={`${m.label}-${i}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3"
                  style={{ background: `${level.color}10`, border: `2px solid ${level.color}25` }}
                >
                  <span className="relative w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0" style={{ color: level.color === COLORS.gold ? COLORS.goldDeep : level.color }}>
                    <ModIcon className="w-[18px] h-[18px]" strokeWidth={2.4} />
                    <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center" style={{ background: level.color, color: fg }}>
                      {i + 1}
                    </span>
                  </span>
                  <span className="text-[13px] sm:text-sm font-extrabold leading-tight" style={{ color: COLORS.ink }}>{m.label}</span>
                </motion.div>
              );
            })}
          </div>

          {/* tools */}
          <div className="mt-6">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] mb-2.5" style={{ color: COLORS.textMuted }}>Tools</div>
            <div className="flex flex-wrap gap-2">
              {level.tools.map((tool, i) => (
                <span
                  key={tool}
                  className="px-3.5 py-1.5 rounded-full text-[13px] font-extrabold bg-white"
                  style={{ color: COLORS.ink, border: `2px dashed ${level.color}70`, transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <ColorBtn color={level.color} className="flex-1" onClick={() => openDemoModal?.(`${cfg.sourcePrefix}-${level.id}`)}>
              Try this level
              <ArrowRight className="w-5 h-5" />
            </ColorBtn>
            <a
              href={getWhatsAppLink(cfg.whatsapp(level))}
              target="_blank"
              rel="noopener noreferrer"
              className="px-btn px-btn--white"
            >
              <MessageCircle className="w-4 h-4" style={{ color: COLORS.emerald }} />
              Ask us
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------- Page ---------- */
const ProgramPage = ({ openDemoModal, hero, levels, levelsSection, values, faq, faqColor, cta, children }) => {
  const [active, setActive] = useState(1);
  const level = levels[active];
  const next = () => setActive((v) => (v + 1) % levels.length);
  const prev = () => setActive((v) => (v - 1 + levels.length) % levels.length);

  return (
    <main className="min-h-screen overflow-hidden bg-white" style={{ color: COLORS.ink }}>
      <ProgramHero hero={hero} openDemoModal={openDemoModal} />

      {/* LEVELS */}
      <section id="levels" className="relative scroll-mt-32 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow={levelsSection.eyebrow}
            eyebrowIcon={levelsSection.eyebrowIcon}
            color={levelsSection.color}
            title={levelsSection.title}
            className="mb-9"
          />

          {/* level "map" tabs */}
          <div className="relative">
            <div aria-hidden="true" className="hidden md:block absolute left-[12%] right-[12%] top-1/2 border-t-[3px] border-dashed" style={{ borderColor: COLORS.borderMed }} />
            <div className="relative flex md:justify-center gap-3 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0">
              {levels.map((item, index) => (
                <LevelTab
                  key={item.id}
                  selected={active === index}
                  color={item.color}
                  Icon={item.LevelIcon}
                  name={item.name}
                  short={item.short}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <LevelBoard key={level.id} level={level} onNext={next} onPrev={prev} openDemoModal={openDemoModal} cfg={levelsSection} />
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-8">
            {levels.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActive(index)}
                aria-label={`Show ${item.name}`}
                className="h-3 rounded-full transition-all duration-300"
                style={{ width: active === index ? 32 : 12, background: active === index ? item.color : COLORS.borderMed }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="pb-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {values.map(([I, text, color], i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 rounded-full bg-white py-3 pl-3 pr-6"
                style={{ border: `2px solid ${color}35`, boxShadow: `0 5px 0 ${color}30` }}
              >
                <span className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: color, color: onColor(color) }}>
                  <I className="w-6 h-6" strokeWidth={2.4} />
                </span>
                <span className="text-lg font-semibold" style={{ fontFamily: FONTS.display }}>{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {children}

      {/* FAQ */}
      <section className="relative py-16 sm:py-20" style={{ background: COLORS.bgSecondary }}>
        <Wave fill="#FFFFFF" flip className="absolute top-0 left-0 right-0" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-6">
          <SectionHeader eyebrow="PARENTS ASK" eyebrowIcon={Star} color={faqColor} title="Quick answers." className="mb-9" />
          <FaqList items={faq} color={faqColor} />
        </div>
      </section>

      <div style={{ background: COLORS.bgSecondary }}>
        <CtaPanel title={cta.title} sub={cta.sub} image={cta.image} color={cta.color}>
          <button onClick={() => openDemoModal?.(cta.source)} className="px-btn px-btn--grad px-btn--lg">
            {cta.label}
            <ArrowRight className="w-5 h-5" />
          </button>
        </CtaPanel>
      </div>
    </main>
  );
};

export default ProgramPage;