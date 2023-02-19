const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');

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

module.exports = model('User', userSchema);
