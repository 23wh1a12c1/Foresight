"use client";

import React from "react";
import { Star, Quote, Heart } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "For years I was the person who 'had it all together' while quietly battling severe anxiety and panic. Working with Dr. Maya gave me practical CBT tools and a calm space where I didn't have to keep performing. Her Santa Monica office is a true haven.",
      author: "Creative Director & Entrepreneur",
      location: "Santa Monica, CA",
      focus: "Anxiety & Burnout Therapy",
    },
    {
      quote:
        "EMDR therapy with Dr. Maya was life-changing. Her pace was so thoughtful and gentle. She never rushed me into hard memories until we had established real grounding techniques. I finally feel regulated in my body.",
      author: "Senior Software Executive",
      location: "California Telehealth Client",
      focus: "EMDR Trauma Recovery",
    },
    {
      quote:
        "As a high achiever struggling with perfectionism, therapy used to feel intimidating. Dr. Maya’s warm, structured, and insightful approach helped me slow down and reconnect with what actually matters. Highly recommend her practice.",
      author: "Legal Professional",
      location: "Los Angeles, CA",
      focus: "Perfectionism & Stress Relief",
    },
  ];

  return (
    <section className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EBF2EE] text-[#345C4F] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
            <Heart className="w-3.5 h-3.5 text-[#C87D55]" />
            <span>Client Experiences</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#234237]">
            Words of Warmth & Relief
          </h2>

          <p className="text-base sm:text-lg text-[#485A53] leading-relaxed">
            Reflections from adults who sought therapy for anxiety, trauma, and burnout with Dr. Maya Reynolds.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-[#E2DDD5] shadow-xs flex flex-col justify-between space-y-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#C87D55]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-[#C87D55]/30" />

                <p className="text-sm sm:text-base text-[#485A53] leading-relaxed italic font-normal">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2DDD5]/60">
                <p className="font-serif font-semibold text-[#234237] text-base">
                  {item.author}
                </p>
                <div className="flex items-center justify-between text-xs text-[#6E8279] mt-1">
                  <span>{item.location}</span>
                  <span className="bg-[#EBF2EE] text-[#345C4F] px-2 py-0.5 rounded-md font-medium">
                    {item.focus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
