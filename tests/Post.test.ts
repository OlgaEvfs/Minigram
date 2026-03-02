import { describe, it, expect } from '@jest/globals';
import { Post } from '../src/models/Post';

describe('Post Model', () => {
    it('should create a post instance with default counts', () => {
        const post = new Post(1, 'http://test.com/img.jpg', 'My Caption');
        
        expect(post.id).toBe(1);
        expect(post.imageUrl).toBe('http://test.com/img.jpg');
        expect(post.caption).toBe('My Caption');
        expect(post.like).toBe(0);
        expect(post.wow).toBe(0);
        expect(post.laugh).toBe(0);
    });

    it('should increment reactions correctly', () => {
        const post = new Post(1, 'img.jpg', 'Cap');
        
        post.addReaction('like');
        expect(post.like).toBe(1);
        expect(post.wow).toBe(0);
        
        post.addReaction('wow');
        post.addReaction('wow');
        expect(post.wow).toBe(2);
        expect(post.laugh).toBe(0);
        
        post.addReaction('laugh');
        expect(post.laugh).toBe(1);
    });

    it('should handle undefined initial reaction counts (safety check)', () => {
        // Создаем объект без указания счетчиков (через constructor они по умолчанию 0)
        const post = new Post(2, 'img.png', 'Another');
        
        // Насильно установим undefined для проверки логики addReaction (this[type] ?? 0)
        (post as any).like = undefined;
        
        post.addReaction('like');
        expect(post.like).toBe(1);
    });
});
