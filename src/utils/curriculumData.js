import { 
  collection, addDoc, getDocs, query, where, serverTimestamp, 
  doc, setDoc, getDoc, updateDoc, orderBy 
} from "firebase/firestore";
import { db } from "../firebase";

export const CATEGORIES = [
  { value: "little_pearls",  label: "🐥 Little Pearls",  ages: "Ages 5–7 • Grades K–2" },
  { value: "bright_pearls",  label: "🌱 Bright Pearls",  ages: "Ages 8–11 • Grades 3–6" },
  { value: "rising_pearls",  label: "🦋 Rising Pearls",  ages: "Ages 12–15 • Grades 7–10" },
];

// Little Pearls: 7 Modules 
const LITTLE_PEARLS_MODULES = [
  {
    moduleNumber: 1, moduleName: "Coding Fundamentals", moduleEmoji: "🖥️",
    platform: "Code.org (Course A & B) + Scratch",
    lessons: [
      { lessonNumber: 1,  title: "What is a Computer?",                platform: "Code.org + Scratch" },
      { lessonNumber: 2,  title: "Sequences: Step by Step",             platform: "Code.org + Scratch" },
      { lessonNumber: 3,  title: "Loops: Repeat the Fun!",              platform: "Code.org + Scratch" },
      { lessonNumber: 4,  title: "Events: Make Things Happen!",         platform: "Code.org + Scratch" },
      { lessonNumber: 5,  title: "Debugging: Finding Mistakes",         platform: "Code.org + Scratch" },
      { lessonNumber: 6,  title: "Conditionals: If This, Then That",    platform: "Code.org + Scratch" },
      { lessonNumber: 7,  title: "Nested Loops: Patterns & Designs",    platform: "Code.org + Scratch" },
      { lessonNumber: 8,  title: "Functions: Little Helpers",           platform: "Code.org + Scratch" },
      { lessonNumber: 9,  title: "Binary & Data: Secret Codes",         platform: "Code.org + Scratch" },
      { lessonNumber: 10, title: "Algorithms: Planning Like a Computer", platform: "Code.org + Scratch" },
      { lessonNumber: 11, title: "Unplugged: Coding Without Computers", platform: "Code.org + Scratch" },
      { lessonNumber: 12, title: "Mini Showcase: My First Program!",    platform: "Scratch" },
    ],
  },
  {
    moduleNumber: 2, moduleName: "Scientific Exploration", moduleEmoji: "🔬",
    platform: "Scratch",
    lessons: [
      { lessonNumber: 1,  title: "The Water Cycle Story",               platform: "Scratch" },
      { lessonNumber: 2,  title: "Day & Night: Earth Spins!",           platform: "Scratch" },
      { lessonNumber: 3,  title: "Plants Need Love: Growing a Seed",    platform: "Scratch" },
      { lessonNumber: 4,  title: "Kindness Matters: The Helping Hand",  platform: "Scratch" },
      { lessonNumber: 5,  title: "The Honest Woodcutter",               platform: "Scratch" },
      { lessonNumber: 6,  title: "Healthy Habits Heroes",               platform: "Scratch" },
      { lessonNumber: 7,  title: "Animals & Their Homes",               platform: "Scratch" },
      { lessonNumber: 8,  title: "The Four Seasons",                    platform: "Scratch" },
      { lessonNumber: 9,  title: "Be a Good Friend",                    platform: "Scratch" },
      { lessonNumber: 10, title: "Five Senses Explorer",                platform: "Scratch" },
      { lessonNumber: 11, title: "Save the Earth! Recycling Fun",       platform: "Scratch" },
      { lessonNumber: 12, title: "My Science Story Showcase",           platform: "Scratch" },
    ],
  },
  {
    moduleNumber: 3, moduleName: "Game Development", moduleEmoji: "🎮",
    platform: "Scratch",
    lessons: [
      { lessonNumber: 1,  title: "Click the Cat! Intro to Games",       platform: "Scratch" },
      { lessonNumber: 2,  title: "Catch the Stars",                     platform: "Scratch" },
      { lessonNumber: 3,  title: "Avoid the Shark!",                    platform: "Scratch" },
      { lessonNumber: 4,  title: "Maze Runner",                         platform: "Scratch" },
      { lessonNumber: 5,  title: "Number Quiz Game",                    platform: "Scratch" },
      { lessonNumber: 6,  title: "Pong: Bouncing Ball",                 platform: "Scratch" },
      { lessonNumber: 7,  title: "Space Shooter",                       platform: "Scratch" },
      { lessonNumber: 8,  title: "Jumping Hero Platformer",             platform: "Scratch" },
      { lessonNumber: 9,  title: "Memory Match Cards",                  platform: "Scratch" },
      { lessonNumber: 10, title: "Whack-a-Mole!",                       platform: "Scratch" },
      { lessonNumber: 11, title: "Game Polish: Sound, Screens & Power-Ups", platform: "Scratch" },
      { lessonNumber: 12, title: "Game Dev Showcase!",                  platform: "Scratch" },
    ],
  },
  {
    moduleNumber: 4, moduleName: "App Development", moduleEmoji: "📱",
    platform: "Code.org App Lab",
    lessons: [
      { lessonNumber: 1,  title: "What is an App?",                     platform: "Code.org App Lab" },
      { lessonNumber: 2,  title: "My First Button App",                 platform: "Code.org App Lab" },
      { lessonNumber: 3,  title: "Colour Changer App",                  platform: "Code.org App Lab" },
      { lessonNumber: 4,  title: "Animal Sounds App",                   platform: "Code.org App Lab" },
      { lessonNumber: 5,  title: "Greeting Card App",                   platform: "Code.org App Lab" },
      { lessonNumber: 6,  title: "Counter & Score App",                 platform: "Code.org App Lab" },
      { lessonNumber: 7,  title: "Emoji Mood Tracker",                  platform: "Code.org App Lab" },
      { lessonNumber: 8,  title: "Simple Quiz App",                     platform: "Code.org App Lab" },
      { lessonNumber: 9,  title: "My Daily Routine App",                platform: "Code.org App Lab" },
      { lessonNumber: 10, title: "Choose Your Adventure App",           platform: "Code.org App Lab" },
      { lessonNumber: 11, title: "Fix My App! Debug Challenge",         platform: "Code.org App Lab" },
      { lessonNumber: 12, title: "My App Showcase",                     platform: "Code.org App Lab" },
    ],
  },
  {
    moduleNumber: 5, moduleName: "Python Basics", moduleEmoji: "🐍",
    platform: "Trinket.io",
    lessons: [
      { lessonNumber: 1,  title: "Hello Python! My First Program",      platform: "Trinket.io" },
      { lessonNumber: 2,  title: "Numbers & Maths in Python",           platform: "Trinket.io" },
      { lessonNumber: 3,  title: "Variables: Names for Things",         platform: "Trinket.io" },
      { lessonNumber: 4,  title: "Getting Input: Talk to Your Program", platform: "Trinket.io" },
      { lessonNumber: 5,  title: "If / Elif / Else: Making Decisions",  platform: "Trinket.io" },
      { lessonNumber: 6,  title: "Loops: For & While",                  platform: "Trinket.io" },
      { lessonNumber: 7,  title: "Python Turtle: Drawing with Code",    platform: "Trinket.io" },
      { lessonNumber: 8,  title: "Turtle Patterns & Flowers",           platform: "Trinket.io" },
      { lessonNumber: 9,  title: "Lists: Python's Shopping Basket",     platform: "Trinket.io" },
      { lessonNumber: 10, title: "Functions: Teach Python New Tricks",  platform: "Trinket.io" },
      { lessonNumber: 11, title: "Mini Project: About Me Program",      platform: "Trinket.io" },
      { lessonNumber: 12, title: "Python Basics Showcase",              platform: "Trinket.io" },
    ],
  },
  {
    moduleNumber: 6, moduleName: "HTML & CSS", moduleEmoji: "🌐",
    platform: "Code.org Web Lab",
    lessons: [
      { lessonNumber: 1,  title: "How Websites Work",                   platform: "Code.org Web Lab" },
      { lessonNumber: 2,  title: "Headings & Paragraphs",               platform: "Code.org Web Lab" },
      { lessonNumber: 3,  title: "Lists: Bullets & Numbers",            platform: "Code.org Web Lab" },
      { lessonNumber: 4,  title: "Adding Images",                       platform: "Code.org Web Lab" },
      { lessonNumber: 5,  title: "Links & Navigation",                  platform: "Code.org Web Lab" },
      { lessonNumber: 6,  title: "CSS: Colours & Backgrounds",          platform: "Code.org Web Lab" },
      { lessonNumber: 7,  title: "CSS: Fonts & Text Styling",           platform: "Code.org Web Lab" },
      { lessonNumber: 8,  title: "CSS: Boxes & Borders",                platform: "Code.org Web Lab" },
      { lessonNumber: 9,  title: "Page Layout with Divs",               platform: "Code.org Web Lab" },
      { lessonNumber: 10, title: "Forms: Getting Feedback",             platform: "Code.org Web Lab" },
      { lessonNumber: 11, title: "My Personal Website",                 platform: "Code.org Web Lab" },
      { lessonNumber: 12, title: "Web Showcase: My First Website!",     platform: "Code.org Web Lab" },
    ],
  },
  {
    moduleNumber: 7, moduleName: "Capstone Project", moduleEmoji: "🏆",
    platform: "All Platforms",
    lessons: [
      { lessonNumber: 1,  title: "Capstone Kickoff: Planning",          platform: "All Platforms" },
      { lessonNumber: 2,  title: "Story: Script & Storyboard",          platform: "Scratch" },
      { lessonNumber: 3,  title: "Story Build: Scenes 1–3",             platform: "Scratch" },
      { lessonNumber: 4,  title: "Story Build: Scenes 4–5 + Sound",    platform: "Scratch" },
      { lessonNumber: 5,  title: "Game: Design Document",               platform: "Scratch" },
      { lessonNumber: 6,  title: "Game Build: Core Mechanics",          platform: "Scratch" },
      { lessonNumber: 7,  title: "Game Build: Polish & Level 2",        platform: "Scratch" },
      { lessonNumber: 8,  title: "App Planning & Build Part 1",         platform: "Code.org App Lab" },
      { lessonNumber: 9,  title: "App Build Part 2 + Logic",            platform: "Code.org App Lab" },
      { lessonNumber: 10, title: "Website Build Part 1",                platform: "Code.org Web Lab" },
      { lessonNumber: 11, title: "Website Build Part 2 + CSS",          platform: "Code.org Web Lab" },
      { lessonNumber: 12, title: "🏆 Grand Showcase: PearlX Graduation!", platform: "All Platforms" },
    ],
  },
];

// Bright Pearls: 6 Modules 
const BRIGHT_PEARLS_MODULES = [
  {
    moduleNumber: 1, moduleName: "Coding Fundamentals", moduleEmoji: "🖥️",
    platform: "Code.org (Course C, D & E) + Scratch",
    lessons: [
      { lessonNumber: 1,  title: "What is a Computer? (+ Networks)",    platform: "Code.org + Scratch" },
      { lessonNumber: 2,  title: "Sequences & Efficiency",              platform: "Code.org + Scratch" },
      { lessonNumber: 3,  title: "Loops & Patterns",                    platform: "Code.org + Scratch" },
      { lessonNumber: 4,  title: "Events & Interactivity",              platform: "Code.org + Scratch" },
      { lessonNumber: 5,  title: "Debugging Strategies",                platform: "Code.org + Scratch" },
      { lessonNumber: 6,  title: "Conditionals & Logic",                platform: "Code.org + Scratch" },
      { lessonNumber: 7,  title: "Nested Loops & Complex Patterns",     platform: "Code.org + Scratch" },
      { lessonNumber: 8,  title: "Functions & Parameters",              platform: "Code.org + Scratch" },
      { lessonNumber: 9,  title: "Variables & Data",                    platform: "Code.org + Scratch" },
      { lessonNumber: 10, title: "Algorithms & Problem Solving",        platform: "Code.org + Scratch" },
      { lessonNumber: 11, title: "Combining Concepts: Mini Project Sprint", platform: "Code.org + Scratch" },
      { lessonNumber: 12, title: "Bright Pearls Showcase",              platform: "Scratch + App Lab" },
    ],
  },
  {
    moduleNumber: 2, moduleName: "Scientific Exploration", moduleEmoji: "🔬",
    platform: "Scratch",
    lessons: [
      { lessonNumber: 1,  title: "Water Cycle: Interactive Simulation", platform: "Scratch" },
      { lessonNumber: 2,  title: "Solar System Explorer",               platform: "Scratch" },
      { lessonNumber: 3,  title: "Plant Life Cycle + Photosynthesis Equation", platform: "Scratch" },
      { lessonNumber: 4,  title: "Empathy Simulator: Walk in Their Shoes", platform: "Scratch" },
      { lessonNumber: 5,  title: "Human Body Systems",                  platform: "Scratch" },
      { lessonNumber: 6,  title: "Healthy Habits Tracker App",          platform: "Scratch" },
      { lessonNumber: 7,  title: "Ecosystems & Food Chains",            platform: "Scratch" },
      { lessonNumber: 8,  title: "Climate & Weather Patterns",          platform: "Scratch" },
      { lessonNumber: 9,  title: "Stand Up! Anti-Bullying Story",       platform: "Scratch" },
      { lessonNumber: 10, title: "The Nervous System: Signal Speed",    platform: "Scratch" },
      { lessonNumber: 11, title: "Save Our Oceans: Data Story",         platform: "Scratch" },
      { lessonNumber: 12, title: "Bright Pearls Science Showcase",      platform: "Scratch" },
    ],
  },
  {
    moduleNumber: 3, moduleName: "Game Development", moduleEmoji: "🎮",
    platform: "Scratch",
    lessons: [
      { lessonNumber: 1,  title: "Game Design Thinking",                platform: "Scratch" },
      { lessonNumber: 2,  title: "Scrolling Background Runner",         platform: "Scratch" },
      { lessonNumber: 3,  title: "Platform Game: Level Design",         platform: "Scratch" },
      { lessonNumber: 4,  title: "Top-Down RPG Movement",               platform: "Scratch" },
      { lessonNumber: 5,  title: "Enemy AI Patterns",                   platform: "Scratch" },
      { lessonNumber: 6,  title: "Tower Defense Game",                  platform: "Scratch" },
      { lessonNumber: 7,  title: "Quiz RPG — Learn & Battle",           platform: "Scratch" },
      { lessonNumber: 8,  title: "2-Player Pong",                       platform: "Scratch" },
      { lessonNumber: 9,  title: "Clicker Game with Economy",           platform: "Scratch" },
      { lessonNumber: 10, title: "Puzzle Game: Sokoban",                platform: "Scratch" },
      { lessonNumber: 11, title: "Game Jam: 1-Hour Challenge",          platform: "Scratch" },
      { lessonNumber: 12, title: "Bright Pearls Game Showcase",         platform: "Scratch" },
    ],
  },
  {
    moduleNumber: 4, moduleName: "App Development", moduleEmoji: "📱",
    platform: "Code.org App Lab + Thunkable",
    lessons: [
      { lessonNumber: 1,  title: "App Design Thinking",                 platform: "Code.org App Lab" },
      { lessonNumber: 2,  title: "App Lab with Real JS Code",           platform: "Code.org App Lab" },
      { lessonNumber: 3,  title: "Multi-Screen Navigation App",         platform: "Code.org App Lab" },
      { lessonNumber: 4,  title: "Data Collection App",                 platform: "Code.org App Lab" },
      { lessonNumber: 5,  title: "List-Powered App",                    platform: "Code.org App Lab" },
      { lessonNumber: 6,  title: "Quiz App with Timer",                 platform: "Code.org App Lab" },
      { lessonNumber: 7,  title: "Thunkable Intro: Your First Mobile App", platform: "Thunkable" },
      { lessonNumber: 8,  title: "Thunkable: Sensor App",               platform: "Thunkable" },
      { lessonNumber: 9,  title: "Thunkable: Data Storage App",         platform: "Thunkable" },
      { lessonNumber: 10, title: "App Debugging & Testing Lab",         platform: "Code.org App Lab" },
      { lessonNumber: 11, title: "App Redesign Challenge",              platform: "Code.org App Lab" },
      { lessonNumber: 12, title: "Bright Pearls App Showcase",          platform: "Code.org App Lab + Thunkable" },
    ],
  },
  {
    moduleNumber: 5, moduleName: "Python Basics", moduleEmoji: "🐍",
    platform: "Trinket.io",
    lessons: [
      { lessonNumber: 1,  title: "Python Setup & First Program",        platform: "Trinket.io" },
      { lessonNumber: 2,  title: "Numbers, Operators & Math Module",    platform: "Trinket.io" },
      { lessonNumber: 3,  title: "Variables, Data Types & Type Conversion", platform: "Trinket.io" },
      { lessonNumber: 4,  title: "Input, Validation & User Programs",   platform: "Trinket.io" },
      { lessonNumber: 5,  title: "Conditionals & Nested Logic",         platform: "Trinket.io" },
      { lessonNumber: 6,  title: "Loops: For, While, Range & Patterns", platform: "Trinket.io" },
      { lessonNumber: 7,  title: "Python Turtle: Geometric Art",        platform: "Trinket.io" },
      { lessonNumber: 8,  title: "Lists: Operations & Algorithms",      platform: "Trinket.io" },
      { lessonNumber: 9,  title: "Functions: Parameters, Returns & Scope", platform: "Trinket.io" },
      { lessonNumber: 10, title: "Dictionaries & Sets",                 platform: "Trinket.io" },
      { lessonNumber: 11, title: "Mini Project: Text-Based Game",       platform: "Trinket.io" },
      { lessonNumber: 12, title: "Bright Python Basics Showcase",       platform: "Trinket.io" },
    ],
  },
  {
    moduleNumber: 6, moduleName: "HTML & CSS", moduleEmoji: "🌐",
    platform: "Code.org Web Lab + VS Code",
    lessons: [
      { lessonNumber: 1,  title: "How the Web Works: Deep Dive",        platform: "Code.org Web Lab" },
      { lessonNumber: 2,  title: "Semantic HTML5",                      platform: "Code.org Web Lab" },
      { lessonNumber: 3,  title: "Advanced CSS Selectors",              platform: "Code.org Web Lab" },
      { lessonNumber: 4,  title: "CSS Flexbox Layout",                  platform: "Code.org Web Lab" },
      { lessonNumber: 5,  title: "CSS Grid Layout",                     platform: "Code.org Web Lab" },
      { lessonNumber: 6,  title: "CSS Animations & Transitions",        platform: "Code.org Web Lab" },
      { lessonNumber: 7,  title: "CSS Variables & Theming",             platform: "Code.org Web Lab" },
      { lessonNumber: 8,  title: "Responsive Design & Media Queries",   platform: "Code.org Web Lab" },
      { lessonNumber: 9,  title: "Google Fonts & Icons",                platform: "Code.org Web Lab" },
      { lessonNumber: 10, title: "HTML Forms: Advanced",                platform: "Code.org Web Lab" },
      { lessonNumber: 11, title: "Full Website Build",                  platform: "Code.org Web Lab" },
      { lessonNumber: 12, title: "Bright Web Showcase",                 platform: "Code.org Web Lab" },
    ],
  },
];

// Rising Pearls: 10 Modules 
const RISING_PEARLS_MODULES = [
  {
    moduleNumber: 1, moduleName: "Coding Fundamentals", moduleEmoji: "🖥️",
    platform: "Code.org CS Principles & App Lab",
    lessons: [
      { lessonNumber: 1,  title: "How Computers & Networks Work",       platform: "Code.org App Lab" },
      { lessonNumber: 2,  title: "Sequences, Efficiency & Pseudocode",  platform: "Code.org App Lab" },
      { lessonNumber: 3,  title: "Loops — For, While & Iteration",      platform: "Code.org App Lab" },
      { lessonNumber: 4,  title: "Events & User Interaction",           platform: "Code.org App Lab" },
      { lessonNumber: 5,  title: "Debugging & Testing",                 platform: "Code.org App Lab" },
      { lessonNumber: 6,  title: "Conditionals, Logic & Boolean Expressions", platform: "Code.org App Lab" },
      { lessonNumber: 7,  title: "Functions, Parameters & Return Values", platform: "Code.org App Lab" },
      { lessonNumber: 8,  title: "Variables, Data Types & Scope",       platform: "Code.org App Lab" },
      { lessonNumber: 9,  title: "Lists & Arrays",                      platform: "Code.org App Lab" },
      { lessonNumber: 10, title: "Algorithms, Sorting & Searching",     platform: "Code.org App Lab" },
      { lessonNumber: 11, title: "Intro to Objects & Clean Code",       platform: "Code.org App Lab" },
      { lessonNumber: 12, title: "Rising Pearls Showcase",              platform: "Code.org App Lab" },
    ],
  },
  {
    moduleNumber: 2, moduleName: "Scientific Exploration", moduleEmoji: "🔬",
    platform: "Scratch",
    lessons: [
      { lessonNumber: 1,  title: "Water Cycle: Simulation with Variables", platform: "Scratch" },
      { lessonNumber: 2,  title: "Solar System Orrery",                 platform: "Scratch" },
      { lessonNumber: 3,  title: "Photosynthesis vs Cellular Respiration", platform: "Scratch" },
      { lessonNumber: 4,  title: "Ethical Dilemmas: A Decision Tree",   platform: "Scratch" },
      { lessonNumber: 5,  title: "Circulatory System: Heart Rate Monitor", platform: "Scratch" },
      { lessonNumber: 6,  title: "Nutrition Analyser",                  platform: "Scratch" },
      { lessonNumber: 7,  title: "Ecosystem Balance Simulation",        platform: "Scratch" },
      { lessonNumber: 8,  title: "Climate Change: Data Visualiser",     platform: "Scratch" },
      { lessonNumber: 9,  title: "Documentary: Social Justice Issue",   platform: "Scratch" },
      { lessonNumber: 10, title: "The Brain & Memory Science",          platform: "Scratch" },
      { lessonNumber: 11, title: "Environmental Action Campaign",       platform: "Scratch" },
      { lessonNumber: 12, title: "Rising Pearls Science Showcase",      platform: "Scratch" },
    ],
  },
  {
    moduleNumber: 3, moduleName: "Game Development", moduleEmoji: "🎮",
    platform: "Scratch",
    lessons: [
      { lessonNumber: 1,  title: "Game Design Document (GDD)",          platform: "Scratch" },
      { lessonNumber: 2,  title: "Platformer with Custom Physics",      platform: "Scratch" },
      { lessonNumber: 3,  title: "Enemy AI: State Machine Design",      platform: "Scratch" },
      { lessonNumber: 4,  title: "Procedural Level Generation",         platform: "Scratch" },
      { lessonNumber: 5,  title: "Inventory & Item System",             platform: "Scratch" },
      { lessonNumber: 6,  title: "Full RPG Battle System",              platform: "Scratch" },
      { lessonNumber: 7,  title: "Saving Progress with Variables",      platform: "Scratch" },
      { lessonNumber: 8,  title: "Polished Game Feel",                  platform: "Scratch" },
      { lessonNumber: 9,  title: "Multiplayer Patterns",                platform: "Scratch" },
      { lessonNumber: 10, title: "Game Testing & Balancing",            platform: "Scratch" },
      { lessonNumber: 11, title: "Porting a Scratch Concept to App Lab", platform: "Scratch + App Lab" },
      { lessonNumber: 12, title: "Rising Pearls Game Showcase",         platform: "Scratch" },
    ],
  },
  {
    moduleNumber: 4, moduleName: "App Development", moduleEmoji: "📱",
    platform: "Thunkable + Airtable",
    lessons: [
      { lessonNumber: 1,  title: "Mobile App Design Principles",        platform: "Thunkable" },
      { lessonNumber: 2,  title: "Thunkable Fundamentals",              platform: "Thunkable" },
      { lessonNumber: 3,  title: "Working with Data & Lists",           platform: "Thunkable" },
      { lessonNumber: 4,  title: "Sensors & Device Features",           platform: "Thunkable" },
      { lessonNumber: 5,  title: "Airtable Database Integration",       platform: "Thunkable + Airtable" },
      { lessonNumber: 6,  title: "User Authentication Concepts",        platform: "Thunkable" },
      { lessonNumber: 7,  title: "Notifications & User Engagement",     platform: "Thunkable" },
      { lessonNumber: 8,  title: "Maps & Location Features",            platform: "Thunkable" },
      { lessonNumber: 9,  title: "App Testing & Analytics",             platform: "Thunkable" },
      { lessonNumber: 10, title: "Monetisation & App Business Models",  platform: "Thunkable" },
      { lessonNumber: 11, title: "Preparing for Launch",                platform: "Thunkable" },
      { lessonNumber: 12, title: "Rising Pearls App Showcase",          platform: "Thunkable" },
    ],
  },
  {
    moduleNumber: 5, moduleName: "Python Basics", moduleEmoji: "🐍",
    platform: "Replit",
    lessons: [
      { lessonNumber: 1,  title: "Python Environment & Code Quality",   platform: "Replit" },
      { lessonNumber: 2,  title: "Numbers, Math & Precision",           platform: "Replit" },
      { lessonNumber: 3,  title: "Strings: Deep Dive",                  platform: "Replit" },
      { lessonNumber: 4,  title: "User Input & Robust Programs",        platform: "Replit" },
      { lessonNumber: 5,  title: "Conditionals & Guard Clauses",        platform: "Replit" },
      { lessonNumber: 6,  title: "Loops: Control Flow Mastery",         platform: "Replit" },
      { lessonNumber: 7,  title: "Functions: Advanced",                 platform: "Replit" },
      { lessonNumber: 8,  title: "Data Structures: Lists, Dicts, Sets, Tuples", platform: "Replit" },
      { lessonNumber: 9,  title: "File I/O: Reading & Writing Files",   platform: "Replit" },
      { lessonNumber: 10, title: "Modules & Packages",                  platform: "Replit" },
      { lessonNumber: 11, title: "Mini Project: Command-Line App",      platform: "Replit" },
      { lessonNumber: 12, title: "Rising Python Basics Showcase",       platform: "Replit" },
    ],
  },
  {
    moduleNumber: 6, moduleName: "Python Intermediate", moduleEmoji: "🐍⚡",
    platform: "Replit",
    lessons: [
      { lessonNumber: 1,  title: "OOP Deep Dive: Design Patterns",      platform: "Replit" },
      { lessonNumber: 2,  title: "OOP: Inheritance & Polymorphism",     platform: "Replit" },
      { lessonNumber: 3,  title: "Functional Python",                   platform: "Replit" },
      { lessonNumber: 4,  title: "Iterators & Generators",              platform: "Replit" },
      { lessonNumber: 5,  title: "Requests & REST APIs",                platform: "Replit" },
      { lessonNumber: 6,  title: "Data Analysis with Pandas",           platform: "Replit" },
      { lessonNumber: 7,  title: "Data Visualisation with Matplotlib",  platform: "Replit" },
      { lessonNumber: 8,  title: "SQLite Databases",                    platform: "Replit" },
      { lessonNumber: 9,  title: "Concurrency: Threading & asyncio",    platform: "Replit" },
      { lessonNumber: 10, title: "Testing with pytest",                 platform: "Replit" },
      { lessonNumber: 11, title: "Advanced Project: Data Pipeline",     platform: "Replit" },
      { lessonNumber: 12, title: "Rising Intermediate Python Showcase",  platform: "Replit" },
    ],
  },
  {
    moduleNumber: 7, moduleName: "Python Advanced", moduleEmoji: "🐍🔥",
    platform: "Replit",
    lessons: [
      { lessonNumber: 1,  title: "Flask: Full Web Framework",           platform: "Replit" },
      { lessonNumber: 2,  title: "Flask: Authentication System",        platform: "Replit" },
      { lessonNumber: 3,  title: "RESTful API Design",                  platform: "Replit" },
      { lessonNumber: 4,  title: "Database: SQLAlchemy ORM",            platform: "Replit" },
      { lessonNumber: 5,  title: "Advanced Pandas & NumPy",             platform: "Replit" },
      { lessonNumber: 6,  title: "Machine Learning Intro: scikit-learn", platform: "Replit" },
      { lessonNumber: 7,  title: "Async Python: asyncio & aiohttp",     platform: "Replit" },
      { lessonNumber: 8,  title: "Testing: pytest & TDD",               platform: "Replit" },
      { lessonNumber: 9,  title: "Deployment: Git & Cloud Hosting",     platform: "GitHub + PythonAnywhere/Render" },
      { lessonNumber: 10, title: "Web Scraping & Data Pipeline",        platform: "Replit" },
      { lessonNumber: 11, title: "Capstone: Full-Stack Python App",     platform: "Replit" },
      { lessonNumber: 12, title: "Rising Advanced Python Showcase",     platform: "Replit" },
    ],
  },
  {
    moduleNumber: 8, moduleName: "CodiMath", moduleEmoji: "🔢",
    platform: "Replit + Scratch",
    lessons: [
      { lessonNumber: 1,  title: "Number Theory & Cryptography",        platform: "Replit" },
      { lessonNumber: 2,  title: "Sorting Algorithms Visualised",       platform: "Replit" },
      { lessonNumber: 3,  title: "Linear Algebra Basics",               platform: "Replit" },
      { lessonNumber: 4,  title: "Statistics: Beyond the Basics",       platform: "Replit" },
      { lessonNumber: 5,  title: "Calculus: Numerical Methods",         platform: "Replit" },
      { lessonNumber: 6,  title: "Graph Theory Intro",                  platform: "Replit" },
      { lessonNumber: 7,  title: "Probability & Simulation",            platform: "Replit" },
      { lessonNumber: 8,  title: "Optimisation Algorithms",             platform: "Replit" },
      { lessonNumber: 9,  title: "Coordinate Geometry & Transformations", platform: "Replit" },
      { lessonNumber: 10, title: "Mathematical Modelling",              platform: "Replit" },
      { lessonNumber: 11, title: "Number Patterns & Research Project",  platform: "Replit" },
      { lessonNumber: 12, title: "Rising CodiMath Showcase",            platform: "Replit" },
    ],
  },
  {
    moduleNumber: 9, moduleName: "HTML & CSS", moduleEmoji: "🌐",
    platform: "VS Code + GitHub",
    lessons: [
      { lessonNumber: 1,  title: "Web Architecture: The Full Stack",    platform: "VS Code / Replit" },
      { lessonNumber: 2,  title: "HTML5: Semantic & Accessible",        platform: "VS Code" },
      { lessonNumber: 3,  title: "Advanced CSS: Custom Properties & Functions", platform: "VS Code" },
      { lessonNumber: 4,  title: "CSS Grid: Advanced Layouts",          platform: "VS Code" },
      { lessonNumber: 5,  title: "CSS Animation & Motion Design",       platform: "VS Code" },
      { lessonNumber: 6,  title: "Sass/SCSS: CSS Preprocessing",        platform: "VS Code + Sass" },
      { lessonNumber: 7,  title: "JavaScript + DOM: Making It Interactive", platform: "VS Code" },
      { lessonNumber: 8,  title: "Responsive Design: Mobile-First & Testing", platform: "VS Code" },
      { lessonNumber: 9,  title: "Performance & Optimisation",          platform: "VS Code" },
      { lessonNumber: 10, title: "Hosting: GitHub Pages",               platform: "GitHub" },
      { lessonNumber: 11, title: "Capstone Website Build",              platform: "VS Code + GitHub" },
      { lessonNumber: 12, title: "Rising Web Showcase",                 platform: "GitHub Pages" },
    ],
  },
  {
    moduleNumber: 10, moduleName: "JavaScript", moduleEmoji: "⚡",
    platform: "VS Code / Replit + Vite",
    lessons: [
      { lessonNumber: 1,  title: "JavaScript: The Full Picture",        platform: "VS Code / Replit" },
      { lessonNumber: 2,  title: "ES6+ Mastery",                        platform: "VS Code / Replit" },
      { lessonNumber: 3,  title: "Functional JavaScript",               platform: "VS Code / Replit" },
      { lessonNumber: 4,  title: "OOP: Prototypes, Classes & Patterns", platform: "VS Code / Replit" },
      { lessonNumber: 5,  title: "Async JavaScript: Promises & async/await", platform: "VS Code / Replit" },
      { lessonNumber: 6,  title: "Fetch, CORS & REST APIs",             platform: "VS Code / Replit" },
      { lessonNumber: 7,  title: "DOM: Advanced Manipulation & Performance", platform: "VS Code / Replit" },
      { lessonNumber: 8,  title: "JavaScript Modules & Bundling",       platform: "Vite + VS Code" },
      { lessonNumber: 9,  title: "TypeScript: Type-Safe JavaScript",    platform: "VS Code + TypeScript" },
      { lessonNumber: 10, title: "Testing JS: Vitest & Testing Library", platform: "VS Code + Vitest" },
      { lessonNumber: 11, title: "Capstone: Full Frontend App",         platform: "VS Code / Vite" },
      { lessonNumber: 12, title: "Rising JS Showcase",                  platform: "VS Code + GitHub" },
    ],
  },
];

//  Category → Module mapping 
export const DEFAULT_MODULES_BY_CATEGORY = {
  little_pearls: LITTLE_PEARLS_MODULES,
  bright_pearls: BRIGHT_PEARLS_MODULES,
  rising_pearls: RISING_PEARLS_MODULES,
};

// Module counts summary 
export const CURRICULUM_SUMMARY = {
  little_pearls: { modules: 7, totalLessons: 84 },
  bright_pearls: { modules: 6, totalLessons: 72 },
  rising_pearls: { modules: 10, totalLessons: 120 },
};

/**
 * Seeds all curriculum data into Firestore.
 * Each category gets its own module set.
 * Call this once from the admin panel — it checks for existing data first.
 * @returns {{ seeded: number, skipped: number }}
 */


export async function fetchAllCurriculumModules() {
  const snap = await getDocs(
    query(collection(db, "curriculum"), orderBy("category"), orderBy("moduleNumber"))
  );
  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}

export async function fetchAllCurriculumLessons() {
  const modules = await fetchAllCurriculumModules();
  const lessons = [];
  
  modules.forEach(mod => {
    (mod.lessons || []).forEach(lesson => {
      lessons.push({
        ...lesson,
        moduleId: mod.id,
        moduleName: mod.moduleName,
        moduleNumber: mod.moduleNumber,
        category: mod.category,
        moduleEmoji: mod.moduleEmoji,
      });
    });
  });
  
  return lessons;
}

export async function saveStudentCurriculumOverride(studentId, assignedModuleIds, assignedLessons) {
  const ref = doc(db, "studentCurriculum", studentId);
  
  // Fetch module details for denormalization
  const moduleDetails = {};
  for (const moduleId of assignedModuleIds) {
    const modRef = doc(db, "curriculum", moduleId);
    const modSnap = await getDoc(modRef);
    if (modSnap.exists()) {
      const data = modSnap.data();
      moduleDetails[moduleId] = {
        moduleName: data.moduleName,
        category: data.category,
        moduleNumber: data.moduleNumber,
      };
    }
  }

   // Process assigned lessons with module context
  const processedLessons = assignedLessons.map(lesson => ({
    lessonId: lesson.id,
    moduleDocId: lesson.moduleId,
    lessonTitle: lesson.title,
    category: lesson.category,
    thumbnailUrl: lesson.thumbnailUrl || "",
  }));
  
  // Format assigned modules
  const formattedModules = assignedModuleIds.map(moduleId => ({
    moduleDocId: moduleId,
    ...moduleDetails[moduleId],
  }));
  
  await setDoc(ref, {
    studentId,
    assignedModules: formattedModules,
    assignedLessons: processedLessons,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

/** Fetch all modules for a given category, ordered by moduleNumber */
export async function fetchCurriculumForCategory(category) {
  const snap = await getDocs(
    query(collection(db, "curriculum"), where("category", "==", category))
  );
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => a.moduleNumber - b.moduleNumber);
}

// Per-student curriculum override helpers 

export async function fetchStudentCurriculumOverride(studentId) {
  const ref = doc(db, "studentCurriculum", studentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
}

export async function getStudentCurriculumWithDetails(studentId) {
  const override = await fetchStudentCurriculumOverride(studentId);
  if (!override) return { modules: [], lessons: [] };
  
  // Fetch full module details
  const modules = [];
  for (const assignedMod of override.assignedModules || []) {
    const modRef = doc(db, "curriculum", assignedMod.moduleDocId);
    const modSnap = await getDoc(modRef);
    if (modSnap.exists()) {
      modules.push({
        id: assignedMod.moduleDocId,
        ...modSnap.data(),
      });
    }
  }

   // Fetch full lesson details
  const lessonsMap = {};
  modules.forEach(mod => {
    (mod.lessons || []).forEach(lesson => {
      lessonsMap[lesson.id] = { ...lesson, moduleName: mod.moduleName, moduleId: mod.id };
    });
  });
  
  const lessons = (override.assignedLessons || [])
    .map(assignedLesson => lessonsMap[assignedLesson.lessonId])
    .filter(Boolean);
  
  return { modules, lessons };
}

/**
 * HELPER: Get lesson with full details including thumbnail
 */
export async function getLessonWithDetails(moduleId, lessonId) {
  const modRef = doc(db, "curriculum", moduleId);
  const modSnap = await getDoc(modRef);
  
  if (!modSnap.exists()) return null;
  
  const mod = modSnap.data();
  const lesson = (mod.lessons || []).find(l => l.id === lessonId);
  
  return lesson ? { ...lesson, moduleName: mod.moduleName, category: mod.category } : null;
}

/**
 * HELPER: Upload lesson thumbnail to Firestore (store as URL or Base64)
 * In production, use Firebase Storage
 */
export async function updateLessonThumbnail(moduleId, lessonId, thumbnailUrl) {
  const modRef = doc(db, "curriculum", moduleId);
  const modSnap = await getDoc(modRef);
  
  if (!modSnap.exists()) throw new Error("Module not found");
  
  const lessons = (modSnap.data().lessons || []).map(l =>
    l.id === lessonId ? { ...l, thumbnailUrl } : l
  );
  
  await updateDoc(modRef, { lessons, updatedAt: serverTimestamp() });
}

export async function seedCurriculumToFirestore(onProgress) {
  const categoryModuleMap = {
    little_pearls: LITTLE_PEARLS_MODULES,
    bright_pearls: BRIGHT_PEARLS_MODULES,
    rising_pearls: RISING_PEARLS_MODULES,
  };

  let seeded = 0, skipped = 0;

  for (const [category, moduleSeed] of Object.entries(categoryModuleMap)) {
    const existingSnap = await getDocs(
      query(collection(db, "curriculum"), where("category", "==", category))
    );
    const existingModuleNumbers = new Set(
      existingSnap.docs.map(d => d.data().moduleNumber)
    );

    for (const mod of moduleSeed) {
      if (existingModuleNumbers.has(mod.moduleNumber)) { skipped++; continue; }

      const lessons = mod.lessons.map((l) => ({
        id: `${category}_m${mod.moduleNumber}_l${l.lessonNumber}`,
        lessonNumber: l.lessonNumber,
        title: l.title,
        platform: l.platform,
        description: "",
        notes: "",
        pptLink: "",
      }));

      await addDoc(collection(db, "curriculum"), {
        category,
        moduleNumber: mod.moduleNumber,
        moduleName: mod.moduleName,
        moduleEmoji: mod.moduleEmoji,
        lessons,
        createdAt: serverTimestamp(),
      });

      seeded++;
      onProgress?.(`Seeded: ${category} → Module ${mod.moduleNumber}: ${mod.moduleName}`);
    }
  }

  return { seeded, skipped };
}

