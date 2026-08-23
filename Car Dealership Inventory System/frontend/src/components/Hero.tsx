import React from 'react';
import { Car, Zap, Shield, Sparkles } from 'lucide-react';
import { Vehicle } from '../types';

interface HeroProps {
  vehicles: Vehicle[];
}

export const Hero: React.FC<HeroProps> = ({ vehicles }) => {
  const totalVehicles = vehicles.reduce((acc, v) => acc + v.quantity, 0);
  const electricCount = vehicles.filter((v) => v.category === 'Electric').length;
  const sportsCount = vehicles.filter((v) => v.category === 'Sports').length;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 mb-10 shadow-2xl border border-slate-800">
      {/* Background Glow Effect */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Luxury & Performance Inventory System
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Find & Reserve Your Next <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Dream Vehicle</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
            Explore our verified high-performance inventory with real-time stock availability, multi-parameter search, and instant reservation processing.
          </p>
        </div>

        {/* Inventory Analytics Stats Badges */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-colors shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-300 mb-3">
              <Car className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-white">{totalVehicles} Units</p>
            <p className="text-xs text-slate-300">Total Available Stock</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-colors shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-white">{electricCount} EV Models</p>
            <p className="text-xs text-slate-300">Zero Emission Lineup</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-colors shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-white">{sportsCount} Sports</p>
            <p className="text-xs text-slate-300">Performance Vehicles</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-colors shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-white">100% Certified</p>
            <p className="text-xs text-slate-300">Inspected & Warranted</p>
          </div>
        </div>
      </div>
    </div>
  );
};
