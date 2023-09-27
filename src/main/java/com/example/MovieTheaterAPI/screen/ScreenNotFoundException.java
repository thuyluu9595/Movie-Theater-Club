package com.example.MovieTheaterAPI.screen;

public class ScreenNotFoundException extends RuntimeException{
    public ScreenNotFoundException() {
        super("Screen not found");
    }

}
