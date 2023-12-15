package com.example.MovieTheaterAPI.location;

import java.util.List;
import java.util.Optional;

import com.example.MovieTheaterAPI.screen.utils.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class LocationServiceImpl implements LocationService{
  LocationRepository locationRepository;

  @Override
  public List<Location> getAllLocations() {
    return locationRepository.findAll();
  }

  @Override
  public Location getLocationById(Long id){
    return locationRepository.findById(id).orElse(null);

  }


  @Override
  public List<Location> getLocationsByState(String state) {
    return locationRepository.findByState(state);
  }

  @Override
  public List<Location> getLocationsByCity(String city) {
    return locationRepository.findByCity(city);
  }

  @Override
  public Location createLocation(Location location) {
    return locationRepository.save(location);
  }

  @Override
  public Location updateLocation(Long id, Location updatedLocation){

    Optional<Location> existLocation = locationRepository.findById(id);
    if (existLocation.isEmpty()) {
      throw new ResourceNotFoundException();
    }
    Location location = existLocation.get();
    location.setState(updatedLocation.getState());
    location.setCity(updatedLocation.getCity());
    return locationRepository.save(location);
  }

  @Override
  public void deleteLocation(Location location){
    locationRepository.delete(location);
  }

}
