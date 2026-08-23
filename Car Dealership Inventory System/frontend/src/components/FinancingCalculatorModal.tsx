import React, { useState } from 'react';
import { X, Calculator, DollarSign, Calendar, Percent, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { Vehicle } from '../types';

interface FinancingCalculatorModalProps {
  isOpen: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onApplyForFinancing: (vehicle: Vehicle, monthlyPayment: number, termMonths: number) => void;
}

export const FinancingCalculatorModal: React.FC<FinancingCalculatorModalProps> = ({
  isOpen,
  vehicle,
  onClose,
  onApplyForFinancing,
}) => {
  if (!isOpen || !vehicle) return null;

  const [downPayment, setDownPayment] = useState<number>(Math.round(vehicle.price * 0.2));
  const [interestRate, setInterestRate] = useState<number>(4.9);
  const [termMonths, setTermMonths] = useState<number>(60);

  // EMI Calculation Math: M = P * [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
  const principal = Math.max(0, vehicle.price - downPayment);
  const monthlyInterestRate = interestRate / 100 / 12;
  
  const monthlyPayment =
    monthlyInterestRate > 0
      ? (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termMonths)) /
        (Math.pow(1 + monthlyInterestRate, termMonths) - 1)
      : principal / termMonths;

  const totalCost = downPayment + monthlyPayment * termMonths;
  const totalInterest = Math.max(0, totalCost - vehicle.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Auto Financing & Monthly EMI Calculator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Estimate payment terms for {vehicle.make} {vehicle.model}
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

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-grow">
          {/* Estimated Monthly Payment Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Estimated Monthly Loan Payment
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-white tracking-tight">
                  ${Math.round(monthlyPayment).toLocaleString('en-US')}
                </span>
                <span className="text-slate-400 font-semibold text-sm">/ month</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Based on {termMonths} mo @ {interestRate}% APR
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
              <span className="text-xs text-slate-400">Vehicle MSRP Price</span>
              <p className="text-xl font-extrabold text-white">${vehicle.price.toLocaleString('en-US')}</p>
            </div>
          </div>

          {/* Calculator Control Controls */}
          <div className="space-y-4">
            {/* Down Payment Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Down Payment Amount ($)
                </label>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                  ${downPayment.toLocaleString('en-US')} ({Math.round((downPayment / vehicle.price) * 100)}%)
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={vehicle.price * 0.8}
                step={1000}
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            {/* Loan Term Selector (Months) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Loan Duration (Months)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[24, 36, 48, 60, 72].map((months) => (
                  <button
                    key={months}
                    onClick={() => setTermMonths(months)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                      termMonths === months
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                        : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {months} mo
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate APR Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Estimated Interest Rate (APR %)
                </label>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{interestRate}% APR</span>
              </div>
              <input
                type="range"
                min={1.9}
                max={12.9}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>
          </div>

          {/* Breakdown Summary Grid */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Principal Loan Amount:</span>
              <span className="font-semibold text-slate-900 dark:text-white">${principal.toLocaleString('en-US')}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Total Interest Cost ({termMonths} mo):</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">${Math.round(totalInterest).toLocaleString('en-US')}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-slate-900 dark:text-white">
              <span>Total Payment Amount:</span>
              <span className="text-sky-600 dark:text-sky-400">${Math.round(totalCost).toLocaleString('en-US')}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onApplyForFinancing(vehicle, Math.round(monthlyPayment), termMonths);
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Apply For Pre-Approved Financing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
