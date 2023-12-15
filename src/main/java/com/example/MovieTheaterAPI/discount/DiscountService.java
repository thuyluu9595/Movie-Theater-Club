package com.example.MovieTheaterAPI.discount;

import org.springframework.stereotype.Service;

import java.util.List;

public interface DiscountService {

  Discount updateTuedayDiscount(float percent);
  Discount updateBefore6PMDiscount(float percent);
  List<Discount> getAllDiscount();

}
