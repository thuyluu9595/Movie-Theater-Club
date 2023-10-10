package com.example.MovieTheaterAPI.booking;

import com.example.MovieTheaterAPI.screen.utils.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("")
    public ResponseEntity<?> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            Booking booking = bookingService.getBookingById(id);
            return ResponseEntity.ok(booking);
        }
        catch (BookingNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<?> createBooking(@RequestBody BookingDTO bookingDTO) {
        try {
            Booking createdBooking = bookingService.createBooking(bookingDTO);
            return ResponseEntity.ok(createdBooking);
        }
        catch (SeatNotAvailableException | ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.ok("Booking cancelled");
        }
        catch (BookingNotFoundException | BookingCannotBeCancelledException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/paid/{id}")
    public ResponseEntity<?> payBooking(@PathVariable Long id) {
        try {
            bookingService.payBooking(id);
            return ResponseEntity.ok("Booking paid");
        }
        catch (BookingNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getBookingsByUserId(@PathVariable Long id) {
        try {
            List<Booking> bookingList = bookingService.getBookingsByUserId(id);
            return ResponseEntity.ok(bookingList);
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{id}/date/{date}")
    public ResponseEntity<?> getBookingsByDate(@PathVariable LocalDate date, @PathVariable Long id) {
        try {
            List<Booking> bookingList = bookingService.getBookingsByAfterBookingDate(id, date);
            return ResponseEntity.ok(bookingList);
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }

    }

}
