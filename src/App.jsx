import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { motion } from "framer-motion";
import { COLORS, FONTS } from "./utils/theme";
import DemoBookingModal from "./components/Demobookingmodal";
import DemoInterestPopup from "./components/DemoInterestPopup";
import OfferCarousel from "./components/OfferCarousel";
import NavBar from "./components/NavBar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import SubjectSection from "./components/SubjectSection";
import ProcessSection from "./components/ProcessSection";
import WhyPearlxSection from "./components/WhyPearlxSection";
import AuthModal from "./components/AuthModal";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import ComputerScienceClasses from "./pages/ComputerScienceClasses";
import AcademicTuition from "./pages/AcademicTuition";
import Courses from "./pages/Courses";
import Pricing from "./pages/Pricing";
import MathsClasses from "./pages/mathsClasses";

function GuestHome({ openDemoModal }) {
  return (
    <>
      <HeroSection openDemoModal={openDemoModal} />
      <ServicesSection />
      
      <SubjectSection />
      <ProcessSection openDemoModal={openDemoModal} />
      <WhyPearlxSection />
      
    </>
  );
}

function MainApp() {
  const { role, isAuthReady } = useAuth();
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSource, setDemoSource] = useState("general");

  const openDemoModal = (source = "general") => {
    setDemoSource(source);
    setDemoModalOpen(true);
  };

  if (!isAuthReady) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: "linear-gradient(180deg, #F0F9FF 0%, #ECFDF5 100%)" }}
      >
        <img src="/pearlxlogo.webp" alt="Pearlx" className="h-14 w-auto" />
        <div className="flex items-center gap-2" aria-hidden="true">
          {[COLORS.cyan, COLORS.emerald, COLORS.gold, COLORS.indigo].map((c, i) => (
            <motion.span
              key={c}
              className="block w-3.5 h-3.5 rounded-full"
              style={{ background: c }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
            />
          ))}
        </div>
        <p className="text-base font-bold" style={{ color: COLORS.textMuted, fontFamily: FONTS.display }}>
          Loading Pearlx...
        </p>
      </div>
    );
  }

  if (role === "admin") return <AdminDashboard />;
  if (role === "tutor") return <TutorDashboard />;
  if (role === "student") return <StudentDashboard />;

  return (
    <div className="grain" style={{ background: COLORS.bgPrimary }}>
      <ScrollToTop />

      <OfferCarousel openDemoModal={openDemoModal} />
      <NavBar openDemoModal={openDemoModal} />

      <main>
        <Routes>
          <Route
            path="/"
            element={<GuestHome openDemoModal={openDemoModal} />}
          />
          <Route
            path="/services/education"
            element={<ComputerScienceClasses openDemoModal={openDemoModal} />}
          />
          <Route path="/courses" element={<Courses openDemoModal={openDemoModal} />} />
          <Route
            path="/mathsclasses"
            element={<MathsClasses openDemoModal={openDemoModal} />}
          />
          <Route
            path="/services/academic-tuition"
            element={<AcademicTuition openDemoModal={openDemoModal} />}
          />
          <Route
            path="/pricing"
            element={<Pricing openDemoModal={openDemoModal} />}
          />
        </Routes>
      </main>

      <Footer openDemoModal={openDemoModal} />
      <AuthModal />

      {/* Appears a few seconds after the first visit in this browser session. */}
      <DemoInterestPopup onBookDemo={openDemoModal} delay={5000} />

      <DemoBookingModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        source={demoSource}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}