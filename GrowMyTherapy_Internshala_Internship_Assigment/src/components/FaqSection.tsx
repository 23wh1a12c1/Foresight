"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "What types of clients do you specialize in working with?",
      answer:
        "I specialize in working with thoughtful, high-achieving adults, professionals, creatives, and entrepreneurs who experience anxiety, panic, chronic stress, trauma, perfectionism, or professional burnout. Many of my clients appear 'functional' on the outside while feeling internally exhausted or stuck in overthinking.",
    },
    {
      question: "Do you offer in-person sessions or telehealth in California?",
      answer:
        "Both! I provide in-person therapy from my quiet, private office located at 123th Street 45 W in Santa Monica, CA 90401. I also offer secure, HIPAA-compliant telehealth video sessions for clients located anywhere within the state of California.",
    },
    {
      question: "How does EMDR therapy work for trauma and anxiety?",
      answer:
        "Eye Movement Desensitization and Reprocessing (EMDR) is an evidence-based therapy that helps the brain reprocess distressing memories or painful patterns. In our work, EMDR is paced very carefully—we prioritize safety, grounding, and nervous system stabilization first, so you feel regulated throughout the process.",
    },
    {
      question: "What is your therapeutic approach and session style?",
      answer:
        "My approach is warm, collaborative, and grounded. Sessions are structured enough to feel supportive and goal-oriented, while leaving ample room for depth and reflection. I integrate Cognitive Behavioral Therapy (CBT), EMDR, somatic techniques, and mindfulness practices.",
    },
    {
      question: "What happens during the initial 15-minute consultation?",
      answer:
        "The initial phone consultation is a free, low-pressure conversation. We'll briefly discuss what you're seeking help with, answer any questions about my practice, cover scheduling and logistics, and make sure we feel like a great mutual fit.",
    },
    {
      question: "What is your Santa Monica office environment like?",
      answer:
        "My office is designed to be a calm, quiet sanctuary with abundant natural coastal light, comfortable seating, and an uncluttered environment. Clients frequently share that the physical space itself helps them feel settled and at ease when they arrive.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-[#FAF7F2] border-t border-[#E2DDD5]/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 bg-[#EBF2EE] text-[#345C4F] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-[#C87D55]" />
            <span>Common Questions</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#234237]">
            Frequently Asked Questions
          </h2>

          <p className="text-base sm:text-lg text-[#485A53]">
            Clear answers about therapy with Dr. Maya Reynolds, session formats, and getting started.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#E2DDD5] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 font-serif text-lg sm:text-xl font-semibold text-[#234237] hover:text-[#345C4F] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E2DDD5] flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#EBF2EE] text-[#C87D55]" : "text-[#345C4F]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm sm:text-base text-[#485A53] leading-relaxed border-t border-[#E2DDD5]/50 animate-fade-in">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Note */}
        <div className="mt-12 text-center text-sm text-[#6E8279]">
          Have a question not listed here?{" "}
          <a href="#contact" className="text-[#C87D55] font-semibold underline underline-offset-2 hover:text-[#B46A42]">
            Send a direct message
          </a>{" "}
          or call (310) 555-0192.
        </div>

      </div>
    </section>
  );
}
