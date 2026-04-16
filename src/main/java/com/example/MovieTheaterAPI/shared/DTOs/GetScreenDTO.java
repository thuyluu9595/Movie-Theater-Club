package com.example.MovieTheaterAPI.shared.DTOs;

import lombok.Data;

@Data
public class GetScreenDTO {
    private Long id;
    private String name;
    private GetLocationDTO location;
}
