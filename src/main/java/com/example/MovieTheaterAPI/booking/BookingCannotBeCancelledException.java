package com.example.MovieTheaterAPI.booking;

public class BookingCannotBeCancelledException extends RuntimeException {
    public BookingCannotBeCancelledException() {
        super("Booking cannot be cancelled");
    }
}
