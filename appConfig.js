require('dotenv').config();

const { NODE_ENV = 'dev' } = process.env;
const { JWT_SECRET = 'dev-secret-key' } = process.env;

const { PORT = 3000 } = process.env;
const { DB_URL = 'mongodb://localhost:27017/movies-explorer' } = process.env;

module.exports = {
  NODE_ENV, JWT_SECRET, PORT, DB_URL,
};
