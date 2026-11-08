import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ChevronDown, BookOpen, Users, Code2, Database,
  Globe, GraduationCap, Award, Rocket, Terminal, Target, FolderKanban, Play, MessageCircle, Sparkles, Clock,
} from "lucide-react";
import { COLORS, FONTS } from "../utils/theme";
import { getWhatsAppLink } from "../utils/whatsapp";
import kidImage from "../assets/kids/courseskid.webp";
import { HeroStage, Sticker, SectionHeader, Scribble, CtaPanel, ColorBtn, IconBubble, PearlScatter, ChipRow, display } from "../components/ui/Brand";
import Subjects from "../components/SubjectSection"

const LOGOS = {
  python: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
  java: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
  js: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
  html: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
  css: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
  react: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  mysql: "https://www.mysql.com/common/logos/logo-mysql-170x115.png",
};

const COURSES = [
  {
    id: "python",
    name: "Python",
    kicker: "Build with Python",
    tagline: "From scripts to full projects",
    color: COLORS.emerald,
    light: COLORS.emeraldLight,
    logo: LOGOS.python,
    Icon: Code2,
    boards: ["CBSE", "ICSE", "ISC", "IGCSE"],
    tracks: [
      { name: "Python Launchpad", type: "Bootcamp", duration: "2 Months", badge: "SHORT" },
      { name: "Python Pro Intensive", type: "Intense Training", duration: "6 Months", badge: "DEEP DIVE" },
    ],
    skills: ["Variables & Loops", "Functions & OOP", "File I/O", "Libraries", "Mini Projects"],
  },
  {
    id: "java",
    name: "Java",
    kicker: "Think in objects",
    tagline: "OOP mastery for boards & beyond",
    color: COLORS.goldDeep,
    light: COLORS.goldLight,
    logo: LOGOS.java,
    Icon: Terminal,
    boards: ["ICSE", "ISC", "CBSE"],
    tracks: [
      { name: "Java Kickstart Bootcamp", type: "Bootcamp", duration: "2 Months", badge: "SHORT" },
      { name: "Java Mastery Intensive", type: "Intense Training", duration: "6 Months", badge: "DEEP DIVE" },
    ],
    skills: ["Java Syntax", "OOP Concepts", "Arrays & Strings", "Data Structures", "Board Prep"],
  },
  {
    id: "webdev",
    name: "Web Development",
    kicker: "Make it live",
    tagline: "Build real websites from scratch",
    color: COLORS.cyan,
    light: COLORS.cyanLight,
    logo: LOGOS.js,
    Icon: Globe,
    boards: ["CBSE", "ICSE", "IGCSE", "All Boards"],
    tracks: [
      { name: "Web Dev Launchpad", type: "Bootcamp", duration: "2 Months", badge: "SHORT" },
      { name: "Full Stack Intensive", type: "Intense Training", duration: "6 Months", badge: "DEEP DIVE" },
    ],
    skills: ["HTML5 & CSS3", "Flexbox & Grid", "JavaScript", "React Basics", "Deploy Sites"],
    stack: [LOGOS.html, LOGOS.css, LOGOS.js, LOGOS.react],
  },
  {
    id: "dbms",
    name: "DBMS & SQL",
    kicker: "Make data make sense",
    tagline: "Databases done right",
    color: COLORS.indigo,
    light: COLORS.indigoLight,
    logo: LOGOS.mysql,
    Icon: Database,
    boards: ["CBSE", "ISC"],
    tracks: [
      { name: "SQL Foundations", type: "Bootcamp", duration: "2 Months", badge: "SHORT" },
      { name: "DBMS Deep Dive", type: "Intense Training", duration: "4 Months", badge: "DEEP DIVE" },
    ],
    skills: ["SQL Queries", "Joins & Subqueries", "ER Diagrams", "Normalization", "Practicals"],
    stack: [LOGOS.mysql],
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    kicker: "Think sharper",
    tagline: "Crack boards & competitive coding",
    color: COLORS.cyan,
    light: COLORS.cyanLight,
    logo: null,
    Icon: FolderKanban,
    boards: ["CBSE", "ISC", "ICSE"],
    tracks: [
      { name: "DSA Essentials", type: "Bootcamp", duration: "2 Months", badge: "SHORT" },
      { name: "DSA + Algo Mastery", type: "Intense Training", duration: "5 Months", badge: "DEEP DIVE" },
    ],
    skills: ["Arrays & Strings", "Stacks & Queues", "Trees & Graphs", "Sorting & Searching", "Complexity"],
  },
];

const WHY = [
  [GraduationCap, "Expert mentors", "Learn live with teachers who know the subject."],
  [Target, "Project first", "Less theory. More making, solving and trying."],
  [Award, "Certificates", "Get recognised for completing your course."],
  [Rocket, "Future ready", "Build skills you can keep using beyond class."],
];

const BOARDS = [
  ["CBSE", "CS & IT", COLORS.gold, BookOpen],
  ["ICSE", "Computer Applications", COLORS.cyan, BookOpen],
  ["ISC", "Computer Science", COLORS.indigo, BookOpen],
  ["IGCSE", "CS & ICT", COLORS.emerald, Globe],
];

const ink = (c) => (c === COLORS.goldDeep || c === COLORS.gold ? COLORS.goldDeep : c);

const Logo = ({ course, size = 56 }) => {
  const Icon = course.Icon;
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="flex items-center justify-center shrink-0 bg-white"
      style={{ width: size, height: size, borderRadius: size * 0.32, border: "1px solid #E2E8F0" }}
    >
      {course.logo && !failed ? (
        <img
          src={course.logo}
          alt=""
          className="object-contain"
          style={{ width: size * 0.6, height: size * 0.6 }}
          onError={() => setFailed(true)}
        />
      ) : (
        <Icon style={{ width: size * 0.48, height: size * 0.48, color: course.color }} strokeWidth={2.3} />
      )}
    </div>
  );
};

const CourseCard = ({ course, index, openDemoModal }) => {
  const [expanded, setExpanded] = useState(false);
  const tone = ink(course.color);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.04 }}
      className="relative flex flex-col overflow-hidden rounded-2xl bg-white"
      style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 10px 28px -16px rgba(15,23,42,0.22)" }}
    >
      <div className="h-1 w-full" style={{ background: course.color }} />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* header */}
        <div className="flex items-center gap-3">
          <Logo course={course} size={44} />
          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: tone }}>{course.kicker}</div>
            <h3 className="text-lg sm:text-xl font-extrabold leading-tight tracking-tight" style={{ color: COLORS.ink }}>{course.name}</h3>
            <p className="text-xs sm:text-sm font-medium" style={{ color: COLORS.textMuted }}>{course.tagline}</p>
          </div>
        </div>

        {/* boards + stack */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {course.boards.map((board) => (
            <span key={board} className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold" style={{ background: course.light, color: tone }}>
              {board}
            </span>
          ))}
          {course.stack && (
            <span className="ml-auto flex items-center gap-1">
              {course.stack.map((logo, i) => (
                <span key={i} className="w-6 h-6 rounded-md bg-white flex items-center justify-center" style={{ border: "1px solid #E2E8F0" }}>
                  <img src={logo} alt="" className="w-4 h-4 object-contain" onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }} />
                </span>
              ))}
            </span>
          )}
        </div>

        {/* formats */}
        <div className="mt-3.5">
          {course.tracks.length > 1 && (
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] mb-1.5" style={{ color: COLORS.textMuted }}>
              Choose your format
            </div>
          )}
          <div className={`grid gap-2 ${course.tracks.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {course.tracks.map((track) => {
              const deep = track.badge === "DEEP DIVE";
              return (
                <div
                  key={track.name}
                  className="rounded-xl p-2.5 sm:p-3"
                  style={{ background: deep ? "#F8FAFC" : course.light, border: `1px solid ${deep ? "#E2E8F0" : `${course.color}30`}` }}
                >
                  <span
                    className="inline-block px-1.5 py-px rounded text-[9px] font-bold tracking-wider"
                    style={{ background: deep ? COLORS.navDark : course.color, color: "#fff" }}
                  >
                    {track.badge}
                  </span>
                  <div className="text-[13px] sm:text-sm font-bold leading-tight mt-1.5" style={{ color: COLORS.ink }}>{track.name}</div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium mt-1" style={{ color: COLORS.textMuted }}>
                    <Clock className="w-3 h-3 shrink-0" />
                    {track.type} · {track.duration}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* skills */}
        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm font-bold w-fit"
          style={{ color: tone }}
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} strokeWidth={2.6} />
          {expanded ? "Hide skills" : "See what you'll build"}
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex flex-wrap gap-1.5 pt-2">
                {course.skills.map((skill) => (
                  <span key={skill} className="px-2 py-1 rounded-md text-[11px] sm:text-xs font-semibold" style={{ background: "#F8FAFC", color: COLORS.textSecondary, border: "1px solid #E2E8F0" }}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-4">
          <ColorBtn color={course.color} className="w-full px-btn--sm sm:!h-11" onClick={() => openDemoModal?.(`course-${course.id}`)}>
            Start with a free class
            <ArrowRight className="w-4 h-4" />
          </ColorBtn>
        </div>
      </div>
    </motion.article>
  );
};

/* Floating "course shelf" card on the hero art */
// const CourseShelf = () => (
//   <div
//     className="absolute z-20 left-[-3%] bottom-[5%] w-[58%] rounded-[1.6rem] bg-white p-3.5"
//     style={{ border: "2px solid rgba(15,23,42,0.08)", boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 10px 24px -14px rgba(15,23,42,0.28)" }}
//   >
//     <div className="flex items-center justify-between pb-2.5">
//       <div className="flex items-center gap-2">
//         <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: COLORS.emeraldLight, color: COLORS.emerald }}>
//           <BookOpen className="w-4 h-4" />
//         </span>
//         <div>
//           <div className="text-[9px] font-extrabold tracking-widest" style={{ color: COLORS.textMuted }}>PEARLX</div>
//           <div className="text-sm font-bold leading-tight" style={{ fontFamily: FONTS.display }}>Course Shelf</div>
//         </div>
//       </div>
//       <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white" style={{ background: COLORS.indigo }}>6 paths</span>
//     </div>
//     <div className="grid grid-cols-2 gap-2">
//       {COURSES.slice(0, 4).map((course) => (
//         <div key={course.id} className="rounded-xl p-2" style={{ background: course.light }}>
//           <Logo course={course} size={30} />
//           <div className="text-[11px] font-extrabold mt-1.5 leading-tight truncate">{course.name}</div>
//           <div className="text-[9px] font-bold" style={{ color: COLORS.textMuted }}>{course.tracks[0].duration}</div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

const Courses = ({ openDemoModal }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Bootcamps", "Intensive"];

  const visibleCourses = COURSES.map((course) => {
    if (activeFilter === "All") return course;
    const matchingTracks = course.tracks.filter((track) =>
      activeFilter === "Bootcamps" ? track.type.includes("Bootcamp") : track.type.includes("Intense")
    );
    return matchingTracks.length ? { ...course, tracks: matchingTracks } : null;
  }).filter(Boolean);

  return (
    <main className="min-h-screen overflow-hidden bg-white" style={{ color: COLORS.ink }}>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #EEF2FF 0%, #FFFFFF 100%)" }}>
        <div aria-hidden="true" className="absolute inset-0 px-dots opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-[124px] sm:pt-[132px] lg:pt-[140px] pb-8 sm:pb-14">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[2rem] sm:text-5xl lg:text-[3.6rem] font-extrabold leading-[1.08] tracking-tight"
                style={{ ...display, color: COLORS.ink }}
              >
                Learn it.
                <br />
                <Scribble color={COLORS.gold} textColor={COLORS.indigo}>Build it.</Scribble>
                <br />
                Show it.
              </motion.h1>
              <p className="max-w-lg mx-auto lg:mx-0 mt-3 sm:mt-5 text-[15px] sm:text-lg font-medium leading-relaxed" style={{ color: COLORS.textSecondary }}>
                Focused tech courses, live mentors and projects you can actually make.
              </p>

              <div className="flex flex-row justify-center lg:justify-start gap-2.5 mt-5 sm:mt-7">
                <button onClick={() => openDemoModal?.("courses-hero")} className="px-btn px-btn--grad px-btn--lg flex-1 sm:flex-none !px-3 sm:!px-6">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Book a Free Class
                </button>
                <a href="#course-list" className="px-btn px-btn--white px-btn--lg flex-1 sm:flex-none !px-3 sm:!px-6">
                  See courses
                </a>
              </div>

              <ChipRow
                className="mt-4 sm:mt-6"
                items={[
                  [Users, "Live mentors", COLORS.emerald],
                  [FolderKanban, "Project based", COLORS.cyan],
                  [Award, "Certificate", COLORS.gold],
                ]}
              />
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
              <HeroStage image={kidImage} alt="Pearlx student with a laptop" color={COLORS.indigo} second={COLORS.cyan}>
                <Sticker className="top-[8%] right-0">
                  <div className="text-[9px] sm:text-[11px] font-bold tracking-widest" style={{ color: COLORS.indigo }}>PICK A PATH</div>
                </Sticker>
                <Sticker className="top-[26%] right-[-2%]" style={{ background: COLORS.emerald, borderColor: COLORS.emerald }}>
                  <div className="text-[9px] sm:text-[11px] font-bold tracking-widest text-white">MAKE SOMETHING</div>
                </Sticker>
                {/* <CourseShelf /> */}
              </HeroStage>
            </motion.div>
          </div>
        </div>
      </section>

      {/* COURSE LIST */}
      <section id="course-list" className="relative scroll-mt-28 py-10 sm:py-16">
        <PearlScatter variant="a" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="THE COURSE SHELF"
            eyebrowIcon={Rocket}
            color={COLORS.indigo}
            title={<>Find your <Scribble color={COLORS.emerald} textColor={COLORS.cyan}>thing.</Scribble></>}
            className="mb-4 sm:mb-6"
          />

          {/* FILTERS */}
          <div className="mx-auto mb-5 sm:mb-8 grid grid-cols-3 w-full max-w-sm gap-1 rounded-xl p-1" style={{ background: "#F1F5F9", border: "1px solid #E2E8F0" }}>
            {filters.map((filter) => {
              const on = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={on}
                  className="relative py-2 rounded-lg text-[13px] sm:text-sm font-bold"
                  style={{ color: on ? COLORS.ink : COLORS.textMuted }}
                >
                  {on && (
                    <motion.span layoutId="course-filter" className="absolute inset-0 rounded-lg bg-white" style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.12)" }} transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
                  )}
                  <span className="relative">{filter}</span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} openDemoModal={openDemoModal} />
            ))}
          </div>
        </div>
      </section>

      <Subjects />

      {/* WHY PEARLX */}
      <section className="relative py-10 sm:py-16" style={{ background: COLORS.bgSecondary }}>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="THE PEARLX WAY" eyebrowIcon={Sparkles} color={COLORS.emerald} title="More making. Less memorising." className="mb-5 sm:mb-10" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {WHY.map(([I, title, desc], i) => {
              const color = i % 2 === 0 ? COLORS.emerald : COLORS.cyan;
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="px-card px-card--lift p-3.5 sm:p-5"
                >
                  <IconBubble icon={I} color={color} size={36} iconSize={18} />
                  <div className="text-sm sm:text-lg font-bold mt-2.5 sm:mt-3.5 leading-snug">{title}</div>
                  <div className="text-xs sm:text-sm font-medium mt-1 leading-relaxed" style={{ color: COLORS.textMuted }}>{desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOARDS */}
      <section className="relative py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            title="Your board. Your path."
            sub="Selected courses are available across the major boards."
            className="mb-5 sm:mb-10"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {BOARDS.map(([name, sub, color, I]) => (
              <div key={name} className="px-card flex items-center gap-3 p-3 sm:p-5">
                <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18`, color: ink(color) }}>
                  <I className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-base sm:text-xl font-extrabold leading-tight">{name}</div>
                  <div className="text-[11px] sm:text-sm font-medium leading-snug" style={{ color: COLORS.textMuted }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <CtaPanel title="Ready to build something?" sub="Start with a free class. Pick the right path together." image={kidImage} color={COLORS.indigo}>
        <button onClick={() => openDemoModal?.("courses-cta")} className="px-btn px-btn--grad px-btn--lg">
          Book a Free Class
          <ArrowRight className="w-4 h-4" />
        </button>
        <a
          href={getWhatsAppLink("Hi! I'd like to know more about Pearlx courses.")}
          target="_blank"
          rel="noopener noreferrer"
          className="px-btn px-btn--lg"
          style={{ "--btn-bg": "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
        >
          <MessageCircle className="w-4 h-4" />
          Ask us
        </a>
      </CtaPanel>
    </main>
  );
};

export default Courses;