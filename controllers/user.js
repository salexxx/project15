const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const user = require('../models/user');
const NotFound = require('../errors/notfound');
const BadRequest = require('../errors/badrequest');

module.exports.getUsers = (req, res, next) => {
  user.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  if (!name || !password || password.length < 6 || name.match(/^[ ]+$/)) {
    throw new BadRequest('Ведите имя и пароль не меньше 6 символов');
  }
  bcrypt.hash(password, 10)
    .then((hash) => user.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((users) => res.status(200).send({
      data: {
        name: users.name, about: users.about, avatar: users.avatar, email: users.email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        throw new BadRequest('Пользователь с таким email уже зарегистрирован');
      }
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  user
    .findById(req.params.id).orFail(new NotFound('Пользователь не найден'))
    .then((someuser) => res.send({ data: someuser }))
    .catch(next);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password)
    .then((usr) => {
      const token = jwt.sign({ _id: usr._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
