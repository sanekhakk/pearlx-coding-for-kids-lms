import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Zap, Medal, MessageCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getWhatsAppLink } from "../../utils/whatsapp";
import { COLORS } from "../../utils/theme";
import {
  HeroStage, Sticker, SectionHeader, LevelSelector, FaqList, CtaPanel, ColorBtn, ChipRow, display, textTone, glow,
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
            {hero.title}
          </motion.h1>

          <p className="max-w-lg mx-auto lg:mx-0 mt-3 sm:mt-5 text-[15px] sm:text-lg font-medium leading-relaxed" style={{ color: COLORS.textSecondary }}>
            {hero.sub}
          </p>

          <div className="flex flex-row justify-center lg:justify-start gap-2.5 mt-5 sm:mt-7">
            <button onClick={() => openDemoModal?.(hero.ctaSource)} className="px-btn px-btn--grad px-btn--lg flex-1 sm:flex-none !px-3 sm:!px-6">
              <Play className="w-3.5 h-3.5 fill-current" />
              {hero.ctaLabel}
            </button>
            <a href="#levels" className="px-btn px-btn--white px-btn--lg flex-1 sm:flex-none !px-3 sm:!px-6">
              Explore levels
            </a>
          </div>

          <ChipRow items={hero.chips} className="mt-4 sm:mt-6" />
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
          <HeroStage image={hero.image} alt={hero.imageAlt} color={hero.stageColor} second={hero.stageSecond} fade={false} mask={hero.mask}>
            <Sticker className="top-[6%] left-0">
              <div className="flex items-center gap-1.5">
                <span className="flex gap-0.5">
                  {hero.dots.map((c) => <span key={c} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: c }} />)}
                </span>
                <span className="text-[9px] sm:text-[11px] font-bold tracking-widest" style={{ color: COLORS.textMuted }}>{hero.labTitle}</span>
              </div>
            </Sticker>
            <Sticker className="top-[14%] right-[2%] !p-0 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center">
              <span className="text-lg sm:text-2xl">{hero.sticker}</span>
            </Sticker>
          </HeroStage>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ---------- Level details ---------- */
const LevelBoard = ({ level, onNext, onPrev, openDemoModal, cfg }) => {
  const Icon = level.LevelIcon;
  const modules = cfg.moduleLimit ? level.modules.slice(0, cfg.moduleLimit) : level.modules;
  const tone = textTone(level.color);

  return (
    <motion.div
      key={level.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl overflow-hidden bg-white"
      style={{ border: `1px solid ${level.color}55`, boxShadow: glow(level.color, "30") }}
    >
      <div className="grid md:grid-cols-[0.85fr_1.15fr]">
        {/* VISUAL */}
        <div className="relative h-[210px] sm:h-[300px] md:h-auto md:min-h-[480px] overflow-hidden" style={{ background: `linear-gradient(160deg, ${level.color}22 0%, ${level.color}40 100%)` }}>
          <div aria-hidden="true" className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[78%] max-w-[340px] aspect-square rounded-full bg-white/50" />

          <span
            className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider bg-white"
            style={{ color: tone }}
          >
            {level.tag}
          </span>
          <span className="absolute right-3 top-3 sm:right-4 sm:top-4 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-white text-lg sm:text-2xl">
            {level.sticker}
          </span>

          <img
            src={level.image}
            alt={level.name}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 h-[88%] max-w-[90%] object-contain object-bottom"
            style={{ filter: "drop-shadow(0 14px 18px rgba(15,23,42,0.18))" }}
          />

          <div className="absolute left-3 bottom-3 sm:left-4 sm:bottom-4 z-20 flex items-center gap-1.5 rounded-full bg-white pl-1 pr-3 py-1" style={{ boxShadow: "0 6px 16px -8px rgba(15,23,42,0.3)" }}>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center" style={{ background: COLORS.goldLight, color: COLORS.goldDeep }}>
              <Medal className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] sm:text-[13px] font-bold" style={{ color: COLORS.ink }}>
              {cfg.achievementPrefix && <span style={{ color: COLORS.textMuted }}>{cfg.achievementPrefix} </span>}
              <span style={{ color: COLORS.goldDeep }}>{level.achievement}</span>
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-7 lg:p-8">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: level.color, color: onColor(level.color) }}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <div>
                <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.14em]" style={{ color: tone }}>{level.tag}</div>
                <h3 className="text-xl sm:text-3xl font-extrabold leading-tight tracking-tight" style={{ ...display, color: COLORS.ink }}>
                  {level.name}
                </h3>
              </div>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={onPrev} aria-label="Previous level" className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center hover:bg-slate-50" style={{ border: "1px solid #E2E8F0", color: COLORS.ink }}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={onNext} aria-label={cfg.nextLabel} className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center hover:bg-slate-50" style={{ border: "1px solid #E2E8F0", color: COLORS.ink }}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-[15px] sm:text-lg font-bold mt-3" style={{ color: COLORS.textSecondary }}>
            {level.tagline}
          </p>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full mt-2 text-[11px] sm:text-xs font-bold" style={{ background: `${level.color}18`, color: tone }}>
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {level.highlight}
          </div>

          {level.description && (
            <p className="text-[13px] sm:text-[15px] font-medium leading-relaxed mt-3" style={{ color: COLORS.textMuted }}>
              {level.description}
            </p>
          )}

          <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] mt-4 sm:mt-6 mb-2" style={{ color: COLORS.textMuted }}>
            What they learn
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {modules.map((m, i) => {
              const ModIcon = m.icon;
              return (
                <div
                  key={`${m.label}-${i}`}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2.5"
                  style={{ background: COLORS.bgSecondary, border: "1px solid #EEF2F6" }}
                >
                  <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: `${level.color}18`, color: tone }}>
                    <ModIcon className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.4} />
                  </span>
                  <span className="text-[11px] sm:text-[13px] font-semibold leading-tight" style={{ color: COLORS.ink }}>{m.label}</span>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] mt-4 sm:mt-5 mb-2" style={{ color: COLORS.textMuted }}>Tools</div>
          <div className="flex flex-wrap gap-1.5">
            {level.tools.map((tool) => (
              <span key={tool} className="px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold" style={{ background: "#fff", color: COLORS.textSecondary, border: "1px solid #E2E8F0" }}>
                {tool}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-2 mt-5 sm:mt-7">
            <ColorBtn color={level.color} onClick={() => openDemoModal?.(`${cfg.sourcePrefix}-${level.id}`)}>
              Try this level
              <ArrowRight className="w-4 h-4" />
            </ColorBtn>
            <a href={getWhatsAppLink(cfg.whatsapp(level))} target="_blank" rel="noopener noreferrer" className="px-btn px-btn--white">
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
      <section id="levels" className="relative scroll-mt-28 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow={levelsSection.eyebrow}
            eyebrowIcon={levelsSection.eyebrowIcon}
            color={levelsSection.color}
            title={levelsSection.title}
            className="mb-5 sm:mb-8"
          />

          <LevelSelector levels={levels} active={active} onChange={setActive} />

          <AnimatePresence mode="wait">
            <LevelBoard key={level.id} level={level} onNext={next} onPrev={prev} openDemoModal={openDemoModal} cfg={levelsSection} />
          </AnimatePresence>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="pb-4 sm:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {values.map(([I, text, color]) => (
              <div
                key={text}
                className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-4 text-center sm:text-left"
                style={{ border: "1px solid #E2E8F0" }}
              >
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18`, color: textTone(color) }}>
                  <I className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.3} />
                </span>
                <span className="text-[11px] sm:text-base font-bold leading-tight">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {children}

      {/* FAQ */}
      <section className="relative py-10 sm:py-16" style={{ background: COLORS.bgSecondary }}>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="PARENTS ASK" eyebrowIcon={Star} color={faqColor} title="Quick answers." className="mb-5 sm:mb-8" />
          <FaqList items={faq} color={faqColor} />
        </div>
      </section>

      <div style={{ background: COLORS.bgSecondary }}>
        <CtaPanel title={cta.title} sub={cta.sub} image={cta.image} color={cta.color}>
          <button onClick={() => openDemoModal?.(cta.source)} className="px-btn px-btn--grad px-btn--lg">
            {cta.label}
            <ArrowRight className="w-4 h-4" />
          </button>
        </CtaPanel>
      </div>
    </main>
  );
};

export default ProgramPage;