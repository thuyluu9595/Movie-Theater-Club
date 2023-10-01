package com.example.MovieTheaterAPI.showtime;

import com.example.MovieTheaterAPI.screen.ScreenService;
import com.example.MovieTheaterAPI.screen.utils.ResourceNotFoundException;
import com.example.MovieTheaterAPI.showtime.dto.ShowTimeDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/showtime")
public class ShowTimeController {
    private final ShowTimeService showTimeService;
    private final ScreenService screenService;

    @PostMapping("")
    public ResponseEntity<?> createShowTime(@RequestBody @Valid ShowTimeDTO showTimeDTO) {
        try {
            ShowTime showTime = showTimeService.createShowTime(showTimeDTO);
            screenService.addMovieToScreen(showTimeDTO.getScreenId(), showTimeDTO.getMovieId());
            return ResponseEntity.ok(showTime);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/movie")
    public ResponseEntity<?> getShowTimeByMovie(@PathVariable long id) {
        try {
            List<ShowTime> showTimes = showTimeService.getShowTimeByMovie(id);
            return ResponseEntity.ok(showTimes);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/location")
    public ResponseEntity<?> getShowTimeByLocation(@PathVariable long id) {
        try {
            List<ShowTime> showTimes = showTimeService.getShowTimeByLocation(id);
            return ResponseEntity.ok(showTimes);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{date}/date")
    public ResponseEntity<?> getShowTimeByDate(@PathVariable("date") String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd-yyyy");
        LocalDate date = LocalDate.parse(dateString, formatter);
        return ResponseEntity.ok(showTimeService.getShowTimeByDate(date));
    }
}
