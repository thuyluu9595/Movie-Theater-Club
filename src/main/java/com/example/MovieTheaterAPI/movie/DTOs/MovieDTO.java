package com.example.MovieTheaterAPI.movie.DTOs;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.time.LocalDate;
import java.util.List;

@Data
public class MovieDTO {
    private String title;

    @JsonProperty("duration_in_minutes")
    private int durationInMinutes;
    private String description;

    @JsonProperty("poster_url")
    private String posterUrl;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonProperty("release_date")
    private LocalDate releaseDate;

    private List<String> genres;
}
