package com.example.MovieTheaterAPI.movie.utils;

public class MovieNotFoundException extends RuntimeException {
    public MovieNotFoundException() {
        super("Movie not found");
    }

    public MovieNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
