const userRout = require('express').Router();
const { getUsers, getUser } = require('../controllers/user');

userRout.get('/', getUsers);
userRout.get('/:id', getUser);
module.exports = userRout;
