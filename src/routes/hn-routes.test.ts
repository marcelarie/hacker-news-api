import request from 'supertest';
import app from '../server';

describe('Hacker News enpoints', () => {
    it('should return an arrays of objects', async () => {
        await request(app).get('/').expect('Content-Type', /json/).expect(200);
    });
    it('should return a message and status 404 for non existing pages', async () => {
        const { body } = await request(app).get('/fdfsdsdg').expect(404);

        expect(body.message).toBe("Can't find this page at Hacker News");
    });

    it('should return 30 for each page (example: page 2 == 60 news, 3 == 90...)', async () => {
        const howManyPagesOfNews = 2;
        const { body } = await request(app)
            .get('/' + howManyPagesOfNews)
            .expect('Content-Type', /json/)
            .expect(200);

        const dataLength = body.length;

        // if (howManyPagesOfNews == 1) expect(dataLength).toBe(30);
        if (howManyPagesOfNews == 2) expect(dataLength).toBe(60);
        // if (howManyPagesOfNews == 3) expect(dataLength).toBe(90);
    });
});
