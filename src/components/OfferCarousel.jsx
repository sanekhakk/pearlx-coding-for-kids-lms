import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { COLORS } from "../utils/theme";

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
export const OFFER_BAR_HEIGHT = 44;

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
        <div className="relative mx-auto flex h-full w-full max-w-[1400px] items-center px-3 sm:px-5 lg:px-8">
          {/* Ticket-style offer mark */}
          <motion.div
            key={`mark-${offer.id}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="relative mr-2.5 flex h-[26px] shrink-0 items-center gap-1 rounded-md px-2"
            style={{ background: offer.accent, color: onAccent }}
          >
            <Sparkles className="h-3 w-3" />
            <span className="text-[11px] sm:text-xs font-extrabold whitespace-nowrap">{offer.mark}</span>
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
                className="hidden md:inline text-[10px] font-bold tracking-[0.12em] uppercase whitespace-nowrap"
                style={{ color: offer.accent }}
              >
                {offer.kicker}
              </span>
              <span
                className="text-white text-[13px] sm:text-sm font-bold whitespace-nowrap truncate"
              >
                {offer.title}
              </span>
              <span className="hidden sm:inline text-xs lg:text-[13px] font-medium truncate" style={{ color: COLORS.silver }}>
                {offer.detail}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Desktop action */}
          <button
            type="button"
            onClick={handleAction}
            className="px-btn px-btn--sm ml-3 hidden sm:inline-flex !h-8 !text-xs"
            style={{ "--btn-bg": offer.accent, "--btn-fg": onAccent }}
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
            className="ml-2 flex h-7 shrink-0 items-center gap-1 rounded-md px-2 text-[11px] font-bold sm:hidden"
            style={{ background: offer.accent, color: onAccent }}
          >
            {offer.icon === "whatsapp" ? <MessageCircle className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
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
                  width: index === active ? 18 : 7,
                  height: 7,
                  background: index === active ? offer.accent : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
        </div>

        {/* progress line along the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "rgba(255,255,255,0.06)" }}>
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