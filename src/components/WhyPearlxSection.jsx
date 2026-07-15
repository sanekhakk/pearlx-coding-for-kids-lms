import React from "react";
import { motion } from "framer-motion";
import { Zap, Target, Users, ShieldCheck, Trophy, Clock } from "lucide-react";

const features = [
  { icon: Zap, t: "100% Projects", d: "Every lesson results in a real game, app, or website the student can show off.", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  { icon: Target, t: "Board Ready", d: "Targeted tuition strategies for CBSE, ICSE, and state board CS exams.", color: "#0EA5E9", bg: "rgba(14,165,233,0.1)" },
  { icon: Users, t: "Small Batches", d: "Maximum 3–5 students per class for genuine focus and attention.", color: "#6366F1", bg: "rgba(99,102,241,0.1)" },
  { icon: ShieldCheck, t: "Certified", d: "Industry-standard certification issued at the end of each completed module.", color: "#C9A84C", bg: "rgba(201,168,76,0.1)" },
  { icon: Trophy, t: "Grand Showcase", d: "Students present their capstone projects to parents at level completion.", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  { icon: Clock, t: "Flexible Timing", d: "Schedule sessions at your convenience — weekdays or weekends.", color: "#0EA5E9", bg: "rgba(14,165,233,0.1)" },
];

const WhyPearlxSection = () => (
  <section className="py-28 relative overflow-hidden" style={{ background: "#F8FAFC" }}>
    {/* Static background — removed rotating orbs and floating particles */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[45vw] h-[45vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.06) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>

    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-xs font-bold tracking-widest uppercase mb-3"
        style={{ color: "#10B981", letterSpacing: "0.14em" }}
      >
        Why Choose Us
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="font-extrabold mb-16 tracking-tight"
        style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#0F172A", letterSpacing: "-0.03em" }}
      >
        Why{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Pearlx?
        </span>
      </motion.h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="p-8 rounded-[2rem] bg-white border-2 text-left relative overflow-hidden group cursor-default"
            style={{
              borderColor: "rgba(15,23,42,0.06)",
              boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = `${f.color}30`;
              e.currentTarget.style.boxShadow = `0 20px 48px ${f.bg}, 0 4px 12px rgba(15,23,42,0.04)`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(15,23,42,0.06)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(15,23,42,0.04)";
            }}
          >
            {/* Top accent line on hover */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }}
            />

            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: f.bg }}
            >
              <f.icon className="w-6 h-6" style={{ color: f.color }} />
            </div>
            <h4 className="font-bold text-lg mb-2" style={{ color: "#0F172A" }}>{f.t}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{f.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyPearlxSection;