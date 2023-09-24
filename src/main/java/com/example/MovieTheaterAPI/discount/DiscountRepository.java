package com.example.MovieTheaterAPI.discount;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountRepository extends JpaRepository<Discount, Long>{

  List<Discount> findByIsHappyHourBefore6PM(float isHappyHourBefore6PM);
  List<Discount> findByIsTuesdayDiscount(float isTuesdayDiscounts);
  
}
