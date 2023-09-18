package com.example.MovieTheaterAPI.movie.service;

import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.movie.repository.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieServiceImpl implements MovieService{
    private final MovieRepository movieRepository;

    public MovieServiceImpl(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }


    @Override
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @Override
    public Movie getMovieById(Long id) {
        return movieRepository.getReferenceById(id);
    }

    @Override
    public Movie createMovie(Movie movie) {
        if (movieRepository.findByTitle(movie.getTitle()).isEmpty())
            return movieRepository.save(movie);
        else
            return null;
    }

    @Override
    public Movie updateMovie(Long id, Movie movie) {
        if (movieRepository.findById(id).isPresent())
            return movieRepository.save(movie);
        else
            return null;
    }

    @Override
    public void deleteMovie(Long id) {
        if (movieRepository.findById(id).isPresent()) movieRepository.deleteById(id);
    }

    @Override
    public List<Movie> getMoviesByReleaseDate() {
        // Find all movies that have a release date after the current date
        return movieRepository.findAllByReleaseDateAfter(java.time.LocalDate.now());
    }

    @Override
    public Movie getMovieByTitle(String title) {
        return movieRepository.findByTitle(title).orElse(null);
    }
}
