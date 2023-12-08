const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const db = require('./database/connect.js');
const { DB_URL, PORT } = require('./appConfig');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./utils/rateLimiter');
const centralErrorHandle = require('./middlewares/centralErrorHandle');
const mainRouter = require('./routes');
const { default: connect } = require('./database/connect');

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://vova-pol.github.io/movies-explorer-frontend',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);
app.use(express.json());

// Логгирование
app.use(requestLogger);

// Куки
app.use(cookieParser());

// Безопасность
app.use(helmet());
app.use(rateLimiter);

// Обработка запросов

app.use('/', mainRouter);

// Обработка ошибок
app.use(errorLogger);
app.use(errors());
app.use(centralErrorHandle);

// Подключение к БД и запуск сервера
db.connect()
  .then(() => {
    try {
      app.listen(PORT, () => {
        console.log(`Приложение запущено на ${PORT} порту`);
      });
    } catch (error) {
      console.log('Ошибка при запуске сервера');
      console.log(error);
    }
  })
  .catch((err) => {
    console.log('Ошибка при подключении к Базе Данных');
    console.log(err);
  });
