package com.example.MovieTheaterAPI.discount;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountRepository extends JpaRepository<Discount, DiscountType>{

}
