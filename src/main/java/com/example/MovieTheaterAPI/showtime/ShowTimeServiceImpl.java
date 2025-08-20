package com.example.MovieTheaterAPI.showtime;

import com.example.MovieTheaterAPI.booking.BookingService;
import com.example.MovieTheaterAPI.discount.Discount;
import com.example.MovieTheaterAPI.discount.DiscountRepository;
import com.example.MovieTheaterAPI.discount.DiscountType;
import com.example.MovieTheaterAPI.location.Location;
import com.example.MovieTheaterAPI.location.LocationRepository;
import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.movie.repository.MovieRepository;
import com.example.MovieTheaterAPI.screen.Screen;
import com.example.MovieTheaterAPI.screen.ScreenRepository;
import com.example.MovieTheaterAPI.screen.utils.ResourceNotFoundException;
import com.example.MovieTheaterAPI.shared.DTOs.GetShowtimeDTO;
import com.example.MovieTheaterAPI.showtime.dto.ShowTimeDTO;
import com.example.MovieTheaterAPI.shared.mappers.ShowtimeMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class ShowTimeServiceImpl implements ShowTimeService {
    private final ShowTimeRepository showTimeRepository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;
    private final LocationRepository locationRepository;
    private final DiscountRepository discountRepository;
    private final BookingService bookingService;
    private final ShowtimeMapper showtimeMapper;

    @Override
    public GetShowtimeDTO createShowTime(ShowTimeDTO showTimeDTO) {
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
        )) {
            throw new RuntimeException();
        }
        applyDiscount(showTime);
        return showtimeMapper.getShowtimeDTO(showTimeRepository.save(showTime));
    }

    @Override
    public GetShowtimeDTO getShowTimeById(long showtimeId) {
        ShowTime showTime = getEntityOrThrow(showTimeRepository.findById(showtimeId));
        return showtimeMapper.getShowtimeDTO(showTime);
    }

    @Override
    public List<GetShowtimeDTO> getShowTimeByMovie(long movieId) {
        Movie movie = getEntityOrThrow(movieRepository.findById(movieId));
        List<ShowTime> showTimes = showTimeRepository.findShowTimeByDateAfterAndMovie(LocalDate.now(), movie);

        log.info(showTimes.toString());

        return showTimes
                .stream()
                .map(showtimeMapper::getShowtimeDTO)
                .toList();
    }

    @Override
    public List<GetShowtimeDTO> getShowTimeByLocation(long locationId) {
        Location location = getEntityOrThrow(locationRepository.findById(locationId));
        List<ShowTime> showTimes = showTimeRepository.findShowTimeByLocation(location);

        return showTimes
                .stream()
                .map(showtimeMapper::getShowtimeDTO)
                .toList();
    }

    @Override
    public List<ShowTime> getShowTimeByDate(LocalDate date) {
        return showTimeRepository.findShowTimeByDate(date);
    }

    @Override
    public Boolean deleteShowTime(long showtimeId) {
        ShowTime showTime = getEntityOrThrow(showTimeRepository.findById(showtimeId));
        if (bookingService.cancelShow(showtimeId)) {
            showTimeRepository.deleteById(showTime.getId());
            return true;
        }
        return false;
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

    private void applyDiscount(ShowTime showTime) {
        Discount discount = null;
        if (showTime.getDate().getDayOfWeek() == DayOfWeek.TUESDAY) {
            discount = discountRepository.findById(DiscountType.TuedaySpecial).get();
        } else if (showTime.getStartTime().isBefore(LocalTime.of(16, 0))) {
            discount = discountRepository.findById(DiscountType.Before6PM).get();
        }
        showTime.setDiscount(discount);
    }
}
