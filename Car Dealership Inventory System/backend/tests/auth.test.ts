import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';

describe('Auth API (TDD)', () => {
  beforeAll(async () => {
    // Clear test database users before testing auth
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['newuser@test.com', 'loginuser@test.com', 'duplicate@test.com']
        }
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new customer successfully and return token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New Test User',
          email: 'newuser@test.com',
          password: 'Password123!',
          role: 'CUSTOMER',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toEqual(
        expect.objectContaining({
          email: 'newuser@test.com',
          name: 'New Test User',
          role: 'CUSTOMER',
        })
      );
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('should fail registration when email already exists', async () => {
      // First registration
      await request(app).post('/api/auth/register').send({
        name: 'Duplicate User',
        email: 'duplicate@test.com',
        password: 'Password123!',
      });

      // Second registration with same email
      const res = await request(app).post('/api/auth/register').send({
        name: 'Duplicate User 2',
        email: 'duplicate@test.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Email already registered');
    });

    it('should reject registration with invalid email or weak password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Bad Input',
        email: 'not-an-email',
        password: '123',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Login Test User',
        email: 'loginuser@test.com',
        password: 'SecretPassword123',
        role: 'CUSTOMER',
      });
    });

    it('should log in successfully with correct credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'loginuser@test.com',
        password: 'SecretPassword123',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('loginuser@test.com');
    });

    it('should fail login with invalid password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'loginuser@test.com',
        password: 'WrongPassword!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Invalid email or password');
    });

    it('should fail login with non-existent email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@test.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user profile when valid JWT provided', async () => {
      const email = `profile-${Date.now()}@test.com`;
      const registerRes = await request(app).post('/api/auth/register').send({
        name: 'Profile User',
        email,
        password: 'Password123!',
      });

      const token = registerRes.body.data.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(email);
    });

    it('should return 401 Unauthorized when token is missing', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });
});
