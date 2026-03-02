import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize, DataTypes } from 'sequelize';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.NODE_ENV === 'test' ? ':memory:' : 'database.sqlite',
    logging: false
});

export const Post = sequelize.define('Post', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    caption: { type: DataTypes.STRING, allowNull: false },
    like: { type: DataTypes.INTEGER, defaultValue: 0 },
    wow: { type: DataTypes.INTEGER, defaultValue: 0 },
    laugh: { type: DataTypes.INTEGER, defaultValue: 0 }
});

sequelize.sync();

app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.json(posts);
    } catch (error) {
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/posts', async (req, res) => {
    try {
        const newPost = await Post.create({
            imageUrl: req.body.imageUrl,
            caption: req.body.caption
        });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/posts/:id/reaction', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).send('Пост не найден');

        const reactionType = req.body.type;
        if (post[reactionType] !== undefined) {
            post[reactionType] += 1;
            await post.save();
            res.json(post);
        } else {
            res.status(400).send('Некорректный тип реакции');
        }
    } catch (error) {
        res.status(500).send('Ошибка сервера');
    }
});

app.delete('/posts/:id', async (req, res) => {
    try {
        const result = await Post.destroy({ where: { id: req.params.id } });
        if (result === 0) return res.status(404).send('Пост не найден');
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Ошибка сервера');
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(3000, () => console.log('Server running on port 3000'));
}

export { app, sequelize };
