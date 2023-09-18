package com.example.MovieTheaterAPI.movie.service;

import com.example.MovieTheaterAPI.movie.model.Movie;
import org.springframework.stereotype.Service;

import java.util.List;

public interface MovieService {
    List<Movie> getAllMovies();
    Movie getMovieById(Long id);
    Movie createMovie(Movie movie);
    Movie updateMovie(Long id, Movie movie);
    void deleteMovie(Long id);
    List<Movie> getMoviesByReleaseDate();
    Movie getMovieByTitle(String title);
}
