const Movie = require('../models/movie');
const { Error } = require('mongoose');
const NotFoundErr = require('../errors/not-found');
const BadRequestErr = require('../errors/bad-request');
const ForbiddenErr = require('../errors/forbidden');

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

async function deleteSavedMovie(req, res, next) {
  const { movieId } = req.params;
  const userId = req.user._id;
  let movieData;

  try {
    movieData = await Movie.findById(movieId);

    if (!movieData) {
      next(new NotFoundErr('Фильм с указанным _id не найден'));
    } else if (String(movieData.owner) !== userId) {
      next(new ForbiddenErr('Вы не можете удалять чужие фильмы'));
    } else {
      const deletedMovie = await movieData.remove();
      res.send({ data: deletedMovie });
    }
  } catch (err) {
    if (err instanceof Error.CastError) {
      next(new BadRequestErr('Передан некорректный _id фильма'));
    } else {
      next(err);
    }
  }
}

module.exports = {
  getSavedMovies,
  postSavedMovie,
  deleteSavedMovie,
};
