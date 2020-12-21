require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
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
    results = results.filter((result) =>
      result.country.toLowerCase().includes(country.toLowerCase())
    );
  }
  if (avg_vote) {
    results = results.filter(
      (result) => result['avg_vote'] >= Number(avg_vote)
    );
  }

  res.json(results);
}
app.get('/movie', handleGetMovie);

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {});
