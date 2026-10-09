"use client";

import React from "react";
import { Phone, Mail, MapPin, ArrowUp, Heart, Shield } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="bg-[#1C2B26] text-[#EBF2EE] pt-16 pb-12 border-t border-[#345C4F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C87D55] text-white flex items-center justify-center font-serif text-xl font-bold">
                MR
              </div>
              <div>
                <span className="block font-serif text-2xl font-semibold text-white">
                  Dr. Maya Reynolds
                </span>
                <span className="block text-xs uppercase tracking-widest text-[#C87D55] font-semibold">
                  PsyD • Licensed Clinical Psychologist
                </span>
              </div>
            </div>

            <p className="text-sm text-[#EBF2EE]/80 leading-relaxed max-w-md">
              Evidence-based, grounded psychological therapy for high-achieving adults, professionals, and creatives in Santa Monica, CA & secure Telehealth across California.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-[#EBF2EE]/70 font-mono">
              <span>CA License #PSY29810</span>
              <span>•</span>
              <span>Santa Monica Practice</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-lg font-semibold text-white">Navigation</h4>
            <ul className="space-y-2 text-sm text-[#EBF2EE]/80 font-normal">
              <li>
                <a href="#about" className="hover:text-[#C87D55] transition-colors">
                  About Dr. Maya
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#C87D55] transition-colors">
                  Specialties & Services
                </a>
              </li>
              <li>
                <a href="#office" className="hover:text-[#C87D55] transition-colors">
                  Our Santa Monica Office
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#C87D55] transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Practice & Location */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif text-lg font-semibold text-white">Office Location & Hours</h4>
            <div className="space-y-2.5 text-sm text-[#EBF2EE]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C87D55] flex-shrink-0 mt-1" />
                <span>123th Street 45 W, Santa Monica, CA 90401</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C87D55] flex-shrink-0" />
                <a href="tel:3105550192" className="hover:text-[#C87D55]">
                  (310) 555-0192
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C87D55] flex-shrink-0" />
                <a href="mailto:maya@drmayareynolds.com" className="hover:text-[#C87D55]">
                  maya@drmayareynolds.com
                </a>
              </div>
              <div className="text-xs text-[#EBF2EE]/60 pt-1">
                Mon - Fri: 9:00 AM - 6:00 PM PST
              </div>
            </div>
          </div>

        </div>

        {/* Emergency Crisis Disclaimer */}
        <div className="bg-[#234237] p-4 sm:p-5 rounded-2xl border border-[#345C4F] text-xs text-[#EBF2EE]/80 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C87D55]/20 text-[#C87D55] flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white">Medical & Crisis Notice: </span>
            This website is for informational purposes and does not establish a provider-patient relationship. If you are experiencing a mental health emergency or crisis, please call <strong>988</strong> (Lifeline) or go to the nearest emergency room immediately.
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 border-t border-[#345C4F]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EBF2EE]/60">
          <div>
            © {new Date().getFullYear()} Dr. Maya Reynolds, PsyD. All rights reserved. Designed for Grow My Therapy evaluation.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-[#EBF2EE] hover:text-[#C87D55] transition-colors p-2 rounded-lg bg-[#234237]"
            aria-label="Scroll to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
