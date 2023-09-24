package com.example.MovieTheaterAPI.discount;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "discount")
public class Discount {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "title")
  private String title;

  @Column(name = "before_6pm")
  private float isHappyHourBefore6PM;

  @Column(name = "tuesday_discount")
  private float isTuesdayDiscount;
  
}
