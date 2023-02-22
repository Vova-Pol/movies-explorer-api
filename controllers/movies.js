const Movie = require('../models/movie');
const { Error } = require('mongoose');
const NotFoundErr = require('../errors/not-found');
const BadRequestErr = require('../errors/bad-request');

function getSavedMovies(req, res, next) {
  Movie.find()
    .populate('owner')
    .then((data) => {
      if (data) {
        res.send({ data });
      } else {
        next(new NotFoundErr('Не найдено ни одного фильма'));
      }
    })
    .catch(next);
}

async function postSavedMovie(req, res, next) {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRu,
      nameEn,
      thumbnail,
      movieId,
    } = req.body;

    const savedMovie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRu,
      nameEn,
      thumbnail,
      movieId,
      owner: req.user._id,
    });

    await savedMovie.populate('owner');
    res.send({ data: savedMovie });
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      next(
        new BadRequestErr('Переданы некорректные данные при сохранении фильма'),
      );
    } else {
      next(err);
    }
  }
}

function deleteSavedMovie(req, res, next) {
  const { movieId } = req.params;

  Movie.findByIdAndRemove(movieId)
    .then((data) => {
      if (!data) {
        next(new NotFoundErr('Фильм с указанным _id не найден'));
      } else {
        res.send({ data });
      }
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestErr('Передан некорректный _id фильма'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getSavedMovies,
  postSavedMovie,
  deleteSavedMovie,
};
