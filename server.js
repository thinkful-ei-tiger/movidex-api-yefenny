require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

const movies = require('./movies-data.json');

function validateAuth(req, res, next) {
  const API_TOKEN = process.env.API_TOKEN;
  const auth = req.get('Authorization');

  if (
    !auth ||
    auth.split(' ')[1] !== API_TOKEN ||
    auth.split(' ')[0] !== 'Bearer'
  )
    res.status(401).json({ message: 'Invalid authorization' });
  next();
}

app.use(validateAuth);
function handleGetMovie(req, res) {
  res.send('Handle get movie');
}

function handleGetMovie(req, res) {
  let { genre, country, avg_vote } = req.query;
  let results = [...movies];
  if (genre) {
    results = results.filter((result) =>
      result.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }
  if (country) {
    results = results.filter((results) =>
      result.country.toLowerCase().includes(country.toLowerCase())
    );
  }
}
app.get('/movie', handleGetMovie);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`App is running in PORT:${PORT}`);
});
