import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types';
import { ZodError } from 'zod';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: error.errors.map((e) => e.message).join(', '),
        });
      }
      return res.status(400).json({
        success: false,
        error: error.message || 'Registration failed',
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: error.errors.map((e) => e.message).join(', '),
        });
      }
      return res.status(401).json({
        success: false,
        error: error.message || 'Authentication failed',
      });
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      const user = await AuthService.getProfile(req.user.userId);
      return res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        error: error.message || 'User not found',
      });
    }
  }
}
