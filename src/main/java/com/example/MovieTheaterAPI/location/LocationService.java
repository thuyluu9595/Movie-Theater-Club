package com.example.MovieTheaterAPI.location;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface LocationService {
  List<Location> getAllLocations();
  Location getLocationById(Long id);
  List<Location> getLocationsByState(String state);
  List<Location> getLocationsByCity(String city);
  Location createLocation(Location location);
  Location updateLocation(Long id, Location location);
  void deleteLocation(Location location);
}
