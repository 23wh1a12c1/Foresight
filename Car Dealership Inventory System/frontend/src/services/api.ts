import axios from 'axios';
import { Vehicle, SearchFilters, AuthResponse } from '../types';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('apex_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fallbackVehicles: Vehicle[] = [
  {
    id: 'v-bugatti-chiron',
    make: 'Bugatti',
    model: 'Chiron Super Sport',
    category: 'Hypercar',
    year: 2024,
    price: 3800000,
    quantity: 1,
    status: 'LOW_STOCK',
    horsepower: 1578,
    zeroToSixty: '2.2s',
    topSpeed: '273 mph',
    isFeatured: true,
    description: '8.0-liter quad-turbocharged W16 engine producing 1,578 horsepower with longtail aerodynamically optimized bodywork.',
    imageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-tesla-s',
    make: 'Tesla',
    model: 'Model S Plaid',
    category: 'Electric',
    year: 2024,
    price: 89990,
    quantity: 5,
    status: 'IN_STOCK',
    horsepower: 1020,
    zeroToSixty: '1.99s',
    topSpeed: '200 mph',
    isFeatured: true,
    description: 'Tri-motor All-Wheel Drive, carbon-sleeved rotors, 396 mile estimated range.',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-bmw-m4',
    make: 'BMW',
    model: 'M4 Competition',
    category: 'Sports',
    year: 2024,
    price: 79100,
    quantity: 1,
    status: 'LOW_STOCK',
    horsepower: 503,
    zeroToSixty: '3.4s',
    topSpeed: '180 mph',
    isFeatured: true,
    description: '3.0L BMW M TwinPower Turbo inline 6-cylinder with M xDrive.',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-porsche-911',
    make: 'Porsche',
    model: '911 GT3 RS',
    category: 'Sports',
    year: 2024,
    price: 241300,
    quantity: 2,
    status: 'IN_STOCK',
    horsepower: 518,
    zeroToSixty: '3.0s',
    topSpeed: '184 mph',
    isFeatured: true,
    description: 'Naturally aspirated 4.0-liter flat-six engine with 518 hp and active motorsport aerodynamics.',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-ferrari-purosangue',
    make: 'Ferrari',
    model: 'Purosangue V12',
    category: 'Luxury',
    year: 2025,
    price: 398350,
    quantity: 0,
    status: 'COMING_SOON',
    horsepower: 715,
    zeroToSixty: '3.3s',
    topSpeed: '193 mph',
    isFeatured: true,
    description: 'Naturally aspirated 6.5-liter V12 supercar SUV. Arriving Q4 2025. Pre-orders open.',
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-mclaren-750s',
    make: 'McLaren',
    model: '750S Spider',
    category: 'Supercar',
    year: 2024,
    price: 345000,
    quantity: 2,
    status: 'IN_STOCK',
    horsepower: 740,
    zeroToSixty: '2.7s',
    topSpeed: '206 mph',
    isFeatured: true,
    description: '4.0-liter twin-turbo V8, ultralight carbon fiber Monocage II chassis with retractable hardtop roof.',
    imageUrl: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-aston-db12',
    make: 'Aston Martin',
    model: 'DB12 Volante',
    category: 'Convertible',
    year: 2024,
    price: 265000,
    quantity: 2,
    status: 'IN_STOCK',
    horsepower: 671,
    zeroToSixty: '3.6s',
    topSpeed: '202 mph',
    isFeatured: false,
    description: '4.0-liter Twin-Turbo V8 producing 671 HP with K-fold roof mechanism and bespoke interior leather.',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-lamborghini-urus',
    make: 'Lamborghini',
    model: 'Urus Performante',
    category: 'SUV',
    year: 2024,
    price: 269885,
    quantity: 2,
    status: 'IN_STOCK',
    horsepower: 657,
    zeroToSixty: '3.1s',
    topSpeed: '190 mph',
    isFeatured: true,
    description: '4.0-liter twin-turbo V8 producing 657 horsepower, carbon fiber hood, titanium exhaust.',
    imageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-audi-etron',
    make: 'Audi',
    model: 'RS e-tron GT',
    category: 'Electric',
    year: 2024,
    price: 106500,
    quantity: 0,
    status: 'SOLD_OUT',
    horsepower: 637,
    zeroToSixty: '3.1s',
    topSpeed: '155 mph',
    isFeatured: false,
    description: 'Quattro all-wheel drive, 637 hp boost mode, carbon fiber roof package. Fully reserved.',
    imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-lucid-air',
    make: 'Lucid',
    model: 'Air Sapphire',
    category: 'Electric',
    year: 2024,
    price: 249000,
    quantity: 3,
    status: 'IN_STOCK',
    horsepower: 1234,
    zeroToSixty: '1.89s',
    topSpeed: '205 mph',
    isFeatured: true,
    description: 'Three-motor powertrain delivering 1,234 hp, carbon ceramic brakes, track-tuned suspension.',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-rolls-spectre',
    make: 'Rolls-Royce',
    model: 'Spectre EV',
    category: 'Luxury',
    year: 2024,
    price: 420000,
    quantity: 1,
    status: 'LOW_STOCK',
    horsepower: 577,
    zeroToSixty: '4.4s',
    topSpeed: '155 mph',
    isFeatured: true,
    description: 'The world first ultra-luxury electric super coupe with Starlight doors and Planar suspension.',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-rangerover-sv',
    make: 'Range Rover',
    model: 'SV Bespoke Edition',
    category: 'SUV',
    year: 2024,
    price: 234000,
    quantity: 3,
    status: 'IN_STOCK',
    horsepower: 606,
    zeroToSixty: '4.3s',
    topSpeed: '162 mph',
    isFeatured: false,
    description: '4.4-liter Twin-Turbo V8 with 24-way heated and cooled massaging front seats.',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-corvette-z06',
    make: 'Chevrolet',
    model: 'Corvette Z06',
    category: 'Sports',
    year: 2024,
    price: 112700,
    quantity: 4,
    status: 'IN_STOCK',
    horsepower: 670,
    zeroToSixty: '2.6s',
    topSpeed: '195 mph',
    isFeatured: true,
    description: 'Mid-engine 5.5L LT6 flat-plane crank V8 revving to 8,600 RPM.',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-cadillac-escalade',
    make: 'Cadillac',
    model: 'Escalade-V Series',
    category: 'SUV',
    year: 2024,
    price: 152295,
    quantity: 2,
    status: 'IN_STOCK',
    horsepower: 682,
    zeroToSixty: '4.4s',
    topSpeed: '125 mph',
    isFeatured: false,
    description: 'Hand-built 6.2L Supercharged V8 producing 682 HP with 38-inch curved OLED display.',
    imageUrl: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-nissan-gtr',
    make: 'Nissan',
    model: 'GT-R Nismo',
    category: 'Sports',
    year: 2024,
    price: 221090,
    quantity: 1,
    status: 'LOW_STOCK',
    horsepower: 600,
    zeroToSixty: '2.9s',
    topSpeed: '205 mph',
    isFeatured: false,
    description: '3.8L Twin-Turbo VR38DETT V8 with GT3 turbochargers and carbon-ceramic brakes.',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-mercedes-g63',
    make: 'Mercedes-AMG',
    model: 'G 63 Grand Edition',
    category: 'SUV',
    year: 2024,
    price: 179000,
    quantity: 1,
    status: 'LOW_STOCK',
    horsepower: 577,
    zeroToSixty: '4.5s',
    topSpeed: '149 mph',
    isFeatured: false,
    description: 'Handcrafted AMG 4.0L V8 biturbo engine with tech gold accents and matte black finish.',
    imageUrl: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-ford-f150',
    make: 'Ford',
    model: 'F-150 Lightning',
    category: 'Truck',
    year: 2024,
    price: 54995,
    quantity: 8,
    status: 'IN_STOCK',
    horsepower: 580,
    zeroToSixty: '3.8s',
    topSpeed: '110 mph',
    isFeatured: false,
    description: 'All-electric pickup truck with dual motors, extended range battery, Pro Power Onboard.',
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v-toyota-supra',
    make: 'Toyota',
    model: 'GR Supra 3.0',
    category: 'Sports',
    year: 2024,
    price: 58500,
    quantity: 6,
    status: 'IN_STOCK',
    horsepower: 382,
    zeroToSixty: '3.9s',
    topSpeed: '155 mph',
    isFeatured: false,
    description: '3.0L turbocharged inline 6-cylinder with 6-speed intelligent Manual Transmission (iMT).',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  },
];

const ensureImages = (vehicles: Vehicle[]): Vehicle[] => {
  if (!vehicles || vehicles.length === 0) return fallbackVehicles;
  return vehicles.map((v, idx) => {
    const fallback = fallbackVehicles[idx % fallbackVehicles.length];
    return {
      ...v,
      imageUrl: v.imageUrl && v.imageUrl.startsWith('http') ? v.imageUrl : fallback.imageUrl,
      horsepower: v.horsepower || fallback.horsepower,
      zeroToSixty: v.zeroToSixty || fallback.zeroToSixty,
      topSpeed: v.topSpeed || fallback.topSpeed,
      status: v.status || (v.quantity === 0 ? 'SOLD_OUT' : v.quantity === 1 ? 'LOW_STOCK' : 'IN_STOCK'),
    };
  });
};

export const authApi = {
  register: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const vehicleApi = {
  getAll: async (): Promise<Vehicle[]> => {
    try {
      const response = await api.get('/vehicles');
      const data = response.data.data;
      return ensureImages(data.length > 0 ? data : fallbackVehicles);
    } catch (err) {
      return fallbackVehicles;
    }
  },
  search: async (filters: SearchFilters): Promise<Vehicle[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('q', filters.search);
      if (filters.make) params.append('make', filters.make);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await api.get(`/vehicles/search?${params.toString()}`);
      const data = response.data.data;
      return ensureImages(data.length > 0 ? data : fallbackVehicles);
    } catch (err) {
      return fallbackVehicles.filter((v) => {
        if (filters.search && !`${v.make} ${v.model} ${v.description}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (filters.category && v.category !== filters.category) return false;
        if (filters.minPrice && v.price < Number(filters.minPrice)) return false;
        if (filters.maxPrice && v.price > Number(filters.maxPrice)) return false;
        return true;
      });
    }
  },
  create: async (data: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await api.post('/vehicles', data);
    return response.data.data;
  },
  update: async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },
  purchase: async (id: string): Promise<Vehicle> => {
    const response = await api.post(`/vehicles/${id}/purchase`);
    return response.data.data;
  },
  restock: async (id: string, quantity: number): Promise<Vehicle> => {
    const response = await api.post(`/vehicles/${id}/restock`, { quantity });
    return response.data.data;
  },
};
