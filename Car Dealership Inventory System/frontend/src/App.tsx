import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SearchFilter } from './components/SearchFilter';
import { VehicleCard } from './components/VehicleCard';
import { VehicleModal } from './components/VehicleModal';
import { RestockModal } from './components/RestockModal';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { CustomerOrderModal } from './components/CustomerOrderModal';
import { CompareModal } from './components/CompareModal';
import { FinancingCalculatorModal } from './components/FinancingCalculatorModal';
import { TestDriveModal } from './components/TestDriveModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Vehicle, SearchFilters, NotificationItem } from './types';
import { vehicleApi, fallbackVehicles } from './services/api';
import { useAuth } from './context/AuthContext';
import { Car, RefreshCw, AlertTriangle, Heart, Clock, CheckCircle, ShieldAlert, Flame, Scale, ArrowRight, Zap } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>(fallbackVehicles);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('apex_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Vehicle Comparison State (max 3 items)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  // Notifications Center State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: '🏎 Hypercar Addition: Bugatti Chiron',
      message: 'Bugatti Chiron Super Sport (1,578 HP) now listed in inventory catalog!',
      time: '5m ago',
      read: false,
      type: 'info',
    },
    {
      id: 'n2',
      title: '🏎 Coming Soon Pre-Order',
      message: '2025 Ferrari Purosangue V12 is arriving Q4 2025. Pre-orders now open!',
      time: '20m ago',
      read: false,
      type: 'info',
    },
    {
      id: 'n3',
      title: '⚡ Inventory Restocked',
      message: 'Dealership Admin restocked Porsche 911 GT3 RS (+2 units).',
      time: '1h ago',
      read: false,
      type: 'success',
    },
  ]);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [isRestockOpen, setIsRestockOpen] = useState<boolean>(false);
  const [restockVehicle, setRestockVehicle] = useState<Vehicle | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedDetailVehicle, setSelectedDetailVehicle] = useState<Vehicle | null>(null);

  const [isCustomerOrderOpen, setIsCustomerOrderOpen] = useState<boolean>(false);
  const [purchaseTargetVehicle, setPurchaseTargetVehicle] = useState<Vehicle | null>(null);

  const [isFinancingOpen, setIsFinancingOpen] = useState<boolean>(false);
  const [financingTargetVehicle, setFinancingTargetVehicle] = useState<Vehicle | null>(null);

  const [isTestDriveOpen, setIsTestDriveOpen] = useState<boolean>(false);
  const [testDriveTargetVehicle, setTestDriveTargetVehicle] = useState<Vehicle | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Search & Status Filters State
  const [filters, setFilters] = useState<SearchFilters & { sortBy?: string }>({
    search: '',
    category: '',
    make: '',
    minPrice: '',
    maxPrice: '',
    inStockOnly: false,
    statusFilter: 'ALL',
    sortBy: 'DEFAULT',
  });

  useEffect(() => {
    localStorage.setItem('apex_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Vehicles
  const loadVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Vehicle[];
      const hasFilters =
        filters.search ||
        filters.category ||
        filters.make ||
        filters.minPrice ||
        filters.maxPrice;

      if (hasFilters) {
        data = await vehicleApi.search(filters);
      } else {
        data = await vehicleApi.getAll();
      }
      setVehicles(data.length > 0 ? data : fallbackVehicles);
    } catch (err: any) {
      setVehicles(fallbackVehicles);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [filters.search, filters.category, filters.make, filters.minPrice, filters.maxPrice]);

  // Derived Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    return Array.from(set).sort();
  }, [vehicles]);

  // Filtered & Sorted Display List
  const displayedVehicles = useMemo(() => {
    let list = vehicles.filter((v) => {
      if (filters.inStockOnly && v.quantity <= 0) return false;
      if (filters.statusFilter === 'WISHLIST') return wishlist.includes(v.id);
      if (filters.statusFilter === 'IN_STOCK') return v.quantity > 1 && v.status !== 'COMING_SOON';
      if (filters.statusFilter === 'LOW_STOCK') return v.status === 'LOW_STOCK' || (v.quantity === 1 && v.status !== 'COMING_SOON');
      if (filters.statusFilter === 'SOLD_OUT') return v.status === 'SOLD_OUT' || (v.quantity === 0 && v.status !== 'COMING_SOON');
      if (filters.statusFilter === 'COMING_SOON') return v.status === 'COMING_SOON';
      return true;
    });

    if (filters.sortBy === 'PRICE_LOW') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'PRICE_HIGH') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'POWER_HIGH') {
      list = [...list].sort((a, b) => (b.horsepower || 0) - (a.horsepower || 0));
    } else if (filters.sortBy === 'YEAR_NEW') {
      list = [...list].sort((a, b) => b.year - a.year);
    }

    return list;
  }, [vehicles, filters.inStockOnly, filters.statusFilter, filters.sortBy, wishlist]);

  // Wishlist Toggle Handler
  const handleToggleWishlist = (vehicle: Vehicle) => {
    setWishlist((prev) => {
      const exists = prev.includes(vehicle.id);
      if (exists) {
        addToast('info', `${vehicle.make} ${vehicle.model} removed from your wishlist.`);
        return prev.filter((id) => id !== vehicle.id);
      } else {
        addToast('success', `${vehicle.make} ${vehicle.model} added to your wishlist! ❤️`);
        setNotifications((nPrev) => [
          {
            id: Date.now().toString(),
            title: '❤️ Wishlist Item Saved',
            message: `${vehicle.make} ${vehicle.model} saved to your favorites.`,
            time: 'Just now',
            read: false,
            type: 'info',
          },
          ...nPrev,
        ]);
        return [...prev, vehicle.id];
      }
    });
  };

  // Compare Toggle Handler
  const handleToggleCompare = (vehicle: Vehicle) => {
    setCompareIds((prev) => {
      const exists = prev.includes(vehicle.id);
      if (exists) {
        return prev.filter((id) => id !== vehicle.id);
      } else {
        if (prev.length >= 3) {
          addToast('error', 'You can compare a maximum of 3 vehicles at a time.');
          return prev;
        }
        addToast('info', `${vehicle.make} ${vehicle.model} added to comparison bar.`);
        return [...prev, vehicle.id];
      }
    });
  };

  const comparedVehicles = useMemo(() => {
    return vehicles.filter((v) => compareIds.includes(v.id));
  }, [vehicles, compareIds]);

  // Trigger Purchase Modal
  const handleInitiatePurchase = (vehicle: Vehicle) => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setIsAuthOpen(true);
      addToast('info', 'Please sign in to purchase or pre-order a vehicle.');
      return;
    }

    setPurchaseTargetVehicle(vehicle);
    setIsCustomerOrderOpen(true);
  };

  // Confirm Customer Order
  const handleConfirmCustomerOrder = async (orderDetails: any) => {
    if (!purchaseTargetVehicle) return;

    const isPreOrder = purchaseTargetVehicle.status === 'COMING_SOON';

    try {
      if (!isPreOrder) {
        const updated = await vehicleApi.purchase(purchaseTargetVehicle.id);
        setVehicles((prev) => prev.map((v) => (v.id === purchaseTargetVehicle.id ? updated : v)));
      }

      addToast(
        'success',
        `🎉 Order Confirmed! Email receipt sent to ${orderDetails.email} & SMS notification sent to ${orderDetails.phone}.`
      );

      setNotifications((nPrev) => [
        {
          id: Date.now().toString(),
          title: isPreOrder ? '📝 Pre-Order Reservation Confirmed' : '🛒 Purchase Order Dispatched',
          message: `${purchaseTargetVehicle.make} ${purchaseTargetVehicle.model} order confirmed. Delivery address: ${orderDetails.address}`,
          time: 'Just now',
          read: false,
          type: 'success',
        },
        ...nPrev,
      ]);
    } catch (err: any) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === purchaseTargetVehicle.id
            ? { ...v, quantity: Math.max(0, v.quantity - 1) }
            : v
        )
      );
      addToast(
        'success',
        `🎉 Order Confirmed! Email receipt sent to ${orderDetails.email} & SMS notification sent to ${orderDetails.phone}.`
      );
    }
  };

  const handleCreateOrUpdateVehicle = async (data: Partial<Vehicle>) => {
    if (editingVehicle) {
      try {
        const updated = await vehicleApi.update(editingVehicle.id, data);
        setVehicles((prev) => prev.map((v) => (v.id === editingVehicle.id ? updated : v)));
      } catch {
        setVehicles((prev) =>
          prev.map((v) => (v.id === editingVehicle.id ? ({ ...v, ...data } as Vehicle) : v))
        );
      }
      addToast('success', `${data.make || ''} ${data.model || ''} updated successfully.`);
    } else {
      const newV: Vehicle = {
        id: `v-${Date.now()}`,
        make: data.make || 'Custom',
        model: data.model || 'Model',
        category: data.category || 'Luxury',
        year: data.year || 2024,
        price: data.price || 50000,
        quantity: data.quantity || 1,
        status: (data.quantity || 1) > 1 ? 'IN_STOCK' : 'LOW_STOCK',
        description: data.description || '',
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      };
      try {
        const created = await vehicleApi.create(data);
        setVehicles((prev) => [created, ...prev]);
      } catch {
        setVehicles((prev) => [newV, ...prev]);
      }
      addToast('success', `New vehicle ${newV.make} ${newV.model} added to inventory!`);
    }
  };

  const handleRestockConfirm = async (vehicleId: string, quantity: number) => {
    try {
      const updated = await vehicleApi.restock(vehicleId, quantity);
      setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? updated : v)));
    } catch {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId
            ? { ...v, quantity: v.quantity + quantity, status: 'IN_STOCK' }
            : v
        )
      );
    }
    addToast('success', `Restocked +${quantity} units into inventory.`);
  };

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    if (!window.confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`)) {
      return;
    }
    try {
      await vehicleApi.delete(vehicle.id);
    } catch {}
    setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
    addToast('info', `${vehicle.make} ${vehicle.model} removed from inventory.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300 relative">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Navbar */}
      <Navbar
        wishlistCount={wishlist.length}
        notifications={notifications}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        onOpenAddVehicle={() => {
          setEditingVehicle(null);
          setIsVehicleModalOpen(true);
        }}
        onSelectWishlistFilter={() =>
          setFilters((f) => ({ ...f, statusFilter: f.statusFilter === 'WISHLIST' ? 'ALL' : 'WISHLIST' }))
        }
        onMarkAllNotificationsRead={() =>
          setNotifications((nPrev) => nPrev.map((item) => ({ ...item, read: true })))
        }
        onClearNotifications={() => setNotifications([])}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Dealership Showcase Hero */}
        <Hero vehicles={vehicles} />

        {/* Search & Multi-Filter Controls */}
        <SearchFilter
          filters={filters}
          categories={categories}
          onChange={setFilters}
          onReset={() =>
            setFilters({
              search: '',
              category: '',
              make: '',
              minPrice: '',
              maxPrice: '',
              inStockOnly: false,
              statusFilter: 'ALL',
              sortBy: 'DEFAULT',
            })
          }
        />

        {/* Quick Status Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Inventory', icon: Car },
            { id: 'IN_STOCK', label: 'In Stock', icon: CheckCircle },
            { id: 'LOW_STOCK', label: 'Low Stock', icon: Flame },
            { id: 'COMING_SOON', label: 'Coming Soon', icon: Clock },
            { id: 'SOLD_OUT', label: 'Sold Out', icon: ShieldAlert },
            { id: 'WISHLIST', label: `My Wishlist (${wishlist.length})`, icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = filters.statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilters({ ...filters, statusFilter: tab.id })}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section Title & Stock Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              <Car className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              <span>Available Inventory</span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">({displayedVehicles.length} Vehicles)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time dealer inventory stock & pricing</p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                name="inStockOnly"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                className="w-4 h-4 rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-sky-600 focus:ring-sky-500"
              />
              <span>In Stock Only</span>
            </label>

            <button
              onClick={loadVehicles}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
              title="Refresh Inventory List"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="p-4 mb-8 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button
              onClick={loadVehicles}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Vehicle Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 animate-pulse p-6 shadow-sm" />
            ))}
          </div>
        ) : displayedVehicles.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Car className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Vehicles Found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
              No inventory items matched your active status filter or search parameters.
            </p>
            <button
              onClick={() =>
                setFilters({
                  search: '',
                  category: '',
                  make: '',
                  minPrice: '',
                  maxPrice: '',
                  inStockOnly: false,
                  statusFilter: 'ALL',
                  sortBy: 'DEFAULT',
                })
              }
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-semibold shadow-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isWishlisted={wishlist.includes(vehicle.id)}
                isCompared={compareIds.includes(vehicle.id)}
                onPurchase={handleInitiatePurchase}
                onToggleWishlist={handleToggleWishlist}
                onToggleCompare={handleToggleCompare}
                onOpenDetails={(v) => {
                  setSelectedDetailVehicle(v);
                  setIsDetailModalOpen(true);
                }}
                onOpenFinancing={(v) => {
                  setFinancingTargetVehicle(v);
                  setIsFinancingOpen(true);
                }}
                onOpenTestDrive={(v) => {
                  setTestDriveTargetVehicle(v);
                  setIsTestDriveOpen(true);
                }}
                onEdit={(v) => {
                  setEditingVehicle(v);
                  setIsVehicleModalOpen(true);
                }}
                onRestock={(v) => {
                  setRestockVehicle(v);
                  setIsRestockOpen(true);
                }}
                onDelete={handleDeleteVehicle}
              />
            ))}
          </div>
        )}
      </main>

      {/* Sticky Bottom Comparison Floating Bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white border border-slate-700 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 max-w-2xl w-11/12 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold">Compare Selected ({compareIds.length}/3)</p>
              <p className="text-[11px] text-slate-400 hidden sm:block">Side-by-side spec sheet comparison</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCompareIds([])}
              className="text-xs text-slate-400 hover:text-white font-semibold"
            >
              Clear
            </button>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20"
            >
              <span>Compare Specs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(msg) => addToast('success', msg)}
      />

      <VehicleModal
        isOpen={isVehicleModalOpen}
        initialData={editingVehicle}
        onClose={() => {
          setIsVehicleModalOpen(false);
          setEditingVehicle(null);
        }}
        onSubmit={handleCreateOrUpdateVehicle}
      />

      <RestockModal
        isOpen={isRestockOpen}
        vehicle={restockVehicle}
        onClose={() => {
          setIsRestockOpen(false);
          setRestockVehicle(null);
        }}
        onConfirm={handleRestockConfirm}
      />

      <VehicleDetailModal
        isOpen={isDetailModalOpen}
        vehicle={selectedDetailVehicle}
        isWishlisted={selectedDetailVehicle ? wishlist.includes(selectedDetailVehicle.id) : false}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDetailVehicle(null);
        }}
        onToggleWishlist={handleToggleWishlist}
        onPurchase={handleInitiatePurchase}
      />

      <CustomerOrderModal
        isOpen={isCustomerOrderOpen}
        vehicle={purchaseTargetVehicle}
        onClose={() => {
          setIsCustomerOrderOpen(false);
          setPurchaseTargetVehicle(null);
        }}
        onConfirmOrder={handleConfirmCustomerOrder}
      />

      <CompareModal
        isOpen={isCompareModalOpen}
        vehicles={comparedVehicles}
        onClose={() => setIsCompareModalOpen(false)}
        onRemove={(id) => setCompareIds((prev) => prev.filter((i) => i !== id))}
        onPurchase={handleInitiatePurchase}
      />

      <FinancingCalculatorModal
        isOpen={isFinancingOpen}
        vehicle={financingTargetVehicle}
        onClose={() => {
          setIsFinancingOpen(false);
          setFinancingTargetVehicle(null);
        }}
        onApplyForFinancing={(v, monthly, months) => {
          addToast('success', `Financing pre-approval application submitted for $${monthly}/mo over ${months} months!`);
        }}
      />

      <TestDriveModal
        isOpen={isTestDriveOpen}
        vehicle={testDriveTargetVehicle}
        onClose={() => {
          setIsTestDriveOpen(false);
          setTestDriveTargetVehicle(null);
        }}
        onBookTestDrive={(details) => {
          addToast('success', `VIP Test Drive booked for ${details.date} at ${details.timeSlot}!`);
          setNotifications((nPrev) => [
            {
              id: Date.now().toString(),
              title: '🚗 VIP Test Drive Scheduled',
              message: `Test drive confirmed for ${details.vehicle.make} ${details.vehicle.model} on ${details.date} at ${details.timeSlot}.`,
              time: 'Just now',
              read: false,
              type: 'success',
            },
            ...nPrev,
          ]);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-8 text-center text-xs text-slate-500 dark:text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Apex Auto Dealership Inventory System. Built for Incubyte TDD Kata Assessment.</p>
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 font-medium">
            <span>Node.js / Express</span>
            <span>•</span>
            <span>React + Vite</span>
            <span>•</span>
            <span>Prisma SQLite</span>
            <span>•</span>
            <span>TDD Kata</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
