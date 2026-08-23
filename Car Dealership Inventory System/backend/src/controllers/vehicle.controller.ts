import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { ZodError } from 'zod';

export class VehicleController {
  static async create(req: Request, res: Response) {
    try {
      const vehicle = await VehicleService.createVehicle(req.body);
      return res.status(201).json({
        success: true,
        data: vehicle,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
        });
      }
      return res.status(400).json({
        success: false,
        error: error.message || 'Failed to create vehicle',
      });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const vehicles = await VehicleService.getAllVehicles();
      return res.status(200).json({
        success: true,
        data: vehicles,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch vehicles',
      });
    }
  }

  static async search(req: Request, res: Response) {
    try {
      const query = {
        make: req.query.make as string,
        model: req.query.model as string,
        category: req.query.category as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        search: req.query.q as string || req.query.search as string,
      };

      const vehicles = await VehicleService.searchVehicles(query);
      return res.status(200).json({
        success: true,
        data: vehicles,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message || 'Search query failed',
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const vehicle = await VehicleService.getVehicleById(req.params.id);
      return res.status(200).json({
        success: true,
        data: vehicle,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        error: error.message || 'Vehicle not found',
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const vehicle = await VehicleService.updateVehicle(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        data: vehicle,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: error.errors.map((e) => e.message).join(', '),
        });
      }
      const statusCode = error.message === 'Vehicle not found' ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to update vehicle',
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await VehicleService.deleteVehicle(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully',
      });
    } catch (error: any) {
      const statusCode = error.message === 'Vehicle not found' ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to delete vehicle',
      });
    }
  }

  static async purchase(req: Request, res: Response) {
    try {
      const vehicle = await VehicleService.purchaseVehicle(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Purchase successful! Vehicle stock updated.',
        data: vehicle,
      });
    } catch (error: any) {
      const statusCode = error.message === 'Vehicle is out of stock' ? 400 : 404;
      return res.status(statusCode).json({
        success: false,
        error: error.message || 'Purchase failed',
      });
    }
  }

  static async restock(req: Request, res: Response) {
    try {
      const quantity = req.body.quantity ? Number(req.body.quantity) : 1;
      const vehicle = await VehicleService.restockVehicle(req.params.id, quantity);
      return res.status(200).json({
        success: true,
        message: 'Restock successful! Inventory updated.',
        data: vehicle,
      });
    } catch (error: any) {
      const statusCode = error.message === 'Vehicle not found' ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        error: error.message || 'Restock failed',
      });
    }
  }
}
