import React from 'react';
import { X, Heart, ShoppingBag, Zap, Gauge, Flame, ShieldAlert, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';

interface VehicleDetailModalProps {
  isOpen: boolean;
  vehicle: Vehicle | null;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (vehicle: Vehicle) => void;
  onPurchase: (vehicle: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  isOpen,
  vehicle,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onPurchase,
}) => {
  const { isAuthenticated } = useAuth();

  if (!isOpen || !vehicle) return null;

  const isOutOfStock = vehicle.quantity <= 0 && vehicle.status !== 'COMING_SOON';
  const isComingSoon = vehicle.status === 'COMING_SOON';
  const isLowStock = vehicle.status === 'LOW_STOCK' || (vehicle.quantity === 1 && vehicle.status !== 'COMING_SOON');

  const defaultImage =
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        {/* Banner Image Header */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-950 shrink-0">
          <img
            src={vehicle.imageUrl || defaultImage}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-black/40" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => onToggleWishlist(vehicle)}
            className={`absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
              isWishlisted
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                : 'bg-slate-900/80 hover:bg-slate-900 text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Category & Status Overlay Badges */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3.5 py-1 rounded-full bg-white/90 dark:bg-slate-950/80 text-sky-700 dark:text-sky-400 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md shadow-sm border border-slate-200 dark:border-slate-800">
              {vehicle.category}
            </span>

            <span
              className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                isComingSoon
                  ? 'bg-purple-100 dark:bg-purple-950/90 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-500/40'
                  : isOutOfStock
                  ? 'bg-rose-100 dark:bg-rose-950/90 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/40'
                  : isLowStock
                  ? 'bg-amber-100 dark:bg-amber-950/90 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-500/40'
                  : 'bg-emerald-100 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40'
              }`}
            >
              {isComingSoon
                ? '⏳ COMING SOON'
                : isOutOfStock
                ? '🚫 SOLD OUT'
                : isLowStock
                ? `⚡ ONLY ${vehicle.quantity} LEFT`
                : `✅ IN STOCK (${vehicle.quantity} UNITS)`}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-grow">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
              <span>{vehicle.year} EDITION</span>
              <span className="font-mono">VIN/ID: {vehicle.id}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {vehicle.make} <span className="text-sky-600 dark:text-sky-400">{vehicle.model}</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-2">
              {vehicle.description || 'Precision engineered luxury performance automobile with aerodynamically sculpted bodywork and state-of-the-art cabin digital controls.'}
            </p>
          </div>

          {/* Key Performance Specifications Grid */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              Technical Specifications & Performance
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center">
                <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p className="text-lg font-black text-slate-900 dark:text-white">{vehicle.horsepower || 520} hp</p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase">Horsepower</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center">
                <Gauge className="w-5 h-5 text-sky-500 mx-auto mb-1" />
                <p className="text-lg font-black text-slate-900 dark:text-white">{vehicle.zeroToSixty || '3.2s'}</p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase">0-60 mph</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center">
                <Zap className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <p className="text-lg font-black text-slate-900 dark:text-white">{vehicle.topSpeed || '180 mph'}</p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase">Top Speed</p>
              </div>
            </div>
          </div>

          {/* Pricing & Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">MSRP Price:</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                ${vehicle.price.toLocaleString('en-US')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onPurchase(vehicle);
                  onClose();
                }}
                disabled={isOutOfStock}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
                  isComingSoon
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20'
                    : isOutOfStock
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-sky-500/20'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isComingSoon
                    ? 'Pre-Order / Reserve'
                    : isOutOfStock
                    ? 'Sold Out'
                    : 'Purchase Vehicle'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
