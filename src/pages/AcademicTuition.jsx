import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Award, Users, TrendingUp, Clock, Target,
  CheckCircle2, Star, Zap, Heart, GraduationCap, ArrowRight,
  ChevronDown, ChevronUp, Globe, FlaskConical, Calculator,
  Landmark, MessageSquare, Monitor, BarChart2, Atom, Microscope,
  DollarSign, ScrollText, Map, Building2, Cpu, Briefcase,
  Sprout, Wallet, Sparkles, HelpCircle, Trophy, Flame
} from "lucide-react";
import { COLORS, GRADIENTS, SHADOWS, DARK } from "../utils/theme";

const T = {
  bg: "#FFFFFF",
  ink: "#0F172A",
  green: "#10B981",
  sky: "#0EA5E9",
  indigo: "#6366F1",
  purple: "#A78BFA",
  pink: "#FF6B9D",
  yellow: "#FFD166",
  teal: "#14B8A6",
};

const CLASSES_DATA = [
  { range: "Classes 1-7", fee: "₹250/session", Icon: Sprout, SecondIcon: Users, color: T.green, desc: "Foundation building with fun learning" },
  { range: "Classes 8-10", fee: "₹300/session", Icon: BookOpen, SecondIcon: Target, color: T.sky, desc: "Board exams preparation & concepts" },
  { range: "Classes 11-12", fee: "₹350/session", Icon: GraduationCap, SecondIcon: Award, color: T.purple, desc: "Advanced concepts & competitive exams" },
];

const AVAILABLE_SYLLABUSES = [
  { name: "CBSE", boards: "Central Board of Secondary Education" },
  { name: "ICSE", boards: "Indian Certificate of Secondary Education" },
  { name: "ISC", boards: "Indian School Certificate" },
  { name: "IGCSE", boards: "International General Certificate of Secondary Education" },
  { name: "State Boards", boards: "All Indian State Boards (Maharashtra, Karnataka, Tamil Nadu, etc.)" },
];

const SUBJECTS_BY_CLASS = {
  "Classes 1-7": [
    { name: "English", SubIcon: BookOpen },
    { name: "Mathematics", SubIcon: Calculator },
    { name: "Science", SubIcon: FlaskConical },
    { name: "Social Studies", SubIcon: Globe },
    { name: "Hindi", SubIcon: MessageSquare },
    { name: "Computer Basics", SubIcon: Monitor },
  ],
  "Classes 8-10": [
    { name: "English", SubIcon: BookOpen },
    { name: "Mathematics", SubIcon: Calculator },
    { name: "Science (Physics, Chemistry, Biology)", SubIcon: FlaskConical },
    { name: "Social Science (History, Geography, Civics)", SubIcon: Globe },
    { name: "Hindi/Regional Language", SubIcon: MessageSquare },
    { name: "Computer Science", SubIcon: Monitor },
    { name: "Accountancy (Optional)", SubIcon: BarChart2 },
  ],
  "Classes 11-12": [
    { name: "Physics", SubIcon: Atom },
    { name: "Chemistry", SubIcon: FlaskConical },
    { name: "Mathematics", SubIcon: Calculator },
    { name: "Biology", SubIcon: Microscope },
    { name: "English", SubIcon: BookOpen },
    { name: "Economics", SubIcon: DollarSign },
    { name: "History", SubIcon: ScrollText },
    { name: "Geography", SubIcon: Map },
    { name: "Civics/Political Science", SubIcon: Building2 },
    { name: "Computer Science", SubIcon: Monitor },
    { name: "Accountancy", SubIcon: BarChart2 },
    { name: "Business Studies", SubIcon: Briefcase },
  ],
};

const FEATURES = [
  { icon: Target, t: "Targeted Board Prep", d: "CBSE, ICSE, ISC, IGCSE, State boards — we teach your child's exact curriculum." },
  { icon: Award, t: "Exam-Focused", d: "Every session designed to boost marks & build conceptual clarity for board exams." },
  { icon: Users, t: "Small Batches (1:1 or 2-3)", d: "Personalised attention — your child isn't lost in a classroom of 40." },
  { icon: TrendingUp, t: "Monthly Progress Reports", d: "Detailed updates on strengths, improvement areas & study strategies." },
  { icon: Clock, t: "Flexible Schedule", d: "Book any time slot that works for you — weekdays, weekends, early morning, late night." },
  { icon: CheckCircle2, t: "Doubt Clearing 24/7", d: "WhatsApp group for quick answers — never let a concept gap linger." },
];

const FAQS = [
  { q: "Which board does your tuition support?", a: "We support all major boards in India: CBSE, ICSE, ISC, IGCSE, and all state boards (Maharashtra, Karnataka, Tamil Nadu, Gujarat, Rajasthan, UP, etc.). Just tell us which board your child is in, and we'll align the curriculum." },
  { q: "What subjects can I get tuition for?", a: "All subjects across Classes 1-12! English, Maths, Science (Physics, Chemistry, Biology), Social Studies, Hindi, Computer Science, Accountancy, Economics, Business Studies, and more. Pick any subject your child needs help with." },
  { q: "How much does academic tuition cost?", a: "Classes 1-7: ₹250/session | Classes 8-10: ₹300/session | Classes 11-12: ₹350/session. One session = 1 hour. Book bundles and save up to 20%!" },
  { q: "Can I book tuition for multiple subjects?", a: "Absolutely! Many students book different tutors for different subjects, or even the same tutor if they teach multiple subjects. Arrange subjects based on your child's needs." },
  { q: "How are board exams different from regular exams?", a: "Board exams test deeper understanding, not just memorization. Our tutors help with answer writing, time management, and problem-solving strategies specific to board patterns." },
  { q: "Can tuition help my child improve marks immediately?", a: "Improvement timeline depends on effort. With 2-3 sessions per week, most students see a 15-25% boost in 2-3 months. Consistency matters more than frequency!" },
];

const TESTIMONIALS = [
  { name: "Priya (Class 10, CBSE)", subject: "Maths", mark: "78 → 92", t: "Pearlx made complex topics so simple! My conceptual gaps vanished in 2 months.", TIcon: Star },
  { name: "Aditya (Class 12, CBSE)", subject: "Physics", mark: "65 → 88", t: "The board exam focus really helped. I went from being scared of Physics to scoring 88!", TIcon: Zap },
  { name: "Ananya (Class 9, ICSE)", subject: "English", mark: "70 → 85", t: "My teacher explained literature in ways I finally understood. Highly recommend!", TIcon: BookOpen },
  { name: "Rohan (Class 11, ISC)", subject: "Chemistry", mark: "72 → 94", t: "Organic chemistry became my favourite subject after Pearlx tuition. Amazing teaching!", TIcon: FlaskConical },
];

// Components
const SectionBadge = ({ children, color }) => (
  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border"
    style={{ background: `${color}15`, borderColor: `${color}30`, color }}>
    {children}
  </motion.div>
);

const FeatureCard = ({ icon: Icon, t, d, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} transition={{ delay }}
    whileHover={{ y: -8 }}
    className="p-6 rounded-2xl bg-white border-2 transition-all"
    style={{ borderColor: "rgba(15,23,42,0.1)", boxShadow: "0 4px 20px rgba(15,23,42,0.04)" }}>
    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
      style={{ background: "rgba(16,185,129,0.1)" }}>
      <Icon className="w-6 h-6" style={{ color: T.green }} />
    </div>
    <h3 className="font-bold text-lg mb-2" style={{ color: T.ink }}>{t}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{d}</p>
  </motion.div>
);

const ClassCard = ({ range, fee, Icon, SecondIcon, color, desc }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.03, y: -6 }}
    className="p-8 rounded-2xl border-2 bg-white relative overflow-hidden group cursor-default"
    style={{ borderColor: `${color}20`, boxShadow: `0 12px 40px ${color}15` }}>
    <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-all"
      style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}10` }}>
        <SecondIcon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
    <h3 className="font-black text-xl mb-1" style={{ color }}>{range}</h3>
    <p className="text-slate-500 text-sm mb-4">{desc}</p>
    <div className="flex items-baseline gap-2">
      <span className="font-black text-2xl" style={{ color }}>{fee}</span>
      <span className="text-xs text-slate-400">1 hour</span>
    </div>
  </motion.div>
);

const SubjectList = ({ classRange }) => {
  const subjects = SUBJECTS_BY_CLASS[classRange] || [];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {subjects.map((subject, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.15)" }}>
              <subject.SubIcon className="w-4 h-4" style={{ color: T.green }} />
            </div>
            <span className="font-semibold text-sm" style={{ color: T.ink }}>{subject.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: i * 0.05 }}
          className="rounded-2xl border-2 overflow-hidden transition-all"
          style={{
            borderColor: openIdx === i ? T.green : "rgba(15,23,42,0.1)",
            boxShadow: openIdx === i ? `0 8px 24px rgba(16,185,129,0.15)` : "0 2px 8px rgba(0,0,0,0.02)"
          }}>
          <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between p-6 text-left font-bold transition-all"
            style={{ color: T.ink, background: openIdx === i ? "rgba(16,185,129,0.05)" : "#fff" }}>
            <span className="text-sm sm:text-base">{faq.q}</span>
            <motion.span animate={{ rotate: openIdx === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-5 h-5" style={{ color: T.green }} />
            </motion.span>
          </button>
          <AnimatePresence>
            {openIdx === i && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t"
                style={{ borderColor: "rgba(16,185,129,0.1)" }}>
                {faq.a}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

const TestimonialCard = ({ name, subject, mark, t, TIcon }) => (
  <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="p-6 rounded-2xl bg-white border-2 flex flex-col"
    style={{ borderColor: "rgba(16,185,129,0.15)", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4" fill={T.yellow} style={{ color: T.yellow }} />)}
    </div>
    <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1 italic">{t}</p>
    <div className="border-t pt-4" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
      <div className="font-bold text-sm" style={{ color: T.ink }}>{name}</div>
      <div className="text-xs text-slate-500 mb-2">{subject}</div>
      <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg text-xs font-bold"
        style={{ background: "rgba(16,185,129,0.1)", color: T.green }}>
        <TIcon className="w-3.5 h-3.5" /> {mark}
      </div>
    </div>
  </motion.div>
);

//MAIN COMPONENT
const AcademicTuition = ({ openDemoModal }) => {
  const [expandedClass, setExpandedClass] = useState("Classes 1-7");

  return (
    <main className="pt-28">
      {/*HERO */}
      <section className="py-28 px-4 relative overflow-hidden" style={{ background: T.bg }}>
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute -top-32 -right-32 w-[40vw] h-[40vw] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-32 -left-32 w-[40vw] h-[40vw] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <SectionBadge color={T.green}><BookOpen className="w-3.5 h-3.5" /> Academic Tuition</SectionBadge>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-black mt-6 mb-4 leading-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: T.ink, letterSpacing: "-0.04em" }}>
            Score top marks with{" "}
            <span style={{ background: GRADIENTS.primary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              board-aligned tuition
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mb-8 leading-relaxed">
            Classes 1-12 • All boards (CBSE, ICSE, ISC, IGCSE, State) • All subjects • Expert teachers • Exam-focused prep
          </motion.p>
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            onClick={() => openDemoModal("academic_hero")}
            className="px-8 py-4 rounded-2xl text-white font-bold border-none cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${T.green}, ${T.sky})`, boxShadow: "0 8px 28px rgba(16,185,129,0.3)" }}>
            Book Free Demo Class <ArrowRight className="w-5 h-5 inline ml-2" />
          </motion.button>
        </div>
      </section>

      {/*FEE STRUCTURE*/}
      <section className="py-24 px-4" style={{ background: "linear-gradient(160deg, #F0FFFE, #E0F2FE)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionBadge color={T.green}><Wallet className="w-3.5 h-3.5" /> Simple Pricing</SectionBadge>
            <h2 className="font-black text-3xl mt-4 mb-3" style={{ color: T.ink, letterSpacing: "-0.03em" }}>
              Affordable for every family
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Transparent pricing with no hidden fees. Book sessions when you need them.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {CLASSES_DATA.map((cls, i) => (
              <ClassCard key={i} {...cls} />
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl text-center text-sm"
            style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
            <span style={{ color: T.green }} className="font-bold flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 inline" /> Save up to 20%</span> with bundle packages! Ask for details on WhatsApp.
          </motion.div>
        </div>
      </section>

      {/* AVAILABLE SYLLABUS */}
      <section className="py-24 px-4" style={{ background: T.bg }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionBadge color={T.sky}><Globe className="w-3.5 h-3.5" /> All Indian Boards</SectionBadge>
            <h2 className="font-black text-3xl mt-4 mb-3" style={{ color: T.ink }}>
              We teach every Indian curriculum
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {AVAILABLE_SYLLABUSES.map((board, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-white border-2 text-center"
                style={{ borderColor: "rgba(14,165,233,0.15)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 mx-auto" style={{ background: "rgba(14,165,233,0.1)" }}>
                  <GraduationCap className="w-5 h-5" style={{ color: T.sky }} />
                </div>
                <h3 className="font-bold" style={{ color: T.ink }}>{board.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{board.boards}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBJECTS BY CLASS */}
      <section className="py-24 px-4" style={{ background: "linear-gradient(160deg, #F0FFFE, #E0F2FE)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionBadge color={T.green}><BookOpen className="w-3.5 h-3.5" /> Subject Coverage</SectionBadge>
            <h2 className="font-black text-3xl mt-4 mb-3" style={{ color: T.ink }}>
              All subjects for all classes
            </h2>
          </div>
          <div className="space-y-4">
            {Object.keys(SUBJECTS_BY_CLASS).map((classRange, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <button onClick={() => setExpandedClass(expandedClass === classRange ? null : classRange)}
                  className="w-full flex items-center justify-between p-6 rounded-2xl bg-white border-2 font-bold transition-all"
                  style={{
                    borderColor: expandedClass === classRange ? T.green : "rgba(15,23,42,0.1)",
                    color: T.ink
                  }}>
                  <span>{classRange}</span>
                  <ChevronDown className="w-5 h-5" style={{ color: T.green, transform: expandedClass === classRange ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }} />
                </button>
                <AnimatePresence>
                  {expandedClass === classRange && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                      className="p-6">
                      <SubjectList classRange={classRange} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/*  KEY FEATURES */}
      <section className="py-24 px-4" style={{ background: T.bg }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionBadge color={T.green}><Star className="w-3.5 h-3.5" /> Why Choose Pearlx</SectionBadge>
            <h2 className="font-black text-3xl mt-4 mb-3" style={{ color: T.ink }}>
              Tuition designed for board success
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/*  TESTIMONIALS  */}
      <section className="py-24 px-4" style={{ background: "linear-gradient(160deg, #F0FFFE, #E0F2FE)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionBadge color={T.green}><Heart className="w-3.5 h-3.5" /> Student Success Stories</SectionBadge>
            <h2 className="font-black text-3xl mt-4 mb-3" style={{ color: T.ink }}>
              See real mark improvements
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TESTIMONIALS.map((test, i) => (
              <TestimonialCard key={i} {...test} />
            ))}
          </div>
        </div>
      </section>

      {/*  FAQs  */}
      <section className="py-24 px-4" style={{ background: T.bg }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionBadge color={T.sky}><HelpCircle className="w-3.5 h-3.5" /> FAQs</SectionBadge>
            <h2 className="font-black text-3xl mt-4 mb-2" style={{ color: T.ink }}>
              Answers to common questions
            </h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/*  CTA BOTTOM  */}
      <section className="py-24 px-4" style={{ background: "linear-gradient(160deg, #F0FFFE, #E0F2FE)" }}>
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center p-12 rounded-3xl border-2"
          style={{
            borderColor: `${T.green}30`,
            background: "linear-gradient(135deg, rgba(16,185,129,0.05), rgba(14,165,233,0.05))",
            boxShadow: `0 16px 60px rgba(16,185,129,0.1)`
          }}>
          <h2 className="font-black text-3xl mb-4" style={{ color: T.ink }}>
            Ready to improve your marks?
          </h2>
          <p className="text-slate-600 mb-8">
            Book a free 30-minute demo class today. No payment, no pressure. Just quality tuition.
          </p>
          <motion.button onClick={() => openDemoModal("academic_cta")}
            whileHover={{ scale: 1.05, boxShadow: `0 12px 40px rgba(16,185,129,0.3)` }}
            className="px-8 py-4 rounded-2xl text-white font-bold border-none cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${T.green}, ${T.sky})`, boxShadow: "0 8px 28px rgba(16,185,129,0.3)" }}>
            Get Free Demo Class Now <Sparkles className="w-4 h-4 inline ml-1" />
          </motion.button>
        </motion.div>
      </section>
    </main>
  );
};

export default AcademicTuition;