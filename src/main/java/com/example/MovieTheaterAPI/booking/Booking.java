package com.example.MovieTheaterAPI.booking;

import com.example.MovieTheaterAPI.showtime.ShowTime;
import com.example.MovieTheaterAPI.user.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "showtime_id", referencedColumnName = "id")
    private ShowTime showTime;

    @Column(name = "seats", nullable = false)
    private int[] seats;

    @Column(name = "booking-date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "booking-time", nullable = false)
    private LocalTime bookingTime;

    @Column(name = "movie-date", nullable = false)
    private LocalDate movieDate;

    @Column(name = "total-price", nullable = false)
    private double totalPrice;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    public Booking(User existingUser, ShowTime existingShowTime, int[] seats, LocalDate date, LocalTime time, LocalDate movieDate, double totalPrice, BookingStatus bookingStatus) {
        this.user = existingUser;
        this.showTime = existingShowTime;
        this.seats = seats;
        this.bookingDate = date;
        this.bookingTime = time;
        this.movieDate = movieDate;
        this.totalPrice = totalPrice;
        this.status = bookingStatus;
    }
}

