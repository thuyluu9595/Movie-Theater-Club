package com.example.MovieTheaterAPI.location;

import java.util.List;

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

    Location existLocation = locationRepository.findById(id).orElse(null);

    if (existLocation != null) {
      // Update the existing location
      existLocation.setState(updatedLocation.getState());
      existLocation.setCity(updatedLocation.getCity());return locationRepository.save(existLocation);
    }
    return null; // Handle the case where the location with the given Id not found
  }

  @Override
  public void deleteLocation(Location location){
    locationRepository.delete(location);
  }

}
