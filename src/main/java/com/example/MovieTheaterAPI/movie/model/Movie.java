package com.example.MovieTheaterAPI.movie.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "movies")
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "duration", nullable = false)
    private Duration duration;

    @Column(name = "release_date", nullable = false)
    private LocalDate releaseDate;

    @Column(name = "poster_url")
    private String posterUrl;

    @Override
    public String toString() {
        return "Movie{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", duration=" + duration.toString() +
                ", releaseDate=" + releaseDate.toString() +
                ", posterUrl='" + posterUrl + '\'' +
                '}';
    }
}
