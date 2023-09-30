package com.example.MovieTheaterAPI.showtime;

import com.example.MovieTheaterAPI.movie.model.Movie;
import com.example.MovieTheaterAPI.screen.Screen;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.IntStream;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "showtime")
public class ShowTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @NonNull
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "screen_id")
    private Screen screen;

    @NonNull
    @Column(name="date")
    private LocalDate date;

    @NonNull
    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @NonNull
    @Column(name = "price")
    private double price;

    @NonNull
    @Setter(AccessLevel.NONE)
    @Column(name = "available_seat")
    private Integer[] availableSeat;

    public ShowTime(Movie movie, Screen screen, LocalDate date, LocalTime startTime, double price) {
        this.movie = movie;
        this.screen = screen;
        this.date = date;
        this.startTime = startTime;
        this.price = price;
        calculateEndTime();
        generateSeat();
    }

    public boolean bookSeat(int seatNumber) {
        if (isSeatAvailable(seatNumber)) {
            availableSeat[seatNumber - 1] = null;
            return true;
        }
        return false;
    }

    public boolean returnSeat(int seatNumber) {
        if (!isSeatAvailable(seatNumber)) {
            availableSeat[seatNumber - 1] = seatNumber;
            return true;
        }
        return false;
    }

    private void calculateEndTime() {
        setEndTime(startTime.plus(movie.getDuration()));
    }

    private void generateSeat() {
        int capacity = screen.getCapacity();
        availableSeat = IntStream.rangeClosed(1, capacity).boxed().toArray(Integer[]::new);
    }

    private boolean isSeatAvailable(int seatNumber) {
        return seatNumber >= 1 && seatNumber <= availableSeat.length && availableSeat[seatNumber - 1] != null;
    }
}