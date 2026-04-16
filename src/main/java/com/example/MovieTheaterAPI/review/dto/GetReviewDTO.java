package com.example.MovieTheaterAPI.review.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GetReviewDTO {
    private Long id;
    private Long userId;
    private Long movieId;
    private String title;
    private String comment;
    private Float rating;
    private LocalDateTime createdAt;
    private String fullName;
}
