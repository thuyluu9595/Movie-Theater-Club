package com.example.MovieTheaterAPI.review.dto;

import lombok.Data;

@Data
public class ReviewDTO {
    private Long userId;
    private Long movieId;
    private String title;
    private Float rating;
    private String comment;
}
