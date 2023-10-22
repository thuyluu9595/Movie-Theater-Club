package com.example.MovieTheaterAPI.analytic;

import com.example.MovieTheaterAPI.location.Location;
import com.example.MovieTheaterAPI.location.LocationRepository;
import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.showtime.ShowTime;
import com.example.MovieTheaterAPI.showtime.ShowTimeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class AnalyticService {
    private final ShowTimeRepository showTimeRepository;
    private final LocationRepository locationRepository;

    public AnalyticService(ShowTimeRepository showTimeRepository, LocationRepository locationRepository) {
        this.showTimeRepository = showTimeRepository;
        this.locationRepository = locationRepository;
    }

    private double getOccupiedPercentage(ShowTime s){
        int totalSeats = s.getAvailableSeat().length;
        long occupiedSeats = Arrays.stream(s.getAvailableSeat())
                .filter(value -> value == null)
                .count();
        return  (occupiedSeats / (double)totalSeats) * 100;
    }
    public List<Occupancy> getOccupancyByLocationAndDates(long days) {
        HashMap<Long, double[]> occupancyLocationMap = new HashMap<>();
        HashMap<Long, Location> locationAndIdMap = new HashMap<>();
        List<Location> locations = locationRepository.findAll();
        List<Occupancy> occupancies = new ArrayList<>();

        for (Location l : locations) {
            locationAndIdMap.put(l.getId(), l);
            occupancyLocationMap.put(l.getId(), new double[]{0.0, 0.0});
        }

        List<ShowTime> showTimes = showTimeRepository.findAllByDateAfter(LocalDate.now().plusDays(days));

        for (ShowTime s : showTimes) {
            double percentage = getOccupiedPercentage(s);
            Long locationId = s.getScreen().getLocation().getId();
            occupancyLocationMap.put(locationId, new double[]{occupancyLocationMap.get(locationId)[0] + 1.0, occupancyLocationMap.get(locationId)[1] + percentage});
        }

        for (Long key : occupancyLocationMap.keySet()) {
            Occupancy occupancy = new Occupancy();
            occupancy.setLocation(locationAndIdMap.get(key));
            occupancy.setOccupiedPercent(occupancyLocationMap.get(key)[1] / occupancyLocationMap.get(key)[0]);

            occupancies.add(occupancy);
        }

        return occupancies;
    }

    public List<Occupancy> getOccupancyByMovieAndDates(long days){
        HashMap<Movie, double[]> occupancyMovieMap = new HashMap<>();
        List<Occupancy> occupancies = new ArrayList<>();
        List<ShowTime> showTimes = showTimeRepository.findAllByDateAfter(LocalDate.now().plusDays(days));

        for (ShowTime s : showTimes) {
            double percentage = getOccupiedPercentage(s);

            Movie movie = s.getMovie();
            occupancyMovieMap.putIfAbsent(movie, new double[] {0.0, 0.0});
            occupancyMovieMap.put(movie, new double[]{occupancyMovieMap.get(movie)[0] + 1.0, occupancyMovieMap.get(movie)[1] + percentage});
        }

        for (Movie m : occupancyMovieMap.keySet()) {
            Occupancy occupancy = new Occupancy();
            occupancy.setOccupiedPercent(occupancyMovieMap.get(m)[1] / occupancyMovieMap.get(m)[0]);
            occupancy.setMovie(m);

            occupancies.add(occupancy);
        }

        return occupancies;

    }
}
