package com.example.MovieTheaterAPI.screen;

import com.example.MovieTheaterAPI.location.Location;
import com.example.MovieTheaterAPI.movie.model.Movie;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "screens")
@Data
@NoArgsConstructor
public class Screen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @Column(name = "location")
    private Location location;

    @Column(name = "capacity")
    private Integer capacity;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @Column(name = "movies")
    List<Movie> movies = new ArrayList<>();

    public Screen(String name, Location location, Integer capacity) {
        this.name = name;
        this.location = location;
        this.capacity = capacity;
    }
    public void addMovie(Movie movie) {
        movies.add(movie);
    }

    public void removeMovie(Movie movie) {
        movies.remove(movie);
    }
}
