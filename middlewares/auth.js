const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/unauthorized');
const { NODE_ENV, JWT_SECRET } = require('../appConfig');
const { unauthorizedErrText } = require('../utils/constants');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new UnauthorizedErr(unauthorizedErrText));
    return;
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key',
    );
  } catch (err) {
    next(new UnauthorizedErr(unauthorizedErrText));
    return;
  }

  req.user = payload;

  next();
};
