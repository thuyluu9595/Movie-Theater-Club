package com.example.MovieTheaterAPI.shared.DTOs;

import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
@Getter
public class GetMovieDTO {
    private Long id;
    private String title;
    private String posterUrl;
    private List<String> genres;
}
