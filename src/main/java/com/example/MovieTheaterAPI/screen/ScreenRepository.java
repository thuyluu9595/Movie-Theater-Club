package com.example.MovieTheaterAPI.screen;

import com.example.MovieTheaterAPI.location.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ScreenRepository extends JpaRepository<Screen, Long> {
    Optional<Screen> findScreenByName(String name);
    List<Screen> findScreensByLocation(Location location);

    @Modifying
    @Query("DELETE FROM Screen s WHERE s.id = :screenId")
    void deleteById(Long screenId);
}
