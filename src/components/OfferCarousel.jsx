// src/components/OfferCarousel.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WA_LINK = "https://wa.link/2sqe3g";

const OFFERS = [
  {
    id: "plus2-offer",
    badge: "🎓 Limited Offer",
    badgeColor: "#10B981",
    headline: "20% OFF for 2026 +2 Passed Students",
    sub: "Python & Java Bootcamps at ₹3,999 · Web Dev Bootcamp at ₹4,799 (was ₹5,999)",
    cta: "Claim via WhatsApp",
    ctaHref: WA_LINK,
    accentFrom: "#10B981",
    accentTo: "#0EA5E9",
    emoji: "🎉",
    tags: ["Python ₹3,999", "Java ₹3,999", "Web Dev ₹4,799"],
  },
  {
    id: "package-deal",
    badge: "💰 Best Value",
    badgeColor: "#C9A84C",
    headline: "Package vs Monthly — Save ₹1,393+",
    sub: "Python/Java Bootcamp package ₹3,999 · vs ₹799/mo × 8 months = ₹6,392. You save big!",
    cta: "See All Packages",
    ctaRoute: "pricing",
    accentFrom: "#C9A84C",
    accentTo: "#B87333",
    emoji: "📦",
    tags: ["Save ₹1,393+", "One-time Pay", "All Inclusive"],
  },
];

const AUTO_PLAY_MS = 5500;

export default function OfferCarousel({ openDemoModal }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(i => (i + 1) % OFFERS.length);
    }, AUTO_PLAY_MS);
  };

  useEffect(() => {
    if (!paused) startTimer();
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const goTo = (idx) => { setActive(idx); startTimer(); };

  if (dismissed) return null;

  const offer = OFFERS[active];

  const handleCta = () => {
    if (offer.ctaHref) {
      window.open(offer.ctaHref, "_blank", "noopener,noreferrer");
    } else if (offer.ctaRoute) {
      window.location.href = `/${offer.ctaRoute}`;
    } else if (openDemoModal) {
      openDemoModal(offer.id);
    }
  };

  return (
    <div
      className="w-full overflow-hidden fixed top-0 left-0 right-0 z-50 "
      style={{ zIndex: 50 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-10"
        style={{ background: "rgba(255,255,255,0.10)" }}>
        {!paused && (
          <motion.div
            key={active + "-bar"}
            className="h-full"
            style={{ background: `linear-gradient(90deg, ${offer.accentFrom}, ${offer.accentTo})` }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: AUTO_PLAY_MS / 1000, ease: "linear" }}
          />
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={offer.id}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="relative flex items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-3"
          style={{
            background: `linear-gradient(105deg, #0B1120 0%, #0F172A 55%, ${offer.accentFrom}1A 100%)`,
            borderBottom: `1px solid ${offer.accentFrom}28`,
          }}
        >
          {/* Left */}
          <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
            {/* Emoji bubble */}
            <div
              className="hidden sm:flex shrink-0 w-9 h-9 items-center justify-center rounded-full text-lg"
              style={{
                background: `${offer.accentFrom}25`,
                border: `1px solid ${offer.accentFrom}40`,
              }}
            >
              {offer.emoji}
            </div>

            <div className="min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              {/* Badge */}
              <span
                className="shrink-0 hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                style={{
                  background: `${offer.badgeColor}20`,
                  color: offer.badgeColor,
                  border: `1px solid ${offer.badgeColor}35`,
                }}
              >
                {offer.badge}
              </span>

              <span className="font-extrabold text-white text-sm md:text-[15px] leading-tight truncate">
                {offer.headline}
              </span>

              <span className="hidden lg:block text-slate-400 text-xs leading-snug truncate max-w-sm">
                {offer.sub}
              </span>

              {/* Tags */}
              <div className="hidden xl:flex items-center gap-1.5 shrink-0">
                {offer.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      background: `${offer.accentFrom}18`,
                      color: offer.accentFrom,
                      border: `1px solid ${offer.accentFrom}28`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleCta}
              className="shrink-0 px-4 py-1.5 rounded-xl text-xs md:text-sm font-bold text-white flex items-center gap-1.5"
              style={{
                background: `linear-gradient(135deg, ${offer.accentFrom}, ${offer.accentTo})`,
                boxShadow: `0 4px 14px ${offer.accentFrom}38`,
              }}
            >
              {offer.ctaHref && <MessageCircle className="w-3.5 h-3.5" />}
              {offer.cta}
            </motion.button>

            {/* Dot nav */}
            <div className="flex items-center gap-1.5">
              {OFFERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: i === active ? 18 : 6,
                    height: 6,
                    background: i === active
                      ? `linear-gradient(90deg, ${offer.accentFrom}, ${offer.accentTo})`
                      : "rgba(255,255,255,0.22)",
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}