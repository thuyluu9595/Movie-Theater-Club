package com.example.MovieTheaterAPI.screen;

import com.example.MovieTheaterAPI.screen.dto.ScreenDTO;

import java.util.List;

public interface ScreenService {
    List<Screen> getScreens();
    Screen getScreenById(Long id);
    Screen createScreen(ScreenDTO screenDTO);
    Screen updateScreen(ScreenDTO screenDTO, Long id);
    void deleteScreen(Long id);
    void addMovieToScreen(Long screenId, Long movieId);
    void removeMovieFromScreen(Long screenId, Long movieId);

}
