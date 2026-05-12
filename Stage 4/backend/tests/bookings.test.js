const request = require('supertest');
const app = require('../server');

describe('Bookings API', () => {
  test('GET /api/bookings/me - unauthorized', async () => {
    const res = await request(app).get('/api/bookings/me');
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/bookings - unauthorized', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        course_id: 1,
        date: '2026-06-01T10:00:00Z'
      });
    expect(res.statusCode).toBe(401);
  });
});
