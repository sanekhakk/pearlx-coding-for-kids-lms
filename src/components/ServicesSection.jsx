import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../utils/theme";
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

function ServiceCard({ service, navigate, index }) {
  return (
    <motion.button
      type="button"
      onClick={() => navigate(service.route)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl bg-white text-left transition-all duration-300 hover:-translate-y-1"
      style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -14px rgba(15,23,42,0.18)" }}
      aria-label={`Open ${service.title}`}
    >
      <div className="relative overflow-hidden aspect-[6/5]" style={{ background: service.light }}>
        <img
          src={service.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
      </div>
      <div className="h-1 w-full" style={{ background: service.color }} />
      <div className="flex items-center gap-2 p-3 sm:p-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-lg font-bold leading-tight" style={{ color: COLORS.ink }}>
            {service.title}
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm font-medium" style={{ color: COLORS.textMuted }}>
            {service.subtitle}
          </p>
        </div>
        <span
          className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5"
          style={{ background: `${service.color}18`, color: service.id === "maths" ? COLORS.goldDeep : service.color }}
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </div>
    </motion.button>
  );
}

export default function ServicesSection() {
  const navigate = useNavigate();

  return (
    <section id="services" className="relative overflow-hidden bg-white py-12 sm:py-20">
      <span id="programs" className="absolute -top-28" aria-hidden="true" />
      <PearlScatter variant="b" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        <SectionHeader eyebrow="FIND THEIR THING" color={COLORS.emerald} title="Four ways to learn." className="mb-7 sm:mb-12" />

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} navigate={navigate} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}