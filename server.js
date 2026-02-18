import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Sequelize, DataTypes } from 'sequelize'; // Импортируем Sequelize и DataTypes

const app = express();
app.use(cors());
app.use(express.json());

// Определяем __dirname для ES модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Обслуживание статических файлов из папки 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Инициализация Sequelize и подключение к SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite' // Файл, где будет храниться база данных
});

// Определение модели Post
const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    caption: {
        type: DataTypes.STRING,
        allowNull: false
    },
    like: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    wow: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    laugh: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

// Синхронизация моделей с базой данных
sequelize.sync().then(() => {
    console.log('База данных и таблицы созданы!');
}).catch(err => {
    console.error('Ошибка синхронизации базы данных:', err);
});



// Получение всех постов
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.json(posts);
    } catch (error) {
        console.error('Ошибка при получении постов:', error);
        res.status(500).send('Ошибка сервера при получении постов.');
    }
});

// Добавление нового поста
app.post('/posts', async (req, res) => {
    try {
        const newPost = await Post.create({
            imageUrl: req.body.imageUrl,
            caption: req.body.caption,
            like: 0,
            wow: 0,
            laugh: 0
        });
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Ошибка при создании поста:', error);
        res.status(500).send('Ошибка сервера при создании поста.');
    }
});

// Добавление реакции
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
            res.status(400).send('Некорректный тип реакции.');
        }
    } catch (error) {
        console.error('Ошибка при добавлении реакции:', error);
        res.status(500).send('Ошибка сервера при добавлении реакции.');
    }
});

// Удаление поста
app.delete('/posts/:id', async (req, res) => {
    try {
        const result = await Post.destroy({
            where: { id: req.params.id }
        });

        if (result === 0) {
            return res.status(404).send('Пост не найден');
        }

        res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Ошибка при удалении поста:', error);
        res.status(500).send('Ошибка сервера при удалении поста.');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
