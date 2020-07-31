const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const userRout = require('./routes/users');
const cardRout = require('./routes/cards');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const notFound = require('./errors/notfound');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', userRout);
app.use('/cards', cardRout);

app.use('/*', (req, res, next) => {
  next (new notFound({ message: 'Запрашиваемый ресурс не найден' }));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
      .status(statusCode)
      .send({
          message: statusCode === 500
              ? 'На сервере произошла ошибка'
              : message
      });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
