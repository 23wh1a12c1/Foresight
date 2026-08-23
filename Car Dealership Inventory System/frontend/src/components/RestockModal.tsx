import React, { useState } from 'react';
import { X, PlusSquare, PackageCheck } from 'lucide-react';
import { Vehicle } from '../types';

interface RestockModalProps {
  isOpen: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onConfirm: (vehicleId: string, quantity: number) => Promise<void>;
}

export const RestockModal: React.FC<RestockModalProps> = ({
  isOpen,
  vehicle,
  onClose,
  onConfirm,
}) => {
  const [addQty, setAddQty] = useState('5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(addQty, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a valid positive quantity.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onConfirm(vehicle.id, qty);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to restock inventory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
              <PlusSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Restock Vehicle Inventory</h2>
              <p className="text-xs text-slate-400">Admin Inventory Restock</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-5">
          <p className="text-sm font-bold text-white">{vehicle.make} {vehicle.model}</p>
          <p className="text-xs text-slate-400 mt-1">Current Stock in Inventory: <span className="text-sky-400 font-semibold">{vehicle.quantity} units</span></p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Additional Units to Add
            </label>
            <input
              type="number"
              value={addQty}
              onChange={(e) => setAddQty(e.target.value)}
              min="1"
              required
              className="w-full px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold shadow-lg shadow-sky-500/20 transition-all"
            >
              <PackageCheck className="w-4 h-4" />
              <span>{loading ? 'Processing...' : 'Confirm Restock'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
