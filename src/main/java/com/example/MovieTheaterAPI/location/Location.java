package com.example.MovieTheaterAPI.location;


import com.example.MovieTheaterAPI.screen.Screen;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "locations")
public class Location {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @NonNull
  @Column(name = "city", nullable = false)
  private String city;

  @NonNull
  @Column(name = "state", nullable = false)
  private String state;

  @JsonIgnore
  @OneToMany(mappedBy = "location")
  private List<Screen> screens;

}
