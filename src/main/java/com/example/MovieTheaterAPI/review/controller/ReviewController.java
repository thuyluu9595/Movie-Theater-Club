package com.example.MovieTheaterAPI.review.controller;

import com.example.MovieTheaterAPI.review.dto.GetReviewDTO;
import com.example.MovieTheaterAPI.review.dto.ReviewDTO;
import com.example.MovieTheaterAPI.review.entities.Review;
import com.example.MovieTheaterAPI.review.service.ReviewService;
import com.example.MovieTheaterAPI.screen.utils.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/ai")
    public String ask(@RequestBody String userInput) {
        return this.reviewService.ask(userInput);
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<GetReviewDTO>> getReviewsByMovieId(@PathVariable Long movieId) {
        return ResponseEntity.ok(reviewService.getReviewsByMovieId(movieId));
    }

    @PostMapping("/create")
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
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok("Review deleted");
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
