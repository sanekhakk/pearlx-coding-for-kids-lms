import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { motion } from "framer-motion";
import { COLORS } from "./utils/theme";
import DemoBookingModal from "./components/Demobookingmodal";
import OfferCarousel from "./components/OfferCarousel";
import NavBar from "./components/NavBar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import SubjectSection from "./components/SubjectSection";
import WebServicesSection from "./components/WebServicesSection";
import ProcessSection from "./components/ProcessSection";
import WhyPearlxSection from "./components/WhyPearlxSection";
import AuthModal from "./components/AuthModal";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import ComputerScienceClasses from "./pages/ComputerScienceClasses";
import AcademicTuition from "./pages/AcademicTuition";
import Courses from "./pages/Courses";
import WebDevelopmentServices from "./pages/WebDevelopmentServices";
import Pricing from "./pages/Pricing";

function GuestHome({ openDemoModal }) {
  return (
    <>
      <HeroSection openDemoModal={openDemoModal} />
      <SubjectSection />
      <ServicesSection />
      <WhyPearlxSection />
      <ProcessSection openDemoModal={openDemoModal} />
      <WebServicesSection />
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-3"
        style={{ background: COLORS.bgPrimary }}>
        <motion.div className="w-8 h-8 rounded-full border-2 border-t-transparent"
          style={{ borderColor: COLORS.indigo, borderTopColor: "transparent" }}
          animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
        <p className="text-sm font-medium" style={{ color: COLORS.textMuted }}>Loading Pearlx...</p>
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
          <Route path="/" element={<GuestHome openDemoModal={openDemoModal} />} />
          <Route path="/services/education" element={<ComputerScienceClasses openDemoModal={openDemoModal} />} />
          <Route path="/courses" element={<Courses openDemoModal={openDemoModal} />} />
          <Route path="/services/academic-tuition" element={<AcademicTuition openDemoModal={openDemoModal} />} />
          <Route path="/services/web-development" element={<WebDevelopmentServices openDemoModal={openDemoModal} />} />
          <Route path="/pricing" element={<Pricing openDemoModal={openDemoModal} />} />
        </Routes>
      </main>
      <Footer openDemoModal={openDemoModal} />
      <AuthModal />
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