package com.example.MovieTheaterAPI.review.service;

import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.movie.repository.MovieRepository;
import com.example.MovieTheaterAPI.review.dto.ReviewDTO;
import com.example.MovieTheaterAPI.review.entities.Review;
import com.example.MovieTheaterAPI.review.entities.UserMovieReview;
import com.example.MovieTheaterAPI.review.repository.ReviewRepository;
import com.example.MovieTheaterAPI.review.repository.UserMovieReviewRepository;
import com.example.MovieTheaterAPI.screen.utils.ResourceNotFoundException;
import com.example.MovieTheaterAPI.user.Role;
import com.example.MovieTheaterAPI.user.User;
import com.example.MovieTheaterAPI.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ReviewService {
    private final ChatClient chatClient;
    private final UserMovieReviewRepository userMovieReviewRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;


    public ReviewService(ChatClient.Builder chatClientBuilder,
                         UserMovieReviewRepository userMovieReviewRepository,
                         MovieRepository movieRepository,
                         UserRepository userRepository,
                         ReviewRepository reviewRepository) {
        this.chatClient = chatClientBuilder.build();
        this.userMovieReviewRepository = userMovieReviewRepository;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
    }

    public String ask(String message) {
        try {
            return this.chatClient.prompt()
                    .user(message)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return null;
    }

    public List<Review> getReviewsByMovieId(Long movieId) {
        Movie movie = movieRepository.findById(movieId).orElse(null);
        if (movie == null) {
            log.error("Movie with ID {} not found", movieId);
            return List.of();
        }
        List<UserMovieReview> userMovieReview = userMovieReviewRepository.findByMovieId(movieId);
        return userMovieReview.stream().map(UserMovieReview::getReview).toList();
    }


    @Transactional(propagation = Propagation.REQUIRED)
    public UserMovieReview createReview(Long userId, ReviewDTO reviewDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(ResourceNotFoundException::new);
        Movie movie = movieRepository.findById(reviewDTO.getMovieId())
                .orElseThrow(ResourceNotFoundException::new);

        if (userMovieReviewRepository.existsUserMovieReviewByUserAndMovie(user, movie))
            throw new DuplicateKeyException("Movie Review already exists");

        Review review = new Review();
        review.setTitle(reviewDTO.getTitle());
        review.setComment(reviewDTO.getComment());
        review.setRating(reviewDTO.getRating());
        review.setCreatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);

        UserMovieReview userMovieReview = new UserMovieReview();
        userMovieReview.setUser(user);
        userMovieReview.setMovie(movie);
        userMovieReview.setReview(savedReview);

        return userMovieReviewRepository.save(userMovieReview);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void deleteReview(Long reviewId, Long userId) {
        UserMovieReview userMovieReview = userMovieReviewRepository.findByReviewId(reviewId)
                .orElseThrow(ResourceNotFoundException::new);

        if (userId != userMovieReview.getUser().getId() || userMovieReview.getUser().getRole() != Role.Employee) {
            throw  new RuntimeException("You do not have permission to delete this review");
        }
        userMovieReviewRepository.delete(userMovieReview);
    }
}
