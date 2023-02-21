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
const auth = require('./middlewares/auth');

router.post('/signup', postUser);
router.post('/signin', loginUser);

// router.use(auth);

router.get('/users/me', getUserInfo);
router.patch('/users/me', patchUserInfo);

router.get('/movies', getSavedMovies);
router.post('/movies', postSavedMovie);
router.delete('/movies/:movieId', deleteSavedMovie);

module.exports = router;
