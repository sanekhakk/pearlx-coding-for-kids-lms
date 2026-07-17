export const COLORS = {
  // Backgrounds 
  bgPrimary:    "#FFFFFF",
  bgSecondary:  "#F8FAFC",
  bgTertiary:   "#F1F5F9",

  //  Text 
  ink:          "#0F172A",
  inkLight:     "#1E293B",
  textPrimary:  "#0F172A",
  textSecondary:"#334155",
  textMuted:    "#64748B",

  // Education Accents (Emerald / Cyan / Indigo) 
  emerald:      "#10B981",
  emeraldLight: "rgba(16,185,129,0.1)",
  cyan:         "#0EA5E9",
  cyanLight:    "rgba(14,165,233,0.1)",
  indigo:       "#6366F1",
  indigoLight:  "rgba(99,102,241,0.1)",

  // Web / Premium Accents (Gold / Silver / Bronze) 
  gold:         "#C9A84C",
  goldDeep:     "#A07830",
  goldLight:    "rgba(201,168,76,0.12)",
  silver:       "#9CA3AF",
  silverBright: "#D1D5DB",
  silverLight:  "rgba(156,163,175,0.12)",
  bronze:       "#B87333",
  bronzeLight:  "rgba(184,115,51,0.12)",

  // Base 
  white:        "#FFFFFF",
  navDark:      "#0B1120",

  // Borders 
  border:       "rgba(15,23,42,0.08)",
  borderMed:    "rgba(15,23,42,0.15)",
  borderDark:   "rgba(255,255,255,0.1)",
};

export const GRADIENTS = {
  primary:      "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
  gold:         "linear-gradient(135deg, #C9A84C 0%, #A07830 100%)",
  textGlow:     "linear-gradient(to right, #0EA5E9, #10B981)",
  lightBg:      "linear-gradient(160deg, #FFFFFF 0%, #F0F9FF 50%, #ECFDF5 100%)",
  navBg:        "linear-gradient(90deg, #0B1120 0%, #0F172A 100%)",
  darkHero:     "linear-gradient(135deg, #0E0E0E 0%, #1A1A1A 100%)",
  purpleDark:   "linear-gradient(135deg, #1A0A2E 0%, #0E0E1A 100%)",
};

export const SHADOWS = {
  sm:         "0 1px 3px rgba(15,23,42,0.08)",
  card:       "0 10px 30px rgba(15,23,42,0.05), 0 1px 3px rgba(15,23,42,0.02)",
  lg:         "0 20px 60px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.04)",
  hover:      "0 20px 40px rgba(16,185,129,0.15)",
  hoverGold:  "0 20px 40px rgba(201,168,76,0.2)",
  float:      "0 30px 60px rgba(14,165,233,0.12)",
  glowCyan:   "0 8px 30px rgba(14,165,233,0.3)",
  glowEmer:   "0 8px 30px rgba(16,185,129,0.3)",
  glowGold:   "0 8px 30px rgba(201,168,76,0.3)",
};

export const ANIMATIONS = {
  fast:   "150ms",
  normal: "300ms",
  slow:   "500ms",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

export const DARK = {
  bg:           "#0A0A0A",
  surface:      "#111111",
  surfaceAlt:   "#1A1A1A",
  border:       "rgba(255,255,255,0.07)",
  borderMed:    "rgba(255,255,255,0.12)",
  borderActive: "rgba(16,185,129,0.45)",

  textPrimary:   "#F1EDE8",
  textSecondary: "#A09890",
  textMuted:     "#686460",

  emerald:   "#10B981",
  cyan:      "#0EA5E9",
  indigo:    "#6366F1",
  red:       "#C25C4A",
  redMuted:  "rgba(194,92,74,0.12)",
  green:     "#10B981",
  greenMuted:"rgba(16,185,129,0.12)",

  gradPrimary: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
  shadowXl:    "0 20px 60px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.45)",
  shadowGlow:  "0 0 24px rgba(16,185,129,0.35)",
};

export default { COLORS, GRADIENTS, SHADOWS, ANIMATIONS, DARK };