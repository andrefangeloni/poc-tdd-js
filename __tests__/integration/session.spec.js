const request = require('supertest');

const factory = require('../factories');

const app = require('../../src/app');

const truncate = require('../utils/truncate');

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to authenticate with valid credentials', async () => {
    const user = await factory.create('User');

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: '123123',
    });

    expect(response.status).toBe(200);
  });

  it('should not be able to authenticate with invalid e-mail', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'teste@teste.com',
      password: '123123',
    });

    expect(response.status).toBe(401);
  });

  it('should not be able to authenticate with invalid password', async () => {
    const user = await factory.create('User');

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: '123456',
    });

    expect(response.status).toBe(401);
  });

  it('should be able to return JWT token after authentication', async () => {
    const user = await factory.create('User');

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: '123123',
    });

    expect(response.body).toHaveProperty('token');
  });

  it('should be able to access private routes when authenticated', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post('/dashboard')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('should not be able to access private routes without JWT token', async () => {
    const response = await request(app).post('/dashboard');

    expect(response.status).toBe(401);
  });

  it('should not be able to access private routes with invalid JWT token', async () => {
    const response = await request(app)
      .post('/dashboard')
      .set('Authorization', `Bearer 123123`);

    expect(response.status).toBe(401);
  });
});
