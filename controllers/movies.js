const { Error } = require('mongoose');
const Movie = require('../models/movie');
const NotFoundErr = require('../errors/not-found');
const BadRequestErr = require('../errors/bad-request');
const ForbiddenErr = require('../errors/forbidden');
const {
  noMovieFoundErrText,
  invalidDataSavingMovieErrText,
  noMovieFoundByIdErrText,
  cantDeleteMovieErrText,
  wrongMovieIdErrText,
} = require('../utils/constants');

function getSavedMovies(req, res, next) {
  Movie.find()
    .populate('owner')
    .then((data) => {
      if (data) {
        res.send({ data });
      } else {
        next(new NotFoundErr(noMovieFoundErrText));
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
      nameRU,
      nameEN,
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
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    });

    await savedMovie.populate('owner');
    res.send({ data: savedMovie });
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      next(new BadRequestErr(invalidDataSavingMovieErrText));
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
      next(new NotFoundErr(noMovieFoundByIdErrText));
    } else if (String(movieData.owner) !== userId) {
      next(new ForbiddenErr(cantDeleteMovieErrText));
    } else {
      const deletedMovie = await movieData.remove();
      res.send({ data: deletedMovie });
    }
  } catch (err) {
    if (err instanceof Error.CastError) {
      next(new BadRequestErr(wrongMovieIdErrText));
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
