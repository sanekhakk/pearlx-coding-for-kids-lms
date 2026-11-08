import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { COLORS, BRAND, FONTS, edgeOf } from "../../utils/theme";

/* =========================================================
   PEARLX BRAND KIT
   Shared building blocks so every page speaks the same
   visual language: pearls, scribbles, chunky buttons,
   sticker cards and wavy section edges.
========================================================= */

export const display = { fontFamily: FONTS.display };

/* ---------- Pearl (glossy decorative bubble) ---------- */
export const Pearl = ({ size = 24, color = COLORS.cyan, className = "", style = {}, float = false, delay = 0 }) => (
  <span
    aria-hidden="true"
    className={`px-pearl ${float ? "px-float" : ""} ${className}`}
    style={{ width: size, height: size, "--pearl": color, animationDelay: `${delay}s`, ...style }}
  />
);

/* A ready-made scatter of pearls for section backgrounds */
export const PearlScatter = ({ variant = "a" }) => {
  const sets = {
    a: [
      { size: 22, color: COLORS.gold, style: { top: "12%", left: "4%" } },
      { size: 14, color: COLORS.emerald, style: { top: "62%", left: "7%" } },
      { size: 30, color: COLORS.cyan, style: { top: "18%", right: "5%" } },
      { size: 12, color: COLORS.indigo, style: { bottom: "14%", right: "10%" } },
    ],
    b: [
      { size: 16, color: COLORS.indigo, style: { top: "10%", right: "8%" } },
      { size: 26, color: COLORS.emerald, style: { bottom: "12%", left: "5%" } },
      { size: 12, color: COLORS.gold, style: { top: "40%", left: "2%" } },
    ],
  };
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
      {sets[variant].map((p, i) => (
        <Pearl key={i} {...p} float delay={i * 0.6} />
      ))}
    </div>
  );
};

/* ---------- Scribble underline for a highlighted word ---------- */
export const Scribble = ({ children, color = COLORS.emerald, textColor }) => (
  <span className="px-scribble" style={{ color: textColor || color }}>
    {children}
    <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M3 14 C 40 4, 70 4, 100 11 S 165 18, 197 6"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  </span>
);

/* ---------- Eyebrow sticker label ---------- */
export const Eyebrow = ({ children, color = COLORS.emerald, icon: Icon, className = "" }) => (
  <span className={`px-eyebrow ${className}`} style={{ color, background: `${color}12` }}>
    {Icon && <Icon className="w-3.5 h-3.5" />}
    {children}
  </span>
);

/* ---------- Section header ---------- */
export const SectionHeader = ({ eyebrow, eyebrowIcon, color = COLORS.emerald, title, sub, align = "center", className = "" }) => (
  <div className={`${align === "center" ? "text-center mx-auto" : ""} max-w-3xl ${className}`}>
    {eyebrow && <Eyebrow color={color} icon={eyebrowIcon}>{eyebrow}</Eyebrow>}
    <h2
      className="mt-4 text-[2.15rem] sm:text-5xl font-semibold leading-[1.05]"
      style={{ ...display, color: COLORS.ink }}
    >
      {title}
    </h2>
    {sub && (
      <p className={`mt-4 text-base sm:text-lg font-semibold leading-relaxed ${align === "center" ? "mx-auto" : ""} max-w-xl`}
        style={{ color: COLORS.textMuted }}>
        {sub}
      </p>
    )}
  </div>
);

/* ---------- Chunky press-down button ---------- */
export const Btn = ({ variant = "grad", size, block, to, href, className = "", children, ...rest }) => {
  const cls = `px-btn px-btn--${variant} ${size ? `px-btn--${size}` : ""} ${block ? "px-btn--block" : ""} ${className}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <button type="button" className={cls} {...rest}>{children}</button>;
};

/* Accent-coloured chunky button for any palette colour */
export const ColorBtn = ({ color, className = "", style = {}, children, href, ...rest }) => {
  const s = { "--btn-bg": color, "--btn-edge": edgeOf(color), "--btn-fg": color === COLORS.gold ? COLORS.navDark : "#fff", ...style };
  if (href) return <a href={href} className={`px-btn ${className}`} style={s} {...rest}>{children}</a>;
  return <button type="button" className={`px-btn ${className}`} style={s} {...rest}>{children}</button>;
};

/* ---------- Wavy section edge ---------- */
export const Wave = ({ fill = "#fff", flip = false, className = "" }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 1440 70"
    preserveAspectRatio="none"
    className={`block w-full h-[38px] sm:h-[60px] ${className}`}
    style={{ transform: flip ? "rotate(180deg)" : undefined }}
  >
    <path
      d="M0 40 C 180 75, 360 5, 540 30 S 900 70, 1080 34 S 1350 8, 1440 38 L1440 70 L0 70 Z"
      fill={fill}
    />
  </svg>
);

/* ---------- Icon bubble ---------- */
export const IconBubble = ({ icon: Icon, color, size = 48, iconSize = 22, rotate = -4 }) => (
  <span
    className="inline-flex items-center justify-center shrink-0"
    style={{
      width: size, height: size, borderRadius: size * 0.36,
      background: `${color}18`, color, transform: `rotate(${rotate}deg)`,
      border: `2px solid ${color}30`,
    }}
  >
    <Icon style={{ width: iconSize, height: iconSize }} strokeWidth={2.4} />
  </span>
);

/* ---------- Floating sticker (small card on hero art) ---------- */
export const Sticker = ({ children, className = "", style = {}, rotate = -4, delay = 0 }) => (
  <div
    className={`absolute z-20 px-float rounded-2xl bg-white px-3.5 py-2.5 ${className}`}
    style={{
      "--r": `${rotate}deg`,
      animationDelay: `${delay}s`,
      border: "2px solid rgba(15,23,42,0.08)",
      boxShadow: "0 5px 0 rgba(15,23,42,0.08)",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ---------- Hero art: kid cut-out on a pearl stage ---------- */
export const HeroStage = ({ image, alt, color = COLORS.cyan, second = COLORS.emerald, children, imgClass = "", fade = true, mask }) => (
  <div className="relative mx-auto w-full max-w-[540px] aspect-square">
    {/* rotating dashed orbit */}
    <div
      aria-hidden="true"
      className="absolute inset-[2%] rounded-full border-[3px] border-dashed px-spin-slow"
      style={{ borderColor: `${color}40` }}
    />
    {/* main pearl */}
    <div
      aria-hidden="true"
      className="absolute inset-[11%] rounded-full"
      style={{
        background: `radial-gradient(circle at 30% 25%, #ffffff 0 10%, ${color}22 42%, ${second}30 100%)`,
        border: `3px solid ${color}25`,
      }}
    />
    <Pearl size={34} color={COLORS.gold} style={{ top: "9%", left: "14%" }} float />
    <Pearl size={20} color={second} style={{ bottom: "16%", right: "6%" }} float delay={1.2} />
    <Pearl size={14} color={COLORS.indigo} style={{ top: "30%", right: "3%" }} float delay={0.6} />
    <img
      src={image}
      alt={alt}
      className={`absolute inset-x-0 bottom-0 mx-auto h-[96%] w-auto max-w-full object-contain z-10 ${imgClass}`}
      style={{
        filter: "drop-shadow(0 22px 26px rgba(15,23,42,0.18))",
        ...(mask ? { WebkitMaskImage: mask, maskImage: mask } : {}),
        ...(fade && !mask ? { WebkitMaskImage: "linear-gradient(to bottom, #000 82%, transparent 100%)", maskImage: "linear-gradient(to bottom, #000 82%, transparent 100%)" } : {}),
      }}
    />
    {children}
  </div>
);

/* ---------- FAQ accordion ---------- */
export const FaqList = ({ items, color = COLORS.emerald }) => {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <motion.div
            key={item.q}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="rounded-3xl bg-white overflow-hidden"
            style={{
              border: `2px solid ${isOpen ? `${color}55` : "rgba(15,23,42,0.09)"}`,
              boxShadow: `0 5px 0 ${isOpen ? `${color}30` : "rgba(15,23,42,0.05)"}`,
              transition: "border-color .2s, box-shadow .2s",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left"
            >
              <span className="text-base sm:text-lg font-semibold" style={{ ...display, color: COLORS.ink }}>
                {item.q}
              </span>
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300"
                style={{ background: isOpen ? color : `${color}15`, color: isOpen ? "#fff" : color, transform: isOpen ? "rotate(45deg)" : "none" }}
              >
                <Plus className="w-5 h-5" strokeWidth={3} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 sm:px-6 pb-5 text-sm sm:text-base font-semibold leading-relaxed" style={{ color: COLORS.textSecondary }}>
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

/* ---------- Big closing call-to-action panel ---------- */
export const CtaPanel = ({ title, sub, image, color = COLORS.emerald, children }) => (
  <section className="px-4 sm:px-6 py-16 sm:py-20">
    <div
      className="relative max-w-6xl mx-auto overflow-hidden rounded-[2.5rem] px-6 py-10 sm:px-12 sm:py-14"
      style={{ background: COLORS.navDark, boxShadow: `0 10px 0 ${color}` }}
    >
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.07] px-dots" style={{ filter: "invert(1)" }} />
      <Pearl size={60} color={COLORS.cyan} className="hidden sm:block" style={{ top: -18, right: "30%" }} />
      <Pearl size={26} color={COLORS.gold} className="hidden sm:block" style={{ bottom: 30, left: "42%" }} float />
      <Pearl size={16} color={COLORS.emerald} style={{ top: 40, left: 30 }} float delay={1} />
      <div className={`relative grid items-center gap-8 ${image ? "lg:grid-cols-[1.2fr_0.8fr]" : ""}`}>
        <div className={image ? "text-center lg:text-left" : "text-center"}>
          <h2 className="text-3xl sm:text-5xl font-semibold leading-[1.08] text-white" style={display}>
            {title}
          </h2>
          {sub && <p className="mt-4 text-base sm:text-lg font-semibold text-slate-300">{sub}</p>}
          <div className={`mt-8 flex flex-col sm:flex-row gap-3 ${image ? "justify-center lg:justify-start" : "justify-center"}`}>
            {children}
          </div>
        </div>
        {image && (
          <div className="relative hidden lg:block h-[300px]">
            <div className="absolute inset-x-8 bottom-0 top-6 rounded-full" style={{ background: `radial-gradient(circle, ${color}55, transparent 70%)` }} />
            <img src={image} alt="" className="absolute bottom-[-56px] left-1/2 -translate-x-1/2 h-[360px] w-auto object-contain" />
          </div>
        )}
      </div>
    </div>
  </section>
);

/* ---------- Level tab (used by Coding & Maths) ---------- */
export const LevelTab = ({ selected, color, Icon, name, short, onClick }) => (
  <button
    onClick={onClick}
    className="shrink-0 snap-start flex items-center gap-3 rounded-full pl-2 pr-5 py-2 transition-all duration-200"
    style={{
      background: selected ? color : "#fff",
      color: selected ? (color === COLORS.gold ? COLORS.navDark : "#fff") : COLORS.ink,
      border: `2px solid ${selected ? color : "rgba(15,23,42,0.1)"}`,
      boxShadow: selected ? `0 5px 0 ${edgeOf(color)}` : "0 4px 0 rgba(15,23,42,0.05)",
      transform: selected ? "translateY(-2px)" : "none",
    }}
  >
    <span
      className="w-10 h-10 rounded-full flex items-center justify-center"
      style={{ background: selected ? "rgba(255,255,255,0.25)" : `${color}18`, color: selected ? "inherit" : color }}
    >
      <Icon className="w-5 h-5" strokeWidth={2.4} />
    </span>
    <span className="text-left">
      <span className="block text-base font-semibold leading-tight" style={display}>{name}</span>
      <span className="block text-[11px] font-bold opacity-75">{short}</span>
    </span>
  </button>
);

export { BRAND, COLORS };