package com.example.MovieTheaterAPI.payment.dto;



import lombok.Data;

@Data
public class StripeSubscriptionDTO {

    private String cardNumber;
    private String expMonth;
    private String expYear;
    private String cvc;
    private String email;
    private String priceId;
    private String username;
    private long numberOfLicense;
    private boolean success;
}
