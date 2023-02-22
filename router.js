const router = require('express').Router();
const {
  postUser,
  loginUser,
  getUserInfo,
  patchUserInfo,
} = require('./controllers/users');
const {
  getSavedMovies,
  postSavedMovie,
  deleteSavedMovie,
} = require('./controllers/movies');
const {
  signInConfig,
  signUpConfig,
  patchUserInfoConfig,
  postSavedMovieConfig,
  deleteSavedMovieConfig,
} = require('./utils/errorHandleConfig');
const { celebrate } = require('celebrate');
const auth = require('./middlewares/auth');

router.post('/signup', celebrate(signUpConfig), postUser);
router.post('/signin', celebrate(signInConfig), loginUser);

router.use(auth());

router.get('/users/me', getUserInfo);
router.patch('/users/me', celebrate(patchUserInfoConfig), patchUserInfo);

router.get('/movies', getSavedMovies);
router.post('/movies', celebrate(postSavedMovieConfig), postSavedMovie);
router.delete(
  '/movies/:movieId',
  celebrate(deleteSavedMovieConfig),
  deleteSavedMovie,
);

module.exports = router;
