package com.example.MovieTheaterAPI.shared.DTOs;

import com.example.MovieTheaterAPI.booking.BookingStatus;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Getter
public class GetBookingDTO {
    private Long id;
    private GetShowtimeDTO showTime;
    private int[] seats;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private LocalDate movieDate;
    private double totalPrice;
    private BookingStatus status;
}
