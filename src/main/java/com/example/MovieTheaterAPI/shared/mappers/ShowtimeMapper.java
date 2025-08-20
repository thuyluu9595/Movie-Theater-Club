package com.example.MovieTheaterAPI.shared.mappers;

import com.example.MovieTheaterAPI.showtime.ShowTime;
import com.example.MovieTheaterAPI.shared.DTOs.GetShowtimeDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ScreenMapper.class, MovieMapper.class})
public interface ShowtimeMapper {
    @Mapping(target = "id", source = "showtime.id")
    @Mapping(target = "screen", source = "showtime.screen")
    @Mapping(target = "date", source = "showtime.date")
    @Mapping(target = "startTime", source = "showtime.startTime")
    @Mapping(target = "endTime", source = "showtime.endTime")
    @Mapping(target = "price", source = "showtime.price")
    @Mapping(target = "availableSeat", source = "showtime.availableSeat")
    @Mapping(target = "discount", source = "showtime.discount")
    @Mapping(target = "movie", source = "showtime.movie")
    GetShowtimeDTO getShowtimeDTO(ShowTime showtime);
}
