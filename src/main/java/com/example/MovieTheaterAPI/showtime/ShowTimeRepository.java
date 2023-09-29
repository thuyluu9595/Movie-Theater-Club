package com.example.MovieTheaterAPI.showtime;

import com.example.MovieTheaterAPI.screen.Screen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ShowTimeRepository extends JpaRepository<ShowTime, Long> {
    List<ShowTime> findShowTimeByDate(LocalDate date);
    List<ShowTime> findShowTimeByScreen(Screen screen);
}
