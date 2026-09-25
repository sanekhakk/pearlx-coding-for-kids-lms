import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { COLORS, SHADOWS } from "../utils/theme";

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

function ServiceButton({ service, navigate }) {
  return (
    <motion.button
      type="button"
      onClick={() => navigate(service.route)}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.985 }}
      className="
        group relative flex w-full items-center overflow-hidden
        rounded-[28px] border-2 p-3 text-left
        transition-shadow duration-300
        min-h-[150px]
        sm:min-h-[170px] sm:p-4
      "
      style={{
        background: service.color,
        borderColor: service.color,
        boxShadow: SHADOWS.card,
      }}
      aria-label={`Open ${service.title}`}
    >
      {/* Kid illustration */}
      <div
        className="
          relative flex shrink-0 items-end justify-center overflow-hidden
          rounded-[22px] w-[128px] sm:w-[150px]"
        style={{ background: service.light }}
      >
        <img
          src={service.image}
          alt=""
          className="
            h-full w-full object-contain object-bottom
            transition-transform duration-300
            group-hover:scale-[1.06]
          "
        />
      </div>

      {/* Service name */}
      <div className="min-w-0 flex-1 px-3 sm:px-5">
        <h3
          className="text-xl font-black leading-tight sm:text-2xl"
          style={{
            color:
              service.id === "maths"
                ? COLORS.ink
                : COLORS.white,
          }}
        >
          {service.title}
        </h3>

        <p
          className="mt-1 text-xs font-bold sm:text-sm"
          style={{
            color:
              service.id === "maths"
                ? COLORS.inkLight
                : COLORS.white,
          }}
        >
          {service.subtitle}
        </p>
      </div>

      {/* Arrow */}
      <span
        className="
          mr-1 flex shrink-0 items-center justify-center rounded-full
          bg-white
          h-11 w-11
          sm:h-12 sm:w-12
          transition-transform duration-300
          group-hover:translate-x-1
        "
        style={{
          color: service.color,
          boxShadow: SHADOWS.sm,
        }}
      >
        <ArrowRight
          className="h-5 w-5 sm:h-6 sm:w-6"
          strokeWidth={2.8}
        />
      </span>
    </motion.button>
  );
}

export default function ServicesSection({ openDemoModal }) {
  const navigate = useNavigate();

  return (
    <section
      id="services"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{ background: COLORS.bgPrimary }}
    >
      <div className="md:mx-20 px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-8 max-w-3xl sm:mb-10">
          <div
            className="mb-3 text-[10px] font-black uppercase tracking-[0.22em]"
            style={{ color: COLORS.emerald }}
          >
            FIND THEIR THING
          </div>

          <h2
            className="
              text-4xl font-black leading-[0.98]
              tracking-[-0.045em]
              sm:text-5xl lg:text-6xl
            "
            style={{ color: COLORS.ink }}
          >
            Four ways to learn.
          </h2>
        </div>

        {/* Four large service buttons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <ServiceButton
              key={service.id}
              service={service}
              navigate={navigate}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
