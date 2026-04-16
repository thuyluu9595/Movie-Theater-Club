package com.example.MovieTheaterAPI.shared.mappers;

import com.example.MovieTheaterAPI.screen.Screen;
import com.example.MovieTheaterAPI.shared.DTOs.GetScreenDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = LocationMapper.class)
public interface ScreenMapper {
    @Mapping(target = "id", source = "screen.id")
    @Mapping(target = "name", source = "screen.name")
    @Mapping(target = "location", source = "screen.location")
    GetScreenDTO getScreenDTO(Screen screen);
}
