import React from 'react';
import { ShoppingBag, Edit3, Trash2, PlusSquare, Zap, ShieldAlert, CheckCircle, Heart, Info, Clock, Flame, Scale, Calculator, Calendar } from 'lucide-react';
import { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  isWishlisted?: boolean;
  isCompared?: boolean;
  onPurchase: (vehicle: Vehicle) => void;
  onToggleWishlist?: (vehicle: Vehicle) => void;
  onToggleCompare?: (vehicle: Vehicle) => void;
  onOpenDetails?: (vehicle: Vehicle) => void;
  onOpenFinancing?: (vehicle: Vehicle) => void;
  onOpenTestDrive?: (vehicle: Vehicle) => void;
  onEdit?: (vehicle: Vehicle) => void;
  onRestock?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isWishlisted = false,
  isCompared = false,
  onPurchase,
  onToggleWishlist,
  onToggleCompare,
  onOpenDetails,
  onOpenFinancing,
  onOpenTestDrive,
  onEdit,
  onRestock,
  onDelete,
}) => {
  const { isAuthenticated, isAdmin } = useAuth();

  const isOutOfStock = vehicle.quantity <= 0 && vehicle.status !== 'COMING_SOON';
  const isComingSoon = vehicle.status === 'COMING_SOON';
  const isLowStock = vehicle.status === 'LOW_STOCK' || (vehicle.quantity === 1 && vehicle.status !== 'COMING_SOON');

  const defaultImage =
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';

  const estimatedMonthly = Math.round(((vehicle.price * 0.8) * 0.0041) / (1 - Math.pow(1.0041, -60)));

  return (
    <div className="group relative bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 dark:hover:border-sky-500/40 overflow-hidden shadow-md hover:shadow-xl dark:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container & Overlays */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={vehicle.imageUrl && vehicle.imageUrl.startsWith('http') ? vehicle.imageUrl : defaultImage}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 dark:from-slate-950 via-slate-900/20 dark:via-slate-950/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-xs font-bold text-sky-700 dark:text-sky-400 shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          <span>{vehicle.category}</span>
        </div>

        {/* Action Buttons Top Right: Compare Checkbox & Wishlist Heart */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {/* Compare Button */}
          <button
            onClick={() => onToggleCompare?.(vehicle)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md transition-all shadow-sm ${
              isCompared
                ? 'bg-sky-500 text-white shadow-sky-500/40'
                : 'bg-white/80 dark:bg-slate-950/80 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-900'
            }`}
            title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => onToggleWishlist?.(vehicle)}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isWishlisted
                ? 'bg-rose-500 text-white shadow-rose-500/40'
                : 'bg-white/80 dark:bg-slate-950/80 text-slate-600 dark:text-slate-300 hover:text-rose-500'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Status Indicator Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border shadow-sm ${
              isComingSoon
                ? 'bg-purple-100 dark:bg-purple-950/90 border-purple-300 dark:border-purple-500/40 text-purple-900 dark:text-purple-300'
                : isOutOfStock
                ? 'bg-rose-100 dark:bg-rose-950/90 border-rose-300 dark:border-rose-500/50 text-rose-800 dark:text-rose-300'
                : isLowStock
                ? 'bg-amber-100 dark:bg-amber-950/90 border-amber-300 dark:border-amber-500/50 text-amber-900 dark:text-amber-300 animate-pulse'
                : 'bg-emerald-100 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-500/50 text-emerald-900 dark:text-emerald-300'
            }`}
          >
            {isComingSoon ? (
              <>
                <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>COMING SOON</span>
              </>
            ) : isOutOfStock ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>SOLD OUT</span>
              </>
            ) : isLowStock ? (
              <>
                <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>ONLY {vehicle.quantity} LEFT!</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{vehicle.quantity} IN STOCK</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold">{vehicle.year} MODEL</span>
            {vehicle.horsepower && (
              <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400 font-bold">{vehicle.horsepower} HP</span>
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            {vehicle.make} <span className="font-semibold text-slate-700 dark:text-slate-300">{vehicle.model}</span>
          </h3>

          <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 mt-2 leading-relaxed">
            {vehicle.description || 'Precision engineered luxury automobile with peak aerodynamics and comfort.'}
          </p>
        </div>

        {/* Quick Options Bar (Financing & Test Drive) */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
          <button
            onClick={() => onOpenFinancing?.(vehicle)}
            className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Est. ${estimatedMonthly.toLocaleString()}/mo</span>
          </button>

          <button
            onClick={() => onOpenTestDrive?.(vehicle)}
            className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold hover:underline"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Test Drive</span>
          </button>
        </div>

        {/* Price & Purchase Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">MSRP:</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ${vehicle.price.toLocaleString('en-US')}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDetails?.(vehicle)}
              className="px-3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
              title="View Specs & Details"
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              onClick={() => onPurchase(vehicle)}
              disabled={isOutOfStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold tracking-wide transition-all transform ${
                isComingSoon
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20'
                  : isOutOfStock
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700/50 cursor-not-allowed opacity-70'
                  : 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-md hover:shadow-lg shadow-sky-500/20 hover:-translate-y-0.5'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {isComingSoon
                  ? 'Pre-Order Now'
                  : isOutOfStock
                  ? 'Sold Out'
                  : 'Purchase Vehicle'}
              </span>
            </button>
          </div>

          {/* Admin Management Tools */}
          {isAuthenticated && isAdmin && (
            <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/60">
              <button
                onClick={() => onEdit?.(vehicle)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Edit Details"
              >
                <Edit3 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                Edit
              </button>

              <button
                onClick={() => onRestock?.(vehicle)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/80 dark:hover:bg-sky-900 text-xs font-semibold text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 transition-colors"
                title="Add Inventory Quantity"
              >
                <PlusSquare className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                Restock
              </button>

              <button
                onClick={() => onDelete?.(vehicle)}
                className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 transition-colors"
                title="Delete Vehicle"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
