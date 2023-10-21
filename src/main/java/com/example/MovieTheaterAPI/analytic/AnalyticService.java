package com.example.MovieTheaterAPI.analytic;

import com.example.MovieTheaterAPI.location.Location;
import com.example.MovieTheaterAPI.location.LocationRepository;
import com.example.MovieTheaterAPI.showtime.ShowTime;
import com.example.MovieTheaterAPI.showtime.ShowTimeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@Service
public class AnalyticService {
    private final ShowTimeRepository showTimeRepository;
    private final LocationRepository locationRepository;

    public AnalyticService(ShowTimeRepository showTimeRepository, LocationRepository locationRepository) {
        this.showTimeRepository = showTimeRepository;
        this.locationRepository = locationRepository;
    }

    public List<Occupancy> getOccupancyByAndDates(long days) {
        HashMap<Long, Double> occupancyLocationMap = new HashMap<>();
        HashMap<Long, Location> locationAndIdMap = new HashMap<>();
        List<Location> locations = locationRepository.findAll();
        List<Occupancy> occupancies = new ArrayList<>();

        for (Location l : locations) {
            locationAndIdMap.put(l.getId(), l);
            occupancyLocationMap.put(l.getId(), 0.0);
        }

        List<ShowTime> showTimes = showTimeRepository.findAllByDateAfter(LocalDate.now().plusDays(days));

        for (ShowTime s : showTimes) {
            int totalSeats = s.getAvailableSeat().length;
            long occupiedSeats = Arrays.stream(s.getAvailableSeat())
                                .filter(value -> value == null)
                                .count();
            double percentage = (occupiedSeats / (double)totalSeats) * 100;

            Long locationId = s.getScreen().getLocation().getId();
            occupancyLocationMap.put(locationId, occupancyLocationMap.get(locationId) + percentage);
        }

        for (Long key : occupancyLocationMap.keySet()) {
            Occupancy occupancy = new Occupancy();
            occupancy.setLocation(locationAndIdMap.get(key));
            occupancy.setOccupiedPercent(occupancyLocationMap.get(key));

            occupancies.add(occupancy);
        }

        return occupancies;
    }
}
