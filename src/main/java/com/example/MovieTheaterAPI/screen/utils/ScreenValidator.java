package com.example.MovieTheaterAPI.screen.utils;

import com.example.MovieTheaterAPI.screen.dto.ScreenDTO;

public class ScreenValidator {
    public static boolean isValidScreen(ScreenDTO screenDTO) {
        return screenDTO.getName() != null && !screenDTO.getName().isEmpty() &&
                screenDTO.getCapacity() != null && screenDTO.getCapacity() > 0 &&
                screenDTO.getLocationId() != null;
    }
}
