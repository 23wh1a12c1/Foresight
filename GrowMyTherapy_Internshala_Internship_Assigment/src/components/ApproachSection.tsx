"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Heart, Sparkles, ArrowRight } from "lucide-react";

interface ApproachSectionProps {
  onOpenBooking: () => void;
}

export default function ApproachSection({ onOpenBooking }: ApproachSectionProps) {
  const steps = [
    {
      number: "01",
      title: "Initial Consultation",
      description:
        "A complimentary 15-minute phone conversation to discuss what you're experiencing, answer your questions, and ensure we're a great fit.",
    },
    {
      number: "02",
      title: "Safety & Stabilization",
      description:
        "We begin by establishing a comfortable pacing, building grounded somatic tools, and ensuring you feel safe and supported in sessions.",
    },
    {
      number: "03",
      title: "Evidence-Based Processing",
      description:
        "Integrating CBT, EMDR, and mindfulness techniques tailored to your needs—helping reprocess trauma, anxiety, and burnout patterns.",
    },
    {
      number: "04",
      title: "Sustainable Inner Resilience",
      description:
        "Developing deeper self-insight, healthier boundaries, and lasting regulation so you can thrive in your personal and professional life.",
    },
  ];

  return (
    <section className="py-20 bg-[#234237] text-[#FAF7F2] relative overflow-hidden">
      
      {/* Soft Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#345C4F] rounded-full blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C87D55] rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-[#345C4F] text-[#EBF2EE] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C87D55]" />
            <span>Collaborative Path Forward</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
            How Therapy Works With Dr. Maya
          </h2>

          <p className="text-base sm:text-lg text-[#EBF2EE]/90 leading-relaxed font-normal">
            A structured yet flexible framework focused on safety, steady progress, and meaningful long-term transformation.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#2D5245] p-8 rounded-3xl border border-[#345C4F]/60 flex flex-col justify-between hover:border-[#C87D55]/60 transition-all duration-300 relative group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C87D55]/20 text-[#C87D55] flex items-center justify-center font-serif font-bold text-xl border border-[#C87D55]/30">
                  {step.number}
                </div>

                <h3 className="font-serif text-2xl font-semibold text-white">
                  {step.title}
                </h3>

                <p className="text-sm text-[#EBF2EE]/80 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#345C4F]/40 flex items-center gap-2 text-xs font-semibold text-[#C87D55]">
                <span>Step {idx + 1} of 4</span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Banner */}
        <div className="mt-16 text-center space-y-6 pt-6">
          <p className="text-lg text-[#EBF2EE] font-serif italic max-w-xl mx-auto">
            "Therapy should be a space where you never have to perform or push through."
          </p>

          <button
            onClick={onOpenBooking}
            className="bg-[#C87D55] hover:bg-[#B46A42] text-white px-8 py-4 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3 transform active:scale-95 cursor-pointer"
          >
            <span>Begin Your Therapy Journey</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
