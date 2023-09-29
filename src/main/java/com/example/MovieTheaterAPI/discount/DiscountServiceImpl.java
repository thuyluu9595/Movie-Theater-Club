//package com.example.MovieTheaterAPI.discount;
//
//import java.util.List;
//
//import org.springframework.stereotype.Service;
//
//@Service
//public class DiscountServiceImpl implements DiscountService{
//
//  DiscountRepository discountRepository;
//
//  @Override
//  public List<Discount> getAllDiscount(){
//    return discountRepository.findAll();
//  }
//
//  @Override
//  public Discount getDiscountById(Long id){
//    return discountRepository.findById(id).orElse(null);
//  }
//
//  @Override
//  public List<Discount> getDiscountByHappyHour(boolean isHappyHourBefore6PM){
//    return discountRepository.findByIsHappyHourBefore6PM(isHappyHourBefore6PM);
//  }
//
//  @Override
//  public List<Discount> getDiscountByTuesday(boolean isTuesdayDiscount){
//    return discountRepository.findByIsTuesdayDiscount(isTuesdayDiscount);
//  }
//}
