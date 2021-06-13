import jest from 'jest';
import request from 'supertest';
import app from '../server';

describe('Hacker News enpoints', () => {
    it('should return an arrays of objects', async () => {
        request(app)
            .get('/')
            .expect('Content-Type', /json/)
            .expect('Content-Length', '15')
            .expect(200);
    });
    it('should return a 404 if not found', async () => {});
    it('should return 30 for each page (example: page 2 == 60 news, 3 == 90...)', async () => {});
});
