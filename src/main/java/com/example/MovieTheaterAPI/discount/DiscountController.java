package com.example.MovieTheaterAPI.discount;

import java.util.List;

import com.example.MovieTheaterAPI.discount.dto.DiscountUpdateDTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/discount")
@AllArgsConstructor
public class DiscountController {
    private final DiscountService discountService;

    @GetMapping("")
    public ResponseEntity<?> getAllDiscount(){
        return ResponseEntity.ok(discountService.getAllDiscount());
    }

    @PutMapping("/tueday-special")
    public ResponseEntity<?> updateTuedayDiscount(@RequestBody DiscountUpdateDTO discountUpdateDTO) {
        return ResponseEntity.ok(discountService.updateTuedayDiscount(discountUpdateDTO.getPercent()));
    }

    @PutMapping("/before-6pm")
    public ResponseEntity<?> updateBefore6PM(@RequestBody DiscountUpdateDTO discountUpdateDTO) {
        return ResponseEntity.ok(discountService.updateBefore6PMDiscount(discountUpdateDTO.getPercent()));
    }


}
