package com.example.MovieTheaterAPI.payment;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.MovieTheaterAPI.payment.dto.StripeTokenDTO;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Token;

import jakarta.annotation.PostConstruct;

@Service
public class StripeService {

    @Value("$api.stripe.key")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public StripeTokenDTO createCardToken(StripeTokenDTO dto) {
        try {
            Map<String, Object> card = new HashMap<>();
            card.put("number", dto.getCardNumber());
            card.put("exp_month",  Integer.parseInt(dto.getExpMonth()));
            card.put("exp_year", Integer.parseInt(dto.getExpYear()));
            card.put("cvc", dto.getCvc());

            Map<String, Object> params = new HashMap<>();
            params.put("card", card);
            Token token = Token.create(params);
            if (token != null && token.getId() != null) {
                dto.setSuccess(true);
                dto.setToken(token.getId());
            }
            return dto;
        } catch (StripeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

}
