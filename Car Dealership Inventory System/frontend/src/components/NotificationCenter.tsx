import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, Info, AlertTriangle, Sparkles, X } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAllRead,
  onClearAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* Bell Button with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
        title="Notification Alerts Center"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden animate-scale-in">
          {/* Popover Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dealership Alerts</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
                {notifications.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onMarkAllRead}
                className="p-1 text-slate-400 hover:text-sky-500 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
              <button
                onClick={onClearAll}
                className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No new notifications.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 transition-colors ${
                    !item.read ? 'bg-sky-50/50 dark:bg-sky-950/20' : 'bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {item.type === 'success' && <Sparkles className="w-4 h-4 text-emerald-500" />}
                      {item.type === 'alert' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {item.type === 'info' && <Info className="w-4 h-4 text-sky-500" />}
                    </div>

                    <div className="flex-grow">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">{item.message}</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 block">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
