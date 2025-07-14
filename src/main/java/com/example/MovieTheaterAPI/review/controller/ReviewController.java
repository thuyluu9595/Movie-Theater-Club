package com.example.MovieTheaterAPI.review.controller;

import com.example.MovieTheaterAPI.review.service.ReviewService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/ai")
    public String ask(@RequestBody String userInput) {
        return this.reviewService.ask(userInput);
    }
}
