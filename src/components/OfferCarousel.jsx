import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { COLORS, FONTS, edgeOf } from "../utils/theme";

const WHATSAPP_LINK = "https://wa.link/2sqe3g";
const AUTO_PLAY_MS = 6500;

const OFFERS = [
  {
    id: "new-year",
    mark: "20% OFF",
    kicker: "2026 BATCH",
    title: "New year. New skills.",
    detail: "Python & Java Bootcamps",
    action: "Claim offer",
    href: WHATSAPP_LINK,
    accent: COLORS.emerald,
    icon: "whatsapp",
  },
  {
    id: "package",
    mark: "SAVE ₹1,393+",
    kicker: "PACKAGE DEAL",
    title: "Pay once. Learn for months.",
    detail: "Python / Java package from ₹3,999",
    action: "See packages",
    href: "/pricing",
    accent: COLORS.gold,
  },
];

// Total height of this bar (progress line + bar). NavBar sits just below it.
export const OFFER_BAR_HEIGHT = 52;

export default function OfferCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  const restart = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setActive((current) => (current + 1) % OFFERS.length);
    }, AUTO_PLAY_MS);
  };

  useEffect(() => {
    if (!paused) restart();
    return () => clearInterval(timer.current);
  }, [paused]);

  const offer = OFFERS[active];
  const onAccent = offer.accent === COLORS.gold ? COLORS.navDark : COLORS.white;

  const go = (index) => {
    setActive(index);
    restart();
  };

  const handleAction = () => {
    if (offer.href.startsWith("http")) {
      window.open(offer.href, "_blank", "noopener,noreferrer");
      return;
    }
    window.location.href = offer.href;
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[70]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-label="Current offers"
    >
      <div className="relative overflow-hidden" style={{ background: COLORS.navDark, height: OFFER_BAR_HEIGHT }}>
        {/* tiny pearl confetti */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-60">
          {[
            ["8%", 10, COLORS.cyan], ["22%", 6, COLORS.gold], ["47%", 8, COLORS.emerald],
            ["68%", 5, COLORS.indigo], ["83%", 9, COLORS.cyan], ["95%", 6, COLORS.gold],
          ].map(([left, s, c], i) => (
            <span key={i} className="absolute rounded-full" style={{ left, top: i % 2 ? 8 : 34, width: s, height: s, background: c, opacity: 0.45 }} />
          ))}
        </div>

        <div className="relative mx-auto flex h-full w-full max-w-[1400px] items-center px-3 sm:px-5 lg:px-8">
          {/* Ticket-style offer mark */}
          <motion.div
            key={`mark-${offer.id}`}
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
            className="relative mr-3 flex h-[32px] shrink-0 items-center gap-1.5 rounded-xl px-3"
            style={{
              background: offer.accent,
              color: onAccent,
              boxShadow: `0 3px 0 ${edgeOf(offer.accent)}`,
              fontFamily: FONTS.display,
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[12px] sm:text-[13px] font-semibold whitespace-nowrap">{offer.mark}</span>
          </motion.div>

          {/* Message — one compact line */}
          <AnimatePresence mode="wait">
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
            >
              <span
                className="hidden md:inline rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-[0.12em] uppercase whitespace-nowrap"
                style={{ color: offer.accent, border: `1.5px dashed ${offer.accent}80` }}
              >
                {offer.kicker}
              </span>
              <span
                className="text-white text-[14px] sm:text-[15px] lg:text-[16px] font-semibold whitespace-nowrap truncate"
                style={{ fontFamily: FONTS.display }}
              >
                {offer.title}
              </span>
              <span className="hidden sm:inline text-[12px] lg:text-[13px] font-bold truncate" style={{ color: COLORS.silver }}>
                {offer.detail}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Desktop action */}
          <button
            type="button"
            onClick={handleAction}
            className="px-btn px-btn--sm ml-3 hidden sm:inline-flex !py-2 !text-[13px]"
            style={{ "--btn-bg": offer.accent, "--btn-edge": edgeOf(offer.accent), "--btn-fg": onAccent }}
          >
            {offer.icon === "whatsapp" && <MessageCircle className="h-4 w-4" />}
            {offer.action}
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Mobile action */}
          <button
            type="button"
            onClick={handleAction}
            aria-label={offer.action}
            className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:hidden"
            style={{ background: offer.accent, color: onAccent, boxShadow: `0 3px 0 ${edgeOf(offer.accent)}` }}
          >
            {offer.icon === "whatsapp" ? <MessageCircle className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </button>

          {/* Pearl dots carousel control */}
          <div className="ml-4 hidden items-center gap-2 md:flex">
            {OFFERS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Show ${item.kicker}`}
                onClick={() => go(index)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: index === active ? 22 : 9,
                  height: 9,
                  background: index === active ? offer.accent : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
        </div>

        {/* progress line along the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            key={`${offer.id}-${active}-${paused}`}
            className="h-full rounded-r-full"
            style={{ background: offer.accent }}
            initial={{ width: "0%" }}
            animate={{ width: paused ? "0%" : "100%" }}
            transition={{ duration: paused ? 0 : AUTO_PLAY_MS / 1000, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}