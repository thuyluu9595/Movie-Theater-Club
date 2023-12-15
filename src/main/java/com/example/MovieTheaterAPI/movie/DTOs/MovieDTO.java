package com.example.MovieTheaterAPI.movie.DTOs;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MovieDTO {
    private String title;

    @JsonProperty("duration_in_minutes")
    private int durationInMinutes;
    private String description;

    @JsonProperty("poster_url")
    private String posterUrl;

    @JsonFormat(pattern = "MM/dd/yyyy")
    @JsonProperty("release_date")
    private LocalDate releaseDate;
}
