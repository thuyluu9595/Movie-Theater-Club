package com.example.MovieTheaterAPI.showtime;

import com.example.MovieTheaterAPI.location.Location;
import com.example.MovieTheaterAPI.location.LocationRepository;
import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.movie.repository.MovieRepository;
import com.example.MovieTheaterAPI.screen.Screen;
import com.example.MovieTheaterAPI.screen.ScreenRepository;
import com.example.MovieTheaterAPI.screen.ScreenService;
import com.example.MovieTheaterAPI.screen.utils.ResourceNotFoundException;
import com.example.MovieTheaterAPI.showtime.dto.ShowTimeDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ShowTimeServiceImpl implements ShowTimeService {
    private final ShowTimeRepository showTimeRepository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;
    private final LocationRepository locationRepository;

    @Override
    public ShowTime createShowTime(ShowTimeDTO showTimeDTO) {
        Movie movie = getEntityOrThrow(movieRepository.findById(showTimeDTO.getMovieId()));
        Screen screen = getEntityOrThrow(screenRepository.findById(showTimeDTO.getScreenId()));

        ShowTime showTime = new ShowTime(
                movie,
                screen,
                showTimeDTO.getDate(),
                showTimeDTO.getStartTime(),
                showTimeDTO.getPrice()
        );

        if (hasTimeOverlap(
                showTimeRepository.findShowTimeByScreenAndDate(screen, showTime.getDate()),
                showTime
        ))
            throw new RuntimeException();

        return showTimeRepository.save(showTime);
    }

    @Override
    public List<ShowTime> getShowTimeByMovie(long movieId) {
        Movie movie = getEntityOrThrow(movieRepository.findById(movieId));
        return showTimeRepository.findShowTimeByDateAfterAndMovie(LocalDate.now(), movie);
    }

    @Override
    public List<ShowTime> getShowTimeByLocation(long locationId) {
        Location location = getEntityOrThrow(locationRepository.findById(locationId));
        return showTimeRepository.findShowTimeByLocation(location);
    }

    @Override
    public List<ShowTime> getShowTimeByDate(LocalDate date) {
        return showTimeRepository.findShowTimeByDate(date);
    }

    private <T> T getEntityOrThrow(Optional<T> optional) {
        return optional.orElseThrow(ResourceNotFoundException::new);
    }

    private boolean hasTimeOverlap(List<ShowTime> existingShowTimes, ShowTime showTime) {
        LocalTime startTime = showTime.getStartTime();
        LocalTime endTime = showTime.getEndTime();
        for (ShowTime existingShowTime : existingShowTimes) {
            LocalTime existingStartTime = existingShowTime.getStartTime().minusMinutes(15);
            LocalTime existingEndTime = existingShowTime.getEndTime().plusMinutes(15);

            if ((startTime.isBefore(existingEndTime) && startTime.isAfter(existingStartTime))
                || (endTime.isAfter(existingStartTime) && endTime.isBefore(existingEndTime)))
                return true;
        }
        return false; // No overlap found
    }
}
