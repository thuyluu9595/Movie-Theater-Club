package com.example.MovieTheaterAPI.payment.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StripeSubscriptionResponse {
    private String stripeCustomerId;
    private String stripeSubscriptionId;
    private String stripePaymentMethodId;
    private String username;
}

