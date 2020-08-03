const cardRout = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCards, createCard, deleteCard } = require('../controllers/card');
const regexUrl = require('../regexUrl');

cardRout.get('/', getCards);

cardRout.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().regex(regexUrl).required(),
  }),
}), createCard);

cardRout.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteCard);
module.exports = cardRout;
