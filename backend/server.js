import express from 'express';
import data from './data.js';

const app = express();

app.get('/api/movies', (req, res) => {
  res.send(data.movies);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});