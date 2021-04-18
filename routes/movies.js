const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  deleteMovies,
  createMovies,
} = require('../controllers/movies');

router.get(
  '/movies',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(),
  }),
  getMovies,
);

router.post(
  '/movies',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(),
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .pattern(/^https?:\/\/[a-z0-9\W\_]+#?$/i, "url"), // eslint-disable-line
      trailer: Joi.string()
        .required()
        .pattern(/^https?:\/\/[a-z0-9\W\_]+#?$/i, "url"), // eslint-disable-line
      thumbnail: Joi.string()
        .required()
        .pattern(/^https?:\/\/[a-z0-9\W\_]+#?$/i, "url"), // eslint-disable-line
      movieId: Joi.string().alphanum().length(24).required(),
      nameRu: Joi.string().required(),
      nameEn: Joi.string().required(),
    }),
  }),
  createMovies,
);

router.delete(
  '/movies/movieId',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(),
    params: Joi.object().keys({
      movieId: Joi.string().alphanum().length(24).required(),
    }),
  }),
  deleteMovies,
);

module.exports = router;
