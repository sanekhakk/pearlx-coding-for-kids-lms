// src/components/ServicesSection.jsx — REDESIGNED FROM SCRATCH
import React, { useRef, useMemo, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, TerminalSquare, BookOpenCheck, Laptop, Star, Zap, Users } from "lucide-react";

const T = { bg:"#F8FAFC", ink:"#0F172A", green:"#10B981", sky:"#0EA5E9",
  yellow:"#FFD166", pink:"#FF6B9D", purple:"#A78BFA" };

/* background-removed floating image */
const FloatImg = ({ src, emoji, style, delay=0 }) => (
  <motion.div animate={{ y:[0,-12,0] }} transition={{ duration:5+delay,repeat:Infinity,ease:"easeInOut",delay }}
    className="absolute pointer-events-none select-none" style={style}>
    <img src={src} alt="" style={{ width:"100%",height:"100%",objectFit:"contain",
      filter:"drop-shadow(0 14px 28px rgba(0,0,0,0.13))" }}
      onError={e=>{ e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }} />
    <div style={{ display:"none",width:"100%",height:"100%",alignItems:"center",
      justifyContent:"center" }}></div>
  </motion.div>
);

const OVERVIEW_CARDS = [
  {
    icon:<TerminalSquare size={32} />,
    title:"Kids Coding Classes",
    subtitle:"Ages 5–15 · Block coding → Python",
    badge:"Core Program",
    badgeColor:"#059669",badgeBg:"rgba(16,185,129,0.12)",
    desc:"Project-based coding curriculum across 3 levels. We start with visual block coding to build logic naturally, then transition to text code when kids are truly ready.",
    cta:"Explore Kids Coding",page:"/services/education",
    color:T.green,glow:"rgba(16,185,129,0.2)",
    kidImg:"/images/kids/service-coding-kid.png",
    stats:[{v:"3",l:"Levels"},{v:"132",l:"Lessons"},{v:"500+",l:"Students"}],
    emoji:null,
  },
  {
    icon:<BookOpenCheck size={32} />,
    title:"Academic CS Tuition",
    subtitle:"Classes 6–12 · CBSE / ICSE",
    badge:"School Subject",
    badgeColor:"#0284C7",badgeBg:"rgba(14,165,233,0.12)",
    desc:"Dedicated tuition for CS, Information Practices, Java, Python, and SQL — ensuring top board marks with board-specific strategies and past paper practice.",
    cta:"Explore CS Tuition",page:"/services/education",
    color:T.sky,glow:"rgba(14,165,233,0.2)",
    kidImg:"/images/kids/service-tuition-kid.png",
    stats:[{v:"4",l:"Boards"},{v:"6",l:"Subjects"},{v:"100%",l:"Exam Focus"}],
    emoji:null,
  },
  {
    icon:<Laptop size={32} />,
    title:"Web Dev Services",
    subtitle:"For Brands & Startups",
    badge:"Extra Service",
    badgeColor:"#A07830",badgeBg:"rgba(201,168,76,0.12)",
    desc:"Custom websites designed, developed, and deployed by expert developers — from UI/UX design and React development to ongoing maintenance.",
    cta:"Get Free Quote",page:"/services/web-development",
    color:"#C9A84C",glow:"rgba(201,168,76,0.2)",
    kidImg:"/images/kids/service-webdev-kid.png",
    stats:[{v:"20+",l:"Sites Built"},{v:"100%",l:"Responsive"},{v:"1mo",l:"Support"}],
    emoji:null,
  },
];

const PLANS = [
  {
    emoji:null,name:"Little Pearls",tagline:"Ages 5–7 · Block coding basics",
    color:"#FFD166",colorDeep:"#CC9B2A",border:"rgba(255,209,102,0.35)",
    bg:"rgba(255,209,102,0.07)",
    features:["Visual block coding — no typing needed","Scratch Jr games & animations","Build strong logic naturally","CodiMath — coding meets maths"],
    highlight:false,
    kidImg:"/images/kids/plan-little-kid.png",
  },
  {
    emoji:null,name:"Bright Pearls",tagline:"Ages 8–11 · Blocks → Text code",
    badge:"Most Popular",
    color:"#A78BFA",colorDeep:"#6D28D9",border:"rgba(167,139,250,0.5)",
    bg:"linear-gradient(160deg,#1A1A2E,#1E1528)",
    features:["Advanced Scratch to Python transition","Code.org — build real mobile apps","HTML & CSS — your first website","Collaborative peer learning"],
    highlight:true,
    kidImg:"/images/kids/plan-bright-kid.png",
  },
  {
    emoji:null,name:"Rising Pearls",tagline:"Ages 12–15 · Real text coding",
    color:"#06D6A0",colorDeep:"#047857",border:"rgba(6,214,160,0.35)",
    bg:"rgba(6,214,160,0.07)",
    features:["Python — basics to OOP & projects","Web Dev — HTML, CSS, JavaScript","Publish live websites online","Portfolio-worthy capstone projects"],
    highlight:false,
    kidImg:"/images/kids/plan-rising-kid.png",
  },
  {
    emoji:null,name:"CS Tuition",tagline:"Classes 6–12 · Academics",
    badge:"School Subject",
    color:"#4CC9F0",colorDeep:"#0284C7",border:"rgba(76,201,240,0.35)",
    bg:"rgba(76,201,240,0.07)",
    features:["CBSE, ICSE & State Boards","Computer Science & Info Practices","Java, Python, SQL & DBMS","Exam-focused prep & doubt clearing"],
    highlight:false,
    kidImg:"/images/kids/plan-cs-kid.png",
  },
];

const TESTIMONIALS = [
  { name:"Priya Mehta",role:"Parent of Aarav, 9",text:"Aarav was scared of computers. After just 3 months at Pearlx, he built his first game and couldn't stop showing everyone!",rating:5,avatar:"/images/testimonials/priya.png" },
  { name:"Rohan Sharma",role:"Parent of Diya, 12",text:"Diya's ICSE CS score jumped from 72 to 96 in one term. The teachers here really know how to prepare kids for board exams.",rating:5,avatar:"/images/testimonials/rohan.png" },
  { name:"Anjali Kapoor",role:"Parent of Kabir, 7",text:"My 7-year-old is already making animations on Scratch! The block coding approach is pure genius — no frustration at all.",rating:5,avatar:"/images/testimonials/anjali.png" },
];

export const ServicesOverview = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });
  const codeChars = useMemo(()=>
    Array.from({length:24}).map((_,i)=>({
      char:["{","}","1","0","/",">",";","()","=>","[]","if","for"][i%12],
      left:`${Math.random()*100}%`,delay:Math.random()*5,
      duration:6+Math.random()*10,size:10+Math.random()*18,
    })),[]);

  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background:"#fff" }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage:`linear-gradient(${T.green} 1px,transparent 1px),linear-gradient(90deg,${T.green} 1px,transparent 1px)`,backgroundSize:"44px 44px" }} />
        {codeChars.map((p,i)=>(
          <motion.div key={i} className="absolute font-mono font-bold"
            style={{ left:p.left,fontSize:p.size,top:-40,color:T.green,opacity:0.15 }}
            animate={{ y:["0vh","110vh"],opacity:[0,0.5,0] }}
            transition={{ duration:p.duration,repeat:Infinity,delay:p.delay,ease:"linear" }}>
            {p.char}
          </motion.div>
        ))}
        <motion.div animate={{ scale:[1,1.2,1],opacity:[0.06,0.14,0.06] }} transition={{ duration:10,repeat:Infinity }}
          className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full"
          style={{ background:`radial-gradient(circle,${T.green},transparent 70%)`,filter:"blur(60px)" }} />
      </div>

      {/* Floating kid images */}
      <FloatImg src="/images/kids/overview-kid-1.png" emoji=""
        style={{ width:100,height:140,top:"5%",right:"2%",zIndex:1 }} delay={0} />
      <FloatImg src="/images/kids/overview-kid-2.png" emoji=""
        style={{ width:90,height:125,bottom:"5%",left:"0.5%",zIndex:1 }} delay={1.2} />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
          className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 border"
            style={{ background:`rgba(16,185,129,0.08)`,borderColor:`rgba(16,185,129,0.25)`,color:T.green }}>
            <Zap className="w-4 h-4" />
            <span className="text-xs font-black tracking-widest uppercase">What We Offer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color:T.ink,letterSpacing:"-0.03em" }}>
            Our{" "}
            <span style={{ background:`linear-gradient(135deg,${T.sky},${T.green})`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
              Programs & Services
            </span>
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto font-medium">
            Two powerful pillars: project-based coding for kids, and board-focused CS tuition. Plus web development for brands.
          </p>
        </motion.div>

        <div ref={ref} className="grid md:grid-cols-3 gap-7">
          {OVERVIEW_CARDS.map((c,i)=>(
            <motion.a key={i} href={c.page}
              initial={{ opacity:0,y:30 }} animate={inView?{opacity:1,y:0}:{}}
              transition={{ delay:i*0.1,duration:0.6 }} whileHover={{ y:-12 }}
              className="group bg-white rounded-[2rem] border-2 flex flex-col h-full relative overflow-hidden"
              style={{ borderColor:"rgba(15,23,42,0.06)",boxShadow:"0 4px 24px rgba(0,0,0,0.04)",
                transition:"box-shadow 0.3s,border-color 0.3s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`${c.color}35`;e.currentTarget.style.boxShadow=`0 20px 48px ${c.glow}`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(15,23,42,0.06)";e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.04)";}}>
              {/* Image header */}
              <div className="h-48 relative overflow-hidden flex items-center justify-center"
                style={{ background:`linear-gradient(145deg,${c.color}08,${c.color}18)` }}>
                {/* Animated rings */}
                <motion.div animate={{ rotate:360 }} transition={{ duration:25,repeat:Infinity,ease:"linear" }}
                  className="absolute w-36 h-36 rounded-full border-2 border-dashed"
                  style={{ borderColor:`${c.color}20` }} />
                {/* BG-removed kid image */}
                <img src={c.kidImg} alt={c.title}
                  className="absolute bottom-0 h-40 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  onError={e=>{e.target.style.display="none";}} />
                
                {/* Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black"
                  style={{ background:c.badgeBg,color:c.badgeColor }}>{c.badge}</div>
              </div>
              {/* Content */}
              <div className="p-7 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl" style={{ background:c.badgeBg,color:c.color }}>{c.icon}</div>
                  <div>
                    <h3 className="text-lg font-black" style={{ color:T.ink }}>{c.title}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color:c.color }}>{c.subtitle}</p>
                  </div>
                </div>
                <p className="text-slate-500 mb-5 flex-grow leading-relaxed text-sm">{c.desc}</p>
                {/* Stats mini row */}
                <div className="flex gap-3 mb-5">
                  {c.stats.map((s,si)=>(
                    <div key={si} className="flex-1 text-center px-2 py-2 rounded-xl"
                      style={{ background:`${c.color}08`,border:`1px solid ${c.color}20` }}>
                      <div className="font-black text-sm" style={{ color:c.color }}>{s.v}</div>
                      <div className="text-[9px] text-slate-400 font-semibold uppercase">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all" style={{ color:c.color }}>
                  {c.cta} <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ProgramPlans = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  const [hoveredPlan, setHoveredPlan] = useState(null);

  return (
    <section className="py-28 relative overflow-hidden" style={{ background:"#0D0818" }}>
      {/* Dark background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute left-0 right-0 h-px"
          style={{ background:"rgba(16,185,129,0.2)",boxShadow:"0 0 20px rgba(16,185,129,0.4)" }}
          animate={{ top:["0%","100%"] }} transition={{ duration:10,repeat:Infinity,ease:"linear" }} />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage:"radial-gradient(circle at 2px 2px, #A78BFA 1px, transparent 0)",backgroundSize:"40px 40px" }} />
        {/* Corner glow orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full"
          style={{ background:"radial-gradient(circle,rgba(167,139,250,0.12),transparent 70%)",filter:"blur(60px)" }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
          style={{ background:"radial-gradient(circle,rgba(16,185,129,0.1),transparent 70%)",filter:"blur(60px)" }} />
      </div>

      {/* Floating kid images on dark bg */}
      <motion.div animate={{ y:[0,-14,0] }} transition={{ duration:6,repeat:Infinity }}
        className="absolute top-12 right-4 pointer-events-none select-none" style={{ zIndex:1 }}>
        <img src="/images/kids/plan-float-kid.png" alt=""
          style={{ width:110,height:150,objectFit:"contain",filter:"drop-shadow(0 8px 24px rgba(167,139,250,0.4))" }}
          onError={e=>{e.target.style.display="none";}} />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-black tracking-widest uppercase mb-3 text-purple-400">Our Programs</p>
          <h2 className="font-black text-white text-4xl md:text-5xl mb-4" style={{ letterSpacing:"-0.03em" }}>
            Pick your{" "}
            <span style={{ background:"linear-gradient(135deg,#A78BFA,#10B981)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
              learning path
            </span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto font-medium">
            Every path is structured, every step is purposeful. Start anywhere — grow everywhere.
          </p>
        </div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((p,i)=>(
            <motion.div key={i}
              initial={{ opacity:0,y:40 }} animate={inView?{opacity:1,y:0}:{}} transition={{ delay:i*0.1 }}
              whileHover={{ y:-14,scale:1.02 }}
              onMouseEnter={()=>setHoveredPlan(i)} onMouseLeave={()=>setHoveredPlan(null)}
              className="relative rounded-[2.5rem] p-7 border-2 flex flex-col group overflow-hidden"
              style={{ background:p.bg,borderColor:p.border,
                boxShadow:hoveredPlan===i?`0 28px 56px ${p.color}30`:"none",transition:"all 0.3s" }}>
              {p.badge && (
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[9px] font-black text-white"
                  style={{ background:p.color }}>{p.badge}</div>
              )}
              {/* Kid image float */}
              <div className="h-28 relative mb-4 overflow-hidden rounded-2xl"
                style={{ background:`${p.color}12` }}>
                <img src={p.kidImg} alt={p.name}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full object-contain mix-blend-multiply"
                  onError={e=>{e.target.style.display="none";}} />
                
              </div>

              <div className="relative z-10 flex flex-col flex-grow">
                <h3 className="font-black text-xl text-white mb-1">{p.name}</h3>
                <p className="text-[10px] font-black uppercase mb-5" style={{ color:p.color }}>{p.tagline}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f,fi)=>(
                    <li key={fi} className="flex items-start gap-2.5 text-xs text-white/60">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color:p.color }} />{f}
                    </li>
                  ))}
                </ul>
                <a href="https://wa.link/2sqe3g"
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all"
                  style={{ background:p.highlight?p.color:`${p.color}18`,color:p.highlight?"#000":p.color }}>
                  Enrol Now <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <h3 className="text-white font-black text-2xl text-center mb-10">What parents say</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t,i)=>(
              <motion.div key={i}
                initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
                transition={{ delay:i*0.1 }}
                className="p-6 rounded-[1.5rem] border relative overflow-hidden"
                style={{ background:"rgba(255,255,255,0.04)",borderColor:"rgba(255,255,255,0.08)" }}>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({length: t.rating}).map((_,ri) => <Star key={ri} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border"
                    style={{ borderColor:"rgba(16,185,129,0.3)",background:"rgba(16,185,129,0.1)" }}>
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover"
                      onError={e=>{e.target.style.display="none";}} />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;