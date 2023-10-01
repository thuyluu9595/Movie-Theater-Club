package com.example.MovieTheaterAPI.discount;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "discount")
public class Discount {

  @Id
  @Enumerated(EnumType.STRING)
  private DiscountType id;

  @Column(name = "percent_discount")
  @Min(value = 0, message = "Percentage discount cannot be less than 0")
  @Max(value = 100, message = "Percentage discount cannot be greater than 100")
  private float percentDiscount;
}
enum DiscountType {
    TuedaySpecial,
    Before6PM
}
