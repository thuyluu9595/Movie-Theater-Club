package com.example.MovieTheaterAPI.screen;

import com.example.MovieTheaterAPI.movie.model.Movie;

import java.util.List;

public interface ScreenService {
    List<Screen> getScreens();
    Screen getScreenById(Long id);
    Screen createScreen(Screen screen);
    Screen updateScreen(Screen screen, Long id);
    void deleteScreen(Long id);
    void addMovieToScreen(Long screenId, Long movieId);
    void removeMovieFromScreen(Long screenId, Long movieId);

}
