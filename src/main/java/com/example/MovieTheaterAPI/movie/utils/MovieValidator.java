package com.example.MovieTheaterAPI.movie.utils;

import com.example.MovieTheaterAPI.movie.MovieDTO;

public class MovieValidator {
    public static boolean isValidMovie(MovieDTO movie) {
        return movie.getTitle() != null && movie.getReleaseDate() != null && movie.getDurationInMinutes() != 0;
    }
}
