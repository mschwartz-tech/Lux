const request = require('supertest');
const app = require('../app'); // Assume you have an app.js or index.js setting up Express

describe('User Routes', () => {
  it('should create a user successfully', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', password: 'password123', name: 'Test User' });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  });

  it('should return validation errors for invalid user data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'invalid-email', password: 'short' });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});