import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Phone, Code2, Calculator, BookOpenCheck, Rocket, Heart, Sprout, BookOpen, Bird } from "lucide-react";
import { COLORS, BRAND } from "../utils/theme";
import { display } from "./ui/Brand";

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

const linkCls = "group inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors";

const FooterLink = ({ item }) => {
  const dot = item.color && <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />;
  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={linkCls}>
        {dot}
        {item.label}
        <ArrowUpRight className="w-3.5 h-3.5" />
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
    <footer className="relative overflow-hidden" style={{ background: COLORS.navDark, color: COLORS.white }}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        {/* CTA */}
        <div className="pt-8 sm:pt-12 pb-8 sm:pb-10">
          <div
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-9"
            style={{ background: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)" }}
          >
            <div aria-hidden="true" className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10" />
            <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] text-white/80">Ready when they are</span>
                <h2 className="mt-1.5 text-xl sm:text-3xl font-extrabold leading-tight tracking-tight text-balance" style={display}>
                  Find their thing. Let them run with it.
                </h2>
                <p className="mt-1.5 max-w-lg text-[13px] sm:text-base font-medium leading-relaxed text-white/85">
                  Coding, maths, academics and deeper courses — one place to keep learning moving.
                </p>
              </div>
              <a
                href="https://wa.link/5pk793"
                target="_blank"
                rel="noreferrer"
                className="px-btn shrink-0 self-start md:self-center"
                style={{ "--btn-bg": "#fff", "--btn-fg": COLORS.ink }}
              >
                <Phone className="h-4 w-4" style={{ color: COLORS.emerald }} />
                Talk to a mentor
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t py-8 sm:py-12 lg:grid-cols-12 lg:gap-8" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="col-span-2 lg:col-span-4">
            <Link to="/" className="inline-block" aria-label="Pearlx home">
              <img src="/pearlxlogodark.webp" alt="Pearlx" className="h-10 sm:h-12 w-auto object-contain" />
            </Link>
            <p className="mt-1 text-xs sm:text-sm font-semibold" style={{ color: COLORS.emerald }}>
              {BRAND.tagline}
            </p>
            <p className="mt-3 max-w-sm text-[13px] sm:text-sm font-medium leading-relaxed text-slate-400">
              A playful place for kids to build skills, solve problems and discover what they love learning.
            </p>
            <a
              href="mailto:pearlxsupport@gmail.com"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-200 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4" style={{ color: COLORS.cyan }} />
              pearlxsupport@gmail.com
            </a>
          </div>

          <div className="col-span-2 lg:col-span-4">
            <h3 className="mb-3 text-sm font-bold">Explore</h3>
            <div className="grid grid-cols-2 gap-2">
              {SERVICES.map(({ label, subtitle, to, Icon, color }) => (
                <Link
                  key={label}
                  to={to}
                  className="group flex items-center gap-2.5 rounded-xl p-2.5 transition-colors hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${color}26`, color }}>
                    <Icon className="h-4 w-4" strokeWidth={2.3} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] sm:text-sm font-bold leading-tight">{label}</span>
                    <span className="block text-[11px] font-medium text-slate-400">{subtitle}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-3 text-sm font-bold">Pearls</h3>
            <div className="flex flex-col gap-2.5">
              {LEVELS.map((item) => <FooterLink key={item.label} item={item} />)}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-3 text-sm font-bold">Pearlx</h3>
            <div className="flex flex-col gap-2.5">
              {COMPANY.map((item) => <FooterLink key={item.label} item={item} />)}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-2 border-t py-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-400">
            © {year} Pearlx Academy
            <span className="text-slate-600">•</span>
            Made for curious young minds
            <Heart className="h-3.5 w-3.5" style={{ color: COLORS.emerald, fill: COLORS.emerald }} />
          </p>
          <a
            href="https://wa.link/5pk793"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Need help choosing?
            <span style={{ color: COLORS.emerald }}>Chat with us</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;