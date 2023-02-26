const { Error } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictErr = require('../errors/conflict');
const BadRequestErr = require('../errors/bad-request');
const NotFoundErr = require('../errors/not-found');
const { NODE_ENV, JWT_SECRET } = require('../appConfig');
const {
  invalidDataCreatingUserErrText,
  existingUserErrText,
  noUserFoundByIdErrText,
  invalidUserIdErrText,
  invalidDataPatchingUserErrText,
} = require('../utils/constants');

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
        next(new BadRequestErr(invalidDataCreatingUserErrText));
      } else if (err.code === 11000) {
        next(new ConflictErr(existingUserErrText));
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
        next(new NotFoundErr(noUserFoundByIdErrText));
      }
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestErr(invalidUserIdErrText));
      } else {
        next(err);
      }
    });
}

function patchUserInfo(req, res, next) {
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })
    .then((userData) => {
      if (userData) {
        res.send({ data: userData });
      } else {
        next(new NotFoundErr(noUserFoundByIdErrText));
      }
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequestErr(invalidDataPatchingUserErrText));
      } else if (err.code === 11000) {
        next(new ConflictErr(existingUserErrText));
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
