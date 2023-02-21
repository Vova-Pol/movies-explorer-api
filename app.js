const express = require('express');
const mongoose = require('mongoose');
const { DB_URL, PORT } = require('./appConfig');
const mainRouter = require('./router');

const app = express();
app.use(express.json());

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
