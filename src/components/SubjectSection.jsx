import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Zap, Trophy, Heart, Users } from "lucide-react";
import lp1 from "../assets/kids/LP1.webp"
import bp1 from "../assets/kids/BP1.webp"
import rp1 from "../assets/kids/RP1.webp"
import kid1 from "../assets/kids/KID1.webp"


const STAT_ICON_MAP = { Users, Zap, Trophy, Heart };

const T = { bg:"#F0FFFE", ink:"#0F172A", green:"#10B981", sky:"#0EA5E9",
  yellow:"#FFD166", pink:"#FF6B9D", purple:"#A78BFA" };

const LEVELS = [
  {
    id:"little",customIcon: lp1 , name:"Little Pearls", age:"Ages 5–7", tag:"BEGINNER",
    tagline:"Where every coder begins their journey!",
    desc:"Drag-and-drop block magic — no typing needed. Kids build logic through animated stories, mini-games, and colourful puzzles. Pure joy from day one.",
    tools:["Scratch Jr","Block Coding","CodiMath"],
    color:T.yellow, glow:"rgba(255,209,102,0.28)", border:"rgba(255,209,102,0.4)",
    textColor:"#A8760A", bg:"linear-gradient(145deg,#FFFBEB,#FFF3C4)",
    floatImg:"/images/kids/little-pearls-float.png",
    achievements:["Logic Builder","Loop Master","Story Coder"],
    modules:9, lessons:44, projects:6,
  },
  {
    id:"bright", customIcon: bp1, name:"Bright Pearls", age:"Ages 8–11", tag:"INTERMEDIATE",
    tagline:"Real projects, real excitement, real skills!",
    desc:"From Scratch to Python — students build actual games and apps. Every module ends with a project they're genuinely proud of showing parents.",
    tools:["Scratch","Python Intro","Game Dev"],
    color:T.green, glow:"rgba(16,185,129,0.25)", border:"rgba(16,185,129,0.4)",
    textColor:"#047857", bg:"linear-gradient(145deg,#ECFDF5,#D1FAE5)",
    floatImg:"/images/kids/bright-pearls-float.png",
    modules:9, lessons:44, projects:8,
  },
  {
    id:"rising", customIcon: rp1, name:"Rising Pearls", age:"Ages 12–15", tag:"ADVANCED",
    tagline:"Pro-grade coding — websites, apps & Python!",
    desc:"Text-based programming that matters. Python OOP, full web dev with JS, and portfolio-ready capstone projects that impress universities.",
    tools:["Python OOP","HTML/CSS/JS","GitHub"],
    color:T.purple, glow:"rgba(167,139,250,0.25)", border:"rgba(167,139,250,0.4)",
    textColor:"#6D28D9", bg:"linear-gradient(145deg,#F5F3FF,#EDE9FE)",
    floatImg:"/images/kids/rising-pearls-float.png",
    modules:9, lessons:44, projects:10,
  },
  {
    id:"academic", customIcon: kid1, name:"Academic Tuition", age:"Classes 1–12", tag:"ACADEMIC",
    tagline:"Board exams? We make them stress-free!",
    desc:"Coaching for Classes 1–12 to excel in their academics. Expert guidance in Mathematics, Science, English, Social Science, Computer Science, and more. Regular tests, doubt clearing, notes, assignments, and exam strategies to help students achieve top scores.",
    tools:["ICSE/CBSE","IGCSE","State Boards"],
    color:T.sky, glow:"rgba(14,165,233,0.25)", border:"rgba(14,165,233,0.4)",
    textColor:"#0284C7", bg:"linear-gradient(145deg,#F0F9FF,#E0F2FE)",
    floatImg:"/images/kids/cs-tuition-float.png",
  },
];

/* background-removed floating kid image */
const FloatKid = ({ src, emoji, style, delay=0 }) => (
  <motion.div animate={{ y:[0,-14,0], rotate:[-2,2,-2] }}
    transition={{ duration:5+delay, repeat:Infinity, ease:"easeInOut", delay }}
    className="absolute pointer-events-none select-none z-0" style={style}>
    <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"contain",
      filter:"drop-shadow(0 16px 28px rgba(0,0,0,0.15))" }}
      onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }} />
    <div style={{ display:"none",width:"100%",height:"100%",alignItems:"center",
      justifyContent:"center" }}></div>
  </motion.div>
);

const LevelCard = ({ l, i }) => (
  <motion.div initial={{ opacity:0,y:60 }} whileInView={{ opacity:1,y:0 }}
    viewport={{ once:true }} transition={{ duration:0.7,delay:i*0.12 }} className="relative group">
    
    {/* Glow background */}
    <div className="absolute inset-0 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"
      style={{ background:l.glow, transform:"scale(1.08)" }} />

    <motion.div whileHover={{ y:-16 }} transition={{ duration:0.3 }}
      className="relative bg-white rounded-[2.5rem] overflow-hidden border-2 flex flex-col h-full"
      style={{ borderColor:l.border, boxShadow:`0 8px 40px ${l.glow}` }}>
      
      {/* Card Header Container */}
<div className="relative h-60 flex flex-col overflow-hidden" style={{ background: l.bg }}>
  
  {/* 1. BACKGROUND DECORATION (Circles) */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
     <motion.div animate={{ rotate: 360 }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
       className="absolute w-48 h-48 rounded-full border-2 border-dashed opacity-20"
       style={{ borderColor: l.color }} />
  </div>

  {/* 3. TAG (Positioned top-left) */}
  <div className="relative z-30 p-4 h-12 flex items-start">
    <div className="px-3 py-1 rounded-full text-[9px] font-black tracking-widest text-white shadow-sm"
      style={{ background: l.color }}>
      {l.tag}
    </div>
  </div>

  {/* 2. IMAGE AREA (This takes up all space ABOVE the stats) */}
  <div className="relative z-10 w-full h-36 flex items-center justify-center px-4">
    {l.customIcon ? (
      <img 
        src={l.customIcon} 
        alt={l.name} 
        // max-h-full ensures it stops growing before hitting the stats bar
        className="h-full w-auto object-contain pointer-events-none drop-shadow-2xl" 
        style={{ filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.15))" }}
      />
    ) : (
      <div className="text-6xl">{l.emoji}</div>
    )}
  </div>

  

  {/* 4. STATS STRIP (Locked to the bottom) */}
  <div className="relative z-20 mt-auto h-12 flex bg-white/95 backdrop-blur-md border-t border-black/5">
    {[{ v: l.modules, l: "Modules" }, { v: l.lessons, l: "Lessons" }, { v: l.projects, l: "Projects" }].map((s, si) => (
      <div key={si} className="flex-1 flex flex-col items-center justify-center">
        <div className="font-black text-[12px] leading-none" style={{ color: l.textColor }}>{s.v}</div>
        <div className="text-[8px] font-semibold text-slate-400 uppercase tracking-tighter mt-0.5">{s.l}</div>
      </div>
    ))}
  </div>
</div>

      {/* Body Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-black text-lg" style={{ color:T.ink }}>{l.name}</h3>
          <span className="text-[10px] font-bold px-2 py-1 rounded-lg"
            style={{ background:`${l.color}15`, color:l.textColor }}>{l.age}</span>
        </div>
        <p className="text-xs font-bold mb-2" style={{ color:l.textColor }}>{l.tagline}</p>
        <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow">{l.desc}</p>
       

        <div className="flex flex-wrap gap-2 mb-5">
          {l.tools.map((t,ti)=>(
            <span key={ti} className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white border"
              style={{ borderColor:l.border, color:l.textColor }}>{t}</span>
          ))}
        </div>

        <a href="https://wa.link/5pk793"
          className="flex justify-center items-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all duration-300"
          style={{ background:l.color, boxShadow:`0 6px 20px ${l.glow}` }}>
          <Sparkles className="w-4 h-4" /> Enrol Now
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </motion.div>
  </motion.div>
);

const SubjectSection = () => (
  <section id="curriculum" className="py-5 relative overflow-hidden" style={{ background:T.bg }}>
    {/* Live background */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 opacity-25"
        style={{ backgroundImage:"radial-gradient(circle at 1px 1px, rgba(16,185,129,0.14) 1px, transparent 0)", backgroundSize:"36px 36px" }} />
      {[
        { c:T.green, x:"-5%", y:"-8%", s:"42vw", dur:18 },
        { c:T.sky, right:true, y:"15%", s:"36vw", dur:22 },
        { c:T.yellow, x:"25%", y:"70%", s:"28vw", dur:16 },
        { c:T.pink, right:true, bottom:true, s:"30vw", dur:20 },
      ].map((o,i)=>(
        <motion.div key={i} animate={{ scale:[1,1.18,1] }} transition={{ duration:o.dur,repeat:Infinity,ease:"easeInOut" }}
          className="absolute rounded-full"
          style={{ width:o.s,height:o.s, left:o.right?"auto":o.x, right:o.right?"-5%":undefined,
            top:o.bottom?"auto":o.y, bottom:o.bottom?"-5%":undefined,
            background:`radial-gradient(circle, ${o.c}12 0%, transparent 70%)`, filter:"blur(48px)" }} />
      ))}
      {/* Floating code pills */}
      {[
        { text:"repeat(10)",top:"8%",left:"3%",c:T.green },
        { text:"if x > 5:",top:"22%",right:"3%",c:T.sky },
        { text:"for i in range:",bottom:"18%",left:"2%",c:T.purple },
        { text:"print('Hello!')",bottom:"10%",right:"2%",c:T.yellow },
      ].map((c,i)=>(
        <motion.div key={i} animate={{ y:[0,-18,0],opacity:[0.6,1,0.6] }}
          transition={{ duration:6+i*1.2,repeat:Infinity,delay:i*0.8 }}
          className="absolute font-mono text-xs font-bold px-3 py-1.5 rounded-xl bg-white/70 backdrop-blur-sm border"
          style={{ top:c.top,left:c.left,right:c.right,bottom:c.bottom,
            borderColor:`${c.c}25`,color:c.c,boxShadow:`0 4px 12px ${c.c}15` }}>{c.text}</motion.div>
      ))}
      {/* Sparkles */}

    </div>

    {/* Floating kid images (background-removed PNGs) */}
    <FloatKid src="/images/kids/float-kid-1.png" emoji=""
      style={{ width:110,height:150,top:"12%",right:"1.5%" }} delay={0} />
    <FloatKid src="/images/kids/float-kid-2.png" emoji=""
      style={{ width:90,height:130,bottom:"14%",left:"0.5%" }} delay={1.5} />
    <FloatKid src="/images/kids/float-star.png" emoji=""
      style={{ width:65,height:65,top:"35%",left:"0.5%" }} delay={0.8} />

    <div className="md :max-w-[80%] sm:max-w-[90%] mx-auto px-6 relative z-10">
      {/* Header */}
      <div className="text-center mb-20">
        <motion.h2 initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
          transition={{ delay:0.1 }} className="font-black mb-5 tracking-tight leading-none"
          style={{ fontSize:"clamp(2.4rem,5vw,3.8rem)",color:T.ink,letterSpacing:"-0.04em" }}>
          Every child learns<br/>
          <span style={{ background:`linear-gradient(135deg,${T.sky},${T.green})`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
            at their own pace
          </span>
        </motion.h2>
        <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:0.2 }}
          className="text-slate-500 max-w-2xl mx-auto text-base font-medium mb-8">
            From school academics to coding and career-focused courses, Pearlx helps learners build knowledge, confidence, and future-ready skills through expert guidance and personalized support.
          </motion.p>
        {/* Stats row */}
        {/* <motion.div initial={{ opacity:0,y:12 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
          transition={{ delay:0.3 }} className="flex flex-wrap justify-center gap-3">
          {[
            { icon:"Users",v:"500+",l:"Students Taught",c:T.green },
            { icon:"Zap",v:"132",l:"Total Lessons",c:T.sky },
            { icon:"Trophy",v:"4 Levels",l:"Structured Path",c:T.yellow },
            { icon:"Heart",v:"4.9",l:"Parent Rating",c:T.pink },
          ].map((s,i)=>(
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border"
              style={{ borderColor:`${s.c}30`,boxShadow:`0 4px 12px ${s.c}15` }}>
              <span className="flex items-center justify-center">
              {(() => { const I = STAT_ICON_MAP[s.icon]; return I ? <I className="w-4 h-4" style={{ color: s.c }} /> : null; })()}
            </span>
              <span className="font-black text-sm" style={{ color:T.ink }}>{s.v}</span>
              <span className="text-xs font-medium text-slate-400">{s.l}</span>
            </div>
          ))}
        </motion.div> */}
      </div>

      {/* Level Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-20">
        {LEVELS.map((l,i)=><LevelCard key={i} l={l} i={i} />)}
      </div>

      {/* Journey Promise Strip */}
      <motion.div initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
        className="rounded-[2.5rem] overflow-hidden relative border-2"
        style={{ borderColor:"rgba(16,185,129,0.2)",boxShadow:"0 20px 60px rgba(16,185,129,0.08)" }}>
        <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,#F0FFFE,#E0F2FE,#F5F3FF)" }} />
        <div className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background:`linear-gradient(90deg,${T.yellow},${T.green},${T.sky},${T.purple})` }} />
        <div className="relative z-10 p-10 lg:p-14">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2">
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color:T.green }}>The Pearlx Promise</p>
              <h3 className="font-black text-2xl mb-4" style={{ color:T.ink,letterSpacing:"-0.03em" }}>
                Logic-first. Always.
              </h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                We never rush kids to text coding before they're ready. Block coding isn't a shortcut — it's the foundation.
                When children finally transition to Python or JavaScript, it feels <strong style={{ color:T.ink }}>natural, not scary.</strong>
              </p>
              <div className="flex gap-3 flex-wrap">
                <a href="https://wa.link/2sqe3g"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white"
                  style={{ background:`linear-gradient(135deg,${T.green},${T.sky})`,boxShadow:"0 6px 24px rgba(16,185,129,0.3)" }}>
                  Book Free Trial <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#curriculum"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm border-2"
                  style={{ borderColor:"rgba(16,185,129,0.3)",color:T.green,background:"rgba(16,185,129,0.06)" }}>
                  See Full Curriculum
                </a>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              {[
                { label:"Block to Scratch",desc:"Ages 5–11 transition" },
                { label:"Scratch to Python",desc:"Ages 8–15 transition" },
                { label:"Board Excellence",desc:"Class 6–12 focused" },
                { label:"Grand Showcase",desc:"Every level's finale" },
              ].map((item,i)=>(
                <motion.div key={i} whileHover={{ scale:1.04 }}
                  className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 text-center"
                  style={{ boxShadow:"0 4px 16px rgba(0,0,0,0.04)" }}>
                  
                  <div className="font-bold text-sm" style={{ color:T.ink }}>{item.label}</div>
                  <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default SubjectSection;