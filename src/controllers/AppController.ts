import { AppView } from '../views/AppView.js';
import { Post, ReactionType } from '../models/Post.js';

// Связывает View и данные, управляет состоянием ленты
export class AppController {
    private posts: Post[] = [];

    constructor(private view: AppView) {}

    private async fetchPosts(): Promise<void> {
        try {
            const response = await fetch('http://localhost:3000/posts');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const posts = await response.json();
            // Преобразуем полученные объекты в экземпляры класса Post
            this.posts = posts.map((postData: any) => new Post(
                postData.id,
                postData.imageUrl,
                postData.caption,
                postData.like,
                postData.wow,
                postData.laugh
            ));
            this.view.render(this.posts);
        } catch (error) {
            console.error('Ошибка при получении постов:', error);
            this.view.showMessage('Не удалось загрузить посты.');
        }
    }

    // Точка инициализации: подписываем события, наполняем демо-данными и показываем список
    init(): void {
        this.view.bindCreate(this.handleCreatePost);
        this.view.bindReact(this.handleReact);
        this.view.bindDelete(this.handleDeletePost);
        this.fetchPosts();
    }



    // Обработчик создания нового поста
    private handleCreatePost = async (imageUrl: string, caption: string): Promise<void> => {
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
        } catch (error) {
            console.error('Ошибка при создании поста:', error);
            this.view.showMessage('Не удалось создать пост.');
        }
    };

    // Обработчик реакции: ищем пост и увеличиваем соответствующий счетчик
    private handleReact = async (postId: number, reaction: ReactionType): Promise<void> => {
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
        } catch (error) {
            console.error('Ошибка при добавлении реакции:', error);
            this.view.showMessage('Не удалось добавить реакцию.');
        }
    };

    // Обработчик удаления поста
    private handleDeletePost = async (postId: number): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // После успешного удаления, получаем обновленный список постов
            await this.fetchPosts();
        } catch (error) {
            console.error('Ошибка при удалении поста:', error);
            this.view.showMessage('Не удалось удалить пост.');
        }
    };
}