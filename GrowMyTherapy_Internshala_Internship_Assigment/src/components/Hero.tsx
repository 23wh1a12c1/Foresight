"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin, Sparkles, Heart } from "lucide-react";

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE6] to-[#FAF7F2]">
      {/* Soft Decorative Ambient Circles */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#EBF2EE] rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#F7EDE7] rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Chip Badge */}
            <div className="inline-flex items-center gap-2 bg-[#EBF2EE] border border-[#6C9788]/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#234237]">
              <Sparkles className="w-3.5 h-3.5 text-[#C87D55]" />
              <span>Grounded, Evidence-Based Therapy in Santa Monica, CA</span>
            </div>

            {/* H1 SEO Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#234237] leading-[1.15] tracking-tight">
              A Safe Space to Slow Down, Heal, and <span className="italic text-[#C87D55]">Reconnect</span>
            </h1>

            {/* Subtext Based on Profile */}
            <p className="text-lg sm:text-xl text-[#485A53] leading-relaxed font-normal max-w-2xl">
              Specialized clinical therapy for high-achieving adults, professionals, and thoughtful individuals in Santa Monica navigating anxiety, panic, trauma, and burnout.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-y-2.5 gap-x-4 pt-1 text-xs sm:text-sm text-[#345C4F] font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C87D55]" />
                <span>Cognitive Behavioral Therapy (CBT)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C87D55]" />
                <span>EMDR Trauma Recovery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C87D55]" />
                <span>Somatic & Mindfulness Tools</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="bg-[#C87D55] hover:bg-[#B46A42] text-white px-8 py-4 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 transform active:scale-95 cursor-pointer group"
              >
                <span>Schedule Free Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#office"
                className="bg-white hover:bg-[#EBF2EE] text-[#234237] border border-[#E2DDD5] px-6 py-4 rounded-full text-base font-medium transition-all flex items-center justify-center gap-2 text-center"
              >
                <MapPin className="w-4 h-4 text-[#C87D55]" />
                <span>View Santa Monica Office</span>
              </a>
            </div>

            {/* Trust Footer Bar */}
            <div className="pt-6 border-t border-[#E2DDD5]/70 flex flex-wrap items-center justify-between gap-4 text-xs text-[#6E8279]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#345C4F]" />
                <span>Licensed Clinical Psychologist (CA #PSY29810)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>In-Person & Secure Telehealth Across CA</span>
              </div>
            </div>
          </div>

          {/* Right Portrait & Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Decorative Soft Framing */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#345C4F]/10 via-[#C87D55]/15 to-[#345C4F]/5 rounded-3xl transform rotate-1 blur-sm"></div>

              {/* Main Image Wrapper */}
              <div className="relative bg-[#FAF7F2] p-2 rounded-3xl shadow-xl border border-[#E2DDD5] overflow-hidden">
                <div className="relative h-[440px] sm:h-[500px] w-full rounded-2xl overflow-hidden bg-[#EBF2EE]">
                  <Image
                    src="/images/dr_maya_reynolds.png"
                    alt="Dr. Maya Reynolds, PsyD - Licensed Clinical Psychologist in Santa Monica"
                    fill
                    priority
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Floating Card 1: Experience & Credential */}
                <div className="absolute top-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-[#E2DDD5] max-w-[210px] animate-fade-in hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EBF2EE] text-[#345C4F] flex items-center justify-center font-bold text-sm">
                      <Heart className="w-5 h-5 text-[#C87D55]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#234237]">Dr. Maya Reynolds</p>
                      <p className="text-[10px] text-[#6E8279]">Licensed Clinical Psychologist</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2: Environment */}
                <div className="absolute bottom-6 -right-4 sm:-right-6 bg-[#234237] text-white p-4 rounded-2xl shadow-xl max-w-[230px] hidden sm:block">
                  <p className="text-xs font-semibold leading-tight text-[#EBF2EE]">
                    "Warm, structured, and paced with care for sustainable healing."
                  </p>
                  <p className="text-[10px] text-[#C87D55] font-bold mt-2 uppercase tracking-wider">
                    Santa Monica Practice
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
