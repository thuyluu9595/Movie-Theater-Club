package com.example.MovieTheaterAPI.showtime;

import com.example.MovieTheaterAPI.location.Location;
import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.screen.Screen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ShowTimeRepository extends JpaRepository<ShowTime, Long> {
    List<ShowTime> findShowTimeByDate(LocalDate date);
    List<ShowTime> findShowTimeByScreen(Screen screen);
    List<ShowTime> findShowTimeByDateAfterAndMovie(LocalDate date, Movie movie);

    List<ShowTime> findShowTimeByScreenAndDate(Screen screen, LocalDate date);

    @Query("SELECT s FROM ShowTime s JOIN s.screen sc WHERE sc.location = :location")
    List<ShowTime> findShowTimeByLocation(@Param("location") Location location);

}
