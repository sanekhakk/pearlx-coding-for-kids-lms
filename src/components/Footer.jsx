import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Phone, Code2, Calculator, BookOpenCheck, Rocket, Heart, Sprout, BookOpen, Bird } from "lucide-react";
import { COLORS, FONTS, BRAND, edgeOf } from "../utils/theme";
import { Wave, Pearl } from "./ui/Brand";

const SERVICES = [
  { label: "Coding", subtitle: "Make & code", to: "/services/education", Icon: Code2, color: COLORS.emerald, light: COLORS.emeraldLight },
  { label: "Maths", subtitle: "Think & solve", to: "/mathsclasses", Icon: Calculator, color: COLORS.gold, light: COLORS.goldLight },
  { label: "Academic Tuition", subtitle: "Learn & grow", to: "/services/academic-tuition", Icon: BookOpenCheck, color: COLORS.cyan, light: COLORS.cyanLight },
  { label: "Courses", subtitle: "Go deeper", to: "/courses", Icon: Rocket, color: COLORS.indigo, light: COLORS.indigoLight },
];

const LEVELS = [
  { label: "Little Pearls", to: "/services/education", Icon: Sprout, color: COLORS.gold },
  { label: "Bright Pearls", to: "/services/education", Icon: BookOpen, color: COLORS.emerald },
  { label: "Rising Pearls", to: "/services/education", Icon: Bird, color: COLORS.indigo },
];

const COMPANY = [
  { label: "Home", to: "/" },
  { label: "Pricing", to: "/pricing" },
  { label: "Contact us", href: "https://wa.link/5pk793" },
];

const linkCls = "group inline-flex items-center gap-2 text-[15px] font-bold text-slate-400 hover:text-white transition-colors";

const FooterLink = ({ item }) => {
  const dot = item.color && <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />;
  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={linkCls}>
        {dot}
        {item.label}
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    );
  }
  return (
    <Link to={item.to} className={linkCls}>
      {dot}
      {item.label}
    </Link>
  );
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative -mt-10 sm:-mt-[60px]" style={{ color: COLORS.white }}>
      <Wave fill={COLORS.navDark} className="-mb-px" />
      <div className="relative overflow-hidden" style={{ background: COLORS.navDark }}>
        <Pearl size={40} color={COLORS.emerald} className="hidden lg:block" style={{ bottom: 80, left: "-12px", opacity: 0.35 }} />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          {/* CTA */}
          <div className="pt-6 pb-12">
            <div
              className="relative overflow-hidden rounded-[2.25rem] p-7 sm:p-10"
              style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)", boxShadow: `0 8px 0 ${edgeOf(COLORS.emerald)}` }}
            >
              <div aria-hidden="true" className="absolute inset-0 px-dots opacity-40" style={{ filter: "invert(1)" }} />
              <Pearl size={34} color={COLORS.gold} style={{ top: 22, right: 30 }} float />
              <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <span className="px-eyebrow" style={{ color: "#fff", background: "rgba(255,255,255,0.15)" }}>Ready when they are</span>
                  <h2 className="mt-4 text-3xl sm:text-4xl font-semibold leading-tight" style={{ fontFamily: FONTS.display }}>
                    Find their thing. Let them run with it.
                  </h2>
                  <p className="mt-2 max-w-lg text-base font-semibold leading-relaxed text-white/85">
                    Coding, maths, academics and deeper courses — one place to keep learning moving.
                  </p>
                </div>
                <a
                  href="https://wa.link/5pk793"
                  target="_blank"
                  rel="noreferrer"
                  className="px-btn px-btn--lg shrink-0"
                  style={{ "--btn-bg": "#fff", "--btn-fg": COLORS.ink, "--btn-edge": "rgba(0,0,0,0.25)" }}
                >
                  <Phone className="h-5 w-5" style={{ color: COLORS.emerald }} />
                  Talk to a mentor
                  <ArrowUpRight className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid gap-10 border-t-2 border-dashed py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <div className="lg:col-span-4">
              <Link to="/" className="inline-block" aria-label="Pearlx home">
                <img src="/pearlxlogodark.webp" alt="Pearlx" className="h-14 w-auto object-contain" />
              </Link>
              <p className="mt-2 text-sm font-semibold" style={{ fontFamily: FONTS.display, color: COLORS.emerald }}>
                {BRAND.tagline}
              </p>
              <p className="mt-4 max-w-sm text-[15px] font-semibold leading-relaxed text-slate-400">
                A playful place for kids to build skills, solve problems and discover what they love learning.
              </p>
              <a
                href="mailto:pearlxsupport@gmail.com"
                className="mt-5 inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-bold text-slate-200 transition-colors hover:text-white"
                style={{ background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.08)" }}
              >
                <Mail className="h-4 w-4" style={{ color: COLORS.cyan }} />
                pearlxsupport@gmail.com
              </a>
            </div>

            <div className="lg:col-span-4">
              <h3 className="mb-4 text-lg font-semibold" style={{ fontFamily: FONTS.display }}>Explore</h3>
              <div className="grid grid-cols-2 gap-3">
                {SERVICES.map(({ label, subtitle, to, Icon, color }) => (
                  <Link
                    key={label}
                    to={to}
                    className="group rounded-3xl p-3.5 transition-all duration-200 hover:-translate-y-1"
                    style={{ background: "rgba(255,255,255,0.05)", border: `2px solid ${color}35` }}
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl transition-transform group-hover:-rotate-12" style={{ background: color, color: color === COLORS.gold ? COLORS.navDark : "#fff" }}>
                      <Icon className="h-5 w-5" strokeWidth={2.4} />
                    </div>
                    <div className="text-[15px] font-semibold" style={{ fontFamily: FONTS.display }}>{label}</div>
                    <div className="mt-0.5 text-xs font-bold text-slate-400">{subtitle}</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold" style={{ fontFamily: FONTS.display }}>Pearls</h3>
              <div className="flex flex-col gap-3.5">
                {LEVELS.map((item) => <FooterLink key={item.label} item={item} />)}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold" style={{ fontFamily: FONTS.display }}>Pearlx</h3>
              <div className="flex flex-col gap-3.5">
                {COMPANY.map((item) => <FooterLink key={item.label} item={item} />)}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col gap-4 border-t-2 border-dashed py-7 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <p className="flex items-center gap-1.5 text-sm font-bold text-slate-400">
              © {year} Pearlx Academy
              <span className="text-slate-600">•</span>
              Made for curious young minds
              <Heart className="ml-0.5 h-4 w-4" style={{ color: COLORS.emerald, fill: COLORS.emerald }} />
            </p>
            <a
              href="https://wa.link/5pk793"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-300 hover:text-white transition-colors"
            >
              Need help choosing?
              <span style={{ color: COLORS.emerald }}>Chat with us</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;