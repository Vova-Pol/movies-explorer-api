const express = require('express');
const mongoose = require('mongoose');
const { DB_URL, PORT } = require('./appConfig');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const mainRouter = require('./router');

const app = express();
app.use(express.json());
app.use(requestLogger);

app.use('/', mainRouter);

app.use(errorLogger);

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
