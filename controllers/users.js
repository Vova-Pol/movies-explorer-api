const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Error } = require('mongoose');
const ConflictErr = require('../errors/conflict');
const BadRequestErr = require('../errors/bad-request');
const NotFoundErr = require('../errors/not-found');
const { NODE_ENV, JWT_SECRET } = require('../appConfig');

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

function getUserInfo(req, res, next) {
  const userId = req.user._id;
  User.findById(userId)
    .then((userData) => {
      if (userData) {
        res.send({ data: userData });
      } else {
        next(new NotFoundErr('Пользователь по указанному _id не найден'));
      }
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestErr('Передан некорректный _id пользователя'));
      } else {
        next(err);
      }
    });
}

function patchUserInfo(req, res, next) {
  const { name } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name }, { new: true, runValidators: true })
    .then((userData) => {
      if (userData) {
        res.send({ data: userData });
      } else {
        next(new NotFoundErr('Пользователь с указанным _id не найден'));
      }
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(
          new BadRequestErr(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      } else {
        next(err);
      }
    });
}

module.exports = {
  postUser,
  loginUser,
  getUserInfo,
  patchUserInfo,
};
