"use client";

import React, { useState } from "react";
import { X, Calendar, CheckCircle2, ShieldCheck, Lock } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    sessionType: "in-person",
    primaryFocus: "anxiety-burnout",
    message: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl border border-[#E2DDD5] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] text-[#234237] hover:bg-[#EBF2EE] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="space-y-6">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#EBF2EE] text-[#345C4F] px-3 py-1 rounded-full text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5 text-[#C87D55]" />
                <span>Free 15-Minute Consultation</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#234237]">
                Schedule Your Free Call
              </h3>
              <p className="text-sm text-[#485A53]">
                Connect directly with Dr. Maya Reynolds to discuss your goals and ask any questions before starting therapy.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#234237] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g., Sarah Jenkins"
                  className="w-full px-4 py-3 rounded-xl border border-[#E2DDD5] bg-[#FAF7F2] text-sm text-[#234237] focus:outline-none focus:border-[#345C4F] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#234237] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#E2DDD5] bg-[#FAF7F2] text-sm text-[#234237] focus:outline-none focus:border-[#345C4F] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#234237] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(310) 555-0123"
                    className="w-full px-4 py-3 rounded-xl border border-[#E2DDD5] bg-[#FAF7F2] text-sm text-[#234237] focus:outline-none focus:border-[#345C4F] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#234237] mb-1">
                    Preferred Format
                  </label>
                  <select
                    value={formData.sessionType}
                    onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2DDD5] bg-[#FAF7F2] text-sm text-[#234237] focus:outline-none focus:border-[#345C4F] focus:bg-white transition-all"
                  >
                    <option value="in-person">In-Person (Santa Monica Office)</option>
                    <option value="telehealth">Telehealth (California-wide)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#234237] mb-1">
                    Primary Focus
                  </label>
                  <select
                    value={formData.primaryFocus}
                    onChange={(e) => setFormData({ ...formData, primaryFocus: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2DDD5] bg-[#FAF7F2] text-sm text-[#234237] focus:outline-none focus:border-[#345C4F] focus:bg-white transition-all"
                  >
                    <option value="anxiety-burnout">Anxiety & Burnout</option>
                    <option value="trauma-emdr">Trauma & EMDR Recovery</option>
                    <option value="somatic-mindfulness">Somatic & Stress Relief</option>
                    <option value="other">General Consultation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#234237] mb-1">
                  Brief Note or Questions (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share anything you'd like Dr. Maya to know prior to your call..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E2DDD5] bg-[#FAF7F2] text-sm text-[#234237] focus:outline-none focus:border-[#345C4F] focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#C87D55] hover:bg-[#B46A42] text-white py-4 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Request Consultation Call
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#6E8279] pt-1">
                <Lock className="w-3.5 h-3.5 text-[#345C4F]" />
                <span>Strictly Confidential & HIPAA Compliant</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#EBF2EE] text-[#345C4F] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-[#C87D55]" />
            </div>

            <h3 className="font-serif text-3xl font-semibold text-[#234237]">
              Consultation Requested!
            </h3>

            <p className="text-base text-[#485A53] max-w-md mx-auto">
              Thank you, <strong>{formData.fullName}</strong>. Dr. Maya Reynolds’ practice will contact you within 24 business hours at <strong>{formData.email}</strong> to confirm your phone call timing.
            </p>

            <button
              onClick={handleReset}
              className="bg-[#234237] hover:bg-[#345C4F] text-white px-8 py-3 rounded-full text-sm font-semibold transition-all"
            >
              Return to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
