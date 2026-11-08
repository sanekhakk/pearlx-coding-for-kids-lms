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
import { COLORS, FONTS, edgeOf } from "../utils/theme";
import { SectionHeader, Scribble, PearlScatter, Wave } from "./ui/Brand";

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
    <section
      id="curriculum"
      className="relative overflow-hidden"
      style={{ background: COLORS.bgSecondary }}
    >
      <Wave fill="#FFFFFF" flip className="absolute top-0 left-0 right-0 z-[1]" />
      <div aria-hidden="true" className="absolute inset-0 px-dots opacity-60" />
      <PearlScatter variant="a" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-20 sm:pt-24 pb-16 sm:pb-24">
        <SectionHeader
          eyebrow="✦ Pearlx Learning"
          color={COLORS.cyan}
          title={
            <>
              Choose what
              <br />
              <Scribble color={COLORS.emerald} textColor={COLORS.emerald}>you want to learn.</Scribble>
            </>
          }
          sub="Explore courses, choose your level and find the package that works for you."
          className="mb-10 sm:mb-12"
        />

        {/* ---------- STEP 1 · COURSE SHELF ---------- */}
        <StepLabel n={1} text="Courses" hint="Swipe to explore →" />
        <div
          className="flex lg:grid lg:grid-cols-6 gap-2.5 sm:gap-3 overflow-x-auto lg:overflow-visible pb-3 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0"
        >
          {COURSES.map((item) => {
            const ItemIcon = item.icon;
            const selected = item.id === activeCourse;
            return (
              <button
                key={item.id}
                onClick={() => setActiveCourse(item.id)}
                className="snap-start shrink-0 flex lg:flex-col items-center lg:items-start gap-2.5 rounded-3xl px-3.5 py-3 lg:p-4 text-left transition-all duration-200"
                style={{
                  background: selected ? COLORS.white : "rgba(255,255,255,0.75)",
                  border: `2px solid ${selected ? item.iconColor : COLORS.border}`,
                  boxShadow: selected ? `0 5px 0 ${item.iconColor}55` : "0 3px 0 rgba(15,23,42,0.04)",
                  transform: selected ? "translateY(-3px)" : "none",
                }}
              >
                <span
                  className="w-10 h-10 lg:w-11 lg:h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${item.iconColor}18` }}
                >
                  <ItemIcon className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: item.iconColor }} />
                </span>
                <span
                  className="text-[15px] font-semibold whitespace-nowrap lg:whitespace-normal leading-tight"
                  style={{ fontFamily: FONTS.display, color: selected ? COLORS.ink : COLORS.textSecondary }}
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
const StepLabel = ({ n, text, hint, right, color = COLORS.cyan }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2.5">
      <span
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
        style={{ background: color, fontFamily: FONTS.display, boxShadow: `0 3px 0 ${edgeOf(color)}` }}
      >
        {n}
      </span>
      <span className="text-lg font-semibold" style={{ fontFamily: FONTS.display, color: COLORS.ink }}>{text}</span>
    </div>
    {hint && <span className="text-xs font-bold lg:hidden" style={{ color: COLORS.textMuted }}>{hint}</span>}
    {right && <span className="text-xs font-bold" style={{ color: COLORS.textMuted }}>{right}</span>}
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="relative mt-5 bg-white rounded-[2.25rem] overflow-hidden"
      style={{ border: `2px solid ${course.iconColor}40`, boxShadow: `0 8px 0 ${course.iconColor}30` }}
    >
      <div className="grid lg:grid-cols-[1.05fr_1fr]">
        {/* LEFT · banner + overview */}
        <div className="p-4 sm:p-6 lg:p-7" style={{ background: `${course.iconColor}0d` }}>
          <div className="relative w-full aspect-[3/1] rounded-[1.5rem] overflow-hidden bg-white" style={{ border: "2px solid rgba(15,23,42,0.06)" }}>
            <img src={course.banner} alt={`${course.name} course`} className="w-full h-full object-cover block" />
          </div>

          <div className="mt-5 flex items-start gap-3">
            <span className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0" style={{ border: `2px solid ${course.iconColor}35`, transform: "rotate(-5deg)" }}>
              <CourseIcon className="w-6 h-6" style={{ color: course.iconColor }} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.14em]" style={{ color: course.iconColor === "#F7DF1E" ? "#A16207" : course.iconColor }}>
                Course Overview
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold leading-tight" style={{ fontFamily: FONTS.display, color: COLORS.ink }}>
                {course.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {[["prev", ChevronLeft, "Previous course"], ["next", ChevronRight, "Next course"]].map(([dir, Ico, label]) => (
                <button
                  key={dir}
                  onClick={() => changeCourse(dir)}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
                  style={{ border: "2px solid rgba(15,23,42,0.1)", boxShadow: "0 3px 0 rgba(15,23,42,0.08)", color: COLORS.ink }}
                >
                  <Ico className="w-5 h-5" strokeWidth={2.6} />
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-base sm:text-lg font-semibold leading-relaxed" style={{ color: COLORS.textSecondary }}>
            {course.description}
          </p>
        </div>

        {/* RIGHT · plan builder */}
        <div className="p-4 sm:p-6 lg:p-7 flex flex-col gap-6">
          {/* Level */}
          <div>
            <StepLabel n={2} text="Level" color={COLORS.emerald} right="Choose level" />
            <div className="grid grid-cols-3 gap-2.5">
              {LEVELS.map((item, i) => {
                const selected = activeLevel === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveLevel(item.id)}
                    className="relative rounded-3xl px-3 py-3.5 text-left transition-all duration-200"
                    style={{
                      background: selected ? COLORS.emerald : COLORS.bgSecondary,
                      color: selected ? COLORS.white : COLORS.ink,
                      border: `2px solid ${selected ? COLORS.emerald : COLORS.border}`,
                      boxShadow: selected ? `0 4px 0 ${edgeOf(COLORS.emerald)}` : "none",
                    }}
                  >
                    <span className="flex gap-0.5 mb-2" aria-hidden="true">
                      {[0, 1, 2].map((s) => (
                        <span key={s} className="w-2 h-2 rounded-full" style={{ background: s <= i ? (selected ? "#fff" : COLORS.emerald) : (selected ? "rgba(255,255,255,0.35)" : COLORS.borderMed) }} />
                      ))}
                    </span>
                    {selected && (
                      <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-white flex items-center justify-center" style={{ color: COLORS.emerald }}>
                        <Check className="w-3 h-3" strokeWidth={3.5} />
                      </span>
                    )}
                    <div className="text-[15px] font-semibold" style={{ fontFamily: FONTS.display }}>{item.name}</div>
                    <div className="text-[11px] font-bold mt-0.5 leading-snug" style={{ opacity: selected ? 0.9 : 0.6 }}>{item.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Classes */}
          <div>
            <StepLabel n={3} text="Classes" color={COLORS.indigo} right={`${formatPrice(pricePerClass)} / class`} />
            <div className="grid grid-cols-4 gap-2.5">
              {CLASS_PACKAGES.map((count) => {
                const selected = classCount === count;
                return (
                  <button
                    key={count}
                    onClick={() => setClassCount(count)}
                    className="relative rounded-3xl py-3 text-center transition-all duration-200"
                    style={{
                      background: selected ? COLORS.indigo : COLORS.bgSecondary,
                      color: selected ? COLORS.white : COLORS.ink,
                      border: `2px solid ${selected ? COLORS.indigo : COLORS.border}`,
                      boxShadow: selected ? `0 4px 0 ${edgeOf(COLORS.indigo)}` : "none",
                    }}
                  >
                    {count === 30 && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-extrabold whitespace-nowrap" style={{ background: COLORS.gold, color: COLORS.navDark }}>
                        POPULAR
                      </span>
                    )}
                    <div className="text-2xl font-semibold leading-none" style={{ fontFamily: FONTS.display }}>{count}</div>
                    <div className="text-[11px] font-bold mt-1" style={{ opacity: 0.75 }}>classes</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price ticket */}
          <div className="relative rounded-[1.75rem] p-5 mt-auto" style={{ background: COLORS.navDark }}>
            {/* ticket notches */}
            <span aria-hidden="true" className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />
            <span aria-hidden="true" className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />

            <div className="text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ color: COLORS.silver }}>Price Details</div>
            <div className="mt-3 grid grid-cols-3 gap-3 pb-4 border-b-2 border-dashed" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
              {[
                ["Selected level", level.name],
                ["Classes", classCount],
                ["Per class", formatPrice(pricePerClass)],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: COLORS.silver }}>{k}</div>
                  <div className="text-base sm:text-lg font-semibold text-white mt-0.5" style={{ fontFamily: FONTS.display }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.16em]" style={{ color: COLORS.silver }}>Total price</div>
                <div className="text-4xl font-semibold leading-none mt-1" style={{ fontFamily: FONTS.display, color: COLORS.emerald }}>
                  {formatPrice(totalPrice)}
                </div>
              </div>
              <button onClick={handleEnquiry} className="px-btn px-btn--grad px-btn--sm">
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