import {
  Trophy, Zap, BookOpen, Sprout, Bird, Award, Calculator, Ruler, Percent, Divide,
  Sigma, PieChart, Puzzle, Brain, Target, Infinity as InfinityIcon, CheckCircle2,
} from "lucide-react";
import { COLORS } from "../utils/theme";
import ProgramPage from "../components/ui/ProgramPage";
import { Scribble } from "../components/ui/Brand";

import lp1 from "../assets/kids/LP2.webp";
import bp1 from "../assets/kids/BP2.webp";
import rp1 from "../assets/kids/RP2.webp";
import heroimage from "../assets/kids/mathkid.webp";

const LEVELS = [
  {
    id: "little",
    LevelIcon: Sprout,
    name: "Little Pearls",
    tag: "START HERE",
    color: COLORS.gold,
    light: COLORS.goldLight,
    image: lp1,
    sticker: "🔢",
    tagline: "Numbers become a playground.",
    short: "Count • Play • Discover",
    highlight: "Visual number play",
    modules: [
      { icon: Calculator, label: "Counting & Number Sense" },
      { icon: Puzzle, label: "Shapes & Patterns" },
      { icon: Sigma, label: "Addition & Subtraction" },
      { icon: Ruler, label: "Measurement Basics" },
      { icon: Brain, label: "Logical Reasoning" },
      { icon: Target, label: "Math Puzzles & Games" },
      { icon: Trophy, label: "Capstone Project" },
    ],
    tools: ["Number Blocks", "Interactive Whiteboard", "Math Games"],
    achievement: "Number Ninja Badge",
    description:
      "Stories, games and hands-on challenges that make early maths feel natural.",
  },
  {
    id: "bright",
    LevelIcon: BookOpen,
    name: "Bright Pearls",
    tag: "LEVEL UP",
    color: COLORS.cyan,
    light: COLORS.cyanLight,
    image: bp1,
    sticker: "🧩",
    tagline: "Think it through. Solve it.",
    short: "Fractions • Geometry • Logic",
    highlight: "Real-world problem solving",
    modules: [
      { icon: Divide, label: "Multiplication & Division" },
      { icon: Percent, label: "Fractions & Decimals" },
      { icon: Ruler, label: "Geometry Basics" },
      { icon: PieChart, label: "Data Handling & Graphs" },
      { icon: Target, label: "Word Problems" },
      { icon: Zap, label: "Mental Math Tricks" },
      { icon: Trophy, label: "Capstone Project" },
    ],
    tools: ["GeoGebra", "Math Playground", "Khan Academy"],
    achievement: "Problem Solver Badge",
    description:
      "Stronger number foundations through puzzles, practical problems and smart shortcuts.",
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
    tagline: "Master the patterns behind maths.",
    short: "Algebra • Geometry • Olympiad",
    highlight: "Advanced problem solving",
    modules: [
      { icon: Sigma, label: "Algebra Foundations" },
      { icon: Sigma, label: "Advanced Algebra" },
      { icon: Ruler, label: "Geometry & Mensuration" },
      { icon: InfinityIcon, label: "Trigonometry" },
      { icon: PieChart, label: "Statistics & Probability" },
      { icon: Target, label: "Coordinate Geometry" },
      { icon: Calculator, label: "Number Theory" },
      { icon: Trophy, label: "Olympiad & Competitive Math" },
      { icon: Brain, label: "Speed & Mental Math" },
      { icon: Award, label: "Capstone Project" },
    ],
    tools: ["GeoGebra", "Desmos", "Wolfram Alpha", "Olympiad Workbooks"],
    achievement: "Math Olympian Badge",
    description:
      "Algebra, geometry, statistics and challenging problem solving that builds exam-ready confidence.",
  },
];

const FAQ = [
  {
    q: "Do you offer a free trial?",
    a: "Yes. Book a free 30-minute demo class with no commitment. We can understand the learner's level and show you how the class works.",
  },
  {
    q: "What happens in a Maths class?",
    a: "Classes are live and interactive, using visual explanations, puzzles, guided problem solving and level-appropriate digital tools.",
  },
  {
    q: "Which tools do students use?",
    a: "Depending on the level, students may use interactive whiteboards, number games, GeoGebra, Desmos and other learning tools.",
  },
  {
    q: "How often are classes held?",
    a: "The standard schedule is two live classes per week, with flexible support available around exams and competitions.",
  },
];

const gradText = {
  background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.indigo})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const MathsClasses = ({ openDemoModal }) => (
  <ProgramPage
    openDemoModal={openDemoModal}
    hero={{
      title: (
        <>
          Numbers.
          <br />
          <span style={gradText}>Patterns.</span>
          <br />
          <Scribble color={COLORS.gold} textColor={COLORS.ink}>Aha!</Scribble>
        </>
      ),
      sub: "Maths that feels less like memorising and more like figuring things out.",
      ctaLabel: "Try a Free Class",
      ctaSource: "maths-hero",
      chips: [
        [Puzzle, "Puzzles", COLORS.gold],
        [Brain, "Reasoning", COLORS.cyan],
        [Trophy, "Challenges", COLORS.indigo],
      ],
      image: heroimage,
      imageAlt: "Pearlx maths student",
      labTitle: "PEARLX MATH LAB",
      dots: [COLORS.gold, COLORS.cyan, COLORS.indigo],
      sticker: "🧮",
      stageColor: COLORS.indigo,
      stageSecond: COLORS.gold,
      wash: "linear-gradient(180deg, #EEF2FF 0%, #FBF6E9 100%)",
      doodles: [
        ["+", COLORS.emerald, { top: "24%", left: "3%" }],
        ["×", COLORS.indigo, { bottom: "20%", left: "40%" }],
        ["π", COLORS.gold, { top: "20%", right: "4%" }],
        ["∑", COLORS.cyan, { bottom: "26%", right: "3%" }],
      ],
    }}
    levels={LEVELS}
    levelsSection={{
      eyebrow: "PICK A PATH",
      eyebrowIcon: Target,
      color: COLORS.indigo,
      title: (
        <>
          Three ways to <span style={gradText}>love maths.</span>
        </>
      ),
      sourcePrefix: "maths",
      nextLabel: "Next maths level",
      moduleLimit: 6,
      whatsapp: (level) => `Hi! I'd like to know more about the ${level.name} Maths program at Pearlx.`,
    }}
    values={[
      [Puzzle, "Solve, don't memorise", COLORS.gold],
      [Brain, "Think step by step", COLORS.cyan],
      [CheckCircle2, "Build real confidence", COLORS.emerald],
    ]}
    faq={FAQ}
    faqColor={COLORS.indigo}
    cta={{
      title: (
        <>
          Ready for the{" "}
          <span style={{ color: COLORS.gold }}>“Aha!” moment?</span>
        </>
      ),
      sub: "Start with a free Pearlx Maths class.",
      label: "Book a Free Trial",
      source: "maths-final",
      image: bp1,
      color: COLORS.indigo,
    }}
  />
);

export default MathsClasses;