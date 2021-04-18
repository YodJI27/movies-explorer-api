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
        .pattern(/^https?:\/\/[a-z0-9\W]+#?$/i, 'url'),
      trailer: Joi.string()
        .required()
        .pattern(/^https?:\/\/[a-z0-9\W]+#?$/i, 'url'),
      thumbnail: Joi.string()
        .required()
        .pattern(/^https?:\/\/[a-z0-9\W]+#?$/i, 'url'),
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
