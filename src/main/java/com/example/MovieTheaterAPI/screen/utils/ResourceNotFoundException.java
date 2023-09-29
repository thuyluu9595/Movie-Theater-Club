package com.example.MovieTheaterAPI.screen.utils;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException() {
        super("Resource not found");
    }

}
