package com.example.MovieTheaterAPI.booking;

public class SeatNotAvailableException extends RuntimeException {
    public SeatNotAvailableException() {
        super("Selected seats are not available");
    }
}
