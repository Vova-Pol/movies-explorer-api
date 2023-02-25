// конфиг валидации модулем celebrate
const { Joi } = require('celebrate');

const signInConfig = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

const signUpConfig = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
};

const patchUserInfoConfig = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
};

const postSavedMovieConfig = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailerLink: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movieId: Joi.string().required(),
    nameRu: Joi.string().required(),
    nameEn: Joi.string().required(),
  }),
};

const deleteSavedMovieConfig = {
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
};

module.exports = {
  signInConfig,
  signUpConfig,
  patchUserInfoConfig,
  postSavedMovieConfig,
  deleteSavedMovieConfig,
};
