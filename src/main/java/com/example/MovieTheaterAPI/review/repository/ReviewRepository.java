package com.example.MovieTheaterAPI.review.repository;


import com.example.MovieTheaterAPI.review.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
