package com.example.MovieTheaterAPI.shared.mappers;

import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.shared.DTOs.GetMovieDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    @Mapping(target = "id", source = "movie.id")
    @Mapping(target = "title", source = "movie.title")
    @Mapping(target = "posterUrl", source = "movie.posterUrl")
    @Mapping(target = "genres", source = "movie.genres")
    GetMovieDTO getMovieDTO(Movie movie);
}
