// src/components/ProcessSection.jsx — REDESIGNED FROM SCRATCH
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const T = { bg:"#ffffff", ink:"#0F172A", green:"#10B981", sky:"#0EA5E9",
  yellow:"#FFD166", pink:"#FF6B9D", purple:"#A78BFA" };

const STEPS = [
  {
    n:"01", emoji:"🎯", t:"Free Trial Class",
    d:"Book your free 30-min trial — no payment, no pressure. We understand your child's grade, interest, and pace.",
    color:T.green, glow:"rgba(16,185,129,0.22)",
    bubbles:["Zero risk","30 min demo","Expert teacher"],
    kidImg:"/images/kids/step-trial-kid.png",
  },
  {
    n:"02", emoji:"🧠", t:"Logic with Blocks",
    d:"Block-based coding builds solid mental models without syntax frustration. Every child starts here — no exceptions.",
    color:T.sky, glow:"rgba(14,165,233,0.22)",
    bubbles:["Visual coding","No typing","Fun stories"],
    kidImg:"/images/kids/step-block-kid.png",
  },
  {
    n:"03", emoji:"🔨", t:"Build Real Projects",
    d:"Students apply concepts immediately — building games, apps, and websites they're genuinely proud of showing friends.",
    color:T.purple, glow:"rgba(167,139,250,0.22)",
    bubbles:["Games","Apps","Websites"],
    kidImg:"/images/kids/step-project-kid.png",
  },
  {
    n:"04", emoji:"🚀", t:"Text Code Mastery",
    d:"Only when truly ready — Python, HTML, CSS, JavaScript. The leap feels natural, never forced. Confidence is built in.",
    color:T.pink, glow:"rgba(255,107,157,0.22)",
    bubbles:["Python","JavaScript","Real syntax"],
    kidImg:"/images/kids/step-code-kid.png",
  },
  {
    n:"05", emoji:"🏆", t:"Grand Showcase",
    d:"Every level ends in a Showcase — students present to parents and peers. Real certificates. Real pride. Real memories.",
    color:T.yellow, glow:"rgba(255,209,102,0.25)",
    bubbles:["Capstone","Certificate","Parent event"],
    kidImg:"/images/kids/step-showcase-kid.png",
  },
];

const PILLARS = [
  { icon:"🧩", title:"Project-Based", desc:"Every concept is applied immediately to a real project — not just drills." },
  { icon:"🎮", title:"Gamified", desc:"Points, badges, and level-up moments keep kids motivated week after week." },
  { icon:"👨‍🏫", title:"Expert Teachers", desc:"Friendly, patient instructors trained specifically to teach kids to code." },
  { icon:"📊", title:"Progress Reports", desc:"Weekly progress updates sent to parents — always in the loop." },
  { icon:"🔁", title:"Unlimited Revision", desc:"Kids can revisit any concept anytime — no one gets left behind." },
  { icon:"🌐", title:"Live Online", desc:"Interactive live sessions, not pre-recorded. Real human connection." },
];

/* Floating background-removed image helper */
const FloatImg = ({ src, emoji, style, delay=0 }) => (
  <motion.div animate={{ y:[0,-12,0],rotate:[-1,1,-1] }}
    transition={{ duration:5+delay,repeat:Infinity,ease:"easeInOut",delay }}
    className="absolute pointer-events-none select-none" style={style}>
    <img src={src} alt="" style={{ width:"100%",height:"100%",objectFit:"contain",
      filter:"drop-shadow(0 12px 24px rgba(0,0,0,0.12))" }}
      onError={e=>{ e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }} />
    <div style={{ display:"none",width:"100%",height:"100%",alignItems:"center",
      justifyContent:"center",fontSize:"3rem" }}>{emoji}</div>
  </motion.div>
);

const ProcessSection = ({ openDemoModal }) => (
  <section className="relative overflow-hidden" style={{ background:T.bg }}>

    {/* ── HOW IT WORKS ── */}
    <div className="py-28 relative">
      {/* Live background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage:"radial-gradient(circle at 1px 1px, rgba(14,165,233,0.15) 1px, transparent 0)", backgroundSize:"44px 44px" }} />
        <motion.div animate={{ scale:[1,1.15,1],opacity:[0.05,0.12,0.05] }} transition={{ duration:12,repeat:Infinity }}
          className="absolute top-0 left-1/3 w-[55vw] h-[55vw] rounded-full"
          style={{ background:"radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)", filter:"blur(64px)" }} />
        {/* Particle dots */}
        {[...Array(8)].map((_,i)=>(
          <motion.div key={i} className="absolute rounded-full"
            style={{ width:6,height:6,
              background:i%3===0?T.green:i%3===1?T.sky:T.yellow,
              left:`${10+i*11}%`,top:`${20+(i%4)*18}%` }}
            animate={{ y:[0,-40,0],opacity:[0,0.7,0] }}
            transition={{ duration:4+i*0.6,repeat:Infinity,delay:i*0.5 }} />
        ))}
        {/* Floating emojis */}
        {["🐣","💡","⚡","🎯","🌟","🎓"].map((e,i)=>(
          <motion.span key={i} className="absolute select-none"
            style={{ fontSize:20+i*3,left:`${8+i*15}%`,top:`${70+i%3*8}%`,opacity:0.12 }}
            animate={{ y:[0,-25,0],rotate:[0,i%2===0?15:-15,0] }}
            transition={{ duration:6+i,repeat:Infinity,delay:i*0.7 }}>{e}</motion.span>
        ))}
      </div>

      {/* Floating kid images */}
      <FloatImg src="/images/kids/process-kid-thinking.png" emoji="🤔"
        style={{ width:100,height:140,top:"8%",right:"2%",zIndex:1 }} delay={0} />
      <FloatImg src="/images/kids/process-kid-happy.png" emoji="😄"
        style={{ width:90,height:120,bottom:"10%",left:"1%",zIndex:1 }} delay={1.5} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div initial={{ opacity:0,y:-10 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 border"
            style={{ background:"rgba(14,165,233,0.08)",borderColor:"rgba(14,165,233,0.25)",color:T.sky }}>
            <span className="text-xs font-black tracking-widest uppercase">How It Works</span>
          </motion.div>
          <motion.h2 initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
            transition={{ delay:0.1 }} className="font-black mb-5 tracking-tight"
            style={{ fontSize:"clamp(2.2rem,5vw,3.5rem)",color:T.ink,letterSpacing:"-0.04em" }}>
            Our proven{" "}
            <span style={{ background:`linear-gradient(135deg,${T.sky},${T.green})`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
              5-step journey
            </span> 🗺️
          </motion.h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            From complete beginner to confident coder — every step is designed for kids, by experts who love teaching.
          </p>
        </div>

        {/* Steps — alternating layout */}
        <div className="space-y-10 mb-24">
          {STEPS.map((s,i)=>(
            <motion.div key={i}
              initial={{ opacity:0, x:i%2===0?-40:40 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.7,delay:i*0.08 }}
              className={`flex flex-col ${i%2===0?"md:flex-row":"md:flex-row-reverse"} items-center gap-8`}>
              {/* Visual side */}
              <div className="md:w-5/12 relative">
                <div className="relative rounded-[2rem] overflow-hidden border-2 aspect-video"
                  style={{ borderColor:`${s.color}30`,background:`linear-gradient(145deg,${s.color}08,${s.color}18)`,
                    boxShadow:`0 12px 40px ${s.glow}` }}>
                  {/* Pulsing ring */}
                  <motion.div animate={{ scale:[1,1.1,1],opacity:[0.3,0.6,0.3] }}
                    transition={{ duration:3,repeat:Infinity }}
                    className="absolute inset-0 rounded-[1.8rem] border-2"
                    style={{ borderColor:s.color }} />
                  {/* Step number watermark */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black"
                    style={{ fontSize:"clamp(5rem,12vw,9rem)",color:`${s.color}12`,lineHeight:1 }}>{s.n}</div>
                  {/* Kid image (bg-removed) */}
                  <img src={s.kidImg} alt={s.t}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-4/5 object-contain mix-blend-multiply"
                    onError={e=>{e.target.style.display="none";}} />
                  {/* Floating emoji */}
                  <motion.div animate={{ y:[0,-10,0],rotate:[0,10,-10,0] }}
                    transition={{ duration:3,repeat:Infinity }}
                    className="absolute top-4 right-4 text-4xl">{s.emoji}</motion.div>
                  {/* Step label badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-xl text-xs font-black text-white"
                    style={{ background:s.color }}>Step {s.n}</div>
                </div>
              </div>
              {/* Content side */}
              <div className="md:w-7/12 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black text-white"
                    style={{ background:s.color,boxShadow:`0 6px 20px ${s.glow}` }}>{s.emoji}</div>
                  <h3 className="font-black text-xl" style={{ color:T.ink }}>{s.t}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">{s.d}</p>
                <div className="flex flex-wrap gap-2">
                  {s.bubbles.map((b,bi)=>(
                    <div key={bi} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold"
                      style={{ borderColor:`${s.color}35`,color:s.color,background:`${s.color}08` }}>
                      <CheckCircle2 className="w-3 h-3" />{b}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    {/* ── TEACHING PILLARS ── */}
    <div className="py-24 relative" style={{ background:"linear-gradient(160deg,#F0FFFE,#E0F2FE)" }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ rotate:[0,360] }} transition={{ duration:60,repeat:Infinity,ease:"linear" }}
          className="absolute -top-24 -right-24 w-[40vw] h-[40vw] rounded-full border-2 border-dashed"
          style={{ borderColor:"rgba(16,185,129,0.1)" }} />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <motion.h2 initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
            className="font-black text-3xl mb-3" style={{ color:T.ink,letterSpacing:"-0.03em" }}>
            Why kids <span style={{ color:T.green }}>love</span> learning here ❤️
          </motion.h2>
          <p className="text-slate-500 max-w-lg mx-auto">Six teaching principles that make all the difference.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((p,i)=>(
            <motion.div key={i}
              initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
              transition={{ delay:i*0.08 }}
              whileHover={{ y:-10,boxShadow:"0 24px 48px rgba(16,185,129,0.1)" }}
              className="p-7 rounded-[2rem] bg-white border-2 relative overflow-hidden group"
              style={{ borderColor:"rgba(16,185,129,0.1)",boxShadow:"0 4px 20px rgba(0,0,0,0.04)",transition:"all 0.3s" }}>
              <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background:`linear-gradient(90deg,${T.green},${T.sky})` }} />
              <div className="text-4xl mb-4">{p.icon}</div>
              <h4 className="font-black text-base mb-2" style={{ color:T.ink }}>{p.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
          className="text-center mt-14">
          <p className="text-slate-500 mb-4 font-medium">Ready to start the journey? 🚀</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => openDemoModal("process_section_demo")}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white"
              style={{ background:`linear-gradient(135deg,${T.green},${T.sky})`,boxShadow:"0 8px 28px rgba(16,185,129,0.3)" }}>
              Book Free Demo Class <ArrowRight className="w-5 h-5" />
            </button>
            <a href="#curriculum"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold border-2"
              style={{ borderColor:"rgba(16,185,129,0.3)",color:T.green }}>
              View Curriculum
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ProcessSection;