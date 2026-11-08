import { motion } from "framer-motion";
import {
  Trophy, Zap, Star, BookOpen, Users, Sprout, Bird, Medal, Code2, Gamepad2, Smartphone, Globe,
  Award, Cpu, Rocket, Layers, Map,
} from "lucide-react";
import { COLORS, FONTS } from "../utils/theme";
import ProgramPage from "../components/ui/ProgramPage";
import { SectionHeader, Scribble } from "../components/ui/Brand";
import lp1 from "../assets/kids/LP1.webp";
import bp1 from "../assets/kids/BP1.webp";
import rp1 from "../assets/kids/RP1.webp";
import heroimage from "../assets/kids/codingkid.webp";
import step1 from "../assets/process/step1.webp";
import step2 from "../assets/process/step2.webp";
import step3 from "../assets/process/step3.webp";
import step4 from "../assets/process/step4.webp";
import step5 from "../assets/process/step5.webp";

const LEVELS = [
  {
    id: "little",
    LevelIcon: Sprout,
    name: "Little Pearls",
    tag: "START HERE",
    color: COLORS.gold,
    light: COLORS.goldLight,
    image: lp1,
    sticker: "🌱",
    tagline: "Code feels like play.",
    short: "Stories • Games • Logic",
    highlight: "Drag, drop & discover",
    modules: [
      { icon: Cpu, label: "Coding Fundamentals" },
      { icon: Gamepad2, label: "Game Development" },
      { icon: Smartphone, label: "App Development" },
      { icon: Code2, label: "Python Basics" },
      { icon: Globe, label: "HTML & CSS" },
      { icon: Trophy, label: "Capstone Project" },
    ],
    tools: ["Scratch Jr", "Code.org", "Trinket.io"],
    achievement: "Coder Badge",
  },
  {
    id: "bright",
    LevelIcon: BookOpen,
    name: "Bright Pearls",
    tag: "LEVEL UP",
    color: COLORS.emerald,
    light: COLORS.emeraldLight,
    image: bp1,
    sticker: "🚀",
    tagline: "Ideas become real projects.",
    short: "Games • Apps • Python",
    highlight: "Build, test & remix",
    modules: [
      { icon: Cpu, label: "Coding Fundamentals" },
      { icon: Gamepad2, label: "Game Development" },
      { icon: Smartphone, label: "App Development" },
      { icon: Code2, label: "Python Basics" },
      { icon: Globe, label: "HTML & CSS" },
      { icon: Trophy, label: "Capstone Project" },
    ],
    tools: ["Scratch", "App Lab", "Thunkable", "Trinket.io"],
    achievement: "Builder Badge",
  },
  {
    id: "rising",
    LevelIcon: Bird,
    name: "Rising Pearls",
    tag: "GO FURTHER",
    color: COLORS.indigo,
    light: COLORS.indigoLight,
    image: rp1,
    sticker: "⚡",
    tagline: "Build like a pro.",
    short: "Python • Web • Apps",
    highlight: "Real code. Real portfolio.",
    modules: [
      { icon: Cpu, label: "Python" },
      { icon: Code2, label: "JavaScript" },
      { icon: Globe, label: "Web Development" },
      { icon: Smartphone, label: "Mobile Apps" },
      { icon: Layers, label: "Full-Stack Projects" },
      { icon: Trophy, label: "Capstone Project" },
    ],
    tools: ["Replit", "GitHub Pages", "Thunkable", "VS Code"],
    achievement: "Pro Coder Badge",
  },
];

const FAQ = [
  {
    q: "Do you offer a free trial?",
    a: "Yes. Book a free demo class and see how Pearlx works before enrolling.",
  },
  {
    q: "How do classes work?",
    a: "Live online classes with hands-on building, guided practice and projects.",
  },
  {
    q: "Is there homework?",
    a: "Only light, fun projects that encourage kids to keep building between classes.",
  },
  {
    q: "What will my child build?",
    a: "Depending on the level: stories, games, apps, websites and portfolio-ready projects.",
  },
];

// Your stored journey artwork (src/assets/process) — each image carries its own step title.
const JOURNEY = [
  { img: step1, alt: "Step 01 — Free Trial Class", color: COLORS.emerald },
  { img: step2, alt: "Step 02 — Logic with Blocks", color: COLORS.indigo },
  { img: step3, alt: "Step 03 — Build Real Projects", color: COLORS.gold },
  { img: step4, alt: "Step 04 — Text Code Mastery", color: "#EC4899" },
  { img: step5, alt: "Step 05 — Grand Showcase", color: COLORS.cyan },
];

const Journey = () => (
  <section className="py-16 sm:py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <SectionHeader
        eyebrow="Step by step"
        eyebrowIcon={Map}
        color={COLORS.indigo}
        title={<>The Pearlx <Scribble color={COLORS.gold} textColor={COLORS.indigo}>coding journey</Scribble></>}
        className="mb-10"
      />
      <div className="flex lg:grid lg:grid-cols-5 gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
        {JOURNEY.map((s, i) => (
          <motion.figure
            key={s.alt}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -8, rotate: 0 }}
            className="snap-start shrink-0 w-[72%] sm:w-[42%] lg:w-auto rounded-[1.75rem] overflow-hidden bg-white p-2"
            style={{ border: `3px solid ${s.color}`, boxShadow: `0 7px 0 ${s.color}55`, rotate: i % 2 ? 1.2 : -1.2 }}
          >
            <img src={s.img} alt={s.alt} className="w-full aspect-square object-cover rounded-[1.25rem]" loading="lazy" />
          </motion.figure>
        ))}
      </div>
    </div>
  </section>
);

const ComputerScienceClasses = ({ openDemoModal }) => (
  <ProgramPage
    openDemoModal={openDemoModal}
    hero={{
      title: (
        <>
          Make.
          <br />
          <Scribble color={COLORS.gold} textColor={COLORS.emerald}>Break.</Scribble>
          <br />
          Build again.
        </>
      ),
      sub: "A playful coding journey where kids learn by creating games, apps and websites — not by memorising boring syntax.",
      ctaLabel: "Try a Free Class",
      ctaSource: "kids-hero",
      chips: [
        [Users, "Small groups", COLORS.emerald],
        [BookOpen, "Project based", COLORS.cyan],
        [Trophy, "Build & show", COLORS.gold],
      ],
      image: heroimage,
      imageAlt: "Pearlx coding student",
      // the artwork has a desk behind it, so soften its edges into the stage
      mask: "radial-gradient(closest-side, #000 78%, transparent 100%)",
      labTitle: "PEARLX PLAYGROUND",
      dots: [COLORS.gold, COLORS.emerald, COLORS.cyan],
      sticker: "🚀",
      stageColor: COLORS.cyan,
      stageSecond: COLORS.emerald,
      wash: "linear-gradient(180deg, #F0F9FF 0%, #ECFDF5 100%)",
      doodles: [
        ["{ }", COLORS.indigo, { top: "24%", left: "3%" }],
        ["</>", COLORS.emerald, { bottom: "18%", left: "44%" }],
        ["✦", COLORS.gold, { top: "22%", right: "4%" }],
      ],
    }}
    levels={LEVELS}
    levelsSection={{
      eyebrow: "PICK A PATH",
      eyebrowIcon: Rocket,
      color: COLORS.cyan,
      title: (
        <>
          Three levels.
          <br />
          <Scribble color={COLORS.cyan} textColor={COLORS.emerald}>One coding adventure.</Scribble>
        </>
      ),
      sourcePrefix: "kids",
      nextLabel: "Next coding level",
      achievementPrefix: "Finish with:",
      whatsapp: (level) => `Hi! I'd like to know more about the ${level.name} coding program at Pearlx.`,
    }}
    values={[
      [Code2, "Learn by building", COLORS.cyan],
      [Rocket, "Projects kids love", COLORS.emerald],
      [Award, "Celebrate progress", COLORS.gold],
    ]}
    faq={FAQ}
    faqColor={COLORS.emerald}
    cta={{
      title: (
        <>
          Ready to build their
          <span style={{ color: COLORS.emerald }}> first thing?</span>
        </>
      ),
      sub: "Start with a free Pearlx trial class.",
      label: "Book Free Trial",
      source: "kids-final",
      image: bp1,
      color: COLORS.emerald,
    }}
  >
    <Journey />
  </ProgramPage>
);

export default ComputerScienceClasses;