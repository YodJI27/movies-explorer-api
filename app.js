require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { BD_DEV_HOST } = require('./utils/config');
const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { authoriz } = require('./middlewares/auth');
const { login, createProfile } = require('./controllers/users');
const { centralErrors } = require('./utils/centralErrors');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

const { PORT = 3000, LINK, NODE_ENV} = process.env;
mongoose.connect(NODE_ENV === 'production' ? LINK : BD_DEV_HOST, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(requestLogger);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().alphanum().required(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createProfile,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().alphanum().required().min(8),
    }),
  }),
  login,
);

app.use('/', authoriz, userRouter);
app.use('/', authoriz, moviesRouter);

app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});
app.use(errorLogger);
app.use(errors());

// Обработка ошибок
app.use(centralErrors);

app.listen(PORT);
