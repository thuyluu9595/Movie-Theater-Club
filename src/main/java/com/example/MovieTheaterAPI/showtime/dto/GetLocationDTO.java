package com.example.MovieTheaterAPI.showtime.dto;

import lombok.Data;

@Data
public class GetLocationDTO {
    private Long id;
    private String city;
    private String state;
}
