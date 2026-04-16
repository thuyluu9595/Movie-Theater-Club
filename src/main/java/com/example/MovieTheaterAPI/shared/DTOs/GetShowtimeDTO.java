package com.example.MovieTheaterAPI.shared.DTOs;

import com.example.MovieTheaterAPI.discount.Discount;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class GetShowtimeDTO {
    private Long id;
    private GetScreenDTO screen;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private double price;
    private Integer[] availableSeat;
    private Discount discount;
    private GetMovieDTO movie;
}
