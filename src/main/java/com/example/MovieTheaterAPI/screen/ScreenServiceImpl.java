package com.example.MovieTheaterAPI.screen;

import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.movie.repository.MovieRepository;
import com.example.MovieTheaterAPI.movie.utils.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScreenServiceImpl implements ScreenService{
    private final ScreenRepository screenRepository;
    private final MovieRepository movieRepository;

    public ScreenServiceImpl(ScreenRepository screenRepository, MovieRepository movieRepository) {
        this.screenRepository = screenRepository;
        this.movieRepository = movieRepository;
    }

    @Override
    public List<Screen> getScreens() {
        return screenRepository.findAll();
    }

    @Override
    public Screen getScreenById(Long id) {
        return screenRepository.findById(id).orElseThrow(ScreenNotFoundException::new);
    }

    @Override
    public Screen createScreen(Screen screen) {
        if (screenRepository.findScreenByName(screen.getName()).isEmpty()) {
            return screenRepository.save(screen);
        }
        throw new ScreenAlreadyExistsException();
    }

    @Override
    public Screen updateScreen(Screen screen, Long id) {
        Optional<Screen> screenOptional = screenRepository.findById(id);
        if (screenOptional.isPresent()) {
            Screen screenToUpdate = screenOptional.get();
            if (screen.getName() != null && !screen.getName().isEmpty()) {
                screenToUpdate.setName(screen.getName());
            }
            if (screen.getCapacity() != null) {
                screenToUpdate.setCapacity(screen.getCapacity());
            }
            if (screen.getLocation() != null) {
                screenToUpdate.setLocation(screen.getLocation());
            }
            if (screen.getMovies() != null) {
                screenToUpdate.setMovies(screen.getMovies());
            }
            return screenRepository.save(screenToUpdate);
        }
        throw new ScreenNotFoundException();
    }

    @Override
    public void deleteScreen(Long id) {
        Optional<Screen> screenOptional = screenRepository.findById(id);
        if (screenOptional.isPresent()) {
            screenRepository.deleteById(id);
        } else {
            throw new ScreenNotFoundException();
        }
    }

    @Override
    public void addMovieToScreen(Long screenId, Long movieId) {
        Optional<Screen> screenOptional = screenRepository.findById(screenId);
        if (screenOptional.isPresent()) {
            Screen screen = screenOptional.get();
            Movie movie = movieRepository.findById(movieId).orElseThrow(MovieNotFoundException::new);
            screen.addMovie(movie);
            screenRepository.save(screen);
        } else {
            throw new ScreenNotFoundException();
        }

    }

    @Override
    public void removeMovieFromScreen(Long screenId, Long movieId) {
        Optional<Screen> screenOptional = screenRepository.findById(screenId);
        if (screenOptional.isPresent()) {
            Screen screen = screenOptional.get();
            Movie movie = movieRepository.findById(movieId).orElseThrow(MovieNotFoundException::new);
            screen.removeMovie(movie);
            screenRepository.save(screen);
        } else {
            throw new ScreenNotFoundException();
        }
    }

}
