const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const { DB_URL, PORT } = require('./appConfig');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./utils/rateLimiter');
const centralErrorHandle = require('./middlewares/centralErrorHandle');
const mainRouter = require('./routes/index');

const app = express();
app.use(express.json());

// Безопасность
app.use(helmet());
app.use(rateLimiter);

// Обработка запросов
app.use(requestLogger);
app.use(cors());
app.use('/', mainRouter);

// Обработка ошибок
app.use(errorLogger);
app.use(errors());
app.use(centralErrorHandle);

// Запуск сервера
async function startApp() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
    });

    app.listen(PORT, () => {
      console.log(`Приложение запущено на ${PORT} порту`);
    });
  } catch (err) {
    console.error(`Возникла ошибка при запуске приложения: ${err}`);
  }
}

startApp();
