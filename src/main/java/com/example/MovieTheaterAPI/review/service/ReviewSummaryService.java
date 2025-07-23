package com.example.MovieTheaterAPI.review.service;

import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.movie.repository.MovieRepository;
import com.example.MovieTheaterAPI.review.entities.UserMovieReview;
import com.example.MovieTheaterAPI.review.repository.UserMovieReviewRepository;
import com.example.MovieTheaterAPI.screen.utils.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ReviewSummaryService {
    private final UserMovieReviewRepository userMovieReviewRepository;
    private final MovieRepository movieRepository;
    private final ChatClient chatClient;

    public ReviewSummaryService(UserMovieReviewRepository userMovieReviewRepository,
                                MovieRepository movieRepository,
                                ChatClient.Builder chatClientBuilder) {
        this.userMovieReviewRepository = userMovieReviewRepository;
        this.movieRepository = movieRepository;
        this.chatClient = chatClientBuilder.build();
    }

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateReviewSummary(Long movieId) {
        try {
            Movie movie = movieRepository.findById(movieId).orElseThrow(ResourceNotFoundException::new);
            List<UserMovieReview> userMovieReviews = userMovieReviewRepository.findByMovieId(movieId);

            if( userMovieReviews.isEmpty()) {
                log.warn("UserMovieReviewRepository is empty");
                return;
            }

            String prompt = buildSummaryPrompt(userMovieReviews);
            String summaryReview = this.chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
            movie.setReviewSummary(summaryReview);
            movieRepository.save(movie);
            log.info("Successfully updated review summary for movie ID: {}", movieId);
        } catch (Exception e) {
            log.error("Failed to update review summary for movie ID: {}. Error: {}", movieId, e.getMessage(), e);
        }
    }

    private String buildSummaryPrompt(List<UserMovieReview> userMovieReviews) {
        String allReviewComments = userMovieReviews.stream()
                .map(userMovieReview -> "- " + userMovieReview.getReview().getComment())
                .collect(Collectors.joining("\n"));

        return "Please provide a short and concise summary based on the overall sentiment of the following user reviews. " +
                "Do not mention the reviews themselves, just summarize the movie's reception.\n" +
                "Reviews:\n" + allReviewComments;
    }
}
