const сard = require('../models/card');

module.exports.getCards = (req, res) => {
  сard
    .find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(404).send({ data: err.message }));
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  сard
    .create({ name, link, owner: req.user._id })
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ data: err.message }));
};
module.exports.deleteCard = (req, res) => {
  сard
    .findOne({ _id: req.params.cardId }).orFail(() => new Error('Нет такой карточки'))
    .then(async (cardobj) => {
      if (cardobj.owner.toString() !== req.user._id) {
        return res.status(403).send({ message: 'Удалять не свои карточки нельзя' });
      }
      await cardobj.remove();
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => res.status(404).send({ err, message: err.message }));
};
