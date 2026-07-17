import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Heart, Phone, ArrowUpRight } from "lucide-react";
import Logo from "../assets/flat_logo_dark.webp";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t" style={{ background: "#0A0E1A", borderColor: "rgba(255,255,255,0.06)" }}>

      {/* ── LIVE BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.5), rgba(14,165,233,0.5), transparent)" }} />

        {/* Ambient orbs */}
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }} transition={{ duration: 14, repeat: Infinity }}
          className="absolute -top-20 left-[20%] w-[40vw] h-[40vw] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 18, repeat: Infinity, delay: 4 }}
          className="absolute bottom-0 right-[10%] w-[35vw] h-[35vw] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)", backgroundSize: "44px 44px" }} />

        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{ width: 2 + (i % 3), height: 2 + (i % 3), background: i % 2 === 0 ? "#10B981" : "#0EA5E9", left: `${6 + i * 9}%`, top: `${20 + (i % 4) * 18}%`, opacity: 0.2 }}
            animate={{ y: [0, -50, 0], opacity: [0, 0.4, 0] }}
            transition={{ duration: 6 + i * 0.7, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <img src={Logo} alt="Pearlx" className="h-11 mb-6" style={{ filter: "brightness(0) invert(1) opacity(0.9)" }} />
            <p className="max-w-sm mb-8 font-medium text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Empowering the next generation of innovators through project-based coding and academic CS excellence.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:support@pearlx.in"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{ color: "rgba(255,255,255,0.5)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#10B981")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                <Mail size={15} /> pearlxsupport@gmail.com
              </a>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-bold text-sm text-white mb-6 uppercase tracking-widest" style={{ letterSpacing: "0.1em" }}>Programs</h4>
            <ul className="space-y-3">
              {[
                { label: "Little Pearls (K–2)", to: "/services/education" },
                { label: "Bright Pearls (3–6)", to: "/services/education" },
                { label: "Rising Pearls (7–10)", to: "/services/education" },
                { label: "CS / IP Tuition (6–12)", to: "/services/education" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.to}
                    className="text-sm font-medium transition-colors"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#10B981")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm text-white mb-6 uppercase tracking-widest" style={{ letterSpacing: "0.1em" }}>Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", to: "/" },
                { label: "Pricing", to: "/pricing" },
                { label: "Web Dev Services", to: "/services/web-development" },
                { label: "Contact", href: "https://wa.link/5pk793" },
              ].map((item, i) => (
                <li key={i}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium transition-colors inline-flex items-center gap-1"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#0EA5E9")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                    >
                      {item.label} <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      to={item.to}
                      className="text-sm font-medium transition-colors"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#0EA5E9")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-sm font-medium flex items-center gap-2" style={{ color: "rgba(255,255,255,0.3)" }}>
            © {year} Pearlx Academy. Made with{" "}
            <Heart size={13} className="inline text-emerald-500 fill-emerald-500" />
            {" "}for young creators.
          </p>

          <motion.a
            href="https://wa.link/5pk793"
            whileHover={{ scale: 1.05, boxShadow: "0 12px 32px rgba(16,185,129,0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-slate-900"
            style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)", boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}
          >
            <Phone size={15} /> Chat with a Mentor
          </motion.a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;