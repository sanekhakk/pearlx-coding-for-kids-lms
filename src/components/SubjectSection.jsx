import React, { useState } from "react";
import { motion } from "framer-motion";

import {
  Check,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Brain,
  Layers,
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
import { COLORS, GRADIENTS, SHADOWS } from "../utils/theme";

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
  const [activeCourse, setActiveCourse] =
    useState("python");

  const [activeLevel, setActiveLevel] =
    useState("intermediate");

  const [classCount, setClassCount] =
    useState(30);

  const course =
    COURSES.find(
      (item) => item.id === activeCourse
    ) || COURSES[0];

  const level =
    LEVELS.find(
      (item) => item.id === activeLevel
    ) || LEVELS[1];

  const CourseIcon = course.icon;

  const pricePerClass =
    course.prices[activeLevel];

  const totalPrice =
    pricePerClass * classCount;

  /* =======================================================
     CHANGE COURSE
  ======================================================= */

  const changeCourse = (direction) => {
    const currentIndex =
      COURSES.findIndex(
        (item) => item.id === activeCourse
      );

    let nextIndex;

    if (direction === "next") {
      nextIndex = currentIndex + 1;

      if (nextIndex >= COURSES.length) {
        nextIndex = 0;
      }
    } else {
      nextIndex = currentIndex - 1;

      if (nextIndex < 0) {
        nextIndex = COURSES.length - 1;
      }
    }

    setActiveCourse(
      COURSES[nextIndex].id
    );
  };

  /* =======================================================
     WHATSAPP
  ======================================================= */

  const handleEnquiry = () => {
    const message = `Hi! I'm interested in the ${course.name} course at Pearlx.

Level: ${level.name}
Classes: ${classCount}
Price: ${formatPrice(totalPrice)}

I'd like to know more about the course and available timings.`;

    window.open(
      getWhatsAppLink(message),
      "_blank"
    );
  };

  return (
    <section
      id="curriculum"
      className="
        relative
        overflow-hidden
        py-16
        sm:py-20
        lg:py-24
      "
      style={{
        background: COLORS.bgSecondary,
      }}
    >

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            -top-40
            -left-32
            w-80
            h-80
            rounded-full
            blur-3xl
            opacity-50
          "
          style={{
            background: COLORS.cyanLight,
          }}
        />

        <div
          className="
            absolute
            -bottom-40
            -right-32
            w-96
            h-96
            rounded-full
            blur-3xl
            opacity-50
          "
          style={{
            background: COLORS.emeraldLight,
          }}
        />

      </div>

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          px-4
          sm:px-6
          lg:px-10
          xl:px-16
        "
      >

        {/* ===================================================
            HEADER
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="
            max-w-2xl
            mx-auto
            text-center
            mb-8
            sm:mb-10
          "
        >

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-full
              text-[9px]
              font-black
              uppercase
              tracking-widest
              mb-4
            "
            style={{
              background:
                COLORS.emeraldLight,
              color:
                COLORS.emerald,
            }}
          >
            <span>✦</span>
            Pearlx Learning
          </div>

          <h2
            className="
              font-black
              tracking-tight
              leading-[0.98]
              text-4xl
              sm:text-5xl
              lg:text-6xl
            "
            style={{
              color: COLORS.ink,
              letterSpacing:
                "-0.055em",
            }}
          >
            Choose what
            <br />

            <span
              style={{
                background:
                  GRADIENTS.textGlow,
                WebkitBackgroundClip:
                  "text",
                WebkitTextFillColor:
                  "transparent",
                backgroundClip:
                  "text",
              }}
            >
              you want to learn.
            </span>
          </h2>

          <p
            className="
              mt-4
              text-sm
              sm:text-base
              leading-relaxed
            "
            style={{
              color:
                COLORS.textSecondary,
            }}
          >
            Explore courses, choose your
            level and find the package
            that works for you.
          </p>

        </motion.div>

        {/* ===================================================
            MOBILE COURSE NAVIGATION
        ==================================================== */}

        <div
          className="
            lg:hidden
            mb-5
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-2.5
            "
          >

            <span
              className="
                text-xs
                font-black
              "
              style={{
                color:
                  COLORS.ink,
              }}
            >
              Courses
            </span>

            <span
              className="
                text-[9px]
                font-bold
              "
              style={{
                color:
                  COLORS.textMuted,
              }}
            >
              Swipe to explore →
            </span>

          </div>

          <div
            className="
              flex
              gap-2
              overflow-x-auto
              pb-2
              snap-x
              snap-mandatory
              scrollbar-hide
            "
            style={{
              scrollbarWidth:
                "none",
            }}
          >

            {COURSES.map((item) => {

              const ItemIcon =
                item.icon;

              const selected =
                item.id === activeCourse;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    setActiveCourse(
                      item.id
                    )
                  }
                  className="
                    snap-start
                    shrink-0
                    flex
                    items-center
                    gap-2
                    px-3.5
                    py-3
                    rounded-xl
                    border-2
                    transition-all
                    active:scale-95
                  "
                  style={{
                    background:
                      selected
                        ? COLORS.white
                        : "rgba(255,255,255,0.65)",

                    borderColor:
                      selected
                        ? item.iconColor
                        : COLORS.border,

                    boxShadow:
                      selected
                        ? SHADOWS.sm
                        : "none",
                  }}
                >

                  <ItemIcon
                    className="
                      w-5.5
                      h-5.5
                    "
                    style={{
                      color:
                        item.iconColor,
                    }}
                  />

                  <span
                    className="
                      text-[11px]
                      font-black
                      whitespace-nowrap
                    "
                    style={{
                      color:
                        selected
                          ? COLORS.ink
                          : COLORS.textMuted,
                    }}
                  >
                    {item.name}
                  </span>

                </button>
              );
            })}

          </div>

        </div>

        {/* ===================================================
            DESKTOP EXPLORER
        ==================================================== */}

        <div
          className="
            hidden
            lg:grid
            lg:grid-cols-[320px_minmax(0,1fr)]
            xl:grid-cols-[350px_minmax(0,1fr)]
            gap-5
            xl:gap-6
            items-stretch
          "
        >

          {/* =================================================
              COURSE LIST
          ================================================== */}

          <div
            className="
              rounded-[2rem]
              bg-white
              border
              p-3.5
              h-full
              flex
              flex-col
            "
            style={{
              borderColor:
                COLORS.border,
              boxShadow:
                SHADOWS.card,
            }}
          >

            <div
              className="
                px-3
                pt-2
                pb-4
              "
            >

              <div
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-widest
                "
                style={{
                  color:
                    COLORS.textMuted,
                }}
              >
                Explore
              </div>

              <div
                className="
                  text-lg
                  font-black
                  mt-1
                "
                style={{
                  color:
                    COLORS.ink,
                }}
              >
                Courses
              </div>

            </div>

            {/* TWO COLUMN COURSE LIST */}

            <div
              className="
                flex-1
                min-h-0
                grid
                grid-cols-2
                grid-rows-6
                gap-2
              "
            >

              {COURSES.map((item) => {

                const ItemIcon =
                  item.icon;

                const selected =
                  item.id === activeCourse;

                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      setActiveCourse(
                        item.id
                      )
                    }
                    className="
                      w-full
                      h-full
                      flex
                      items-center
                      gap-2.5
                      px-3
                      py-3
                      rounded-xl
                      text-left
                      transition-all
                      duration-200
                    "
                    style={{
                      background:
                        selected
                          ? `${item.iconColor}10`
                          : "transparent",

                      color:
                        selected
                          ? COLORS.ink
                          : COLORS.textSecondary,
                    }}
                  >

                    {/* ICON */}

                    <div
                      className="
                        w-9
                        h-9
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                      style={{
                        background:
                          selected
                            ? `${item.iconColor}16`
                            : COLORS.bgTertiary,
                      }}
                    >

                      <ItemIcon
                        className="
                          w-[18px]
                          h-[18px]
                        "
                        style={{
                          color:
                            item.iconColor,
                        }}
                      />

                    </div>

                    {/* NAME */}

                    <span
                      className="
                        text-[11px]
                        xl:text-xs
                        font-bold
                        leading-tight
                        truncate
                      "
                      style={{
                        color:
                          selected
                            ? COLORS.ink
                            : COLORS.textSecondary,
                      }}
                    >
                      {item.name}
                    </span>

                    {/* ACTIVE INDICATOR */}

                    {selected && (
                      <div
                        className="
                          ml-auto
                          w-1.5
                          h-1.5
                          rounded-full
                          shrink-0
                        "
                        style={{
                          background:
                            item.iconColor,
                        }}
                      />
                    )}

                  </button>
                );
              })}

            </div>

          </div>

          {/* =================================================
              COURSE DETAILS
          ================================================== */}

          <CourseDetails
            course={course}
            level={level}
            activeLevel={activeLevel}
            setActiveLevel={
              setActiveLevel
            }
            classCount={classCount}
            setClassCount={
              setClassCount
            }
            pricePerClass={
              pricePerClass
            }
            totalPrice={
              totalPrice
            }
            CourseIcon={
              CourseIcon
            }
            handleEnquiry={
              handleEnquiry
            }
            changeCourse={
              changeCourse
            }
          />

        </div>

        {/* ===================================================
            MOBILE COURSE DETAILS
        ==================================================== */}

        <div className="lg:hidden">

          <CourseDetails
            course={course}
            level={level}
            activeLevel={activeLevel}
            setActiveLevel={
              setActiveLevel
            }
            classCount={classCount}
            setClassCount={
              setClassCount
            }
            pricePerClass={
              pricePerClass
            }
            totalPrice={
              totalPrice
            }
            CourseIcon={
              CourseIcon
            }
            handleEnquiry={
              handleEnquiry
            }
            changeCourse={
              changeCourse
            }
          />

        </div>

      </div>
    </section>
  );
};

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative bg-white rounded-[1.75rem] sm:rounded-[2rem] border-2 overflow-hidden"
      style={{
        borderColor: `${course.iconColor}30`,
        boxShadow: SHADOWS.card,
      }}
    >
      <div className="p-4 sm:p-6 lg:p-7 xl:p-8">
        {/* BANNER + DESCRIPTION */}
        <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] gap-5 lg:gap-7 items-center mb-6">
          {/* BANNER */}
          <div className="relative w-full h-[170px] sm:h-[200px] lg:h-[220px] xl:h-[240px] rounded-2xl sm:rounded-[1.5rem] overflow-hidden flex items-center justify-center bg-slate-50">
            <img
              src={course.banner}
              alt={`${course.name} course`}
              className="w-full h-full object-contain block"
            />
          </div>

          {/* DESCRIPTION + NAVIGATION */}
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div
                  className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest mb-1.5"
                  style={{ color: course.iconColor }}
                >
                  Course Overview
                </div>
                <p
                  className="text-sm sm:text-base leading-relaxed font-medium"
                  style={{ color: COLORS.textSecondary }}
                >
                  {course.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => changeCourse("prev")}
                  aria-label="Previous course"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  onClick={() => changeCourse("next")}
                  aria-label="Next course"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* OPTIONS + PRICE */}
        <div className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1.05fr] gap-4 sm:gap-5 lg:gap-6 items-stretch">
          {/* LEVEL COLUMN */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs sm:text-sm font-black" style={{ color: COLORS.ink }}>
                Level
              </h4>
              <span className="text-[9px]" style={{ color: COLORS.textMuted }}>
                Choose level
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {LEVELS.map((item) => {
                const selected = activeLevel === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveLevel(item.id)}
                    className="relative w-full min-h-[64px] sm:min-h-[70px] px-3.5 py-3 rounded-xl border-2 text-left transition-all duration-200"
                    style={{
                      background: selected ? COLORS.emeraldLight : COLORS.bgSecondary,
                      borderColor: selected ? COLORS.emerald : COLORS.border,
                    }}
                  >
                    {selected && (
                      <span
                        className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: COLORS.emerald, color: COLORS.white }}
                      >
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}

                    <div
                      className="text-[10px] sm:text-xs font-black pr-5"
                      style={{ color: selected ? COLORS.emerald : COLORS.ink }}
                    >
                      {item.name}
                    </div>

                    <div
                      className="text-[9px] mt-1 leading-tight"
                      style={{ color: COLORS.textMuted }}
                    >
                      {item.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CLASSES COLUMN */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs sm:text-sm font-black" style={{ color: COLORS.ink }}>
                Classes
              </h4>
              <span className="text-[9px]" style={{ color: COLORS.textMuted }}>
                {formatPrice(pricePerClass)} / class
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {CLASS_PACKAGES.map((count) => {
                const selected = classCount === count;

                return (
                  <button
                    key={count}
                    onClick={() => setClassCount(count)}
                    className="relative w-full min-h-[46px] sm:min-h-[50px] px-4 rounded-xl border-2 text-left flex items-center justify-between transition-all duration-200 active:scale-[0.98]"
                    style={{
                      background: selected ? `${course.iconColor}10` : COLORS.bgSecondary,
                      borderColor: selected ? course.iconColor : COLORS.border,
                      color: selected ? course.iconColor : COLORS.ink,
                    }}
                  >
                    <span className="text-xs sm:text-sm font-black">
                      {count} classes
                    </span>

                    {count === 30 && (
                      <span
                        className="px-2 py-0.5 rounded-full text-[7px] font-black"
                        style={{ background: COLORS.gold, color: COLORS.white }}
                      >
                        POPULAR
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRICE + ENQUIRY COLUMN */}
          <div
            className="col-span-2 lg:col-span-1 rounded-2xl p-4 sm:p-5 flex flex-col justify-between"
            style={{
              background: `linear-gradient(145deg, ${COLORS.bgSecondary}, #FFFFFF)`,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div>
              <div
                className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: COLORS.textMuted }}
              >
                Price Details
              </div>

              <div className="mt-3">
                <div
                  className="text-[8px] font-bold uppercase tracking-wider"
                  style={{ color: COLORS.textMuted }}
                >
                  Selected level
                </div>
                <div
                  className="text-sm sm:text-base font-black mt-0.5"
                  style={{ color: COLORS.ink }}
                >
                  {level.name}
                </div>
              </div>

              {/* Compact class + per-class summary */}
              <div
                className="mt-3 flex items-center gap-5 py-2.5 border-y"
                style={{ borderColor: COLORS.border }}
              >
                <div>
                  <div
                    className="text-[8px] font-bold uppercase tracking-wider"
                    style={{ color: COLORS.textMuted }}
                  >
                    Classes
                  </div>
                  <div
                    className="text-base sm:text-lg font-black mt-0.5"
                    style={{ color: COLORS.ink }}
                  >
                    {classCount}
                  </div>
                </div>

                <div
                  className="h-7 w-px"
                  style={{ background: COLORS.border }}
                />

                <div>
                  <div
                    className="text-[8px] font-bold uppercase tracking-wider"
                    style={{ color: COLORS.textMuted }}
                  >
                    Per class
                  </div>
                  <div
                    className="text-base sm:text-lg font-black mt-0.5"
                    style={{ color: COLORS.ink }}
                  >
                    {formatPrice(pricePerClass)}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div
                  className="text-[8px] font-black uppercase tracking-widest"
                  style={{ color: COLORS.textMuted }}
                >
                  Total price
                </div>
                <div
                  className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5"
                  style={{ color: COLORS.emerald }}
                >
                  {formatPrice(totalPrice)}
                </div>
              </div>
            </div>

            <button
              onClick={handleEnquiry}
              className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black text-white active:scale-[0.98] transition-transform"
              style={{ background: GRADIENTS.primary, boxShadow: SHADOWS.glowEmer }}
            >
              Enquire about this course
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectSection;
