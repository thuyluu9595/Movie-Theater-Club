package com.example.MovieTheaterAPI.booking;

public class BookingNotFoundException extends RuntimeException{
    public BookingNotFoundException() {
        super("Booking not found");
    }
}
