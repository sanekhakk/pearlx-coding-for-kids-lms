import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { COLORS, FONTS, edgeOf } from "../utils/theme";
import { SectionHeader, PearlScatter } from "./ui/Brand";

const SERVICES = [
  {
    id: "coding",
    title: "Coding",
    subtitle: "Make & code",
    image: "/assets/kids/services/coding.webp",
    color: COLORS.emerald,
    light: COLORS.emeraldLight,
    route: "/services/education",
  },
  {
    id: "maths",
    title: "Maths",
    subtitle: "Think & solve",
    image: "/assets/kids/services/maths.webp",
    color: COLORS.gold,
    light: COLORS.goldLight,
    route: "/mathsclasses",
  },
  {
    id: "academic",
    title: "Academic Tuition",
    subtitle: "Learn & grow",
    image: "/assets/kids/services/academics.webp",
    color: COLORS.cyan,
    light: COLORS.cyanLight,
    route: "/services/academic-tuition",
  },
  {
    id: "courses",
    title: "Courses",
    subtitle: "Go deeper",
    image: "/assets/kids/services/courses.webp",
    color: COLORS.indigo,
    light: COLORS.indigoLight,
    route: "/courses",
  },
];

const TILTS = [-1.5, 1, -1, 1.5];

function ServiceCard({ service, navigate, index }) {
  const onColor = service.id === "maths" ? COLORS.navDark : COLORS.white;
  return (
    <motion.button
      type="button"
      onClick={() => navigate(service.route)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 160, damping: 18 }}
      whileHover={{ y: -8, rotate: 0 }}
      whileTap={{ scale: 0.98, y: 2 }}
      className="group relative flex w-full flex-col overflow-hidden rounded-[2rem] p-3 text-left"
      style={{
        background: service.color,
        boxShadow: `0 8px 0 ${edgeOf(service.color)}`,
        rotate: TILTS[index],
      }}
      aria-label={`Open ${service.title}`}
    >
      {/* Picture window */}
      <div className="relative overflow-hidden rounded-[1.5rem] bg-white aspect-[6/5]">
        <img
          src={service.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
        />
        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider"
          style={{ background: service.color, color: onColor }}
        >
          0{index + 1}
        </span>
      </div>

      {/* Label row */}
      <div className="flex items-center gap-3 px-2 pb-1 pt-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-semibold leading-tight" style={{ fontFamily: FONTS.display, color: onColor }}>
            {service.title}
          </h3>
          <p className="mt-0.5 text-sm font-bold opacity-85" style={{ color: onColor }}>
            {service.subtitle}
          </p>
        </div>
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-12"
          style={{ color: service.color, boxShadow: "0 3px 0 rgba(0,0,0,0.12)" }}
        >
          <ArrowRight className="h-6 w-6" strokeWidth={2.8} />
        </span>
      </div>
    </motion.button>
  );
}

export default function ServicesSection() {
  const navigate = useNavigate();

  return (
    <section id="services" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <span id="programs" className="absolute -top-28" aria-hidden="true" />
      <PearlScatter variant="b" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader eyebrow="FIND THEIR THING" color={COLORS.emerald} title="Four ways to learn." className="mb-12 sm:mb-14" />

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} navigate={navigate} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}