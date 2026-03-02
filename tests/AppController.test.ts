import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { AppController } from '../src/controllers/AppController';
import { AppView } from '../src/views/AppView';
import { Post } from '../src/models/Post';

describe('AppController', () => {
    let controller: AppController;
    let mockView: jest.Mocked<AppView>;

    beforeEach(() => {
        // Создаем мок для AppView
        mockView = {
            render: jest.fn(),
            bindCreate: jest.fn(),
            bindReact: jest.fn(),
            bindDelete: jest.fn(),
            showMessage: jest.fn(),
            clearMessage: jest.fn(),
            resetForm: jest.fn(),
        } as any;

        controller = new AppController(mockView);

        // Мокаем глобальный fetch
        global.fetch = jest.fn() as any;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should initialize and fetch posts', async () => {
        const mockPosts = [
            { id: 1, imageUrl: 'test.jpg', caption: 'Test', like: 0, wow: 0, laugh: 0 }
        ];

        // Настраиваем fetch так, чтобы он вернул наш массив
        (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
            ok: true,
            json: async () => mockPosts,
        } as Response);

        // Запускаем инициализацию
        await (controller as any).fetchPosts();

        // Проверяем, что fetch был вызван по правильному адресу
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/posts');

        // Проверяем, что View.render был вызван с объектами класса Post
        expect(mockView.render).toHaveBeenCalled();
        const renderedPosts = mockView.render.mock.calls[0][0];
        expect(renderedPosts[0]).toBeInstanceOf(Post);
        expect(renderedPosts[0].caption).toBe('Test');
    });

    it('should show error message if fetch fails', async () => {
        (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
            ok: false,
            status: 500
        } as Response);

        await (controller as any).fetchPosts();

        expect(mockView.showMessage).toHaveBeenCalledWith('Не удалось загрузить посты.');
    });

    it('should bind handlers during init', () => {
        controller.init();

        expect(mockView.bindCreate).toHaveBeenCalled();
        expect(mockView.bindReact).toHaveBeenCalled();
        expect(mockView.bindDelete).toHaveBeenCalled();
    });
});
