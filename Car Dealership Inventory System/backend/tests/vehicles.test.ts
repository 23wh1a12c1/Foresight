import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';

describe('Vehicle & Inventory API (TDD)', () => {
  let customerToken: string;
  let adminToken: string;
  let createdVehicleId: string;

  beforeAll(async () => {
    // Clear existing test data
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();

    // Register Customer User
    const customerRes = await request(app).post('/api/auth/register').send({
      name: 'Test Customer',
      email: 'customer@test.com',
      password: 'Password123!',
      role: 'CUSTOMER',
    });
    customerToken = customerRes.body.data.token;

    // Register Admin User
    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'Password123!',
      role: 'ADMIN',
    });
    adminToken = adminRes.body.data.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/vehicles (Create Vehicle)', () => {
    it('should allow authenticated user to add a new vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          make: 'Toyota',
          model: 'Camry Hybrid',
          category: 'Sedan',
          year: 2024,
          price: 28800,
          quantity: 4,
          description: 'Fuel-efficient hybrid sedan with advanced safety features.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.make).toBe('Toyota');
      expect(res.body.data.model).toBe('Camry Hybrid');
      expect(res.body.data.quantity).toBe(4);

      createdVehicleId = res.body.data.id;
    });

    it('should reject creation without auth token', async () => {
      const res = await request(app).post('/api/vehicles').send({
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 24000,
        quantity: 2,
      });

      expect(res.status).toBe(401);
    });

    it('should reject creation with missing required fields or negative price', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          make: 'Tesla',
          price: -50000, // Invalid price
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/vehicles (List & Search)', () => {
    beforeAll(async () => {
      // Add multiple sample vehicles for filtering tests
      await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Tesla',
          model: 'Model 3',
          category: 'Electric',
          year: 2024,
          price: 38990,
          quantity: 3,
        });

      await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'BMW',
          model: 'X5',
          category: 'SUV',
          year: 2024,
          price: 65200,
          quantity: 1,
        });
    });

    it('should fetch list of all available vehicles when authenticated', async () => {
      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it('should search vehicles by make or model query parameter', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?make=Tesla')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].make).toBe('Tesla');
    });

    it('should filter vehicles by category and price range', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?category=SUV&minPrice=50000&maxPrice=70000')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].model).toBe('X5');
    });
  });

  describe('PUT /api/vehicles/:id (Update Vehicle)', () => {
    it('should update vehicle details when authenticated', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          price: 29500,
          description: 'Updated price and description for Toyota Camry Hybrid.',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(29500);
    });

    it('should return 404 for updating non-existent vehicle', async () => {
      const res = await request(app)
        .put('/api/vehicles/non-existent-id-123')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ price: 30000 });

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/vehicles/:id/purchase (Purchase Vehicle)', () => {
    let limitedVehicleId: string;

    beforeAll(async () => {
      // Create vehicle with quantity 1
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Ford',
          model: 'Mustang Dark Horse',
          category: 'Sports',
          price: 59270,
          quantity: 1,
        });
      limitedVehicleId = res.body.data.id;
    });

    it('should decrease quantity by 1 on successful purchase', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${limitedVehicleId}/purchase`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(0);
      expect(res.body.message).toContain('Purchase successful');
    });

    it('should fail purchase when vehicle is out of stock (quantity = 0)', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${limitedVehicleId}/purchase`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.toLowerCase()).toContain('out of stock');
    });
  });

  describe('POST /api/vehicles/:id/restock (Restock Vehicle - Admin Only)', () => {
    let restockVehicleId: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Porsche',
          model: 'Macan EV',
          category: 'SUV',
          price: 78800,
          quantity: 0,
        });
      restockVehicleId = res.body.data.id;
    });

    it('should allow Admin to restock vehicle quantity', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${restockVehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(5);
    });

    it('should forbid non-admin customer from restocking vehicle', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${restockVehicleId}/restock`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ quantity: 10 });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('Admin privileges required');
    });
  });

  describe('DELETE /api/vehicles/:id (Delete Vehicle - Admin Only)', () => {
    let vehicleToDeleteId: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Nissan',
          model: 'GT-R Nismo',
          category: 'Sports',
          price: 221000,
          quantity: 1,
        });
      vehicleToDeleteId = res.body.data.id;
    });

    it('should forbid regular customer from deleting a vehicle', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${vehicleToDeleteId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow Admin user to delete a vehicle', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${vehicleToDeleteId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify vehicle is deleted
      const checkRes = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${customerToken}`);
      const exists = checkRes.body.data.some((v: any) => v.id === vehicleToDeleteId);
      expect(exists).toBe(false);
    });
  });
});
