const userRout = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, getUser } = require('../controllers/user');

userRout.get('/', getUsers);

userRout.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), getUser);
module.exports = userRout;
