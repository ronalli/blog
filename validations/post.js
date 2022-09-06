import { body } from 'express-validator';

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи')
    .isLength({
      min: 4,
    })
    .isString(),
  body('text', 'Введите текст статьи')
    .isLength({
      min: 10,
    })
    .isString(),
  body('tags', 'Неверный формат тэгов').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображения').optional().isString(),
];
