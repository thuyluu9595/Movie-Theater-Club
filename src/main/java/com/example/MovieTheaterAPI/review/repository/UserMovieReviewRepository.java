package com.example.MovieTheaterAPI.review.repository;

import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.review.entities.UserMovieReview;
import com.example.MovieTheaterAPI.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserMovieReviewRepository extends JpaRepository<UserMovieReview, Long> {

    List<UserMovieReview> findByUserId(Long userId);
    List<UserMovieReview> findByMovieId(Long movieId);
    boolean existsUserMovieReviewByUserAndMovie(User user, Movie movie);
    Optional<UserMovieReview> findByReviewId(Long reviewId);
}
