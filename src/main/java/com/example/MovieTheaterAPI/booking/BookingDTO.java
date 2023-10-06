package com.example.MovieTheaterAPI.booking;

import lombok.Data;

@Data
public class BookingDTO {
    private Long userId;
    private Long showTimeId;
    private int[] seats;
}
