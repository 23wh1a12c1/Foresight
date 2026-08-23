import { prisma } from '../utils/prisma';
import { z } from 'zod';

export const vehicleCreateSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  category: z.string().min(1, 'Category is required'),
  year: z.number().int().min(1900).max(2026).optional().default(2024),
  price: z.number().positive('Price must be greater than 0'),
  quantity: z.number().int().nonnegative('Quantity cannot be negative').optional().default(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export const vehicleUpdateSchema = vehicleCreateSchema.partial();

export const vehicleSearchSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
});

export class VehicleService {
  static async createVehicle(data: z.infer<typeof vehicleCreateSchema>) {
    const validated = vehicleCreateSchema.parse(data);
    return await prisma.vehicle.create({
      data: validated,
    });
  }

  static async getAllVehicles() {
    return await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async searchVehicles(query: z.infer<typeof vehicleSearchSchema>) {
    const { make, model, category, minPrice, maxPrice, search } = query;

    const where: any = {};

    if (make) {
      where.make = { contains: make };
    }
    if (model) {
      where.model = { contains: model };
    }
    if (category) {
      where.category = { contains: category };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (search) {
      where.OR = [
        { make: { contains: search } },
        { model: { contains: search } },
        { category: { contains: search } },
        { description: { contains: search } },
      ];
    }

    return await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getVehicleById(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    return vehicle;
  }

  static async updateVehicle(id: string, data: z.infer<typeof vehicleUpdateSchema>) {
    await this.getVehicleById(id);
    const validated = vehicleUpdateSchema.parse(data);

    return await prisma.vehicle.update({
      where: { id },
      data: validated,
    });
  }

  static async deleteVehicle(id: string) {
    await this.getVehicleById(id);
    return await prisma.vehicle.delete({
      where: { id },
    });
  }

  static async purchaseVehicle(id: string) {
    const vehicle = await this.getVehicleById(id);

    if (vehicle.quantity <= 0) {
      throw new Error('Vehicle is out of stock');
    }

    return await prisma.vehicle.update({
      where: { id },
      data: {
        quantity: vehicle.quantity - 1,
      },
    });
  }

  static async restockVehicle(id: string, addQuantity: number) {
    const vehicle = await this.getVehicleById(id);
    const newQuantity = vehicle.quantity + (addQuantity || 1);

    return await prisma.vehicle.update({
      where: { id },
      data: {
        quantity: newQuantity,
      },
    });
  }
}
