package com.example.MovieTheaterAPI.showtime.dto;

import lombok.Data;

@Data
public class GetScreenDTO {
    private Long id;
    private String name;
    private GetLocationDTO location;
}
