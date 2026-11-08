import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { COLORS, BRAND, FONTS } from "../../utils/theme";

/* =========================================================
   PEARLX BRAND KIT — professional, parent-friendly
   Clean cards, clear labels, compact on phones.
   The kids' touch comes from colour, illustrations and
   the small "pearl" accents — not from oversized type.
========================================================= */

export const display = { fontFamily: FONTS.display };

const onColor = (c) => (c === COLORS.gold ? COLORS.navDark : "#fff");
// Readable text version of a brand colour (gold is too light for text).
export const textTone = (c) => (c === COLORS.gold ? COLORS.goldDeep : c);
// Soft coloured shadow for selected / featured items.
export const glow = (c, strength = "33") => `0 1px 2px rgba(15,23,42,0.05), 0 10px 24px -12px ${c}${strength}`;

/* ---------- Pearl (small decorative bubble) ---------- */
export const Pearl = ({ size = 16, color = COLORS.cyan, className = "", style = {}, float = false, delay = 0 }) => (
  <span
    aria-hidden="true"
    className={`px-pearl ${float ? "px-float" : ""} ${className}`}
    style={{ width: size, height: size, "--pearl": color, animationDelay: `${delay}s`, ...style }}
  />
);

export const PearlScatter = ({ variant = "a" }) => {
  const sets = {
    a: [
      { size: 12, color: COLORS.gold, style: { top: "14%", left: "4%" } },
      { size: 16, color: COLORS.cyan, style: { top: "20%", right: "5%" } },
    ],
    b: [
      { size: 12, color: COLORS.indigo, style: { top: "12%", right: "8%" } },
      { size: 14, color: COLORS.emerald, style: { bottom: "12%", left: "4%" } },
    ],
  };
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      {sets[variant].map((p, i) => <Pearl key={i} {...p} />)}
    </div>
  );
};

/* ---------- Highlighted word (soft marker underline) ---------- */
export const Scribble = ({ children, color = COLORS.emerald, textColor }) => (
  <span
    className="px-scribble"
    style={{
      color: textColor || textTone(color),
      backgroundImage: `linear-gradient(${color}2e, ${color}2e)`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "100% 0.3em",
      backgroundPosition: "0 88%",
      paddingInline: "0.04em",
    }}
  >
    {children}
  </span>
);

/* ---------- Eyebrow label ---------- */
export const Eyebrow = ({ children, color = COLORS.emerald, icon: Icon, className = "" }) => (
  <span className={`px-eyebrow ${className}`} style={{ color: textTone(color), background: `${color}14` }}>
    {Icon && <Icon className="w-3.5 h-3.5" />}
    {children}
  </span>
);

/* ---------- Section header ---------- */
export const SectionHeader = ({ eyebrow, eyebrowIcon, color = COLORS.emerald, title, sub, align = "center", className = "" }) => (
  <div className={`${align === "center" ? "text-center mx-auto" : ""} max-w-2xl ${className}`}>
    {eyebrow && <Eyebrow color={color} icon={eyebrowIcon}>{eyebrow}</Eyebrow>}
    <h2
      className="mt-3 text-[1.55rem] sm:text-4xl lg:text-[2.6rem] font-extrabold leading-[1.15] tracking-tight text-balance"
      style={{ ...display, color: COLORS.ink }}
    >
      {title}
    </h2>
    {sub && (
      <p className={`mt-2.5 sm:mt-3 text-sm sm:text-base font-medium leading-relaxed ${align === "center" ? "mx-auto" : ""} max-w-xl`}
        style={{ color: COLORS.textMuted }}>
        {sub}
      </p>
    )}
  </div>
);

/* ---------- Buttons ---------- */
export const Btn = ({ variant = "grad", size, block, to, href, className = "", children, ...rest }) => {
  const cls = `px-btn px-btn--${variant} ${size ? `px-btn--${size}` : ""} ${block ? "px-btn--block" : ""} ${className}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <button type="button" className={cls} {...rest}>{children}</button>;
};

export const ColorBtn = ({ color, className = "", style = {}, children, href, ...rest }) => {
  const s = { "--btn-bg": color, "--btn-fg": onColor(color), ...style };
  if (href) return <a href={href} className={`px-btn ${className}`} style={s} {...rest}>{children}</a>;
  return <button type="button" className={`px-btn ${className}`} style={s} {...rest}>{children}</button>;
};

/* Kept for compatibility — sections now use clean straight edges. */
export const Wave = () => null;

/* ---------- Icon tile ---------- */
export const IconBubble = ({ icon: Icon, color, size = 44, iconSize = 20 }) => (
  <span
    className="inline-flex items-center justify-center shrink-0"
    style={{ width: size, height: size, borderRadius: Math.round(size * 0.3), background: `${color}14`, color: textTone(color) }}
  >
    <Icon style={{ width: iconSize, height: iconSize }} strokeWidth={2.2} />
  </span>
);

/* ---------- Small info card on hero art ---------- */
export const Sticker = ({ children, className = "", style = {} }) => (
  <div
    className={`absolute z-20 rounded-xl bg-white px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 ${className}`}
    style={{ border: "1px solid #E2E8F0", boxShadow: "0 10px 30px -12px rgba(15,23,42,0.25)", ...style }}
  >
    {children}
  </div>
);

/* ---------- Hero art: kid illustration on a soft circle ---------- */
export const HeroStage = ({ image, alt, color = COLORS.cyan, second = COLORS.emerald, children, imgClass = "", fade = true, mask }) => (
  <div className="relative mx-auto w-full max-w-[250px] sm:max-w-[400px] lg:max-w-[500px] aspect-square">
    <div
      aria-hidden="true"
      className="absolute inset-[8%] rounded-full"
      style={{ background: `radial-gradient(circle at 30% 25%, #ffffff 0 8%, ${color}1f 45%, ${second}29 100%)` }}
    />
    <Pearl size={14} color={COLORS.gold} style={{ top: "10%", left: "16%" }} />
    <Pearl size={10} color={second} style={{ bottom: "18%", right: "8%" }} />
    <img
      src={image}
      alt={alt}
      className={`absolute inset-x-0 bottom-0 mx-auto h-[94%] w-auto max-w-full object-contain z-10 ${imgClass}`}
      style={{
        filter: "drop-shadow(0 16px 20px rgba(15,23,42,0.14))",
        ...(mask ? { WebkitMaskImage: mask, maskImage: mask } : {}),
        ...(fade && !mask ? { WebkitMaskImage: "linear-gradient(to bottom, #000 84%, transparent 100%)", maskImage: "linear-gradient(to bottom, #000 84%, transparent 100%)" } : {}),
      }}
    />
    {children}
  </div>
);

/* ---------- Trust chips under hero buttons ---------- */
export const ChipRow = ({ items, className = "" }) => (
  <div className={`flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2 ${className}`}>
    {items.map(([Icon, label, color]) => (
      <span
        key={label}
        className="inline-flex items-center gap-1.5 rounded-full bg-white pl-1 pr-2.5 py-1 sm:pl-1.5 sm:pr-3.5 sm:py-1.5 text-xs sm:text-sm font-semibold"
        style={{ color: COLORS.textSecondary, border: "1px solid #E2E8F0" }}
      >
        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center" style={{ background: `${color}18`, color: textTone(color) }}>
          <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2.5} />
        </span>
        {label}
      </span>
    ))}
  </div>
);

/* ---------- FAQ accordion ---------- */
export const FaqList = ({ items, color = COLORS.emerald }) => {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-2 sm:space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="rounded-2xl bg-white overflow-hidden transition-colors"
            style={{ border: `1px solid ${isOpen ? `${color}55` : "#E2E8F0"}`, boxShadow: isOpen ? glow(color, "26") : "none" }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4 text-left"
            >
              <span className="text-sm sm:text-base font-bold" style={{ color: COLORS.ink }}>{item.q}</span>
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300"
                style={{ background: isOpen ? `${color}18` : "#F1F5F9", color: isOpen ? textTone(color) : COLORS.textMuted, transform: isOpen ? "rotate(180deg)" : "none" }}
              >
                <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 sm:px-5 pb-4 text-[13px] sm:text-[15px] font-medium leading-relaxed" style={{ color: COLORS.textSecondary }}>
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Closing call-to-action panel ---------- */
export const CtaPanel = ({ title, sub, image, color = COLORS.emerald, children }) => (
  <section className="px-4 sm:px-6 py-10 sm:py-16">
    <div
      className="relative max-w-6xl mx-auto overflow-hidden rounded-3xl px-5 py-8 sm:px-12 sm:py-12"
      style={{ background: COLORS.navDark }}
    >
      <div aria-hidden="true" className="absolute -right-24 -top-24 w-72 h-72 rounded-full" style={{ background: `${color}26` }} />
      <div aria-hidden="true" className="absolute -left-16 -bottom-20 w-56 h-56 rounded-full" style={{ background: `${COLORS.cyan}1a` }} />
      <div className={`relative grid items-center gap-6 ${image ? "lg:grid-cols-[1.3fr_0.7fr]" : ""}`}>
        <div className={image ? "text-center lg:text-left" : "text-center"}>
          <h2 className="text-[1.45rem] sm:text-4xl font-extrabold leading-tight tracking-tight text-white text-balance" style={display}>
            {title}
          </h2>
          {sub && <p className="mt-2 sm:mt-3 text-sm sm:text-base font-medium text-slate-300">{sub}</p>}
          <div className={`mt-5 sm:mt-7 flex flex-row flex-wrap gap-2.5 ${image ? "justify-center lg:justify-start" : "justify-center"}`}>
            {children}
          </div>
        </div>
        {image && (
          <div className="relative hidden lg:block h-[240px]">
            <div className="absolute inset-x-10 bottom-0 top-8 rounded-full" style={{ background: `radial-gradient(circle, ${color}40, transparent 70%)` }} />
            <img src={image} alt="" className="absolute bottom-[-48px] left-1/2 -translate-x-1/2 h-[300px] w-auto object-contain" />
          </div>
        )}
      </div>
    </div>
  </section>
);

/* ---------- Level selector: all options always visible ---------- */
export const LevelSelector = ({ levels, active, onChange, label = "Choose a level" }) => (
  <div>
    <div className="text-center text-xs sm:text-sm font-semibold mb-2.5" style={{ color: COLORS.textMuted }}>
      {label} <span className="hidden sm:inline">— tap to compare all {levels.length}</span>
    </div>
    <div
      role="tablist"
      className="grid gap-1.5 sm:gap-2 p-1.5 rounded-2xl max-w-3xl mx-auto"
      style={{ gridTemplateColumns: `repeat(${levels.length}, minmax(0, 1fr))`, background: "#F1F5F9", border: "1px solid #E2E8F0" }}
    >
      {levels.map((item, index) => {
        const selected = active === index;
        const Icon = item.LevelIcon;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(index)}
            className="flex flex-col sm:flex-row items-center sm:justify-center gap-1 sm:gap-2.5 rounded-xl px-1.5 py-2 sm:px-3 sm:py-2.5 transition-all duration-200"
            style={{
              background: selected ? "#fff" : "transparent",
              boxShadow: selected ? glow(item.color, "40") : "none",
              border: `1px solid ${selected ? `${item.color}66` : "transparent"}`,
            }}
          >
            <span
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: selected ? item.color : `${item.color}18`, color: selected ? onColor(item.color) : textTone(item.color) }}
            >
              {Icon && <Icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" strokeWidth={2.4} />}
            </span>
            <span className="text-center sm:text-left leading-tight">
              <span className="block text-[12px] sm:text-[15px] font-bold" style={{ color: selected ? COLORS.ink : COLORS.textSecondary }}>
                {item.name}
              </span>
              <span className="block text-[10px] sm:text-xs font-semibold mt-0.5" style={{ color: COLORS.textMuted }}>
                {item.short}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export { BRAND, COLORS };