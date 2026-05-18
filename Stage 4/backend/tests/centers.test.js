const request = require('supertest');
const app = require('../server');

describe('Centers API', () => {
  test('GET /api/centers - success', async () => {
    const res = await request(app).get('/api/centers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/centers/:id - not found', async () => {
    const res = await request(app).get('/api/centers/9999');
    expect(res.statusCode).toBe(404);
  });

  test('POST /api/centers - unauthorized', async () => {
    const res = await request(app)
      .post('/api/centers')
      .send({
        name: 'Test Center',
        location: 'Riyadh',
        description: 'Test'
      });
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/centers/all - unauthorized', async () => {
    const res = await request(app).get('/api/centers/all');
    expect(res.statusCode).toBe(401);
  });

  test('DELETE /api/centers/1 - unauthorized', async () => {
    const res = await request(app).delete('/api/centers/1');
    expect(res.statusCode).toBe(401);
  });

  test('PATCH /api/centers/1/approve - unauthorized', async () => {
    const res = await request(app).patch('/api/centers/1/approve');
    expect(res.statusCode).toBe(401);
  });
});
