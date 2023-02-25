const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/unauthorized');
const { NODE_ENV, JWT_SECRET } = require('../appConfig');
const { unauthorizedErrText } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedErr(unauthorizedErrText));
    return;
  }

  const token = authorization.replace('Bearer ', '');
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
