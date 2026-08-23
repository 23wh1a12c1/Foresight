import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Edit3, Car } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Vehicle>) => Promise<void>;
  initialData?: Vehicle | null;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: 'Electric',
    year: 2024,
    price: '',
    quantity: '1',
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        make: initialData.make,
        model: initialData.model,
        category: initialData.category,
        year: initialData.year,
        price: initialData.price.toString(),
        quantity: initialData.quantity.toString(),
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
      });
    } else {
      setFormData({
        make: '',
        model: '',
        category: 'Electric',
        year: 2024,
        price: '',
        quantity: '1',
        description: '',
        imageUrl: '',
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make || !formData.model || !formData.price) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSubmit({
        make: formData.make,
        model: formData.model,
        category: formData.category,
        year: Number(formData.year),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        description: formData.description,
        imageUrl: formData.imageUrl,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save vehicle details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
              {initialData ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {initialData ? 'Update Vehicle Details' : 'Add New Vehicle to Inventory'}
              </h2>
              <p className="text-xs text-slate-400">Admin Dealership Management Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 mb-5 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Make *</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                placeholder="e.g. Tesla, BMW"
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Model *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Model 3, M4"
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
              >
                <option value="Electric">Electric</option>
                <option value="Sports">Sports</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Truck">Truck</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Initial Stock *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Price ($ USD) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 75000"
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Key specifications, horsepower, range, trim packages..."
              className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/20 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Update Vehicle' : 'Create Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
