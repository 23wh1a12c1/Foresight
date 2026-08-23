import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VehicleCard } from '../components/VehicleCard';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Vehicle } from '../types';

const mockVehicleInStock: Vehicle = {
  id: 'v1',
  make: 'Tesla',
  model: 'Model S Plaid',
  category: 'Electric',
  year: 2024,
  price: 89990,
  quantity: 5,
  description: 'Tri-motor electric powertrain',
};

const mockVehicleOutOfStock: Vehicle = {
  id: 'v2',
  make: 'Audi',
  model: 'RS e-tron GT',
  category: 'Electric',
  year: 2024,
  price: 106500,
  quantity: 0,
  description: 'Quattro performance',
};

describe('VehicleCard Component (Frontend TDD)', () => {
  it('renders vehicle details, make, model, price, and stock count', () => {
    const handlePurchase = vi.fn();

    render(
      <ThemeProvider>
        <AuthProvider>
          <VehicleCard vehicle={mockVehicleInStock} onPurchase={handlePurchase} />
        </AuthProvider>
      </ThemeProvider>
    );

    expect(screen.getByText('Tesla')).toBeInTheDocument();
    expect(screen.getByText('Model S Plaid')).toBeInTheDocument();
    expect(screen.getByText('$89,990')).toBeInTheDocument();
    expect(screen.getByText('5 IN STOCK')).toBeInTheDocument();

    const purchaseButton = screen.getByRole('button', { name: /purchase vehicle/i });
    expect(purchaseButton).not.toBeDisabled();

    fireEvent.click(purchaseButton);
    expect(handlePurchase).toHaveBeenCalledWith(mockVehicleInStock);
  });

  it('disables purchase button when vehicle is out of stock (quantity = 0)', () => {
    const handlePurchase = vi.fn();

    render(
      <ThemeProvider>
        <AuthProvider>
          <VehicleCard vehicle={mockVehicleOutOfStock} onPurchase={handlePurchase} />
        </AuthProvider>
      </ThemeProvider>
    );

    expect(screen.getByText('SOLD OUT')).toBeInTheDocument();
    const purchaseButton = screen.getByRole('button', { name: /sold out/i });
    expect(purchaseButton).toBeDisabled();
  });
});
