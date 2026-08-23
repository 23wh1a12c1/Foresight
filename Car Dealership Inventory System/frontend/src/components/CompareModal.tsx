import React from 'react';
import { X, CheckCircle, ShieldAlert, Clock, Flame, Scale, ShoppingBag } from 'lucide-react';
import { Vehicle } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  vehicles: Vehicle[];
  onClose: () => void;
  onRemove: (vehicleId: string) => void;
  onPurchase: (vehicle: Vehicle) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  vehicles,
  onClose,
  onRemove,
  onPurchase,
}) => {
  if (!isOpen || vehicles.length === 0) return null;

  const defaultImage =
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Side-by-Side Vehicle Comparison
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Comparing specifications & performance metrics ({vehicles.length} Selected)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid Table */}
        <div className="p-6 overflow-x-auto flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[600px]">
            {vehicles.map((v) => {
              const isOutOfStock = v.quantity <= 0 && v.status !== 'COMING_SOON';
              const isComingSoon = v.status === 'COMING_SOON';

              return (
                <div
                  key={v.id}
                  className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="relative h-40 rounded-xl overflow-hidden bg-slate-900 mb-2">
                    <img
                      src={v.imageUrl || defaultImage}
                      alt={`${v.make} ${v.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultImage;
                      }}
                    />
                    <button
                      onClick={() => onRemove(v.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white backdrop-blur-md transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                      {v.category} • {v.year}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {v.make} {v.model}
                    </h3>
                  </div>

                  {/* Spec Comparison Attributes */}
                  <div className="space-y-2 text-xs border-t border-b border-slate-200 dark:border-slate-800/80 py-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">MSRP Price:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">${v.price.toLocaleString('en-US')}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Horsepower:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{v.horsepower || 500} HP</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">0-60 mph:</span>
                      <span className="font-bold text-sky-600 dark:text-sky-400">{v.zeroToSixty || '3.2s'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Top Speed:</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">{v.topSpeed || '180 mph'}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Stock Status:</span>
                      <span
                        className={`font-bold ${
                          isComingSoon
                            ? 'text-purple-600 dark:text-purple-400'
                            : isOutOfStock
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {isComingSoon ? 'Coming Soon' : isOutOfStock ? 'Sold Out' : `${v.quantity} Units`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onPurchase(v);
                      onClose();
                    }}
                    disabled={isOutOfStock}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isComingSoon
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : isOutOfStock
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isComingSoon ? 'Pre-Order' : isOutOfStock ? 'Sold Out' : 'Purchase'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
