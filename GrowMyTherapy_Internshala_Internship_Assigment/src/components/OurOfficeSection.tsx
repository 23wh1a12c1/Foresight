"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Sun, Shield, Coffee, Check, Maximize2, X } from "lucide-react";

export default function OurOfficeSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const officeImages = [
    {
      src: "/images/office_main.png",
      alt: "Dr. Maya Reynolds Therapy Office Main Seating Area in Santa Monica",
      title: "Main Counseling Room",
      caption: "Soft linen armchair and sofa with abundant natural coastal light.",
    },
    {
      src: "/images/office_nook.png",
      alt: "Grounding Nook with Psychology Books and Herbal Tea",
      title: "Grounding Nook",
      caption: "A quiet space for reflection with warm lighting and calming textures.",
    },
    {
      src: "/images/office_exterior.png",
      alt: "Boutique Santa Monica Office Building Entrance",
      title: "Private Office Entrance",
      caption: "Conveniently located at 123th Street 45 W, Santa Monica, CA 90401.",
    },
  ];

  return (
    <section id="office" className="py-20 bg-gradient-to-b from-[#FAF7F2] via-[#F4F0EA] to-[#FAF7F2] border-t border-[#E2DDD5]/80 relative overflow-hidden">
      
      {/* Background Decorative Accent */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#345C4F]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-[#C87D55]/15 text-[#C87D55] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
            <MapPin className="w-3.5 h-3.5" />
            <span>Physical Practice Space</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#234237]">
            Our Santa Monica Office: <br />
            <span className="italic text-[#C87D55]">A Calm Sanctuary for Healing</span>
          </h2>

          <p className="text-base sm:text-lg text-[#485A53] leading-relaxed">
            Located in downtown Santa Monica, our therapy office is intentionally designed to feel quiet, private, and deeply grounding from the moment you step inside.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-5 rounded-2xl border border-[#E2DDD5] shadow-xs flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EBF2EE] text-[#345C4F] flex items-center justify-center flex-shrink-0">
              <Sun className="w-5 h-5 text-[#C87D55]" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-[#234237] text-base">Abundant Natural Light</h4>
              <p className="text-xs text-[#6E8279]">Bright, warm, and uplifting atmosphere</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2DDD5] shadow-xs flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EBF2EE] text-[#345C4F] flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-[#345C4F]" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-[#234237] text-base">Private & Uncluttered</h4>
              <p className="text-xs text-[#6E8279]">Confidential, quiet sanctuary</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2DDD5] shadow-xs flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EBF2EE] text-[#345C4F] flex items-center justify-center flex-shrink-0">
              <Coffee className="w-5 h-5 text-[#C87D55]" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-[#234237] text-base">Comfort & Ease</h4>
              <p className="text-xs text-[#6E8279]">Ergonomic seating & tea station</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2DDD5] shadow-xs flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EBF2EE] text-[#345C4F] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#345C4F]" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-[#234237] text-base">Santa Monica & Online</h4>
              <p className="text-xs text-[#6E8279]">In-person or California Telehealth</p>
            </div>
          </div>
        </div>

        {/* Office Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {officeImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(img.src)}
              className="group cursor-pointer bg-white rounded-3xl p-3 border border-[#E2DDD5] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-[#EBF2EE]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="p-4 text-left">
                <h3 className="font-serif text-xl font-semibold text-[#234237]">
                  {img.title}
                </h3>
                <p className="text-xs text-[#6E8279] mt-1 leading-relaxed">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Location & Practice Info Card */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-[#E2DDD5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C87D55]">
              Visit Us In Santa Monica
            </span>
            <h3 className="font-serif text-2xl font-semibold text-[#234237]">
              123th Street 45 W, Santa Monica, CA 90401
            </h3>
            <p className="text-sm text-[#485A53] max-w-xl">
              Clients often share that the environment itself helps them feel more at ease the moment they arrive. We offer both in-person appointments in Santa Monica and HIPAA-compliant telehealth throughout California.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="https://maps.google.com/?q=Santa+Monica+CA"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#234237] hover:bg-[#345C4F] text-white px-6 py-3.5 rounded-full text-sm font-semibold text-center transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#C87D55]" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>

      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={selectedImage}
              alt="Santa Monica Therapy Office Enlarged View"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
