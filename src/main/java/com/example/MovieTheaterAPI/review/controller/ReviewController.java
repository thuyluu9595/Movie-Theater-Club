package com.example.MovieTheaterAPI.review.controller;

import com.example.MovieTheaterAPI.review.dto.ReviewDTO;
import com.example.MovieTheaterAPI.review.entities.Review;
import com.example.MovieTheaterAPI.review.service.ReviewService;
import com.example.MovieTheaterAPI.screen.utils.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody ReviewDTO reviewDTO) {
        Long userId = reviewDTO.getUserId();
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            Review review = reviewService.createReview(userId, reviewDTO);
            return new ResponseEntity<>(review, HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@RequestBody ReviewDTO reviewDTO, @PathVariable Long id) {
        try {
            Long userId = reviewDTO.getUserId();
            if (userId == null) {
                throw new ResourceNotFoundException();
            }
            reviewService.deleteReview(id, userId);
            return ResponseEntity.ok("Review deleted");
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
