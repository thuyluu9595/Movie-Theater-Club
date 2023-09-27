package com.example.MovieTheaterAPI.screen;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ScreenRepository extends JpaRepository<Screen, Long> {
    Optional<Screen> findScreenByName(String name);

}
