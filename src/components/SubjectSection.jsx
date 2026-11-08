import React, { useState } from "react";
import { motion } from "framer-motion";

import {
  Check,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Brain,
} from "lucide-react";

import {
  SiPython,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiMysql,
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiDjango,
  SiGit,
} from "react-icons/si";

import { getWhatsAppLink } from "../utils/whatsapp";
import { COLORS } from "../utils/theme";
import { SectionHeader, Scribble, glow } from "./ui/Brand";

/* =========================================================
   COURSE BANNERS
========================================================= */

import pythonBanner from "../assets/courses/python.webp";
import htmlBanner from "../assets/courses/html.webp";
import cssBanner from "../assets/courses/css.webp";
import javascriptBanner from "../assets/courses/javascript.webp";
import sqlBanner from "../assets/courses/sql.webp";
import reactBanner from "../assets/courses/react.webp";
import nodeBanner from "../assets/courses/node.webp";
import mongodbBanner from "../assets/courses/mongodb.webp";
import djangoBanner from "../assets/courses/django.webp";
import gitBanner from "../assets/courses/git.webp";
import mathsBanner from "../assets/courses/mathsbanner.webp";
import logicalThinkingBanner from "../assets/courses/logical-thinking.webp";

/* =========================================================
   COURSE DATA
========================================================= */

const COURSES = [
  {
    id: "python",
    name: "Python",
    icon: SiPython,
    iconColor: "#3776AB",
    banner: pythonBanner,
    prices: {
      starter: 350,
      intermediate: 400,
      advanced: 500,
    },
    description:
      "Learn Python from programming fundamentals to advanced concepts and problem solving.",
  },

  {
    id: "html",
    name: "HTML",
    icon: SiHtml5,
    iconColor: "#E34F26",
    banner: htmlBanner,
    prices: {
      starter: 350,
      intermediate: 400,
      advanced: 500,
    },
    description:
      "Learn how websites are structured and build clean web pages from scratch.",
  },

  {
    id: "css",
    name: "CSS",
    icon: SiCss,
    iconColor: "#1572B6",
    banner: cssBanner,
    prices: {
      starter: 350,
      intermediate: 400,
      advanced: 500,
    },
    description:
      "Create beautiful, responsive and modern website designs with CSS.",
  },

  {
    id: "javascript",
    name: "JavaScript",
    icon: SiJavascript,
    iconColor: "#F7DF1E",
    banner: javascriptBanner,
    prices: {
      starter: 350,
      intermediate: 400,
      advanced: 500,
    },
    description:
      "Learn JavaScript and create interactive, dynamic web experiences.",
  },

  {
    id: "sql",
    name: "SQL",
    icon: SiMysql,
    iconColor: "#4479A1",
    banner: sqlBanner,
    prices: {
      starter: 350,
      intermediate: 400,
      advanced: 500,
    },
    description:
      "Learn databases, queries, joins and practical data management.",
  },

  {
    id: "react",
    name: "React.js",
    icon: SiReact,
    iconColor: "#61DAFB",
    banner: reactBanner,
    prices: {
      starter: 450,
      intermediate: 550,
      advanced: 650,
    },
    description:
      "Build modern interactive web applications using React.js.",
  },

  {
    id: "node",
    name: "Node.js",
    icon: SiNodedotjs,
    iconColor: "#339933",
    banner: nodeBanner,
    prices: {
      starter: 450,
      intermediate: 550,
      advanced: 650,
    },
    description:
      "Learn backend development, APIs and server-side JavaScript.",
  },

  {
    id: "mongodb",
    name: "MongoDB",
    icon: SiMongodb,
    iconColor: "#47A248",
    banner: mongodbBanner,
    prices: {
      starter: 450,
      intermediate: 550,
      advanced: 650,
    },
    description:
      "Learn NoSQL databases and work with real-world application data.",
  },

  {
    id: "django",
    name: "Django",
    icon: SiDjango,
    iconColor: "#092E20",
    banner: djangoBanner,
    prices: {
      starter: 500,
      intermediate: 600,
      advanced: 700,
    },
    description:
      "Build powerful backend applications using Python and Django.",
  },


  {
    id: "git",
    name: "Git & GitHub",
    icon: SiGit,
    iconColor: "#F05032",
    banner: gitBanner,
    prices: {
      starter: 350,
      intermediate: 400,
      advanced: 500,
    },
    description:
      "Learn version control and professional development workflows.",
  },

  {
    id: "maths",
    name: "Maths",
    icon: Calculator,
    iconColor: COLORS.indigo,
    banner: mathsBanner,
    prices: {
      starter: 350,
      intermediate: 400,
      advanced: 500,
    },
    description:
      "Build stronger mathematical thinking through concepts and problem solving.",
  },

  {
    id: "logical-thinking",
    name: "Logical Thinking",
    icon: Brain,
    iconColor: COLORS.emerald,
    banner: logicalThinkingBanner,
    prices: {
      starter: 350,
      intermediate: 400,
      advanced: 500,
    },
    description:
      "Develop reasoning, analytical thinking and structured problem solving.",
  },
];

/* =========================================================
   LEVELS
========================================================= */

const LEVELS = [
  {
    id: "starter",
    name: "Starter",
    description: "Build strong fundamentals",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "Build practical skills",
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Master advanced concepts",
  },
];

/* =========================================================
   CLASS PACKAGES
========================================================= */

const CLASS_PACKAGES = [12, 24, 30, 60];

/* =========================================================
   PRICE FORMATTER
========================================================= */

const formatPrice = (price) =>
  `₹${price.toLocaleString("en-IN")}`;

/* =========================================================
   MAIN COMPONENT
========================================================= */

const SubjectSection = () => {
  const [activeCourse, setActiveCourse] = useState("python");
  const [activeLevel, setActiveLevel] = useState("intermediate");
  const [classCount, setClassCount] = useState(30);

  const course = COURSES.find((item) => item.id === activeCourse) || COURSES[0];
  const level = LEVELS.find((item) => item.id === activeLevel) || LEVELS[1];
  const CourseIcon = course.icon;
  const pricePerClass = course.prices[activeLevel];
  const totalPrice = pricePerClass * classCount;

  /* ---------- change course ---------- */
  const changeCourse = (direction) => {
    const currentIndex = COURSES.findIndex((item) => item.id === activeCourse);
    let nextIndex;
    if (direction === "next") {
      nextIndex = currentIndex + 1;
      if (nextIndex >= COURSES.length) nextIndex = 0;
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) nextIndex = COURSES.length - 1;
    }
    setActiveCourse(COURSES[nextIndex].id);
  };

  /* ---------- whatsapp ---------- */
  const handleEnquiry = () => {
    const message = `Hi! I'm interested in the ${course.name} course at Pearlx.
Level: ${level.name}
Classes: ${classCount}
Price: ${formatPrice(totalPrice)}
I'd like to know more about the course and available timings.`;
    window.open(getWhatsAppLink(message), "_blank");
  };

  return (
    <section id="curriculum" className="relative" style={{ background: COLORS.bgSecondary }}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <SectionHeader
          eyebrow="✦ Pearlx Learning"
          color={COLORS.cyan}
          title={
            <>
              Choose what <Scribble color={COLORS.emerald}>you want to learn.</Scribble>
            </>
          }
          sub="Explore courses, choose your level and find the package that works for you."
          className="mb-7 sm:mb-10"
        />

        {/* ---------- STEP 1 · ALL COURSES VISIBLE ---------- */}
        <StepLabel n={1} text="Courses" right={`${COURSES.length} options`} />
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1.5 sm:gap-2.5">
          {COURSES.map((item) => {
            const ItemIcon = item.icon;
            const selected = item.id === activeCourse;
            return (
              <button
                key={item.id}
                onClick={() => setActiveCourse(item.id)}
                aria-pressed={selected}
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2.5 rounded-xl px-1.5 py-2 sm:px-3 sm:py-2.5 text-center sm:text-left transition-all duration-200"
                style={{
                  background: COLORS.white,
                  border: `1px solid ${selected ? item.iconColor : COLORS.border}`,
                  boxShadow: selected ? glow(item.iconColor, "40") : "none",
                  outline: selected ? `1px solid ${item.iconColor}` : "none",
                }}
              >
                <span
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${item.iconColor}18` }}
                >
                  <ItemIcon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" style={{ color: item.iconColor }} />
                </span>
                <span
                  className="text-[11px] sm:text-sm font-semibold leading-tight"
                  style={{ color: selected ? COLORS.ink : COLORS.textSecondary }}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* ---------- COURSE DETAILS ---------- */}
        <CourseDetails
          course={course}
          level={level}
          activeLevel={activeLevel}
          setActiveLevel={setActiveLevel}
          classCount={classCount}
          setClassCount={setClassCount}
          pricePerClass={pricePerClass}
          totalPrice={totalPrice}
          CourseIcon={CourseIcon}
          handleEnquiry={handleEnquiry}
          changeCourse={changeCourse}
        />
      </div>
    </section>
  );
};

/* ---------- small numbered step label ---------- */
const StepLabel = ({ n, text, right, color = COLORS.cyan }) => (
  <div className="flex items-center justify-between mb-2.5">
    <div className="flex items-center gap-2">
      <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: color }}>
        {n}
      </span>
      <span className="text-sm sm:text-base font-bold" style={{ color: COLORS.ink }}>{text}</span>
    </div>
    {right && <span className="text-[11px] sm:text-xs font-semibold" style={{ color: COLORS.textMuted }}>{right}</span>}
  </div>
);

/* =========================================================
   COURSE DETAILS
========================================================= */

const CourseDetails = ({
  course,
  level,
  activeLevel,
  setActiveLevel,
  classCount,
  setClassCount,
  pricePerClass,
  totalPrice,
  CourseIcon,
  handleEnquiry,
  changeCourse,
}) => {
  return (
    <motion.div
      key={course.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative mt-4 sm:mt-6 bg-white rounded-2xl sm:rounded-3xl overflow-hidden"
      style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 16px 40px -20px rgba(15,23,42,0.2)" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* LEFT · banner + overview */}
        <div className="p-3.5 sm:p-6 lg:border-r" style={{ borderColor: "#E2E8F0" }}>
          <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden bg-slate-50">
            <img src={course.banner} alt={`${course.name} course`} className="w-full h-full object-cover block" />
          </div>

          <div className="mt-3.5 sm:mt-5 flex items-center gap-3">
            <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${course.iconColor}14` }}>
              <CourseIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" style={{ color: course.iconColor }} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: COLORS.textMuted }}>
                Course Overview
              </div>
              <h3 className="text-lg sm:text-2xl font-extrabold leading-tight tracking-tight" style={{ color: COLORS.ink }}>
                {course.name}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {[["prev", ChevronLeft, "Previous course"], ["next", ChevronRight, "Next course"]].map(([dir, Ico, label]) => (
                <button
                  key={dir}
                  onClick={() => changeCourse(dir)}
                  aria-label={label}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white flex items-center justify-center hover:bg-slate-50"
                  style={{ border: "1px solid #E2E8F0", color: COLORS.ink }}
                >
                  <Ico className="w-4 h-4" strokeWidth={2.4} />
                </button>
              ))}
            </div>
          </div>

          <p className="mt-3 text-[13px] sm:text-base font-medium leading-relaxed" style={{ color: COLORS.textSecondary }}>
            {course.description}
          </p>
        </div>

        {/* RIGHT · plan builder */}
        <div className="p-3.5 sm:p-6 flex flex-col gap-4 sm:gap-5 border-t lg:border-t-0" style={{ borderColor: "#E2E8F0" }}>
          {/* Level */}
          <div>
            <StepLabel n={2} text="Level" color={COLORS.emerald} right="Choose level" />
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {LEVELS.map((item) => {
                const selected = activeLevel === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveLevel(item.id)}
                    aria-pressed={selected}
                    className="relative rounded-xl px-2 py-2 sm:px-3 sm:py-2.5 text-left transition-all duration-200"
                    style={{
                      background: selected ? COLORS.emeraldLight : COLORS.white,
                      border: `1px solid ${selected ? COLORS.emerald : COLORS.border}`,
                      outline: selected ? `1px solid ${COLORS.emerald}` : "none",
                    }}
                  >
                    {selected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full hidden sm:flex items-center justify-center text-white" style={{ background: COLORS.emerald }}>
                        <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
                      </span>
                    )}
                    <div className="text-[13px] sm:text-sm font-bold" style={{ color: COLORS.ink }}>{item.name}</div>
                    <div className="text-[10px] sm:text-[11px] font-medium mt-0.5 leading-snug" style={{ color: COLORS.textMuted }}>{item.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Classes */}
          <div>
            <StepLabel n={3} text="Classes" color={COLORS.indigo} right={`${formatPrice(pricePerClass)} / class`} />
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {CLASS_PACKAGES.map((count) => {
                const selected = classCount === count;
                return (
                  <button
                    key={count}
                    onClick={() => setClassCount(count)}
                    aria-pressed={selected}
                    className="relative rounded-xl py-2 sm:py-2.5 text-center transition-all duration-200"
                    style={{
                      background: selected ? COLORS.indigoLight : COLORS.white,
                      border: `1px solid ${selected ? COLORS.indigo : COLORS.border}`,
                      outline: selected ? `1px solid ${COLORS.indigo}` : "none",
                    }}
                  >
                    {count === 30 && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-px rounded-full text-[8px] sm:text-[9px] font-bold whitespace-nowrap" style={{ background: COLORS.gold, color: COLORS.navDark }}>
                        POPULAR
                      </span>
                    )}
                    <div className="text-base sm:text-xl font-extrabold leading-none" style={{ color: COLORS.ink }}>{count}</div>
                    <div className="text-[10px] sm:text-[11px] font-medium mt-0.5" style={{ color: COLORS.textMuted }}>classes</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price summary */}
          <div className="rounded-2xl p-3.5 sm:p-5 mt-auto" style={{ background: COLORS.navDark }}>
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.silver }}>Price Details</div>
            <div className="mt-2 grid grid-cols-3 gap-2 pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              {[
                ["Selected level", level.name],
                ["Classes", classCount],
                ["Per class", formatPrice(pricePerClass)],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider" style={{ color: COLORS.silver }}>{k}</div>
                  <div className="text-[13px] sm:text-base font-bold text-white mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.silver }}>Total price</div>
                <div className="text-2xl sm:text-3xl font-extrabold leading-none mt-1" style={{ color: COLORS.emerald }}>
                  {formatPrice(totalPrice)}
                </div>
              </div>
              <button onClick={handleEnquiry} className="px-btn px-btn--grad px-btn--sm w-full sm:w-auto">
                Enquire about this course
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectSection;