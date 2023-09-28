package com.example.MovieTheaterAPI.screen;

import com.example.MovieTheaterAPI.location.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScreenRepository extends JpaRepository<Screen, Long> {
    Optional<Screen> findScreenByName(String name);
    List<Screen> findScreensByLocation(Location location);

}
