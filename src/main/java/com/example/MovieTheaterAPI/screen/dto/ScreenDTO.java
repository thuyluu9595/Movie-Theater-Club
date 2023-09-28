package com.example.MovieTheaterAPI.screen.dto;

import lombok.Data;

@Data
public class ScreenDTO {
    private String name;
    private Long locationId;
    private Integer capacity;
}
