package com.example.MovieTheaterAPI.review.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name= "rating")
    private Float rating;

    @Column(name= "comment")
    private String comment;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
