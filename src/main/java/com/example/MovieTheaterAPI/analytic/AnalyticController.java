package com.example.MovieTheaterAPI.analytic;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytic")
public class AnalyticController {
    private final AnalyticService analyticService;

    public AnalyticController(AnalyticService analyticService) {
        this.analyticService = analyticService;
    }

    @GetMapping("/locations")
    public ResponseEntity<?> getOccupancyByLocation(@RequestParam long days) {
        List<Occupancy> occupancies = analyticService.getOccupancyByLocationAndDates(days);
        return ResponseEntity.ok(occupancies);
    }

    @GetMapping("/movies")
    public ResponseEntity<?> getOccupancyByMovie(@RequestParam long days) {
        List<Occupancy> occupancies = analyticService.getOccupancyByMovieAndDates(days);
        return ResponseEntity.ok(occupancies);
    }
}
