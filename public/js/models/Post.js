// Модель поста с идентификатором, ссылкой на картинку, подписью и счетчиками реакций
export class Post {
    constructor(id, imageUrl, caption, like = 0, 
    wow = 0, 
    laugh = 0 
    ) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.caption = caption;
        this.like = like;
        this.wow = wow;
        this.laugh = laugh;
    }
    // Увеличиваем счетчик выбранной реакции
    addReaction(type) {
        this[type] = (this[type] ?? 0) + 1; 
    }
}
