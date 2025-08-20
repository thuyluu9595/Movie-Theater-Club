package com.example.MovieTheaterAPI.showtime;

import com.example.MovieTheaterAPI.shared.DTOs.GetShowtimeDTO;
import com.example.MovieTheaterAPI.showtime.dto.ShowTimeDTO;

import java.time.LocalDate;
import java.util.List;

public interface ShowTimeService {
    GetShowtimeDTO createShowTime(ShowTimeDTO showTimeDTO);
    List<GetShowtimeDTO> getShowTimeByMovie(long movieId);
    List<GetShowtimeDTO> getShowTimeByLocation(long locationId);
    GetShowtimeDTO getShowTimeById(long showtimeId);
    List<ShowTime> getShowTimeByDate(LocalDate date);

    Boolean deleteShowTime(long showtimeId);
}
