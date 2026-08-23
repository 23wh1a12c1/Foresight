import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, CheckCircle, Mail, Phone, MapPin, CreditCard, ShieldCheck, FileText, Sparkles } from 'lucide-react';
import { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';

interface CustomerOrderModalProps {
  isOpen: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onConfirmOrder: (orderDetails: any) => Promise<void>;
}

export const CustomerOrderModal: React.FC<CustomerOrderModalProps> = ({
  isOpen,
  vehicle,
  onClose,
  onConfirmOrder,
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'checkout' | 'confirmation'>('checkout');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'Financing',
    deliveryType: 'Home Delivery',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSummary, setOrderSummary] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('checkout');
      setError('');
      setFormData({
        fullName: user?.name || 'Meghana K',
        email: user?.email || 'kmegha9505@gmail.com',
        phone: '+91 98765 43210',
        address: 'BVRIT Hyderabad College Campus, Bachupally, Hyderabad, Telangana 500090',
        paymentMethod: 'Financing',
        deliveryType: 'Home Delivery',
      });
    }
  }, [isOpen, user]);

  if (!isOpen || !vehicle) return null;

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      setError('Please fill in all contact and delivery fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onConfirmOrder({
        vehicleId: vehicle.id,
        ...formData,
      });

      const orderId = `APEX-${Date.now().toString().slice(-6)}`;
      const taxAmount = vehicle.price * 0.08;
      const grandTotal = vehicle.price + taxAmount;

      setOrderSummary({
        orderId,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        vehicle,
        customer: formData,
        taxAmount,
        grandTotal,
      });

      setStep('confirmation');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Order submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {step === 'checkout' ? 'Customer Purchase Order Checkout' : 'Order Confirmed & Invoice Receipt'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {step === 'checkout' ? 'Enter delivery & contact details' : 'Confirmation notifications dispatched'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow space-y-5">
          {step === 'checkout' ? (
            <form onSubmit={handleSubmitCheckout} className="space-y-4">
              {/* Selected Vehicle Card Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    Selected Vehicle
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{vehicle.category} • {vehicle.horsepower || 500} HP</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">MSRP</span>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                    ${vehicle.price.toLocaleString('en-US')}
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs">
                  {error}
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-500" /> Customer Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Email Address (For Confirmation Mail) *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Mobile Phone Number (For SMS Alerts) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        placeholder="+91 9876543210"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Payment Method
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
                      >
                        <option value="Financing">Dealership Financing</option>
                        <option value="Bank Wire">Bank Wire Transfer</option>
                        <option value="Card">Credit / Debit Card</option>
                        <option value="Cash">Cash on Delivery</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={2}
                      required
                      placeholder="Street, Landmark, City, State, Pincode"
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{loading ? 'Processing Order...' : 'Confirm Order & Send Receipts'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Order Confirmation & Digital Receipt View */
            <div className="space-y-5 animate-slide-up">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-center space-y-1">
                <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h3 className="text-xl font-black text-emerald-900 dark:text-emerald-200">
                  Order Successfully Confirmed!
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  Order ID: <span className="font-mono font-bold">{orderSummary?.orderId}</span>
                </p>
              </div>

              {/* Notifications Dispatched Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-500" /> Notifications Dispatched
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>Email Confirmation sent to: <strong className="text-slate-900 dark:text-white">{orderSummary?.customer?.email}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>SMS Order Tracking sent to: <strong className="text-slate-900 dark:text-white">{orderSummary?.customer?.phone}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Delivery Address: <strong className="text-slate-900 dark:text-white">{orderSummary?.customer?.address}</strong></span>
                  </p>
                </div>
              </div>

              {/* Invoice Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Invoice Summary
                  </span>
                  <span className="text-xs font-mono text-slate-400">{orderSummary?.date}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>{vehicle.make} {vehicle.model} ({vehicle.year})</span>
                    <span className="font-semibold">${vehicle.price.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Estimated Taxes & Registration (8%)</span>
                    <span>${orderSummary?.taxAmount?.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Delivery & Dealer Handling</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Total Amount Paid</span>
                  <span className="text-xl font-black text-sky-600 dark:text-sky-400">
                    ${orderSummary?.grandTotal?.toLocaleString('en-US')}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-bold shadow-md transition-colors"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
