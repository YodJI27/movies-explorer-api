const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsersMe, updateProfile } = require('../controllers/users');

router.get(
  '/users/me',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(),
  }),
  getUsersMe,
);
router.patch(
  '/users/me',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required(),
    }),
  }),
  updateProfile,
);

module.exports = router;
