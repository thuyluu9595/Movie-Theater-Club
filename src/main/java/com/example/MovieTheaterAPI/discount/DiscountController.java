//package com.example.MovieTheaterAPI.discount;
//
//import java.util.List;
//
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/discount")
//public class DiscountController {
//
//  DiscountService discountService;
//
//  @GetMapping("/")
//  public List<Discount> getAllDiscount(){
//    return discountService.getAllDiscount();
//  }
//
//  @GetMapping("/{id}")
//  public Discount getDiscountById(@PathVariable Long id) {
//    return discountService.getDiscountById(id);
//  }
//
//  @GetMapping("/happy-hour/{isHappyHourBefore6PM}")
//  public List<Discount> getDiscountByHappyHour(@PathVariable boolean isHappyHourBefore6PM) {
//    return discountService.getDiscountByHappyHour(isHappyHourBefore6PM);
//  }
//
//  @GetMapping("/tuesday/{isTuesdayDiscount}")
//  public List<Discount> getDiscountByTuesday(@PathVariable boolean isTuesdayDiscount) {
//    return discountService.getDiscountByTuesday(isTuesdayDiscount);
//  }
//
//}
