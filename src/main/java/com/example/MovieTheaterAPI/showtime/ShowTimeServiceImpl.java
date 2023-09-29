package com.example.MovieTheaterAPI.showtime;

import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.movie.repository.MovieRepository;
import com.example.MovieTheaterAPI.screen.Screen;
import com.example.MovieTheaterAPI.screen.ScreenRepository;
import com.example.MovieTheaterAPI.screen.utils.ResourceNotFoundException;
import com.example.MovieTheaterAPI.showtime.dto.ShowTimeDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ShowTimeServiceImpl implements ShowTimeService {
    private final ShowTimeRepository showTimeRepository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;

    @Override
    public ShowTime createShowTime(ShowTimeDTO showTimeDTO) {
        Optional<Movie> movieOptional = movieRepository.findById(showTimeDTO.getMovieId());
        if (movieOptional.isEmpty()) throw new ResourceNotFoundException();

        Optional<Screen> screenOptional = screenRepository.findById(showTimeDTO.getScreenId());
        if (screenOptional.isEmpty()) throw new ResourceNotFoundException();

        ShowTime showTime = new ShowTime(
                movieOptional.get(),
                screenOptional.get(),
                showTimeDTO.getDate(),
                showTimeDTO.getStartTime(),
                showTimeDTO.getPrice()
        );
        return showTimeRepository.save(showTime);
    }
}
