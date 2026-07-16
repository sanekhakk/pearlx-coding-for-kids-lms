import React from "react";
import { motion } from "framer-motion";
import { Layout, Code2, Rocket, Shield, ExternalLink, Sparkles } from "lucide-react";
import { COLORS, GRADIENTS, SHADOWS, DARK } from "../utils/theme";
import { getWhatsAppLink } from "../utils/whatsapp";

const services = [
  { icon: Layout, title: "UI / UX Design", desc: "Beautiful, conversion-focused designs built around your brand identity and users.", accent: COLORS.cyan },
  { icon: Code2, title: "Website Development", desc: "React, Node.js, custom CMS — fast, modern, scalable websites.", accent: COLORS.emerald },
  { icon: Rocket, title: "Deployment & SEO", desc: "Domain, hosting, SSL, Google Search Console — fully handled.", accent: COLORS.indigo },
  { icon: Shield, title: "Support & Maintenance", desc: "Ongoing care, security patches, and performance monitoring.", accent: COLORS.cyan },
];

const tags = [
  { label: "E-commerce", color: COLORS.emerald },
  { label: "Portfolios", color: COLORS.cyan },
  { label: "Landing Pages", color: COLORS.indigo },
  { label: "Web Apps", color: COLORS.emerald },
];

const WebServicesSection = () => (
  <section className="py-0 overflow-hidden">
    <div className="py-28 relative" style={{ background: DARK.bg }}>

      {/* ── THEMED BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: DARK.gradPrimary, opacity: 0.3 }} />
        
        {/* Dot grid using theme muted text color */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, ${DARK.textMuted} 1px, transparent 0)`, backgroundSize: "48px 48px" }} />

        {/* Animated Orbs using Emerald and Cyan Lights */}
        <motion.div animate={{ rotate: 360, scale: [1, 1.15, 1] }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -right-32 w-[40vw] h-[40vw] rounded-full"
          style={{ background: `radial-gradient(circle, ${COLORS.emeraldLight} 0%, transparent 70%)`, filter: "blur(50px)" }} />
        <motion.div animate={{ rotate: -360, scale: [1, 1.2, 1] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -left-32 w-[35vw] h-[35vw] rounded-full"
          style={{ background: `radial-gradient(circle, ${COLORS.cyanLight} 0%, transparent 70%)`, filter: "blur(50px)" }} />

        {/* Shimmer animation using Cyan */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 6, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, transparent)` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left content */}
          <div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold mb-6 border"
              style={{ color: COLORS.emerald, borderColor: DARK.borderActive, background: COLORS.emeraldLight, letterSpacing: "0.1em" }}>
              <Sparkles className="w-3.5 h-3.5" /> WEB STUDIO
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-bold text-white mb-6"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              We also build{" "}
              <span style={{ background: GRADIENTS.primary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                great websites
              </span>
            </motion.h2>

            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-base leading-relaxed mb-8"
              style={{ color: DARK.textSecondary, lineHeight: 1.9 }}>
              The same developers who teach CS build real production websites for brands, startups, and professionals. 
              From design to deployment — everything handled.
            </motion.p>

            <div className="flex gap-2.5 flex-wrap mb-10">
              {tags.map((t, i) => (
                <span key={i} className="px-3.5 py-1.5 rounded-full text-xs font-semibold border"
                  style={{ color: t.color, borderColor: `${t.color}30`, background: `${t.color}10` }}>
                  {t.label}
                </span>
              ))}
            </div>

            <motion.a
              href={getWhatsAppLink("Hi! I'd like a free quote for a website for my brand/business.")}
              target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.04, boxShadow: SHADOWS.glowCyan }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold transition-all"
              style={{ background: GRADIENTS.primary, color: COLORS.white, boxShadow: SHADOWS.sm }}>
              Get a free quote <ExternalLink className="w-4 h-4" />
            </motion.a>
          </div>

          {/* Right — service cards */}
          <div className="grid grid-cols-2 gap-4">
            {services.map((s, i) => (
              <motion.div key={i}
                whileHover={{ y: -6, borderColor: DARK.borderActive, background: DARK.surfaceAlt }}
                className="p-5 rounded-2xl border transition-all duration-300"
                style={{ background: DARK.surface, borderColor: DARK.border }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${s.accent}15`, border: `1px solid ${s.accent}30` }}>
                  <s.icon className="w-4 h-4" style={{ color: s.accent }} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: DARK.textMuted }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default WebServicesSection;