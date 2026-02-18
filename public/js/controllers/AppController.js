import { Post } from '../models/Post.js';
// Связывает View и данные, управляет состоянием ленты
export class AppController {
    constructor(view) {
        this.view = view;
        this.posts = [];
        // Обработчик создания нового поста
        this.handleCreatePost = async (imageUrl, caption) => {
            if (!imageUrl || !caption) {
                this.view.showMessage('Add an image URL and a caption.');
                return;
            }
            this.view.clearMessage();
            try {
                const response = await fetch('http://localhost:3000/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ imageUrl, caption })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // После успешного создания, получаем обновленный список постов
                await this.fetchPosts();
                this.view.resetForm();
            }
            catch (error) {
                console.error('Ошибка при создании поста:', error);
                this.view.showMessage('Не удалось создать пост.');
            }
        };
        // Обработчик реакции: ищем пост и увеличиваем соответствующий счетчик
        this.handleReact = async (postId, reaction) => {
            try {
                const response = await fetch(`http://localhost:3000/posts/${postId}/reaction`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ type: reaction })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // После успешной реакции, получаем обновленный список постов
                await this.fetchPosts();
            }
            catch (error) {
                console.error('Ошибка при добавлении реакции:', error);
                this.view.showMessage('Не удалось добавить реакцию.');
            }
        };

        // Обработчик удаления поста
        this.handleDeletePost = async (postId) => {
            try {
                const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // После успешного удаления, получаем обновленный список постов
                await this.fetchPosts();
                this.view.showMessage('Пост успешно удален.');
            } catch (error) {
                console.error('Ошибка при удалении поста:', error);
                this.view.showMessage('Не удалось удалить пост.');
            }
        };
    }
    async fetchPosts() {
        try {
            const response = await fetch('http://localhost:3000/posts');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const posts = await response.json();
            // Преобразуем полученные объекты в экземпляры класса Post
            this.posts = posts.map((postData) => new Post(postData.id, postData.imageUrl, postData.caption, postData.like, postData.wow, postData.laugh));
            this.view.render(this.posts);
        }
        catch (error) {
            console.error('Ошибка при получении постов:', error);
            this.view.showMessage('Не удалось загрузить посты.');
        }
    }
    // Точка инициализации: подписываем события, наполняем демо-данными и показываем список
    init() {
        this.view.bindCreate(this.handleCreatePost);
        this.view.bindReact(this.handleReact);
        this.view.bindDelete(this.handleDeletePost); // Привязываем новый обработчик удаления
        this.fetchPosts();
    }
}
