package com.example.MovieTheaterAPI.showtime.mapper;

import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.showtime.dto.GetMovieDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    @Mapping(target = "id", source = "movie.id")
    @Mapping(target = "title", source = "movie.title")
    @Mapping(target = "posterUrl", source = "movie.posterUrl")
    GetMovieDTO getMovieDTO(Movie movie);
}
