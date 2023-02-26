const moviesRouter = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getSavedMovies,
  postSavedMovie,
  deleteSavedMovie,
} = require('../controllers/movies');
const {
  postSavedMovieConfig,
  deleteSavedMovieConfig,
} = require('../utils/celebrateValidConfig');

moviesRouter.get('/', getSavedMovies);
moviesRouter.post('/', postSavedMovie);
moviesRouter.delete(
  '/:movieId',
  celebrate(deleteSavedMovieConfig),
  deleteSavedMovie,
);

module.exports = moviesRouter;
// celebrate(postSavedMovieConfig),
