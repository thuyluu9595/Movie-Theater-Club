package com.example.MovieTheaterAPI.movie.repository;

import com.example.MovieTheaterAPI.movie.model.Movie;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByTitle(String title);

    // Find all movies that have a release date after the current date
    List<Movie> findAllByReleaseDateAfter(LocalDate date);

    @Query("""
     select d
     from Movie d
     order by cosine_distance(d.embedding, :qvec)
     """)
    List<Movie> findNearestCosine(@Param("qvec") float[] qvec,
                                  Pageable pageable);
}
