const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const NotFound = require('../errors/notfound');

module.exports.getUsers = (req, res, next) => {
  user.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => user.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((users) => res.status(200).send({
      data: {
        name: users.name, about: users.about, avatar: users.avatar, email: users.email,
      },
    }))
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
      const token = jwt.sign({ _id: usr._id }, 'secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
