// конфиг валидации модулем celebrate
const { Joi } = require('celebrate');
const { urlRegEx } = require('./constants');

const signInConfig = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const signUpConfig = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
};

const patchUserInfoConfig = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
};

const postSavedMovieConfig = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegEx),
    trailerLink: Joi.string().required().pattern(urlRegEx),
    thumbnail: Joi.string().required().pattern(urlRegEx),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
};

const deleteSavedMovieConfig = {
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24),
  }),
};

module.exports = {
  signInConfig,
  signUpConfig,
  patchUserInfoConfig,
  postSavedMovieConfig,
  deleteSavedMovieConfig,
};
