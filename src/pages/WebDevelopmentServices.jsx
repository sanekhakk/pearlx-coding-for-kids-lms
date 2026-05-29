// src/pages/WebDevelopmentServices.jsx — REDESIGNED FROM SCRATCH
import { motion } from "framer-motion";
import { Layout, Code, Rocket, Shield, Globe, Zap, ArrowRight, Check, ExternalLink, Star, Palette, Monitor, ShoppingCart, Wrench, Settings, Mail, Trophy, Target, CheckCircle2, Cpu } from "lucide-react";

const T = { bg:"#F0FFFE",ink:"#0F172A",green:"#10B981",sky:"#0EA5E9",
  yellow:"#FFD166",pink:"#FF6B9D",purple:"#A78BFA",gold:"#C9A84C" };

const SERVICES = [
  { icon:Layout,title:"UI / UX Design",ServiceIcon:Palette,color:T.gold,
    desc:"Clean, conversion-focused designs built around your users and brand identity. Wireframes, prototypes, and a complete brand kit.",
    tags:["Wireframes","Prototypes","Brand Kit"],
    img:"/images/webdev/ui-ux.png",
  },
  { icon:Code,title:"Website Development",ServiceIcon:Monitor,color:T.green,
    desc:"React, Next.js, Node.js — fast, scalable, and beautifully crafted. From landing pages to complex web apps.",
    tags:["React","Node.js","Custom CMS"],
    img:"/images/webdev/development.png",
  },
  { icon:Rocket,title:"Deployment & SEO",ServiceIcon:Rocket,color:T.purple,
    desc:"Domain, hosting, SSL, Google Search Console, and on-page SEO — fully handled so you rank on Google.",
    tags:["Domain Setup","SSL","Google SEO"],
    img:"/images/webdev/seo.png",
  },
  { icon:Shield,title:"Maintenance",ServiceIcon:Wrench,color:"#B87333",
    desc:"Ongoing updates, security patches, performance monitoring, and reliable post-launch support included.",
    tags:["Security","Updates","Monitoring"],
    img:"/images/webdev/maintenance.png",
  },
  { icon:Globe,title:"E-commerce Stores",ServiceIcon:ShoppingCart,color:T.pink,
    desc:"Full shopping experiences with product management, payment gateways, and powerful admin panels.",
    tags:["Payments","Inventory","Admin"],
    img:"/images/webdev/ecommerce.png",
  },
  { icon:Zap,title:"Web Applications",ServiceIcon:Cpu,color:T.sky,
    desc:"Custom dashboards, portals, and SaaS tools — whatever your business needs, built at scale.",
    tags:["Dashboard","SaaS","Portal"],
    img:"/images/webdev/webapp.png",
  },
];

const PROCESS = [
  {step:"01",title:"Discovery Call",desc:"We understand your goals, brand, audience, and timeline — no jargon, just clarity.",PIcon:Target,color:T.gold},
  {step:"02",title:"Design Proposal",desc:"Full wireframes, moodboard, and interactive UI prototype delivered in 5 business days.",PIcon:Palette,color:T.green},
  {step:"03",title:"Development",desc:"We build with clean, maintainable code — React, Node.js, or whatever fits best.",PIcon:Code,color:T.sky},
  {step:"04",title:"Review & Revise",desc:"Two full revision rounds included. We refine until you're 100% happy.",PIcon:CheckCircle2,color:T.purple},
  {step:"05",title:"Launch & Handover",desc:"Go live with SEO setup, analytics, and complete source code handover.",PIcon:Rocket,color:T.pink},
];

const INCLUDED = [
  "Mobile-responsive design","SSL certificate setup","Domain & hosting guidance",
  "Google Search Console","Basic on-page SEO","Source code handover",
  "1 month post-launch support","2 revision rounds included",
];

const PACKAGES = [
  { name:"Starter",price:"₹14,999",PkgIcon:Rocket,color:T.gold,
    desc:"Perfect for personal brands and small businesses.",
    features:["Up to 5 pages","Mobile responsive","Contact form","Basic SEO","1-month support"],
  },
  { name:"Business Pro",price:"₹29,999",PkgIcon:Trophy,badge:"Most Popular",color:T.green,
    desc:"Full-featured site for growing businesses.",
    features:["Up to 12 pages","Custom UI/UX","CMS admin panel","Google SEO setup","Blog/News section","3-month support"],
  },
  { name:"E-commerce",price:"₹49,999",PkgIcon:ShoppingCart,color:T.sky,
    desc:"Complete shopping experience with all features.",
    features:["Unlimited products","Payment gateway","Order management","Inventory tracking","Customer portal","6-month support"],
  },
];

const PORTFOLIO = [
  {title:"EdTech Platform",cat:"Education",color:T.sky,PIcon:Globe,img:"/images/portfolio/edtech.png"},
  {title:"Restaurant Website",cat:"F&B",color:T.gold,PIcon:Star,img:"/images/portfolio/restaurant.png"},
  {title:"Fashion Store",cat:"E-commerce",color:T.pink,PIcon:ShoppingCart,img:"/images/portfolio/fashion.png"},
  {title:"SaaS Dashboard",cat:"Technology",color:T.purple,PIcon:Zap,img:"/images/portfolio/saas.png"},
  {title:"Portfolio Site",cat:"Personal Brand",color:T.green,PIcon:Palette,img:"/images/portfolio/portfolio.png"},
  {title:"Fitness App",cat:"Health & Wellness",color:"#FF6B35",PIcon:Trophy,img:"/images/portfolio/fitness.png"},
];

const TECH_STACK = [
  {name:"React",TIcon:Zap,color:T.sky},{name:"Next.js",TIcon:Globe,color:"#000"},
  {name:"Node.js",TIcon:Settings,color:T.green},{name:"MongoDB",TIcon:Shield,color:"#4DB33D"},
  {name:"Tailwind",TIcon:Layout,color:T.sky},{name:"Figma",TIcon:Palette,color:T.purple},
  {name:"Vercel",TIcon:Rocket,color:"#000"},{name:"Firebase",TIcon:Zap,color:T.yellow},
];

/* BG-removed floating image */
const FloatImg = ({src,FallbackIcon,color,style,delay=0}) => (
  <motion.div animate={{y:[0,-12,0],rotate:[-1,1,-1]}}
    transition={{duration:5+delay,repeat:Infinity,ease:"easeInOut",delay}}
    className="absolute pointer-events-none select-none" style={style}>
    <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"contain",
      filter:"drop-shadow(0 14px 28px rgba(0,0,0,0.13))"}}
      onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}} />
    <div style={{display:"none",width:"100%",height:"100%",alignItems:"center",
      justifyContent:"center"}}>
      {FallbackIcon && <FallbackIcon style={{width:"60%",height:"60%",color:color||"#94a3b8"}} />}
    </div>
  </motion.div>
);

const WebDevelopmentServices = () => (
  <section className="min-h-screen relative overflow-hidden" style={{background:T.bg}}>
    {/* Live background */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 opacity-20"
        style={{backgroundImage:"radial-gradient(circle at 1px 1px, rgba(201,168,76,0.14) 1px, transparent 0)",backgroundSize:"44px 44px"}} />
      {[{c:T.gold,x:"-5%",y:"-5%",s:"38vw",dur:20},
        {c:T.green,right:true,y:"20%",s:"32vw",dur:18},
        {c:T.sky,x:"20%",y:"75%",s:"28vw",dur:15}].map((o,i)=>(
        <motion.div key={i} animate={{scale:[1,1.18,1]}} transition={{duration:o.dur,repeat:Infinity,ease:"easeInOut"}}
          className="absolute rounded-full"
          style={{width:o.s,height:o.s,left:o.right?"auto":o.x,right:o.right?"-5%":undefined,
            top:o.y,background:`radial-gradient(circle,${o.c}12 0%,transparent 70%)`,filter:"blur(50px)"}} />
      ))}
      {/* Floating web elements */}
      {[{t:"<div>",top:"8%",left:"3%",c:T.sky},{t:"const app = React",top:"20%",right:"2%",c:T.green},
        {t:"margin: auto",bottom:"18%",left:"2%",c:T.purple},{t:"SELECT * FROM",bottom:"8%",right:"2%",c:T.gold},
        {t:"npm start",top:"45%",left:"1%",c:T.pink}].map((c,i)=>(
        <motion.div key={i} animate={{y:[0,-16,0],opacity:[0.6,1,0.6]}}
          transition={{duration:7+i,repeat:Infinity,delay:i*0.9}}
          className="absolute font-mono text-xs font-bold px-3 py-1.5 rounded-xl bg-white/70 backdrop-blur-sm border"
          style={{top:c.top,left:c.left,right:c.right,bottom:c.bottom,
            borderColor:`${c.c}25`,color:c.c}}>{c.t}</motion.div>
      ))}
    </div>

    {/* Floating dev-themed images */}
    <FloatImg src="/images/webdev/float-laptop.png" FallbackIcon={Monitor} color={T.sky}
      style={{width:130,height:110,top:"12%",right:"1.5%",zIndex:1}} delay={0} />
    <FloatImg src="/images/webdev/float-design.png" FallbackIcon={Palette} color={T.gold}
      style={{width:100,height:100,bottom:"20%",left:"0.5%",zIndex:1}} delay={1.5} />
    <FloatImg src="/images/webdev/float-rocket.png" FallbackIcon={Rocket} color={T.purple}
      style={{width:70,height:70,top:"42%",right:"1%",zIndex:1}} delay={0.8} />

    <div className="max-w-7xl mx-auto px-6 py-50 relative z-10">

      {/* ── HERO ── */}
      <div className="text-center mb-20">
        <motion.div initial={{opacity:0,y:-12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 border"
          style={{background:"rgba(201,168,76,0.08)",borderColor:"rgba(201,168,76,0.3)",color:T.gold}}>
          <Globe className="w-4 h-4" />
          <span className="text-xs font-black tracking-widest uppercase">Web Development Services</span>
        </motion.div>
        <motion.h1 initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          transition={{delay:0.1}} className="font-black mb-5 tracking-tight leading-none"
          style={{fontSize:"clamp(2.4rem,6vw,4.2rem)",color:T.ink,letterSpacing:"-0.04em"}}>
          Websites that<br/>
          <span style={{background:`linear-gradient(135deg,${T.gold},${T.green})`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
            work hard for you
          </span>
        </motion.h1>
        <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}
          transition={{delay:0.2}} className="text-slate-500 max-w-2xl mx-auto text-lg font-medium mb-8">
          Custom websites and web apps designed, developed, and deployed by expert developers.
          From UI/UX to ongoing maintenance — we handle everything.
        </motion.p>
        {/* Stats */}
        <motion.div initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          transition={{delay:0.3}} className="flex flex-wrap justify-center gap-4 mb-8">
          {[{SIcon:Star,v:"20+",l:"Sites Built",c:T.gold},{SIcon:Zap,v:"7 days",l:"Avg Design Time",c:T.sky},
            {SIcon:CheckCircle2,v:"100%",l:"Mobile Ready",c:T.green},{SIcon:Shield,v:"1 mo",l:"Free Support",c:T.purple}].map((s,i)=>(
            <div key={i} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border"
              style={{borderColor:`${s.c}30`,boxShadow:`0 4px 16px ${s.c}15`}}>
              <s.SIcon className="w-4 h-4" style={{color:s.c}} />
              <span className="font-black text-sm" style={{color:T.ink}}>{s.v}</span>
              <span className="text-xs text-slate-400 font-medium">{s.l}</span>
            </div>
          ))}
        </motion.div>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="https://wa.link/2sqe3g"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white"
            style={{background:`linear-gradient(135deg,${T.gold},#8B6914)`,boxShadow:`0 8px 32px ${T.gold}40`}}>
            <Target className="w-5 h-5" /> Get Free Quote <ArrowRight className="w-5 h-5" />
          </a>
          <a href="#portfolio"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold border-2"
            style={{borderColor:"rgba(201,168,76,0.35)",color:T.gold,background:"rgba(201,168,76,0.06)"}}>
            View Our Work <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* ── SERVICES GRID ── */}
      <div className="mb-24">
        <motion.h2 initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="font-black text-3xl mb-10 text-center" style={{color:T.ink,letterSpacing:"-0.03em"}}>
          What We Build
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {SERVICES.map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.08}}
              whileHover={{y:-12}}
              className="bg-white rounded-[2rem] border-2 overflow-hidden group"
              style={{borderColor:"rgba(15,23,42,0.06)",boxShadow:"0 4px 24px rgba(0,0,0,0.04)",transition:"all 0.3s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`${s.color}35`;e.currentTarget.style.boxShadow=`0 20px 48px ${s.color}18`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(15,23,42,0.06)";e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.04)";}}>
              {/* Image area */}
              <div className="h-44 relative overflow-hidden flex items-center justify-center"
                style={{background:`linear-gradient(145deg,${s.color}08,${s.color}18)`}}>
                <motion.div animate={{rotate:360}} transition={{duration:30,repeat:Infinity,ease:"linear"}}
                  className="absolute w-40 h-40 rounded-full border-2 border-dashed"
                  style={{borderColor:`${s.color}20`}} />
                {/* BG-removed service image */}
                <img src={s.img} alt={s.title}
                  className="absolute h-36 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  onError={e=>{e.target.style.display="none";}} />
                <span className="text-5xl relative z-10 opacity-20"><s.ServiceIcon className="w-10 h-10" style={{color:s.color}} /></span>
                {/* Icon badge */}
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{background:`${s.color}15`,border:`1px solid ${s.color}25`}}>
                  <s.icon className="w-5 h-5" style={{color:s.color}} />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:`${s.color}15`}}>
                    <s.ServiceIcon className="w-4 h-4" style={{color:s.color}} />
                  </div>
                  <h3 className="font-black text-base" style={{color:T.ink}}>{s.title}</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map((t,ti)=>(
                    <span key={ti} className="text-[10px] font-bold px-2.5 py-1 rounded-xl"
                      style={{background:`${s.color}10`,color:s.color,border:`1px solid ${s.color}25`}}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── PACKAGES ── */}
      <div className="mb-24">
        <motion.h2 initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="font-black text-3xl mb-3 text-center" style={{color:T.ink,letterSpacing:"-0.03em"}}>
          Pricing Packages
        </motion.h2>
        <p className="text-center text-slate-500 mb-10">Transparent pricing, no surprises. Custom quotes available.</p>
        <div className="grid sm:grid-cols-3 gap-7">
          {PACKAGES.map((pkg,i)=>(
            <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.1}}
              whileHover={{y:-12}}
              className="p-8 rounded-[2rem] border-2 bg-white relative overflow-hidden"
              style={{borderColor:`${pkg.color}35`,boxShadow:`0 8px 32px ${pkg.color}12`}}>
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{background:pkg.color}} />
              {pkg.badge && (
                <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full text-[9px] font-black text-white"
                  style={{background:pkg.color}}>{pkg.badge}</div>
              )}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{background:`${pkg.color}15`}}>
                <pkg.PkgIcon className="w-7 h-7" style={{color:pkg.color}} />
              </div>
              <h3 className="font-black text-xl mb-1" style={{color:T.ink}}>{pkg.name}</h3>
              <div className="font-black text-3xl mb-2" style={{color:pkg.color}}>{pkg.price}</div>
              <p className="text-sm text-slate-500 mb-5 leading-relaxed">{pkg.desc}</p>
              <ul className="space-y-2.5 mb-6">
                {pkg.features.map((f,fi)=>(
                  <li key={fi} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 flex-shrink-0" style={{color:pkg.color}} />{f}
                  </li>
                ))}
              </ul>
              <a href="https://wa.link/2sqe3g"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-white"
                style={{background:pkg.color,boxShadow:`0 6px 20px ${pkg.color}35`}}>
                Get This Package <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* What's included strip */}
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="mt-8 p-7 rounded-[2rem] border-2 bg-white"
          style={{borderColor:"rgba(16,185,129,0.2)",boxShadow:"0 4px 20px rgba(16,185,129,0.06)"}}>
          <p className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{color:T.green}}><Check className="w-3.5 h-3.5" /> Always included in every package</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {INCLUDED.map((w,wi)=>(
              <div key={wi} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 flex-shrink-0" style={{color:T.green}} />{w}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── PROCESS ── */}
      <div className="mb-24">
        <motion.h2 initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="font-black text-3xl mb-10 text-center" style={{color:T.ink,letterSpacing:"-0.03em"}}>
          How We Work
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 relative">
          {/* Connecting line */}
          <div className="absolute top-10 left-[10%] right-[10%] h-px hidden lg:block"
            style={{background:`linear-gradient(90deg,${T.gold},${T.green},${T.sky},${T.purple},${T.pink})`,opacity:0.3}} />
          {PROCESS.map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.1}}
              whileHover={{y:-10}}
              className="text-center p-6 rounded-[1.8rem] bg-white border-2 group"
              style={{borderColor:"rgba(15,23,42,0.06)",boxShadow:"0 4px 20px rgba(0,0,0,0.04)",transition:"all 0.3s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`${s.color}35`;e.currentTarget.style.boxShadow=`0 20px 40px ${s.color}18`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(15,23,42,0.06)";e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.04)";}}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-b-full"
                style={{background:s.color,opacity:0,filter:"blur(4px)"}} />
              <motion.div whileHover={{scale:1.15,rotate:8}} transition={{duration:0.2}}
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-4 text-white"
                style={{background:`linear-gradient(135deg,${s.color},${s.color}aa)`,boxShadow:`0 6px 20px ${s.color}35`}}>
                <s.PIcon className="w-5 h-5 text-white" />
              </motion.div>
              <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{color:s.color}}>Step {s.step}</div>
              <h4 className="font-black text-sm mb-2" style={{color:T.ink}}>{s.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── PORTFOLIO ── */}
      <div id="portfolio" className="mb-24">
        <motion.h2 initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="font-black text-3xl mb-10 text-center" style={{color:T.ink,letterSpacing:"-0.03em"}}>
          Recent Work
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTFOLIO.map((p,i)=>(
            <motion.div key={i} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.07}}
              whileHover={{y:-8,scale:1.02}}
              className="rounded-[1.8rem] overflow-hidden border-2 group"
              style={{borderColor:`${p.color}25`,boxShadow:`0 6px 24px ${p.color}10`}}>
              <div className="h-48 relative overflow-hidden flex items-center justify-center"
                style={{background:`linear-gradient(145deg,${p.color}08,${p.color}18)`}}>
                <img src={p.img} alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500"
                  onError={e=>{e.target.style.display="none";}} />
                <p.PIcon className="w-12 h-12 relative z-10 opacity-30" style={{color:p.color}} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4" style={{color:p.color}} />
                </div>
              </div>
              <div className="p-5 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm" style={{color:T.ink}}>{p.title}</h4>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{background:`${p.color}12`,color:p.color}}>{p.cat}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── TECH STACK ── */}
      <div className="mb-24">
        <motion.h2 initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="font-black text-3xl mb-10 text-center" style={{color:T.ink,letterSpacing:"-0.03em"}}>
          Tech Stack
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-4">
          {TECH_STACK.map((t,i)=>(
            <motion.div key={i} initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}}
              viewport={{once:true}} transition={{delay:i*0.06}}
              whileHover={{y:-6,scale:1.08}}
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white border-2"
              style={{borderColor:"rgba(15,23,42,0.08)",boxShadow:"0 4px 16px rgba(0,0,0,0.04)"}}>
              <t.TIcon className="w-5 h-5" style={{color:t.color}} />
              <span className="font-black text-sm" style={{color:T.ink}}>{t.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA STRIP ── */}
      <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
        className="rounded-[2.5rem] overflow-hidden border-2 relative"
        style={{borderColor:"rgba(201,168,76,0.3)",boxShadow:"0 20px 64px rgba(201,168,76,0.12)"}}>
        <div className="absolute inset-0" style={{background:"linear-gradient(135deg,#FFFDF5,#F0FFF9,#F9F5FF)"}} />
        <div className="absolute top-0 left-0 right-0 h-1.5"
          style={{background:`linear-gradient(90deg,${T.gold},${T.green},${T.sky},${T.purple})`}} />
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 p-10 lg:p-14">
          <div className="lg:w-2/5 grid grid-cols-2 gap-4">
            {[{FIcon:Palette,l:"UI Design"},{FIcon:Zap,l:"Fast Dev"},{FIcon:Rocket,l:"SEO Ready"},{FIcon:Shield,l:"Secure"}].map((item,i)=>(
              <motion.div key={i} animate={{y:[0,-6,0]}} transition={{duration:3+i*0.4,repeat:Infinity,delay:i*0.3}}
                className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 text-center"
                style={{boxShadow:"0 4px 16px rgba(0,0,0,0.04)"}}>
                <div className="flex justify-center mb-2">
                  <item.FIcon className="w-7 h-7" style={{color:T.gold}} />
                </div>
                <div className="font-bold text-xs" style={{color:T.ink}}>{item.l}</div>
              </motion.div>
            ))}
          </div>
          <div className="lg:w-3/5 text-center lg:text-left">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{color:T.gold}}>Ready to get started?</p>
            <h3 className="font-black mb-3"
              style={{fontSize:"clamp(1.6rem,3.5vw,2.4rem)",color:T.ink,letterSpacing:"-0.03em"}}>
              Your website, built<br/>
              <span style={{background:`linear-gradient(135deg,${T.gold},${T.green})`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
                right the first time
              </span>
            </h3>
            <p className="text-sm mb-7 max-w-md mx-auto lg:mx-0 text-slate-500 leading-relaxed">
              Tell us about your project and get a free quote in 24 hours. No commitment, no pressure — just honest advice.
            </p>
            <div className="flex gap-3 justify-center lg:justify-start flex-wrap">
              <motion.a href="https://wa.link/2sqe3g"
                whileHover={{scale:1.04,boxShadow:`0 8px 30px ${T.gold}50`}}
                className="px-7 py-3.5 rounded-2xl text-sm font-black"
                style={{background:`linear-gradient(135deg,${T.gold},#8B6914)`,color:"#0E0E0E",
                  boxShadow:`0 4px 20px ${T.gold}35`}}>
                Get Free Quote →
              </motion.a>
              <motion.a href="mailto:support@pearlx.in"
                whileHover={{scale:1.04}}
                className="px-7 py-3.5 rounded-2xl text-sm font-bold border-2 transition-all"
                style={{color:T.ink,borderColor:"rgba(15,23,42,0.15)",background:"#fff"}}>
                <Mail className="w-4 h-4 inline mr-1" /> Email Us
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default WebDevelopmentServices;