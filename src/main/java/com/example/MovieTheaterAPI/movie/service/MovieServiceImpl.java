package com.example.MovieTheaterAPI.movie.service;

import com.example.MovieTheaterAPI.movie.DTOs.MovieDTO;
import com.example.MovieTheaterAPI.movie.DTOs.MovieResponseDTO;
import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.movie.repository.MovieRepository;
import com.example.MovieTheaterAPI.movie.s3.S3Service;
import com.example.MovieTheaterAPI.movie.utils.MovieExistedException;
import com.example.MovieTheaterAPI.movie.utils.MovieNotFoundException;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MovieServiceImpl implements MovieService{
    private final MovieRepository movieRepository;
    private final S3Service s3Service;

    public MovieServiceImpl(MovieRepository movieRepository, S3Service s3Service) {
        this.movieRepository = movieRepository;
        this.s3Service = s3Service;
    }

    private MovieResponseDTO movieToMovieResponseDTO(Movie movie){
        if (movie == null) return null;

        MovieResponseDTO movieResponseDTO = new MovieResponseDTO();
        movieResponseDTO.setId(movie.getId());
        movieResponseDTO.setTitle(movie.getTitle());
        movieResponseDTO.setDescription(movie.getDescription());
        movieResponseDTO.setReleaseDate(movie.getReleaseDate());
        movieResponseDTO.setPosterUrl(movie.getPosterUrl());
        movieResponseDTO.setDurationInMinutes(movie.getDuration().toMinutes());
        return movieResponseDTO;
    }
    @Override
    public List<MovieResponseDTO> getAllMovies() {
         List<Movie> movies = movieRepository.findAll();
         List<MovieResponseDTO> movieResponseDTOs = new ArrayList<>();
         for (Movie movie : movies){
             movieResponseDTOs.add(movieToMovieResponseDTO(movie));
         }
         return movieResponseDTOs;
    }

    @Override
    public MovieResponseDTO getMovieById(Long id) {
        Movie existingMovie = movieRepository.findById(id).orElseThrow(MovieNotFoundException::new);
        return movieToMovieResponseDTO(existingMovie);
    }

    @Override
    public MovieResponseDTO createMovie(MovieDTO movie) {
        if (movieRepository.findByTitle(movie.getTitle()).isEmpty()) {
            Movie createdMovie = new Movie();
            createdMovie.setTitle(movie.getTitle());
            createdMovie.setDuration(Duration.ofMinutes(movie.getDurationInMinutes()));
            createdMovie.setDescription(movie.getDescription());
            createdMovie.setPosterUrl(movie.getPosterUrl());
            createdMovie.setReleaseDate(movie.getReleaseDate());
            return movieToMovieResponseDTO(movieRepository.save(createdMovie));
        }else
            throw new MovieExistedException();
    }

    @Override
    public MovieResponseDTO updateMovie(Long id, MovieDTO movie) {
        Movie existingMovie = movieRepository.findById(id).orElseThrow(MovieNotFoundException::new);

        if (movie.getTitle() != null && !movie.getTitle().equals("")) {
            existingMovie.setTitle(movie.getTitle());
        }
        if (movie.getDurationInMinutes() != 0) {
            existingMovie.setDuration(Duration.ofMinutes(movie.getDurationInMinutes()));
        }
        if (movie.getReleaseDate() != null) {
            existingMovie.setReleaseDate(movie.getReleaseDate());
        }
        if (movie.getPosterUrl() != null && !movie.getPosterUrl().isBlank()) {
            existingMovie.setPosterUrl(movie.getPosterUrl());
        }
        return movieToMovieResponseDTO(movieRepository.save(existingMovie));
    }

    @Override
    public void deleteMovie(Long id) {
        if (movieRepository.findById(id).isPresent()) movieRepository.deleteById(id);
    }

    @Override
    public List<MovieResponseDTO> getMoviesByReleaseDate() {
        // Find all movies that have a release date after the current date
        List<Movie> movies = movieRepository.findAllByReleaseDateAfter(java.time.LocalDate.now());
        List<MovieResponseDTO> movieResponseDTOS = new ArrayList<>();
        for (Movie movie : movies) {
            movieResponseDTOS.add(movieToMovieResponseDTO(movie));
        }
        return movieResponseDTOS;
    }

    @Override
    public MovieResponseDTO getMovieByTitle(String title) {
        return movieToMovieResponseDTO(movieRepository.findByTitle(title).orElse(null));
    }

    @Override
    public void updateProfileImage(Long movieId, byte[] image) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(MovieNotFoundException::new);
        String key = "%s%s".formatted(movieId, UUID.randomUUID().toString());
        URL movie_url = s3Service.PutObject(key,image);
        movie.setPosterUrl(String.valueOf(movie_url));
        movieRepository.save(movie);
    }
}
