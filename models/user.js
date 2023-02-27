const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedErr = require('../errors/unauthorized');
const { wrongPasswordOrEmailErrText } = require('../utils/constants');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'email is not valid'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((userData) => {
      if (!userData) {
        return Promise.reject(new UnauthorizedErr(wrongPasswordOrEmailErrText));
      }
      return bcrypt.compare(password, userData.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedErr(wrongPasswordOrEmailErrText),
          );
        }
        return userData;
      });
    });
};

module.exports = model('User', userSchema);
