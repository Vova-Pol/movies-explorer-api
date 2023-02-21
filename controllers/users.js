const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Error } = require('mongoose');
const ConflictErr = require('../errors/conflict');
const BadRequestErr = require('../errors/bad-request');
const { NODE_ENV, JWT_SECRET } = require('../app');
// Перенести NODE_ENV и JWT в .env файл на сервере
// и получить к ним доступ с помощью модуля dotenv и process.env

function postUser(req, res, next) {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      }),
    )
    .then((data) => {
      const newUser = data.toObject();
      delete newUser.password;
      res.send({ data: newUser });
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(
          new BadRequestErr(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      } else if (err.code === 11000) {
        next(new ConflictErr('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
}

function loginUser(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch(next);
}

function getUserInfo(req, res, next) {}

function patchUserInfo(req, res, next) {}

module.exports = {
  postUser,
  loginUser,
  getUserInfo,
  patchUserInfo,
};
