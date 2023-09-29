package com.example.MovieTheaterAPI.showtime;

import com.example.MovieTheaterAPI.screen.utils.ResourceNotFoundException;
import com.example.MovieTheaterAPI.showtime.dto.ShowTimeDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/showtime")
public class ShowTimeController {
    private final ShowTimeService showTimeService;

    @PostMapping("")
    public ResponseEntity<?> createShowTime(@RequestBody @Valid ShowTimeDTO showTimeDTO) {
        try {
            ShowTime showTime = showTimeService.createShowTime(showTimeDTO);
            return ResponseEntity.ok(showTime);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
