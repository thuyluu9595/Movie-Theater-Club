package com.example.MovieTheaterAPI.location;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/locations")
public class LocationController {
  LocationService locationService;

  @GetMapping("")
  public List<Location> getAllLocations() {
    return locationService.getAllLocations();
  }

  @GetMapping("/{id}")
  public Location getLocationById(@PathVariable Long id) {
    return locationService.getLocationById(id);
  }

  @GetMapping("/search")
  public List<Location> searchLocations(
    @RequestParam(required = false) String state,
    @RequestParam(required = false) String city) {

      // Todo: need to refine search engine
      if (state != null) {
        return locationService.getLocationsByState(state);
      } else if (city != null) {
        return locationService.getLocationsByCity(city);
      } else {
        return locationService.getAllLocations();
      }
    }
    
    @PostMapping("")
    public Location createLocation(@RequestBody Location location) {
      return  locationService.createLocation(location);
    }

    @PutMapping("/{id}")
    public Location updatedLocation(@PathVariable Long id, @RequestBody Location location) {
      return locationService.updateLocation(id, location);
    }
  
}
