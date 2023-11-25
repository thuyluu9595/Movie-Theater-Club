package com.example.MovieTheaterAPI.movie.controller;

import com.example.MovieTheaterAPI.movie.DTOs.MovieDTO;
import com.example.MovieTheaterAPI.movie.DTOs.MovieResponseDTO;
import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.movie.service.MovieServiceImpl;
import com.example.MovieTheaterAPI.movie.utils.MovieExistedException;
import com.example.MovieTheaterAPI.movie.utils.MovieNotFoundException;
import com.example.MovieTheaterAPI.movie.utils.MovieValidator;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private final MovieServiceImpl movieService;
    public MovieController(MovieServiceImpl movieService) {
        this.movieService = movieService;
    }


    @GetMapping("/")
    public ResponseEntity<?> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable Long id) {
        try {
            MovieResponseDTO movie = movieService.getMovieById(id);
            return ResponseEntity.ok(movie);
        } catch (MovieNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createMovie(@RequestBody MovieDTO movie) {
        if (movie == null || !MovieValidator.isValidMovie(movie)) { // Check if movie is valid
            return ResponseEntity.badRequest().build();
        }

        try {
            MovieResponseDTO createdMovie = movieService.createMovie(movie);
            return ResponseEntity.ok(createdMovie);
        }
        catch (MovieExistedException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMovie(@PathVariable Long id, @RequestBody MovieDTO movie) {
        if (movie == null || !MovieValidator.isValidMovie(movie)) { // Check if movie is valid
            return ResponseEntity.badRequest().build();
        }
        try {
            MovieResponseDTO updatedMovie = movieService.updateMovie(id, movie);
            return ResponseEntity.ok(updatedMovie);
        }
        catch (MovieNotFoundException e) {
            return ResponseEntity.notFound().build();
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/latest-movies")
    public ResponseEntity<?> getMoviesByReleaseDate() {
        // Get all movies that have a release date after the current date
        return ResponseEntity.ok(movieService.getMoviesByReleaseDate());
    }

    @GetMapping("/title/{title}")
    public ResponseEntity<?> getMovieByTitle(@PathVariable String title) {
        MovieResponseDTO movie = movieService.getMovieByTitle(title);
        if (movie != null)
            return ResponseEntity.ok(movie);
        else
            return ResponseEntity.notFound().build();
    }

    @PostMapping(
            value = "/{movieId}/movie-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> updateMovieImage(
            @PathVariable("movieId") Long movieId,
            @RequestParam("image")MultipartFile image
            ) {
        try {
            movieService.updateProfileImage(movieId, image.getBytes());
            return ResponseEntity.ok("Updated");
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }

    }
}

