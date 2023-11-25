package com.example.MovieTheaterAPI.movie.DTOs;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MovieResponseDTO {
    private long id;
    private String title;

    @JsonProperty("duration")
    private long durationInMinutes;
    private String description;

    @JsonProperty("posterUrl")
    private String posterUrl;

    @JsonFormat(pattern = "MM/dd/yyyy")
    @JsonProperty("releaseDate")
    private LocalDate releaseDate;
}