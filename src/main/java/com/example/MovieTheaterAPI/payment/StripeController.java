package com.example.MovieTheaterAPI.payment;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MovieTheaterAPI.payment.dto.StripeChargeDTO;
import com.example.MovieTheaterAPI.payment.dto.StripeTokenDTO;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/payment")
@AllArgsConstructor
public class StripeController {
    private final StripeService stripeService;

//    @PostMapping("/card/token")
//    public ResponseEntity<?> createCardToken(@RequestBody StripeTokenDTO req) {
//        try {
//            return ResponseEntity.ok(stripeService.createCardToken(req));
//        } catch(RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }

    @PostMapping("/charge")
    public ResponseEntity<?> charge(@RequestBody StripeChargeDTO req) {
        System.out.println("call here");
        return ResponseEntity.ok(stripeService.charge(req));
    }
}
