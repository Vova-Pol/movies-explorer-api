const mainRouter = require('express').Router();
const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');
const { postUser, loginUser } = require('../controllers/users');
const { signUpConfig, signInConfig } = require('../utils/celebrateValidConfig');
const NotFoundErr = require('../errors/not-found');
const { pageNotFoundErrText } = require('../utils/constants');
const usersRouter = require('./users');
const moviesRouter = require('./movies');

mainRouter.post('/signup', celebrate(signUpConfig), postUser);
mainRouter.post('/signin', celebrate(signInConfig), loginUser);

mainRouter.use(auth);

mainRouter.use('/users', usersRouter);
mainRouter.use('/movies', moviesRouter);

mainRouter.use('*', (req, res, next) => {
  next(new NotFoundErr(pageNotFoundErrText));
});

module.exports = mainRouter;
