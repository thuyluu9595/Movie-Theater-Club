package com.example.MovieTheaterAPI.booking;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NonNull;

@Data
public class BookingDTO {
    @NonNull
    private Long userId;

    @NonNull
    private Long showTimeId;

    @NonNull
    private int[] seats;
}
