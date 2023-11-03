package com.example.MovieTheaterAPI.payment.dto;

import java.util.HashMap;
import java.util.Map;

import lombok.Data;

@Data
public class StripeChargeDTO {
    private String stripeToken;
    private String username;
    private Double amount;
    private Boolean success;
    private String message;
    private String chargeId;
    private Map<String, Object> additionalInfo = new HashMap<>(); 
}
