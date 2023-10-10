package com.example.MovieTheaterAPI.booking;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BookingDTO {
    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("show_time_id")
    private Long showTimeId;

    @JsonProperty("seats")
    private int[] seats;
}
