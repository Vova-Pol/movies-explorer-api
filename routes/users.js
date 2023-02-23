const usersRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { getUserInfo, patchUserInfo } = require('../controllers/users');
const { patchUserInfoConfig } = require('../utils/celebrateValidConfig');

usersRouter.get('/me', getUserInfo);
usersRouter.patch('/me', celebrate(patchUserInfoConfig), patchUserInfo);

module.exports = usersRouter;
