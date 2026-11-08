import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ChevronDown, BookOpen, Users, Code2, Database,
  Globe, GraduationCap, Award, Rocket, Terminal, Target, FolderKanban, Play, MessageCircle, Sparkles, Clock,
} from "lucide-react";
import { COLORS, FONTS, edgeOf } from "../utils/theme";
import { getWhatsAppLink } from "../utils/whatsapp";
import kidImage from "../assets/kids/courseskid.webp";
import { HeroStage, Sticker, SectionHeader, Scribble, CtaPanel, ColorBtn, Wave, IconBubble, PearlScatter } from "../components/ui/Brand";
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
      style={{ width: size, height: size, borderRadius: size * 0.32, border: `2px solid ${course.color}35`, boxShadow: `0 3px 0 ${course.color}30` }}
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

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.06 }}
      className="relative flex flex-col overflow-hidden rounded-[2.25rem] bg-white"
      style={{ border: `3px solid ${course.color}`, boxShadow: `0 8px 0 ${edgeOf(course.color)}` }}
    >
      {/* coloured header */}
      <div className="relative overflow-hidden px-5 sm:px-6 pt-5 pb-6" style={{ background: course.color }}>
        <span aria-hidden="true" className="absolute -right-10 -top-12 w-36 h-36 rounded-full bg-white/15" />
        <span aria-hidden="true" className="absolute right-16 -bottom-10 w-20 h-20 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-4">
          <Logo course={course} />
          <div className="min-w-0 text-white">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] opacity-90">{course.kicker}</div>
            <h3 className="text-2xl font-semibold leading-tight" style={{ fontFamily: FONTS.display }}>{course.name}</h3>
            <p className="text-sm font-bold opacity-90">{course.tagline}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* boards */}
        <div className="flex flex-wrap gap-1.5">
          {course.boards.map((board) => (
            <span key={board} className="px-2.5 py-1 rounded-full text-[11px] font-extrabold" style={{ background: course.light, color: ink(course.color) }}>
              {board}
            </span>
          ))}
        </div>

        {course.stack && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Stack</span>
            {course.stack.map((logo, i) => (
              <span key={i} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center" style={{ border: `2px solid ${COLORS.border}` }}>
                <img src={logo} alt="" className="w-5 h-5 object-contain" onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }} />
              </span>
            ))}
          </div>
        )}

        {/* formats */}
        <div className="mt-5">
          {course.tracks.length > 1 && (
            <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] mb-2" style={{ color: COLORS.textMuted }}>
              Choose your format
            </div>
          )}
          <div className={`grid gap-2.5 ${course.tracks.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {course.tracks.map((track) => {
              const deep = track.badge === "DEEP DIVE";
              return (
                <div
                  key={track.name}
                  className="relative rounded-2xl p-3.5"
                  style={{ background: deep ? COLORS.navDark : course.light, color: deep ? "#fff" : COLORS.ink }}
                >
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider"
                    style={{ background: deep ? COLORS.gold : course.color, color: deep ? COLORS.navDark : "#fff" }}
                  >
                    {track.badge}
                  </span>
                  <div className="text-[15px] font-semibold leading-tight mt-2" style={{ fontFamily: FONTS.display }}>{track.name}</div>
                  <div className="flex items-center gap-1 text-[11px] font-bold mt-1.5" style={{ opacity: 0.75 }}>
                    <Clock className="w-3 h-3" />
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
          className="mt-4 flex items-center gap-2 text-sm font-extrabold w-fit"
          style={{ color: ink(course.color) }}
        >
          <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: course.light }}>
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} strokeWidth={2.8} />
          </span>
          {expanded ? "Hide skills" : "See what you'll build"}
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex flex-wrap gap-2 pt-3">
                {course.skills.map((skill, i) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-white"
                    style={{ border: `2px dashed ${course.color}80`, transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-6">
          <ColorBtn color={course.color} className="w-full" onClick={() => openDemoModal?.(`course-${course.id}`)}>
            Start with a free class
            <ArrowRight className="w-5 h-5" />
          </ColorBtn>
        </div>
      </div>
    </motion.article>
  );
};

/* Floating "course shelf" card on the hero art */
// const CourseShelf = () => (
//   <div
//     className="absolute z-20 left-[-3%] bottom-[5%] w-[58%] rounded-[1.6rem] bg-white p-3.5 px-float px-float--slow"
//     style={{ "--r": "-3deg", border: "2px solid rgba(15,23,42,0.08)", boxShadow: "0 7px 0 rgba(15,23,42,0.08)" }}
//   >
//     <div className="flex items-center justify-between pb-2.5">
//       <div className="flex items-center gap-2">
//         <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: COLORS.emeraldLight, color: COLORS.emerald }}>
//           <BookOpen className="w-4 h-4" />
//         </span>
//         <div>
//           <div className="text-[9px] font-extrabold tracking-widest" style={{ color: COLORS.textMuted }}>PEARLX</div>
//           <div className="text-sm font-semibold leading-tight" style={{ fontFamily: FONTS.display }}>Course Shelf</div>
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
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #EEF2FF 0%, #F0F9FF 100%)" }}>
        <div aria-hidden="true" className="absolute inset-0 px-dots opacity-70" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-40 sm:pt-44 lg:pt-40 pb-4">
          <div className="grid lg:grid-cols-[1fr_0.95fr] gap-10 lg:gap-12 items-center lg:min-h-[600px]">
            <div className="text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[3.2rem] sm:text-7xl lg:text-[5.4rem] font-semibold leading-[0.98]"
                style={{ fontFamily: FONTS.display, color: COLORS.ink }}
              >
                Learn it.
                <br />
                <Scribble color={COLORS.gold} textColor={COLORS.indigo}>Build it.</Scribble>
                <br />
                Show it.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12 }}
                className="max-w-lg mx-auto lg:mx-0 mt-7 text-lg sm:text-xl font-semibold leading-relaxed"
                style={{ color: COLORS.textSecondary }}
              >
                Focused tech courses, live mentors and projects you can actually make.
              </motion.p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3.5 mt-8">
                <button onClick={() => openDemoModal?.("courses-hero")} className="px-btn px-btn--grad px-btn--lg">
                  <Play className="w-4 h-4 fill-current" />
                  Book a Free Class
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a href="#course-list" className="px-btn px-btn--white px-btn--lg">
                  See courses
                </a>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mt-8">
                {[
                  [Users, "Live mentors", COLORS.emerald],
                  [FolderKanban, "Project based", COLORS.cyan],
                  [Award, "Certificate", COLORS.gold],
                ].map(([I, label, color], i) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white pl-1.5 pr-4 py-1.5 text-[15px] font-semibold"
                    style={{ fontFamily: FONTS.display, border: `2px solid ${color}40`, boxShadow: `0 4px 0 ${color}30`, transform: `rotate(${[-2, 1.5, -1][i]}deg)` }}
                  >
                    <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${color}1f`, color }}>
                      <I className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.55 }}>
              <HeroStage image={kidImage} alt="Pearlx student with a laptop" color={COLORS.indigo} second={COLORS.cyan}>
                <Sticker className="top-[8%] right-[0%]" rotate={5}>
                  <div className="text-[11px] font-extrabold tracking-widest" style={{ color: COLORS.indigo }}>PICK A PATH</div>
                </Sticker>
                <Sticker className="top-[30%] right-[-2%]" rotate={-6} delay={1} style={{ background: COLORS.emerald, borderColor: COLORS.emerald, boxShadow: `0 5px 0 ${edgeOf(COLORS.emerald)}` }}>
                  <div className="text-[11px] font-extrabold tracking-widest text-white">MAKE SOMETHING</div>
                </Sticker>
                {/* <CourseShelf /> */}
              </HeroStage>
            </motion.div>
          </div>
        </div>
        <Wave fill="#FFFFFF" className="relative z-10 -mb-px" />
      </section>

      {/* COURSE LIST */}
      <section id="course-list" className="relative scroll-mt-32 py-14 sm:py-20">
        <PearlScatter variant="a" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="THE COURSE SHELF"
            eyebrowIcon={Rocket}
            color={COLORS.indigo}
            title={<>Find your <Scribble color={COLORS.emerald} textColor={COLORS.cyan}>thing.</Scribble></>}
            className="mb-8"
          />

          {/* FILTERS */}
          <div className="mx-auto mb-10 flex w-fit gap-1 rounded-full bg-white p-1.5" style={{ border: `2px solid ${COLORS.border}`, boxShadow: "0 4px 0 rgba(15,23,42,0.05)" }}>
            {filters.map((filter) => {
              const on = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className="relative px-5 py-2.5 rounded-full text-[15px] font-semibold"
                  style={{ fontFamily: FONTS.display, color: on ? "#fff" : COLORS.textSecondary }}
                >
                  {on && (
                    <motion.span layoutId="course-filter" className="absolute inset-0 rounded-full" style={{ background: COLORS.indigo, boxShadow: `0 3px 0 ${edgeOf(COLORS.indigo)}` }} transition={{ type: "spring", bounce: 0.25, duration: 0.45 }} />
                  )}
                  <span className="relative">{filter}</span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {visibleCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} openDemoModal={openDemoModal} />
            ))}
          </div>
        </div>
      </section>

      <Subjects/>

      {/* WHY PEARLX */}
      <section className="relative py-16 sm:py-20" style={{ background: COLORS.bgSecondary }}>
        <Wave fill="#FFFFFF" flip className="absolute top-0 left-0 right-0" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-4">
          <SectionHeader eyebrow="THE PEARLX WAY" eyebrowIcon={Sparkles} color={COLORS.emerald} title="More making. Less memorising." className="mb-10" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY.map(([I, title, desc], i) => {
              const color = i % 2 === 0 ? COLORS.emerald : COLORS.cyan;
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="px-card px-card--lift p-6"
                  style={{ borderColor: `${color}30`, boxShadow: `0 6px 0 ${color}25` }}
                >
                  <IconBubble icon={I} color={color} size={54} iconSize={25} rotate={i % 2 ? 5 : -5} />
                  <div className="text-xl font-semibold mt-4" style={{ fontFamily: FONTS.display }}>{title}</div>
                  <div className="text-[15px] font-semibold mt-1.5 leading-relaxed" style={{ color: COLORS.textMuted }}>{desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOARDS */}
      <section className="relative py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            title="Your board. Your path."
            sub="Selected courses are available across the major boards."
            className="mb-10"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {BOARDS.map(([name, sub, color, I], i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.5 : -1.5 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
                whileHover={{ y: -6, rotate: 0 }}
                className="rounded-[1.75rem] bg-white p-5 text-center"
                style={{ border: `3px solid ${color}`, boxShadow: `0 6px 0 ${edgeOf(color)}` }}
              >
                <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: color, color: color === COLORS.gold ? COLORS.navDark : "#fff" }}>
                  <I className="w-6 h-6" />
                </div>
                <div className="text-2xl font-semibold mt-3" style={{ fontFamily: FONTS.display }}>{name}</div>
                <div className="text-sm font-bold mt-1" style={{ color: COLORS.textMuted }}>{sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <CtaPanel title="Ready to build something?" sub="Start with a free class. Pick the right path together." image={kidImage} color={COLORS.indigo}>
        <button onClick={() => openDemoModal?.("courses-cta")} className="px-btn px-btn--grad px-btn--lg">
          Book a Free Class
          <ArrowRight className="w-5 h-5" />
        </button>
        <a
          href={getWhatsAppLink("Hi! I'd like to know more about Pearlx courses.")}
          target="_blank"
          rel="noopener noreferrer"
          className="px-btn px-btn--lg"
          style={{ "--btn-bg": "rgba(255,255,255,0.1)", "--btn-edge": "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.2)" }}
        >
          <MessageCircle className="w-5 h-5" />
          Ask us
        </a>
      </CtaPanel>
    </main>
  );
};

export default Courses;