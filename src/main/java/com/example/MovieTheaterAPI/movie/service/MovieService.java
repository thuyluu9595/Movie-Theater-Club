package com.example.MovieTheaterAPI.movie.service;

import com.example.MovieTheaterAPI.movie.MovieDTO;
import com.example.MovieTheaterAPI.movie.model.Movie;

import java.util.List;

public interface MovieService {
    List<Movie> getAllMovies();
    Movie getMovieById(Long id);
    Movie createMovie(MovieDTO movie);
    Movie updateMovie(Long id, MovieDTO movie);
    void deleteMovie(Long id);
    List<Movie> getMoviesByReleaseDate();
    Movie getMovieByTitle(String title);
    void updateProfileImage(Long movieId, byte[] image);

}
