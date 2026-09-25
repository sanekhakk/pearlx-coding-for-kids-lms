import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, Code2, Calculator, BookOpen } from "lucide-react";
import heroKid from "../assets/kids/heroKid.webp";


const HeroSection = ({ openDemoModal }) => {
  const highlights = [
    { icon: Code2, label: "Coding", color: "#10B981" },
    { icon: Calculator, label: "Maths", color: "#F59E0B" },
    { icon: BookOpen, label: "Academic Tuition", color: "#0EA5E9" },
  ];

  return (
    <section className="relative overflow-hidden bg-white pt-32 lg:pt-36">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-[-10%] w-[620px] h-[620px] rounded-full bg-cyan-100/50 blur-3xl" />
        <div className="absolute top-[45%] left-[-15%] w-[520px] h-[520px] rounded-full bg-emerald-100/40 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 md:mx-30 px-5 sm:px-6 pt-10 md:pt-0">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-12 items-center min-h-[calc(100vh-120px)] py-10 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-2xl"
          >
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live online classes for kids
            </div> */}

            <h1 className="text-[2.7rem] sm:text-5xl lg:text-[4.4rem] font-black leading-[0.98] tracking-[-0.045em] text-slate-950">
              Help your child
              <span className="block mt-2 bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
                learn with confidence.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-7 text-slate-600">
              Coding, Maths and Academic Tuition designed around your child's
              age, level and learning pace.
            </p>

            <div className="flex flex-wrap gap-2.5 mt-7">
              {highlights.map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  <Icon size={16} style={{ color }} />
                  {label}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => openDemoModal("hero")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Book a free trial
                <ArrowRight size={17} />
              </button>

              <a
                href="#programs"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Play size={16} />
                Explore programs
              </a>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-7 text-xs font-semibold text-slate-500">
              {["Personalised learning", "Small groups", "Parent updates"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative flex items-center justify-center min-h-[420px] lg:min-h-[600px]"
          >
            <div className="absolute w-[78%] aspect-square rounded-full bg-gradient-to-br from-sky-100 via-white to-emerald-100" />
            <div className="absolute w-[88%] aspect-square rounded-full border border-slate-200/80" />
            <div className="absolute w-[66%] aspect-square rounded-full border border-dashed border-emerald-200/80" />

            <div className="relative z-10 w-full max-w-[500px]">
              <img
                src={heroKid}
                alt="Child learning coding"
                className="w-full h-auto object-contain drop-shadow-[0_28px_45px_rgba(15,23,42,0.16)]"
              />
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[8%] right-[2%] sm:right-[7%] rounded-2xl border border-white bg-white/95 backdrop-blur px-4 py-3 shadow-xl"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Learning
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                At their own pace
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              className="absolute bottom-[10%] left-[0%] sm:left-[4%] rounded-2xl border border-white bg-white/95 backdrop-blur px-4 py-3 shadow-xl"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Pearlx
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                Learn · Build · Grow
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* <div className="border-t border-slate-100 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span className="font-semibold">Built for curious minds. Trusted by parents.</span>
          <span>Online • Interactive • Structured</span>
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;
