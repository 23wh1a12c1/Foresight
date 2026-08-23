import React from 'react';
import { Search, RotateCcw, DollarSign, ArrowUpDown } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchFilterProps {
  filters: SearchFilters & { sortBy?: string };
  categories: string[];
  onChange: (newFilters: any) => void;
  onReset: () => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ filters, categories, onChange, onReset }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      onChange({ ...filters, [name]: checked });
    } else {
      onChange({ ...filters, [name]: value });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl mb-8 space-y-5 shadow-lg dark:shadow-xl transition-colors">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleInputChange}
          placeholder="Search by make, model, category, or spec (e.g. Tesla, M4, SUV, 911)..."
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all text-sm font-medium"
        />
      </div>

      {/* Multi-Parameter Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
        {/* Category Selector */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Vehicle Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-sky-500 transition-colors font-medium"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Selector */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Sort Inventory By
          </label>
          <div className="relative">
            <select
              name="sortBy"
              value={filters.sortBy || 'DEFAULT'}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-sky-500 transition-colors font-medium"
            >
              <option value="DEFAULT">Featured & Default</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="POWER_HIGH">Highest Power (HP)</option>
              <option value="YEAR_NEW">Newest Model Year</option>
            </select>
          </div>
        </div>

        {/* Price Range Min */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Min Price ($)
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              placeholder="0"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-sky-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Price Range Max */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Max Price ($)
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              placeholder="500,000"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-sky-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Reset Filters */}
        <div className="lg:col-span-2 flex items-end">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold border border-slate-300 dark:border-slate-700 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
