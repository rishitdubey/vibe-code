import request from 'supertest';
import app from '../server';
import User from '../models/User';

describe('Auth Endpoints', () => {
  describe('POST /api/v1/auth/user/signup', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        bio: 'Test user bio'
      };

      const response = await request(app)
        .post('/api/v1/auth/user/signup')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.username).toBe(userData.username);
      expect(response.body.data.tokens).toBeDefined();
      expect(response.body.data.tokens.accessToken).toBeDefined();
    });

    it('should not create user with duplicate email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      // Create first user
      await request(app)
        .post('/api/v1/auth/user/signup')
        .send(userData)
        .expect(201);

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/v1/auth/user/signup')
        .send({ ...userData, username: 'testuser2' })
        .expect(400);

      expect(response.body.status).toBe('error');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/user/signup')
        .send({})
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/v1/auth/user/login', () => {
    beforeEach(async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/user/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.tokens).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/user/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/v1/auth/profile', () => {
    let authToken: string;
    let userId: string;

    beforeEach(async () => {
      const signupResponse = await request(app)
        .post('/api/v1/auth/user/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      authToken = signupResponse.body.data.tokens.accessToken;
      userId = signupResponse.body.data.user.id;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user.id).toBe(userId);
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .expect(401);

      expect(response.body.status).toBe('error');
    });
  });
});