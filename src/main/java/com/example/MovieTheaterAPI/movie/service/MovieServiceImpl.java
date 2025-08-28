package com.example.MovieTheaterAPI.movie.service;

import com.example.MovieTheaterAPI.booking.Booking;
import com.example.MovieTheaterAPI.booking.BookingService;
import com.example.MovieTheaterAPI.embeddings.EmbeddingService;
import com.example.MovieTheaterAPI.movie.DTOs.MovieDTO;
import com.example.MovieTheaterAPI.movie.DTOs.MovieResponseDTO;
import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.movie.repository.MovieRepository;
import com.example.MovieTheaterAPI.movie.s3.S3Service;
import com.example.MovieTheaterAPI.movie.utils.MovieExistedException;
import com.example.MovieTheaterAPI.movie.utils.MovieNotFoundException;
import com.example.MovieTheaterAPI.shared.DTOs.GetBookingDTO;
import com.example.MovieTheaterAPI.shared.DTOs.GetShowtimeDTO;
import com.example.MovieTheaterAPI.showtime.ShowTime;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MovieServiceImpl implements MovieService{
    private final MovieRepository movieRepository;
    private final S3Service s3Service;
    private final EmbeddingService embeddingService;
    final BookingService bookingService;

    public MovieServiceImpl(MovieRepository movieRepository,
                            S3Service s3Service,
                            EmbeddingService embeddingService,
                            BookingService bookingService
    ) {
        this.movieRepository = movieRepository;
        this.s3Service = s3Service;
        this.embeddingService = embeddingService;
        this.bookingService = bookingService;
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
        movieResponseDTO.setReviewSummary(movie.getReviewSummary());
        movieResponseDTO.setGenres(movie.getGenres());
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

    private float[] generateEmbedding(List<String> genres) {
        if (genres != null && !genres.isEmpty()){
            String genresAsString = genres.stream().map(String::toUpperCase).collect(Collectors.joining(", "));
            return embeddingService.getEmbedding(genresAsString);
        }
        return null;
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
            createdMovie.setGenres(movie.getGenres());

            float[] embedding = generateEmbedding(createdMovie.getGenres().stream().map(String::toUpperCase).collect(Collectors.toList()));
            createdMovie.setEmbedding(embedding);

            return movieToMovieResponseDTO(movieRepository.save(createdMovie));
        } else
            throw new MovieExistedException();
    }

    @Override
    public MovieResponseDTO updateMovie(Long id, MovieDTO movie) {
        Movie existingMovie = movieRepository.findById(id).orElseThrow(MovieNotFoundException::new);

        if (movie.getTitle() != null && !movie.getTitle().isEmpty()) {
            existingMovie.setTitle(movie.getTitle());
        }
        existingMovie.setDescription(movie.getDescription());
        
        if (movie.getDurationInMinutes() != 0) {
            existingMovie.setDuration(Duration.ofMinutes(movie.getDurationInMinutes()));
        }
        if (movie.getReleaseDate() != null) {
            existingMovie.setReleaseDate(movie.getReleaseDate());
        }
        if (movie.getPosterUrl() != null && !movie.getPosterUrl().isBlank()) {
            existingMovie.setPosterUrl(movie.getPosterUrl());
        }
        if (movie.getGenres() != null && !movie.getGenres().isEmpty()) {
            existingMovie.setGenres(movie.getGenres());
        }

        float[] embedding = generateEmbedding(existingMovie.getGenres().stream().map(String::toUpperCase).collect(Collectors.toList()));
        existingMovie.setEmbedding(embedding);

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


    @Override
    public List<MovieResponseDTO> getSimilarMoviesByUserId(Long userId) {
        List<GetBookingDTO> bookings = bookingService.getBookingsByUserId(userId);
        List<GetShowtimeDTO> showTimes = bookings
                                    .stream()
                                    .map(GetBookingDTO::getShowTime)
                                    .toList();
        Set<String> genres = new HashSet<>();
        for (GetShowtimeDTO showTime : showTimes) {
            List<String> genreList = showTime.getMovie().getGenres();
            genres.addAll(genreList.stream().map(String::toUpperCase).collect(Collectors.toSet()));
        }

        float[] embeddings = generateEmbedding(new ArrayList<>(genres));
        List<Movie> movies = movieRepository.findNearestCosine(embeddings, PageRequest.of(0,5));

        return movies.stream()
                .map(this::movieToMovieResponseDTO)
                .toList();
    }
}
