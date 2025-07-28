package com.example.MovieTheaterAPI.showtime.dto;

import lombok.Data;

@Data
public class GetMovieDTO {
    private Long id;
    private String title;
    private String posterUrl;
}
