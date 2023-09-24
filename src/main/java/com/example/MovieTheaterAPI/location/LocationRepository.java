package com.example.MovieTheaterAPI.location;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface LocationRepository extends JpaRepository<Location, Long> {
  List<Location> findAll();  
  List<Location> findByCity(String city);
  List<Location> findByState(String state);
}
