package com.example.MovieTheaterAPI.screen.utils;

public class ScreenAlreadyExistsException extends RuntimeException {
    public ScreenAlreadyExistsException() {
        super("Screen already exists");
    }
}
