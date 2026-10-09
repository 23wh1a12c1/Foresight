"use client";

import React from "react";
import { Compass, Sparkles, AlertCircle, RefreshCw, Feather } from "lucide-react";

export default function IntroBanner() {
  return (
    <section className="py-16 md:py-20 bg-[#FAF7F2] border-y border-[#E2DDD5]/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 bg-[#F2EBE1] text-[#C87D55] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
          <Feather className="w-3.5 h-3.5" />
          <span>Understanding Your Journey</span>
        </div>

        {/* Empathy Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#234237] leading-tight">
          "Highly Functional" on the Outside, But <br className="hidden sm:inline" />
          <span className="italic text-[#C87D55]">Quietly Struggling</span> on the Inside?
        </h2>

        <p className="text-base sm:text-lg text-[#485A53] leading-relaxed max-w-3xl mx-auto font-normal">
          You might be a driven professional, creative, entrepreneur, or caregiver who appears self-aware and put-together. Yet internally, you may be experiencing constant tension, overthinking, difficulty resting, or feeling like you are always bracing for something to go wrong.
        </p>

        {/* 3 Core Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
          <div className="bg-white p-6 rounded-2xl border border-[#E2DDD5] shadow-xs hover:border-[#6C9788]/40 transition-all">
            <div className="w-10 h-10 rounded-full bg-[#EBF2EE] text-[#345C4F] flex items-center justify-center mb-4">
              <AlertCircle className="w-5 h-5 text-[#C87D55]" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#234237] mb-2">
              Constant Overthinking
            </h3>
            <p className="text-sm text-[#485A53] leading-relaxed">
              Feeling stuck in endless loops of worry, internal pressure, and high standards that leave you feeling emotionally drained.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2DDD5] shadow-xs hover:border-[#6C9788]/40 transition-all">
            <div className="w-10 h-10 rounded-full bg-[#EBF2EE] text-[#345C4F] flex items-center justify-center mb-4">
              <RefreshCw className="w-5 h-5 text-[#345C4F]" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#234237] mb-2">
              Nervous System Exhaustion
            </h3>
            <p className="text-sm text-[#485A53] leading-relaxed">
              Experiencing physical symptoms of chronic stress—tightness in your chest, shallow breathing, muscle tension, or poor sleep.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2DDD5] shadow-xs hover:border-[#6C9788]/40 transition-all">
            <div className="w-10 h-10 rounded-full bg-[#EBF2EE] text-[#345C4F] flex items-center justify-center mb-4">
              <Compass className="w-5 h-5 text-[#C87D55]" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#234237] mb-2">
              Lingering Impact of Past Events
            </h3>
            <p className="text-sm text-[#485A53] leading-relaxed">
              Navigating earlier life experiences or relationship patterns that still affect your present sense of safety and confidence.
            </p>
          </div>
        </div>

        {/* Reassurance Callout */}
        <div className="bg-[#EBF2EE] border border-[#6C9788]/30 p-6 rounded-2xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full bg-[#345C4F] text-white flex-shrink-0 flex items-center justify-center font-bold text-lg">
            ✓
          </div>
          <div>
            <h4 className="font-serif text-lg font-semibold text-[#234237]">
              Therapy is a space to slow down—not just push through.
            </h4>
            <p className="text-sm text-[#485A53] mt-0.5">
              Dr. Maya Reynolds combines evidence-based psychological tools with a compassionate, non-judgmental environment so you can feel truly regulated and at ease.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
