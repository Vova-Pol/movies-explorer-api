// Текст ошибок авторизации
const unauthorizedErrText = 'Необходима авторизация';
const wrongPasswordOrEmailErrText = 'Неправильные почта или пароль';

// Текст ошибок при запросе к Фильмам
const noMovieFoundErrText = 'Не найдено ни одного фильма';
const invalidDataSavingMovieErrText =
  'Переданы некорректные данные при сохранении фильма';
const noMovieFoundByIdErrText = 'Фильм с указанным _id не найден';
const cantDeleteMovieErrText = 'Вы не можете удалять чужие фильмы';
const wrongMovieIdErrText = 'Передан некорректный _id фильма';

// Текст ошибок при запросе к Пользователям
const invalidDataCreatingUserErrText =
  'Переданы некорректные данные при создании пользователя';
const existingUserErrText = 'Пользователь с таким email уже существует';
const noUserFoundByIdErrText = 'Пользователь по указанному _id не найден';
const invalidUserIdErrText = 'Передан некорректный _id пользователя';
const invalidDataPatchingUserErrText =
  'Переданы некорректные данные при обновлении профиля';

// Регулярные выражения для валидации
const urlRegEx = /^https?:\/\/[^а-яё\s]+$/;

module.exports = {
  noMovieFoundErrText,
  invalidDataSavingMovieErrText,
  noMovieFoundByIdErrText,
  cantDeleteMovieErrText,
  wrongMovieIdErrText,
  invalidDataCreatingUserErrText,
  existingUserErrText,
  noUserFoundByIdErrText,
  invalidUserIdErrText,
  invalidDataPatchingUserErrText,
  unauthorizedErrText,
  wrongPasswordOrEmailErrText,
  urlRegEx,
};
