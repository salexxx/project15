const cardRout = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/card');

cardRout.get('/', getCards);
cardRout.post('/', createCard);
cardRout.delete('/:cardId', deleteCard);
module.exports = cardRout;
