package com.example.MovieTheaterAPI.review.entities;

import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.user.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_movie_reviews")
@Data
@NoArgsConstructor
public class UserMovieReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "review_id", referencedColumnName = "id")
    private Review review;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "movie_id", referencedColumnName = "id")
    private Movie movie;
}
