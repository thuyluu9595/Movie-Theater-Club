package com.example.MovieTheaterAPI.payment;


public class StripeConfig {
    private String secretKey;
    private String publishableKey;

    public StripeConfig(String secretKey, String publishableKey) {
        this.secretKey = secretKey;
        this.publishableKey = publishableKey;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public String getPublishableKey() {
        return publishableKey;
    }
    
}
