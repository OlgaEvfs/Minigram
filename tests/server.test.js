import request from 'supertest';
import { app, sequelize } from '../server.js';

describe('Posts API', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true }); // Пересоздаем таблицы перед тестами
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /posts', () => {
        it('should return an empty array if no posts exist', async () => {
            const response = await request(app).get('/posts');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe('POST /posts', () => {
        it('should create a new post with correct data', async () => {
            const newPost = { imageUrl: 'test.jpg', caption: 'Test Post' };
            const response = await request(app).post('/posts').send(newPost);
            
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(newPost);
            expect(response.body.id).toBeDefined();
        });

        it('should fail if imageUrl is missing (Sequelize validation)', async () => {
            const response = await request(app).post('/posts').send({ caption: 'No image' });
            expect(response.status).toBe(500); // Sequelize выкинет ошибку, сервер вернет 500
        });
    });

    describe('POST /posts/:id/reaction', () => {
        let postId;

        beforeEach(async () => {
            const post = await request(app).post('/posts').send({ imageUrl: 't.jpg', caption: 'c' });
            postId = post.body.id;
        });

        it('should increment reaction count for valid type', async () => {
            const response = await request(app).post(`/posts/${postId}/reaction`).send({ type: 'wow' });
            expect(response.status).toBe(200);
            expect(response.body.wow).toBe(1);
        });

        it('should return 400 for invalid reaction type', async () => {
            const response = await request(app).post(`/posts/${postId}/reaction`).send({ type: 'dislike' });
            expect(response.status).toBe(400);
        });

        it('should return 404 for non-existent post', async () => {
            const response = await request(app).post('/posts/9999/reaction').send({ type: 'like' });
            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /posts/:id', () => {
        it('should delete an existing post', async () => {
            const post = await request(app).post('/posts').send({ imageUrl: 'd.jpg', caption: 'delete' });
            const id = post.body.id;

            const delResponse = await request(app).delete(`/posts/${id}`);
            expect(delResponse.status).toBe(204);

            const getResponse = await request(app).get('/posts');
            const found = getResponse.body.find(p => p.id === id);
            expect(found).toBeUndefined();
        });

        it('should return 404 when deleting non-existent post', async () => {
            const response = await request(app).delete('/posts/8888');
            expect(response.status).toBe(404);
        });
    });
});
