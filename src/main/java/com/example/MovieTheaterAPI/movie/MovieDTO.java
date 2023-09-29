package com.example.MovieTheaterAPI.movie;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MovieDTO {
    private String title;
    private int durationInMinutes;
    private String description;
    private String posterUrl;
    private LocalDate releaseDate;
}
