package com.example.MovieTheaterAPI.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> getBookingsByUserIdAndBookingDateAfter(Long userId, LocalDate bookingDate);

    List<Booking> findByUserId(Long userId);
}
