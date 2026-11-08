import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Sparkles, X } from "lucide-react";
import { COLORS, FONTS, edgeOf } from "../utils/theme";
import { Pearl, Scribble } from "./ui/Brand";

const KID_IMAGE = "/assets/kids/demo-popup.webp";

const BENEFITS = [
  "Meet the tutor",
  "Try a real class",
  "See if they enjoy it",
];

const DemoInterestPopup = ({ onBookDemo, delay = 5000 }) => {
  const [visible, setVisible] = useState(false);

  // First appearance happens after `delay` (5 seconds by default).
  // After the visitor dismisses the popup, it can appear again after
  // two minutes if they are still on the website.
  const timerRef = useRef(null);
  const stoppedRef = useRef(false);
  const REPEAT_DELAY = 1 * 60 * 1000;

  const schedulePopup = (wait) => {
    if (typeof window === "undefined" || stoppedRef.current) return;

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      if (!stoppedRef.current) {
        setVisible(true);
      }
    }, wait);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // No session/local storage flag is used.
    // Every fresh page refresh starts the 5-second timer again.
    stoppedRef.current = false;
    schedulePopup(delay);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [delay]);

  // Blur the actual application root while the popup is open.
  // This also catches fixed/sticky navbars that otherwise can sit above
  // a backdrop because of their own stacking context.
  useEffect(() => {
    if (typeof document === "undefined") return;

    const appRoot = document.getElementById("root");
    if (!appRoot) return;

    if (visible) {
      appRoot.style.filter = "blur(7px)";
      appRoot.style.transition = "filter 180ms ease";
      appRoot.style.pointerEvents = "none";
      document.body.style.overflow = "hidden";
    } else {
      appRoot.style.filter = "";
      appRoot.style.transition = "";
      appRoot.style.pointerEvents = "";
      document.body.style.overflow = "";
    }

    return () => {
      appRoot.style.filter = "";
      appRoot.style.transition = "";
      appRoot.style.pointerEvents = "";
      document.body.style.overflow = "";
    };
  }, [visible]);

  const close = () => {
    setVisible(false);

    // If they are still browsing, show the popup again after 2 minutes.
    schedulePopup(REPEAT_DELAY);
  };

  const handleBookDemo = () => {
    // Booking the demo means the visitor has already taken the action,
    // so stop future repeat popups for this page visit.
    stoppedRef.current = true;

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setVisible(false);

    // Give the popup exit animation a moment before opening the real modal.
    window.setTimeout(() => {
      onBookDemo?.("demo_interest_popup");
    }, 220);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 2147483647, background: "rgba(11, 17, 32, 0.5)", isolation: "isolate" }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pearlx-demo-popup-title"
            initial={{ opacity: 0, y: 30, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="relative w-full max-w-[660px] overflow-hidden rounded-[2.25rem] bg-white"
            style={{ border: "3px solid #fff", boxShadow: `0 10px 0 ${COLORS.emerald}, 0 30px 70px rgba(0,0,0,0.3)`, fontFamily: FONTS.body }}
          >
            {/* Close */}
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute top-3.5 right-3.5 z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center"
              style={{ color: COLORS.ink, border: `2px solid ${COLORS.border}`, boxShadow: "0 3px 0 rgba(15,23,42,0.08)" }}
            >
              <X size={18} strokeWidth={2.8} />
            </button>

            <div className="grid sm:grid-cols-[1.05fr_0.95fr]">
              {/* LEFT: message */}
              <div className="relative z-[2] px-7 pt-8 pb-7 sm:pl-9 sm:pr-4 sm:py-10 flex flex-col justify-center order-2 sm:order-1">
                <Pearl size={16} color={COLORS.gold} style={{ top: 22, right: 24 }} float />
                <span
                  className="px-eyebrow w-fit"
                  style={{ color: COLORS.emerald, background: COLORS.emeraldLight }}
                >
                  <Sparkles size={13} /> Free Demo
                </span>

                <h2
                  id="pearlx-demo-popup-title"
                  className="mt-4 text-[2.4rem] leading-[1] font-semibold"
                  style={{ fontFamily: FONTS.display, color: COLORS.ink }}
                >
                  Let them
                  <br />
                  <Scribble color={COLORS.gold} textColor={COLORS.emerald}>try Pearlx.</Scribble>
                </h2>

                <p className="mt-4 text-[15px] font-bold leading-snug" style={{ color: COLORS.textSecondary }}>
                  One real class. No pressure.
                  <br />
                  Just see how they like it.
                </p>

                <div className="mt-5 grid gap-2">
                  {BENEFITS.map((benefit, i) => (
                    <div key={benefit} className="flex items-center gap-2.5 text-sm font-extrabold" style={{ color: COLORS.ink }}>
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
                        style={{ background: [COLORS.emerald, COLORS.cyan, COLORS.indigo][i % 3] }}
                      >
                        <Check size={13} strokeWidth={3.2} />
                      </span>
                      {benefit}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-7">
                  <button type="button" onClick={handleBookDemo} className="px-btn px-btn--grad">
                    Book free demo
                    <ArrowRight size={17} strokeWidth={2.8} />
                  </button>
                  <button type="button" onClick={close} className="text-sm font-extrabold hover:underline" style={{ color: COLORS.textMuted }}>
                    Maybe later
                  </button>
                </div>
              </div>

              {/* RIGHT: kid illustration in a pearl frame */}
              <div className="relative order-1 sm:order-2 h-[210px] sm:h-auto overflow-hidden" style={{ background: "linear-gradient(160deg, #F0F9FF 0%, #ECFDF5 100%)" }}>
                <div aria-hidden="true" className="absolute inset-0 px-dots opacity-60" />
                <motion.img
                  src={KID_IMAGE}
                  alt="Child learning with Pearlx"
                  initial={{ y: 10, scale: 1.04 }}
                  animate={{ y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 160, damping: 18 }}
                  className="absolute inset-0 w-full h-full object-cover object-top sm:object-contain sm:object-bottom"
                />
                {/* wavy edge between image and text */}
                <svg aria-hidden="true" viewBox="0 0 30 400" preserveAspectRatio="none" className="hidden sm:block absolute left-0 top-0 h-full w-[30px]">
                  <path d="M0 0 L18 0 C 30 60, 4 120, 16 200 S 30 330, 14 400 L0 400 Z" fill="#fff" />
                </svg>
                <svg aria-hidden="true" viewBox="0 0 400 30" preserveAspectRatio="none" className="sm:hidden absolute left-0 right-0 bottom-0 w-full h-[24px]">
                  <path d="M0 30 L0 14 C 80 30, 160 0, 240 12 S 360 26, 400 10 L400 30 Z" fill="#fff" />
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default DemoInterestPopup;