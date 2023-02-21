const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./router');

const app = express();
app.use(express.json());

const DB_URL = 'mongodb://localhost:27017/movies-explorer';
const PORT = 3000;
const NODE_ENV = 'dev';
const JWT_SECRET = 'dev-secret-key';

app.use('/', mainRouter);

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
