package com.example.MovieTheaterAPI.showtime.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
public class ShowTimeDTO {
    @JsonProperty("movie_id")
    @Positive(message = "movie_id must be positive")
    private long movieId;

    @JsonProperty("screen_id")
    @Positive(message = "screen_id must be positive")
    private long screenId;

    @NotNull
    @JsonFormat(pattern = "MM/dd/yyyy")
    private LocalDate date;

    @JsonFormat(pattern = "HH:mm:ss")
    @JsonProperty("start_time")
    @NonNull
    private LocalTime startTime;

    @Min(value = 0, message = "Price must be a non negative number")
    private double price;
}
