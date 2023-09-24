package com.example.MovieTheaterAPI.movie.utils;

public class MovieExistedException extends RuntimeException {
    public MovieExistedException() {
        super("Movie existed");
    }

    public MovieExistedException(String message, Throwable cause) {
        super(message, cause);
    }
}
