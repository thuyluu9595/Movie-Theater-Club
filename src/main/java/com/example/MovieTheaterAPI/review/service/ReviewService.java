package com.example.MovieTheaterAPI.review.service;

import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.movie.repository.MovieRepository;
import com.example.MovieTheaterAPI.review.dto.GetReviewDTO;
import com.example.MovieTheaterAPI.review.dto.ReviewDTO;
import com.example.MovieTheaterAPI.review.entities.Review;
import com.example.MovieTheaterAPI.review.entities.UserMovieReview;
import com.example.MovieTheaterAPI.review.repository.ReviewRepository;
import com.example.MovieTheaterAPI.review.repository.UserMovieReviewRepository;
import com.example.MovieTheaterAPI.screen.utils.ResourceNotFoundException;
import com.example.MovieTheaterAPI.user.User;
import com.example.MovieTheaterAPI.user.UserRepository;
import com.example.MovieTheaterAPI.review.mapper.ReviewMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class ReviewService {
    private final ChatClient chatClient;
    private final UserMovieReviewRepository userMovieReviewRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final ReviewSummaryService reviewSummaryService;


    public ReviewService(ChatClient.Builder chatClientBuilder,
                         UserMovieReviewRepository userMovieReviewRepository,
                         MovieRepository movieRepository,
                         UserRepository userRepository,
                         ReviewRepository reviewRepository,
                         ReviewMapper reviewMapper,
                         ReviewSummaryService reviewSummaryService
    ) {
        this.chatClient = chatClientBuilder.build();
        this.userMovieReviewRepository = userMovieReviewRepository;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.reviewMapper = reviewMapper;
        this.reviewSummaryService = reviewSummaryService;
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

    public List<GetReviewDTO> getReviewsByMovieId(Long movieId) {
        Movie movie = movieRepository.findById(movieId).orElse(null);
        if (movie == null) {
            log.error("Movie with ID {} not found", movieId);
            return List.of();
        }
        List<GetReviewDTO> getReviewDTOList = userMovieReviewRepository.findByMovieId(movieId)
                .stream()
                .map(reviewMapper::toGetReviewDTO)
                .toList();

        return getReviewDTOList;
    }


    @Transactional(propagation = Propagation.REQUIRED)
    public Review createReview(Long userId, ReviewDTO reviewDTO) {
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

        userMovieReviewRepository.save(userMovieReview);
        reviewSummaryService.updateReviewSummary(movie.getId());
        return savedReview;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void deleteReview(Long reviewId) {
        try {
            UserMovieReview userMovieReview = userMovieReviewRepository.findByReviewId(reviewId)
                    .orElseThrow(ResourceNotFoundException::new);

//        if (userId != userMovieReview.getUser().getId() || userMovieReview.getUser().getRole() != Role.Employee) {
//            throw  new RuntimeException("You do not have permission to delete this review");
//        }
            userMovieReviewRepository.delete(userMovieReview);
        } catch (ResourceNotFoundException e) {
            log.error("Review with ID {} not found", reviewId);
        }
    }
}
