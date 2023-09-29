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
    @ElementCollection
    @Setter(AccessLevel.NONE)
    @Column(name = "available_seat")
    private List<Integer> availableSeat;

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
        if (availableSeat.contains(seatNumber)) {
            availableSeat.remove(Integer.valueOf(seatNumber));
            return true;
        }
        return false;
    }

    public boolean returnSeat(int seatNumber) {
        if (availableSeat.contains(seatNumber)) {
            return false;
        }
        availableSeat.add(seatNumber);
        return true;
    }



    private void calculateEndTime() {
        setEndTime(startTime.plus(movie.getDuration()));
    }
    private void generateSeat() {
        this.availableSeat = IntStream.range(1, screen.getCapacity() + 1).boxed().toList();
    }
}