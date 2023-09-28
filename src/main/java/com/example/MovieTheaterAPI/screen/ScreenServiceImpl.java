package com.example.MovieTheaterAPI.screen;

import com.example.MovieTheaterAPI.location.Location;
import com.example.MovieTheaterAPI.location.LocationRepository;
import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.movie.repository.MovieRepository;
import com.example.MovieTheaterAPI.screen.dto.ScreenDTO;
import com.example.MovieTheaterAPI.screen.utils.ResourceNotFoundException;
import com.example.MovieTheaterAPI.screen.utils.ScreenAlreadyExistsException;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ScreenServiceImpl implements ScreenService{
    private final ScreenRepository screenRepository;
    private final MovieRepository movieRepository;
    private final LocationRepository locationRepository;

    public ScreenServiceImpl(ScreenRepository screenRepository, MovieRepository movieRepository, LocationRepository locationRepository) {
        this.screenRepository = screenRepository;
        this.movieRepository = movieRepository;
        this.locationRepository = locationRepository;
    }

    @Override
    public List<Screen> getScreens() {
        return screenRepository.findAll();
    }

    @Override
    public Screen getScreenById(Long id) {
        return screenRepository.findById(id).orElseThrow(ResourceNotFoundException::new);
    }

    @Override
    public List<Screen> getScreensByLocationId(Long locationId) {
        Optional<Location> locationOptional = locationRepository.findById(locationId);
        return locationOptional.map(screenRepository::findScreensByLocation).orElseGet(Collections::emptyList);
    }

    @Override
    public Screen createScreen(ScreenDTO screenDTO) {
        Optional<Location> locationOptional = locationRepository.findById(screenDTO.getLocationId());
        if (locationOptional.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        Screen existingScreen = screenRepository.findScreenByName(screenDTO.getName()).orElse(null);
        if (existingScreen != null && existingScreen.getLocation().getId().equals(screenDTO.getLocationId())) {
            throw new ScreenAlreadyExistsException();
        }

        Screen screen = new Screen(screenDTO.getName(), locationOptional.get(), screenDTO.getCapacity());
        return screenRepository.save(screen);
    }

    @Override
    public Screen updateScreen(ScreenDTO screenDTO, Long id) {
        Optional<Screen> screenOptional = screenRepository.findById(id);
        if (screenOptional.isPresent()) {
            Screen screenToUpdate = screenOptional.get();
            if (screenDTO.getName() != null && !screenDTO.getName().isEmpty()) {
                screenToUpdate.setName(screenDTO.getName());
            }
            if (screenDTO.getCapacity() != null) {
                screenToUpdate.setCapacity(screenDTO.getCapacity());
            }

            Location location = locationRepository.findById(screenDTO.getLocationId()).orElseThrow(ResourceNotFoundException::new);
            screenToUpdate.setLocation(location);

            return screenRepository.save(screenToUpdate);
        }
        throw new ResourceNotFoundException();
    }

    @Override
    public void deleteScreen(Long id) {
        Optional<Screen> screenOptional = screenRepository.findById(id);
        if (screenOptional.isPresent()) {
            screenRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException();
        }
    }

    @Override
    public void addMovieToScreen(Long screenId, Long movieId) {
        Optional<Screen> screenOptional = screenRepository.findById(screenId);
        if (screenOptional.isPresent()) {
            Screen screen = screenOptional.get();
            Movie movie = movieRepository.findById(movieId).orElseThrow(ResourceNotFoundException::new);
            screen.addMovie(movie);
            screenRepository.save(screen);
        } else {
            throw new ResourceNotFoundException();
        }

    }

    @Override
    public void removeMovieFromScreen(Long screenId, Long movieId) {
        Optional<Screen> screenOptional = screenRepository.findById(screenId);
        if (screenOptional.isPresent()) {
            Screen screen = screenOptional.get();
            Movie movie = movieRepository.findById(movieId).orElseThrow(ResourceNotFoundException::new);
            screen.removeMovie(movie);
            screenRepository.save(screen);
        } else {
            throw new ResourceNotFoundException();
        }
    }

}
