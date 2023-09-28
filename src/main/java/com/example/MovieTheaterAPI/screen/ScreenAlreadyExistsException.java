package com.example.MovieTheaterAPI.screen;

public class ScreenAlreadyExistsException extends RuntimeException {
    public ScreenAlreadyExistsException() {
        super("Screen already exists");
    }
}
