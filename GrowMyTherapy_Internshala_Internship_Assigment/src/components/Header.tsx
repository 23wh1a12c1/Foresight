"use client";

import React, { useState, useEffect } from "react";
import { Phone, MapPin, Menu, X, Calendar, Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenBooking: () => void;
}

export default function Header({ onOpenBooking }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-[#234237] text-[#FAF7F2] text-xs py-2 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#C87D55] animate-pulse"></span>
        <span>Now Accepting In-Person Clients in Santa Monica & Telehealth Across California</span>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "glass-nav border-b border-[#E2DDD5] shadow-sm py-3"
            : "bg-[#FAF7F2]/90 backdrop-blur-md py-4 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-[#345C4F] text-[#FAF7F2] flex items-center justify-center font-serif text-xl font-bold transition-transform group-hover:scale-105 shadow-sm">
                MR
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#234237]">
                  Dr. Maya Reynolds
                </span>
                <span className="block text-[11px] uppercase tracking-widest text-[#6E8279] font-medium">
                  PsyD • Licensed Clinical Psychologist
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#485A53]">
              <a
                href="#about"
                className="hover:text-[#345C4F] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C87D55] hover:after:w-full after:transition-all"
              >
                About Maya
              </a>
              <a
                href="#services"
                className="hover:text-[#345C4F] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C87D55] hover:after:w-full after:transition-all"
              >
                Specialties & Services
              </a>
              <a
                href="#office"
                className="hover:text-[#345C4F] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C87D55] hover:after:w-full after:transition-all flex items-center gap-1.5"
              >
                <span>Our Office</span>
                <span className="text-[10px] bg-[#C87D55]/15 text-[#C87D55] px-1.5 py-0.5 rounded-full font-semibold">
                  New
                </span>
              </a>
              <a
                href="#faq"
                className="hover:text-[#345C4F] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C87D55] hover:after:w-full after:transition-all"
              >
                FAQs
              </a>
              <a
                href="#contact"
                className="hover:text-[#345C4F] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C87D55] hover:after:w-full after:transition-all"
              >
                Contact
              </a>
            </nav>

            {/* CTA & Phone */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:3105550192"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#345C4F] hover:text-[#234237] transition-colors px-3 py-2 rounded-lg bg-[#EBF2EE]"
              >
                <Phone className="w-3.5 h-3.5 text-[#C87D55]" />
                <span>(310) 555-0192</span>
              </a>
              <button
                onClick={onOpenBooking}
                className="bg-[#C87D55] hover:bg-[#B46A42] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2 transform active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={onOpenBooking}
                className="bg-[#C87D55] text-white px-3 py-1.5 rounded-full text-xs font-semibold"
              >
                Book
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#234237] hover:bg-[#EBF2EE] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF7F2] border-b border-[#E2DDD5] px-4 pt-3 pb-6 animate-fade-in shadow-lg">
            <div className="flex flex-col gap-4 font-medium text-[#485A53]">
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#E2DDD5]/50 hover:text-[#345C4F]"
              >
                About Dr. Maya
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#E2DDD5]/50 hover:text-[#345C4F]"
              >
                Services & Specialties
              </a>
              <a
                href="#office"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#E2DDD5]/50 hover:text-[#345C4F] flex items-center justify-between"
              >
                <span>Our Santa Monica Office</span>
                <span className="text-xs bg-[#C87D55]/15 text-[#C87D55] px-2 py-0.5 rounded-full">
                  Physical Space
                </span>
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#E2DDD5]/50 hover:text-[#345C4F]"
              >
                Frequently Asked Questions
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#345C4F]"
              >
                Contact & Location
              </a>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full bg-[#C87D55] text-white py-3 rounded-full text-center font-semibold shadow-sm flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Free Consultation</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-[#6E8279] pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C87D55]" />
                  <span>123th Street 45 W, Santa Monica, CA 90401</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
