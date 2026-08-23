import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

// Public Vehicle Browsing Routes (Guest Visitors & Customers can view inventory)
router.get('/search', VehicleController.search);
router.get('/', VehicleController.getAll);
router.get('/:id', VehicleController.getById);

// Protected Vehicle Management & Inventory Operations (Requires Authentication)
router.post('/', authenticate as any, VehicleController.create);
router.put('/:id', authenticate as any, VehicleController.update);
router.delete('/:id', authenticate as any, authorizeAdmin as any, VehicleController.delete);

// Protected Inventory Purchase & Restock Operations
router.post('/:id/purchase', authenticate as any, VehicleController.purchase);
router.post('/:id/restock', authenticate as any, authorizeAdmin as any, VehicleController.restock);

export default router;
