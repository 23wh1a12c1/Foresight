"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, Brain, Activity, ShieldAlert, Sparkles, X } from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  details: string[];
  modalities: string[];
  image: string;
  icon: React.ReactNode;
}

interface ServicesSectionProps {
  onOpenBooking: () => void;
}

export default function ServicesSection({ onOpenBooking }: ServicesSectionProps) {
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const services: ServiceItem[] = [
    {
      id: "anxiety-burnout",
      title: "Anxiety, Stress & Burnout Therapy",
      subtitle: "For High-Achieving Professionals & Creatives",
      badge: "CBT & Mindful Strategy",
      description:
        "Many high-functioning adults quietly struggle with chronic worry, panic, or perfectionism. Therapy provides a dedicated space to break free from overthinking, set sustainable boundaries, and quiet your internal pressure.",
      details: [
        "Relief from chronic worry, panic attacks, and sleep disruption",
        "Addressing high internal pressure, imposter feelings, and perfectionism",
        "Practical Cognitive Behavioral Therapy (CBT) tools for daily regulation",
        "Navigating professional burnout for entrepreneurs and corporate leaders"
      ],
      modalities: ["CBT", "Mindfulness-Based Therapy", "Stress Management"],
      image: "/images/service_anxiety.png",
      icon: <Brain className="w-6 h-6 text-[#C87D55]" />,
    },
    {
      id: "trauma-emdr",
      title: "Trauma Recovery & EMDR Therapy",
      subtitle: "Paced Stabilization & Processing for Lasting Safety",
      badge: "EMDR Trauma Certified",
      description:
        "Whether you're healing from single-incident trauma or complex, long-standing relational patterns, EMDR therapy helps reprocess distressing memories gently without overwhelming your nervous system.",
      details: [
        "Eye Movement Desensitization and Reprocessing (EMDR) protocol",
        "Processing childhood experiences, relational trauma, or sudden loss",
        "Focus on safety, pacing, and somatic stabilization first",
        "Reducing hypervigilance, emotional triggers, and body tension"
      ],
      modalities: ["EMDR", "Trauma-Informed CBT", "Attachment Work"],
      image: "/images/service_trauma.png",
      icon: <ShieldAlert className="w-6 h-6 text-[#345C4F]" />,
    },
    {
      id: "somatic-mindfulness",
      title: "Somatic & Body-Oriented Therapy",
      subtitle: "Bridging the Mind-Body Connection for Nervous System Balance",
      badge: "In-Person & Telehealth",
      description:
        "Anxiety and stress aren't just thoughts—they live in the physical body. Body-oriented and mindfulness practices help you build genuine somatic regulation, so you feel calm, present, and grounded in daily life.",
      details: [
        "Mindfulness techniques tailored for busy, analytical minds",
        "Somatic grounding exercises for chest tightness and racing heart",
        "Building physiological resilience and nervous system regulation",
        "Available at our Santa Monica office & via secure California Telehealth"
      ],
      modalities: ["Somatic Techniques", "Mindfulness", "Polyvagal Informed"],
      image: "/images/office_nook.png",
      icon: <Activity className="w-6 h-6 text-[#C87D55]" />,
    },
  ];

  return (
    <section id="services" className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EBF2EE] text-[#345C4F] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C87D55]" />
            <span>Specialized Clinical Focus</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#234237]">
            Tailored Psychological Services
          </h2>

          <p className="text-base sm:text-lg text-[#485A53] leading-relaxed">
            Integrating evidence-based techniques with depth-oriented care for adults ready to experience relief, clarity, and sustainable inner strength.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E2DDD5] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              {/* Card Image Banner */}
              <div className="relative h-56 w-full overflow-hidden bg-[#EBF2EE]">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#234237] border border-white/50">
                  {service.badge}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E2DDD5] flex items-center justify-center">
                    {service.icon}
                  </div>

                  <h3 className="font-serif text-2xl font-semibold text-[#234237] leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs font-bold uppercase tracking-wider text-[#C87D55]">
                    {service.subtitle}
                  </p>

                  <p className="text-sm text-[#485A53] leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>

                {/* Modality Chips */}
                <div className="space-y-4 pt-4 border-t border-[#E2DDD5]/60">
                  <div className="flex flex-wrap gap-1.5">
                    {service.modalities.map((modality, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-[#EBF2EE] text-[#345C4F] px-2.5 py-1 rounded-md font-medium"
                      >
                        {modality}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveModalService(service)}
                    className="w-full py-3 px-4 rounded-xl border border-[#345C4F] text-[#345C4F] hover:bg-[#345C4F] hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Explore Service Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Booking Trigger */}
        <div className="mt-16 text-center bg-[#EBF2EE] border border-[#6C9788]/20 p-8 sm:p-10 rounded-3xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h4 className="font-serif text-2xl font-semibold text-[#234237]">
              Unsure Which Therapy Approach Fits Your Needs?
            </h4>
            <p className="text-sm text-[#485A53]">
              Schedule a complimentary 15-minute phone consultation with Dr. Maya Reynolds to discuss your goals.
            </p>
          </div>

          <button
            onClick={onOpenBooking}
            className="bg-[#C87D55] hover:bg-[#B46A42] text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg flex-shrink-0 cursor-pointer"
          >
            Request Consultation
          </button>
        </div>

      </div>

      {/* Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E2DDD5]">
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] text-[#234237] hover:bg-[#EBF2EE] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF2EE] flex items-center justify-center">
                  {activeModalService.icon}
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#C87D55] uppercase tracking-wider">
                    {activeModalService.badge}
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-[#234237]">
                    {activeModalService.title}
                  </h3>
                </div>
              </div>

              <p className="text-base text-[#485A53] leading-relaxed">
                {activeModalService.description}
              </p>

              <div className="space-y-3 bg-[#FAF7F2] p-5 rounded-2xl border border-[#E2DDD5]">
                <h4 className="font-serif text-lg font-semibold text-[#234237]">
                  Key Areas Addressed in Sessions:
                </h4>
                <ul className="space-y-2.5">
                  {activeModalService.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-[#485A53]">
                      <span className="w-5 h-5 rounded-full bg-[#345C4F] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    setActiveModalService(null);
                    onOpenBooking();
                  }}
                  className="flex-1 bg-[#C87D55] hover:bg-[#B46A42] text-white py-3.5 rounded-full font-semibold text-center text-sm transition-all shadow-sm"
                >
                  Schedule Consultation for This Service
                </button>
                <button
                  onClick={() => setActiveModalService(null)}
                  className="px-6 py-3.5 rounded-full border border-[#E2DDD5] text-[#485A53] hover:bg-[#FAF7F2] text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
