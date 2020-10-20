require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const data = require('./data.js');

const app = express();
app.use(morgan('dev'));
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  console.log(authToken.split(' ')[1]);
  console.log(apiToken);
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res
      .status(401)
      .json({ error: 'Unauthorized request' });
  }
  next();
});
app.use(helmet());
app.use(cors());

app.get('/movie', (req, res) => {
  let movieData = [...data];
  let { genre, country, avg_vote } = req.query;

  if (genre) {
    movieData = movieData.filter((obj) =>
      obj.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  if (country) {
    movieData = movieData.filter((obj) =>
      obj.country
        .toLowerCase()
        .includes(country.toLowerCase())
    );
    console.log(movieData);
  }

  if (avg_vote) {
    movieData = movieData.filter(
      (obj) => obj.avg_vote >= avg_vote
    );
  }

  res.status(200).send(movieData);
});

app.listen(8000, () => {
  console.log('Server is listening on port 8000!');
});
