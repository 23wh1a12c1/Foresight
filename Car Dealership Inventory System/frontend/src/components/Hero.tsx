import React, { useState, useEffect } from 'react';
import { Car, Zap, Shield, Sparkles, Flame, Clock, Award, Star, ArrowRight } from 'lucide-react';
import { Vehicle } from '../types';

interface HeroProps {
  vehicles: Vehicle[];
}

export const Hero: React.FC<HeroProps> = ({ vehicles }) => {
  const totalUnits = vehicles.reduce((acc, v) => acc + v.quantity, 0);
  const hypercarsCount = vehicles.filter((v) => v.category === 'Hypercar' || v.category === 'Supercar').length;
  const electricCount = vehicles.filter((v) => v.category === 'Electric').length;

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 mb-10 shadow-2xl border border-slate-800/80">
      {/* Background Animated Glow Blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-500/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Alert Bar */}
      <div className="mb-6 inline-flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-bold shadow-lg">
        <span className="flex items-center gap-1.5 text-amber-400">
          <Flame className="w-4 h-4 fill-amber-400" />
          <span>VIP DEAL OF THE DAY</span>
        </span>
        <span className="text-slate-400">|</span>
        <span className="text-slate-200">2024 Koenigsegg Jesko Attack (1,600 HP)</span>
        <span className="text-slate-400">|</span>
        <span className="flex items-center gap-1 font-mono text-sky-400">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s Left
          </span>
        </span>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column Content */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Incubyte TDD Kata • Apex Auto Pro
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
            Precision Luxury & <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Supercar Inventory
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
            Explore 24 verified luxury hypercars, supercars, and EVs with real-time stock status, side-by-side spec comparison, monthly EMI loan calculations, and instant purchase checkout.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-1 text-amber-400 text-xs font-extrabold">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="ml-1 text-white">4.9/5 Rating</span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
              <Award className="w-4 h-4 text-sky-400" /> #1 Luxury Dealership Showcase 2026
            </span>
          </div>
        </div>

        {/* Right Column Analytics Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 hover:border-white/30 transition-all shadow-xl group">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-300 mb-3 group-hover:scale-110 transition-transform">
              <Car className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-white">{totalUnits || 24} Units</p>
            <p className="text-xs font-semibold text-slate-300 mt-0.5">Live Available Stock</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 hover:border-white/30 transition-all shadow-xl group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 mb-3 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-white">{hypercarsCount || 8} Supercars</p>
            <p className="text-xs font-semibold text-slate-300 mt-0.5">Hypercars & Speedsters</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 hover:border-white/30 transition-all shadow-xl group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 mb-3 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-white">{electricCount || 6} Electric</p>
            <p className="text-xs font-semibold text-slate-300 mt-0.5">Zero-Emission EVs</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 hover:border-white/30 transition-all shadow-xl group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 mb-3 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-white">100% TDD</p>
            <p className="text-xs font-semibold text-slate-300 mt-0.5">Verified API & Tests</p>
          </div>
        </div>
      </div>
    </div>
  );
};
