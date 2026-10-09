"use client";

import React from "react";
import Image from "next/image";
import { Award, BookOpen, HeartHandshake, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-[#FAF7F2] border-t border-[#E2DDD5]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Portrait & Highlights */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Image Frame */}
              <div className="relative rounded-3xl overflow-hidden border border-[#E2DDD5] shadow-xl bg-white p-3">
                <div className="relative h-[480px] w-full rounded-2xl overflow-hidden bg-[#EBF2EE]">
                  <Image
                    src="/images/dr_maya_reynolds.png"
                    alt="Dr. Maya Reynolds, PsyD - Licensed Clinical Psychologist"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>

                {/* Bottom Experience Badge */}
                <div className="p-4 bg-[#FAF7F2] rounded-xl mt-3 border border-[#E2DDD5]/80 flex items-center justify-between text-xs text-[#234237]">
                  <div className="flex items-center gap-2 font-semibold">
                    <Award className="w-4 h-4 text-[#C87D55]" />
                    <span>Doctor of Psychology (PsyD)</span>
                  </div>
                  <span className="text-[#6E8279] font-medium">Santa Monica, CA</span>
                </div>
              </div>

              {/* Decorative Backing Accent */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#C87D55]/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>
          </div>

          {/* Right Column: Bio Content */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-[#EBF2EE] text-[#345C4F] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
              <HeartHandshake className="w-3.5 h-3.5 text-[#C87D55]" />
              <span>Meet Your Psychologist</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#234237] leading-tight">
              Hi, I’m Dr. Maya Reynolds, PsyD.
            </h2>

            <p className="text-lg text-[#345C4F] font-medium leading-relaxed">
              I’m a licensed clinical psychologist based in Santa Monica, California, offering warm, grounded therapy for adults who feel overwhelmed by anxiety, stress, or past experiences.
            </p>

            <div className="space-y-4 text-base text-[#485A53] leading-relaxed">
              <p>
                Many of the people I work with are high-achieving, thoughtful, and self-aware—but internally feel exhausted, stuck in overthinking, or emotionally on edge. On the outside, you may appear completely "functional," while quietly struggling with constant worry, muscle tension, or a sense that you're always bracing for something to go wrong.
              </p>
              <p>
                I take a <strong>collaborative, warm, and structured approach</strong> to therapy. Sessions are designed to feel supportive and organized, while still leaving spacious room for deep reflection. I integrate evidence-based methods such as <strong>Cognitive Behavioral Therapy (CBT), EMDR, mindfulness, and body-oriented somatic practices</strong> to address both the emotional and physiological sides of your experience.
              </p>
              <p>
                Therapy works best when you feel respected, understood, and actively involved. My goal is not just temporary symptom relief, but helping you develop long-term insight, nervous system resilience, and a healthier relationship with yourself.
              </p>
            </div>

            {/* Core Values / Approach Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-white p-4 rounded-2xl border border-[#E2DDD5] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EBF2EE] text-[#345C4F] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-[#234237]">Paced & Safe Trauma Work</h4>
                  <p className="text-xs text-[#6E8279] mt-0.5">Focusing on stabilization and regulation before diving deep into difficult memories.</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2DDD5] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EBF2EE] text-[#345C4F] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-[#234237]">Mind-Body Integration</h4>
                  <p className="text-xs text-[#6E8279] mt-0.5">Combining cognitive insights with somatic tools for holistic physical ease.</p>
                </div>
              </div>
            </div>

            {/* Location & Format Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-sm text-[#234237] font-medium">
              <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E2DDD5] px-4 py-2 rounded-full">
                <MapPin className="w-4 h-4 text-[#C87D55]" />
                <span>In-Person: 123th Street 45 W, Santa Monica, CA</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E2DDD5] px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-[#345C4F]" />
                <span>Telehealth Available Across California</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
