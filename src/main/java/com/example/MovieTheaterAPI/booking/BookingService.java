package com.example.MovieTheaterAPI.booking;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    List<Booking> getAllBookings();
    Booking getBookingById(Long id);
    Booking createBooking(BookingDTO bookingDTO);
//    Booking updateBooking(Long id, BookingDTO bookingDTO);
//    void deleteBooking(Long id);
    void cancelBooking(Long id);
    void payBooking(Long id);
    List<Booking> getBookingsByUserId(Long userId);
    List<Booking> getBookingsByAfterBookingDate(Long id, LocalDate bookingDate);
//    List<Booking> getBookingsByShowTimeId(Long showTimeId);
//    List<Booking> getBookingsByShowTimeIdAndUserId(Long showTimeId, Long userId);
//    List<Booking> getBookingsByShowTimeIdAndUserIdAndStatus(Long showTimeId, Long userId, BookingStatus status);
//    List<Booking> getBookingsByShowTimeIdAndStatus(Long showTimeId, BookingStatus status);
//    List<Booking> getBookingsByUserIdAndStatus(Long userId, BookingStatus status);
//    List<Booking> getBookingsByStatus(BookingStatus status);
//    List<Booking> getBookingsByShowTimeIdAndBookingDate(Long showTimeId, String bookingDate);
}
