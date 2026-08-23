import React from 'react';
import { Car, User, LogOut, ShieldCheck, PlusCircle, UserCheck, Sun, Moon, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { NotificationCenter } from './NotificationCenter';
import { NotificationItem } from '../types';

interface NavbarProps {
  wishlistCount: number;
  notifications: NotificationItem[];
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenAddVehicle: () => void;
  onSelectWishlistFilter: () => void;
  onMarkAllNotificationsRead: () => void;
  onClearNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  wishlistCount,
  notifications,
  onOpenAuth,
  onOpenAddVehicle,
  onSelectWishlistFilter,
  onMarkAllNotificationsRead,
  onClearNotifications,
}) => {
  const { user, isAuthenticated, isAdmin, logout, quickLoginAsAdmin, quickLoginAsCustomer } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-900 dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Car className="w-6 h-6 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                APEX AUTO
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 uppercase tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Luxury & Performance Dealership</p>
          </div>
        </div>

        {/* Action Controls & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist Quick Button */}
          <button
            onClick={onSelectWishlistFilter}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-bold transition-colors"
            title="View Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-rose-500 fill-current' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Notifications Center */}
          <NotificationCenter
            notifications={notifications}
            onMarkAllRead={onMarkAllNotificationsRead}
            onClearAll={onClearNotifications}
          />

          {/* Theme Switcher Toggle (Light ☀️ / Dark 🌙) */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Quick Demo Login Switcher Shortcuts */}
          {!isAuthenticated && (
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-900/90 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400 pl-2 font-semibold">Demo:</span>
              <button
                onClick={quickLoginAsCustomer}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 font-medium shadow-sm"
                title="Login as Customer (kmegha9505@gmail.com)"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Customer
              </button>
              <button
                onClick={quickLoginAsAdmin}
                className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30 transition-colors flex items-center gap-1.5 font-semibold shadow-sm"
                title="Login as Admin (23wh1a12c1@bvrithyderabad.edu.in)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                Admin
              </button>
            </div>
          )}

          {/* Admin Add Vehicle Trigger */}
          {isAuthenticated && isAdmin && (
            <button
              onClick={onOpenAddVehicle}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-sky-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          )}

          {/* User Auth Controls */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> : <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">{user?.name}</p>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isAdmin ? 'text-sky-600 dark:text-sky-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {user?.role}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold border border-slate-800 dark:border-slate-700 transition-colors shadow-sm"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
