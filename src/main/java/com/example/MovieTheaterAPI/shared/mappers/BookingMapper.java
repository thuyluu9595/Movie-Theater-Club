package com.example.MovieTheaterAPI.shared.mappers;

import com.example.MovieTheaterAPI.booking.Booking;
import com.example.MovieTheaterAPI.shared.DTOs.GetBookingDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ShowtimeMapper.class})
public interface BookingMapper {
    @Mapping(target = "id", source = "booking.id")
    @Mapping(target = "showTime", source = "booking.showTime")
    @Mapping(target = "seats", source = "booking.seats")
    @Mapping(target = "bookingDate", source = "booking.bookingDate")
    @Mapping(target = "bookingTime", source = "booking.bookingTime")
    @Mapping(target = "movieDate", source = "booking.movieDate")
    @Mapping(target = "totalPrice", source = "booking.totalPrice")
    @Mapping(target = "status", source = "booking.status")
    GetBookingDTO getBookingDTO(Booking booking);
}
