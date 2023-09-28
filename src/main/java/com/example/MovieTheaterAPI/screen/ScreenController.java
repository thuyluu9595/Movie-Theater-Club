package com.example.MovieTheaterAPI.screen;

import com.example.MovieTheaterAPI.screen.dto.ScreenDTO;
import com.example.MovieTheaterAPI.screen.utils.ResourceNotFoundException;
import com.example.MovieTheaterAPI.screen.utils.ScreenAlreadyExistsException;
import com.example.MovieTheaterAPI.screen.utils.ScreenValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/screens")
public class ScreenController {
    private final ScreenServiceImpl screenService;

    public ScreenController(ScreenServiceImpl screenService) {
        this.screenService = screenService;
    }

    @GetMapping
    public ResponseEntity<?> getAllScreens() {
        return ResponseEntity.ok(screenService.getScreens());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getScreenById(Long id) {
        Screen screen = screenService.getScreenById(id);
        if (screen != null)
            return ResponseEntity.ok(screen);
        else
            return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> createScreen(@RequestBody ScreenDTO screenDTO) {
        if (screenDTO == null || !ScreenValidator.isValidScreen(screenDTO)) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Screen createdScreen = screenService.createScreen(screenDTO);
            return ResponseEntity.ok(createdScreen);
        }
        catch (ResourceNotFoundException | ScreenAlreadyExistsException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateScreen(@PathVariable Long id, @RequestBody ScreenDTO screenDTO){
        if (screenDTO == null || !ScreenValidator.isValidScreen(screenDTO)) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Screen updatedScreen = screenService.updateScreen(screenDTO, id);
            return ResponseEntity.ok(updatedScreen);
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteScreen(@PathVariable Long id) {
        try {
            screenService.deleteScreen(id);
            return ResponseEntity.ok().build();
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{screenId}/movies/{movieId}")
    public ResponseEntity<?> addMovieToScreen(@PathVariable Long screenId, @PathVariable Long movieId) {
        try {
            screenService.addMovieToScreen(screenId, movieId);
            return ResponseEntity.ok().build();
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{screenId}/movies/{movieId}")
    public ResponseEntity<?> removeMovieFromScreen(@PathVariable Long screenId, @PathVariable Long movieId) {
        try {
            screenService.removeMovieFromScreen(screenId, movieId);
            return ResponseEntity.ok().build();
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/locations/{locationId}")
    public ResponseEntity<?> getScreensByLocationId(@PathVariable Long locationId) {
        return ResponseEntity.ok(screenService.getScreensByLocationId(locationId));
    }

}
