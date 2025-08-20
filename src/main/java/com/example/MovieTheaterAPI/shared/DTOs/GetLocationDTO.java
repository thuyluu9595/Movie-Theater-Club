package com.example.MovieTheaterAPI.shared.DTOs;

import lombok.Data;

@Data
public class GetLocationDTO {
    private Long id;
    private String city;
    private String state;
}
