import express from 'express';
import data from './data.js';

const app = express();

app.get('/api/movies', (req, res) => {
  if (!data.movies){
    res.status(404).send('Images not found');
  } else {
    res.status(200).send(data.movies);
  }
});

app.get('/api/movies/slug/:slug', (req, res) => {
  const movie = data.movies.find(m => m.slug === req.params.slug);
  if (movie) {
    res.status(200).send(movie);
  } else {
    res.status(404).send({message: 'Movie not found'})
  }
})

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});