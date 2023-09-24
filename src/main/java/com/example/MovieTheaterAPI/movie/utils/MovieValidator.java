package com.example.MovieTheaterAPI.movie.utils;

import com.example.MovieTheaterAPI.movie.model.Movie;

public class MovieValidator {
    public static boolean isValidMovie(Movie movie) {
        return movie.getTitle() != null && movie.getReleaseDate() != null && movie.getDuration() != null;
    }
}
