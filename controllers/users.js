const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const IdenticalDataErrors = require('../errors/IdenticalDataErrors');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getUsersMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователя не существует'); // 404
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  const userId = req.user._id;

  User.findOneAndUpdate({ _id: userId }, { email, name }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.createProfile = (req, res, next) => {
  const { email, password, name } = req.body;

  User.findOne({ email })
    .then((data) => {
      if (data && data.email === email) {
        throw new IdenticalDataErrors('Пользователь с таким Email существует'); // 409
      }
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.create({
            email,
            password: hash,
            name,
          })
            .then((user) => {
              res.status(200).send(user);
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль'); // 401
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неправильные почта или пароль'); // 401
        }
        const { JWT_SECRET } = process.env;
        const NODE_ENV = 'dev';
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        );
        return res.status(200).send({ token });
      });
    })
    .catch(next);
};
