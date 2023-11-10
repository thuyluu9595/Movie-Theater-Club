package com.example.MovieTheaterAPI.analytic;

import com.example.MovieTheaterAPI.location.Location;
import com.example.MovieTheaterAPI.movie.model.Movie;
import lombok.Data;

@Data
public class Occupancy {
    private double occupiedPercent;
    private Location location;
    private Movie movie;

}
