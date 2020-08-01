const сard = require('../models/card');
const NotFound = require('../errors/notfound');
const Forbidden = require('../errors/forbidden');

module.exports.getCards = (req, res, next) => {
  сard
    .find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  сard
    .create({ name, link, owner: req.user._id })
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};
module.exports.deleteCard = (req, res, next) => {
  сard
    .findOne({ _id: req.params.cardId }).orFail(new NotFound('Нет такой карточки'))
    .then(async (cardobj) => {
      if (cardobj.owner.toString() !== req.user._id) {
        throw new Forbidden('Удалять не свои карточки нельзя');
      }
      await cardobj.remove();
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch(next);
};
