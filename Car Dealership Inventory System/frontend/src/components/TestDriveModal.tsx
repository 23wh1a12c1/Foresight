import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, Phone, CheckCircle2, Car } from 'lucide-react';
import { Vehicle } from '../types';

interface TestDriveModalProps {
  isOpen: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onBookTestDrive: (bookingDetails: any) => void;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  isOpen,
  vehicle,
  onClose,
  onBookTestDrive,
}) => {
  const [bookingType, setBookingType] = useState<'SHOWROOM' | 'HOME_DELIVERY'>('SHOWROOM');
  const [date, setDate] = useState<string>(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('11:00 AM');
  const [fullName, setFullName] = useState<string>('Meghana K');
  const [phone, setPhone] = useState<string>('+91 98765 43210');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBookTestDrive({
      vehicle,
      bookingType,
      date,
      timeSlot,
      fullName,
      phone,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Book a VIP Test Drive
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Experience {vehicle.make} {vehicle.model}
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

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3 animate-slide-up">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Test Drive Scheduled!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                We have sent an SMS confirmation to {phone} for {date} at {timeSlot}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setBookingType('SHOWROOM')}
                  className={`py-2 rounded-lg transition-all ${
                    bookingType === 'SHOWROOM'
                      ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  Showroom Visit
                </button>
                <button
                  type="button"
                  onClick={() => setBookingType('HOME_DELIVERY')}
                  className={`py-2 rounded-lg transition-all ${
                    bookingType === 'HOME_DELIVERY'
                      ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  VIP Home Delivery
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Preferred Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Time Slot
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
                  >
                    <option value="10:00 AM">10:00 AM (Morning)</option>
                    <option value="11:30 AM">11:30 AM (Morning)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    <option value="04:30 PM">04:30 PM (Evening)</option>
                    <option value="06:00 PM">06:00 PM (Sunset VIP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Your Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 transition-all"
              >
                Confirm Test Drive Booking
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
