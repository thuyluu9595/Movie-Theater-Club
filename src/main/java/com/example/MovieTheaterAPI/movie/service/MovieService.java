package com.example.MovieTheaterAPI.movie.service;

import com.example.MovieTheaterAPI.movie.DTOs.MovieDTO;
import com.example.MovieTheaterAPI.movie.DTOs.MovieResponseDTO;
import com.example.MovieTheaterAPI.movie.model.Movie;

import java.util.List;

public interface MovieService {
    List<MovieResponseDTO> getAllMovies();
    MovieResponseDTO getMovieById(Long id);
    MovieResponseDTO createMovie(MovieDTO movie);
    MovieResponseDTO updateMovie(Long id, MovieDTO movie);
    void deleteMovie(Long id);
    List<MovieResponseDTO> getMoviesByReleaseDate();
    MovieResponseDTO getMovieByTitle(String title);
    void updateProfileImage(Long movieId, byte[] image);

}
