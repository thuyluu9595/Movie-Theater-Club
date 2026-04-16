package com.example.MovieTheaterAPI.shared.mappers;

import com.example.MovieTheaterAPI.location.Location;
import com.example.MovieTheaterAPI.shared.DTOs.GetLocationDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LocationMapper {
    @Mapping(target = "id", source = "location.id")
    @Mapping(target = "city", source = "location.city")
    @Mapping(target = "state", source = "location.state")
    GetLocationDTO getLocationDTO(Location location);
}
