"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import IntroBanner from "@/components/IntroBanner";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import OurOfficeSection from "@/components/OurOfficeSection";
import ApproachSection from "@/components/ApproachSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import BookingModal from "@/components/BookingModal";
import Footer from "@/components/Footer";

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleOpenBooking = () => {
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C2B26] selection:bg-[#C87D55]/20 selection:text-[#234237]">
      {/* Header Navigation */}
      <Header onOpenBooking={handleOpenBooking} />

      {/* Hero Section */}
      <Hero onOpenBooking={handleOpenBooking} />

      {/* Intro / Persona Empathy Hook */}
      <IntroBanner />

      {/* 3 Specialized Services Section */}
      <ServicesSection onOpenBooking={handleOpenBooking} />

      {/* About Dr. Maya Reynolds Section */}
      <AboutSection />

      {/* PART 3: NEW CUSTOM SECTION - Our Office */}
      <OurOfficeSection />

      {/* How Therapy Works Framework */}
      <ApproachSection onOpenBooking={handleOpenBooking} />

      {/* Client Reflections / Testimonials */}
      <TestimonialsSection />

      {/* FAQ Accordion */}
      <FaqSection />

      {/* Footer */}
      <Footer />

      {/* Interactive Consultation Request Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={handleCloseBooking} />
    </main>
  );
}
