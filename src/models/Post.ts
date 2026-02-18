// Возможные типы реакций под постом
export type ReactionType = 'like' | 'wow' | 'laugh';

// Модель поста с идентификатором, ссылкой на картинку, подписью и счетчиками реакций
export class Post {
    constructor(
        public id: number,
        public imageUrl: string,
        public caption: string,
        public like: number = 0, 
        public wow: number = 0,  
        public laugh: number = 0
    ) {}

    // Увеличиваем счетчик выбранной реакции
    addReaction(type: ReactionType): void {
        this[type] = (this[type] ?? 0) + 1; 
    }
}