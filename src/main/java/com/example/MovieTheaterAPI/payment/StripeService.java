package com.example.MovieTheaterAPI.payment;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.MovieTheaterAPI.payment.dto.StripeChargeDTO;
import com.example.MovieTheaterAPI.payment.dto.StripeSubscriptionDTO;
import com.example.MovieTheaterAPI.payment.dto.StripeSubscriptionResponse;
import com.example.MovieTheaterAPI.payment.dto.StripeTokenDTO;
import com.example.MovieTheaterAPI.user.Member;
import com.example.MovieTheaterAPI.user.dto.UpgradeAccountDTO;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;

import com.stripe.model.Charge;
import com.stripe.model.Customer;
import com.stripe.model.PaymentMethod;
import com.stripe.model.Subscription;
import com.stripe.model.Token;
import com.stripe.model.PaymentIntent.PaymentMethodOptions.Card.Installments.Plan;

import jakarta.annotation.PostConstruct;

@Service
public class StripeService {

    @Value("${api.stripe.secret}")
    private String secretKey;

    @Value("${api.stripe.publishable}")
    private String publishableKey;

    private StripeConfig stripeConfig;

    @Value("${subscription.id}")
    private String subscriptionPriceId;

    @PostConstruct
    public void init() {
        stripeConfig = new StripeConfig(secretKey, publishableKey);
        Stripe.apiKey = stripeConfig.getSecretKey();
    }

    private void switchToStripeSecretKey() {
        Stripe.apiKey = stripeConfig.getSecretKey();
    }

    private void switchToStripePublishableKey() {
        Stripe.apiKey = stripeConfig.getPublishableKey();
    }

    public StripeChargeDTO createCardToken(StripeChargeDTO dto) {
        switchToStripePublishableKey();
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
                dto.setStripeToken(token.getId());
            }
            return dto;
        } catch (StripeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public StripeChargeDTO charge(StripeChargeDTO dto) {
        createCardToken(dto);
        switchToStripeSecretKey();
        try {
            dto.setSuccess(false);
            Map<String, Object> chargeParams = new HashMap<>();
            chargeParams.put("amount", (int)(dto.getAmount() * 100));
            chargeParams.put("currency", "USD");
            chargeParams.put("description", "Payment for id " + dto.getAdditionalInfo().getOrDefault("ID_TAG", ""));
            chargeParams.put("source", dto.getStripeToken());

            Map<String, Object> metaData = new HashMap<>();
            metaData.put("id", dto.getChargeId());
            metaData.putAll(dto.getAdditionalInfo());

            chargeParams.put("metadata", metaData);
            Charge charge = Charge.create(chargeParams);
            dto.setMessage(charge.getOutcome().getSellerMessage());

            if (charge.getPaid()) {
                dto.setChargeId(charge.getId());
                dto.setSuccess(true);
            }
            return dto;
        } catch (StripeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    

    public Subscription createSubscription(UpgradeAccountDTO dto, Member member) {
        PaymentMethod paymentMethod = createPaymentMethod(dto);
        Customer customer = getCustomer(member);
        paymentMethod = attachCustomerToPaymentMethod(customer, paymentMethod);
        return createSubscription(customer, paymentMethod);
    }

    private Customer getCustomer(Member member) {
        switchToStripeSecretKey();
        try {
            return Customer.retrieve(member.getStripeCustomerId());
        } catch (StripeException e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
    
    public PaymentMethod createPaymentMethod(UpgradeAccountDTO dto) {
        switchToStripePublishableKey();
        try {
            Map<String, Object> card = new HashMap<>();

            card.put("number", dto.getCardNumber());
            card.put("exp_month", Integer.parseInt(dto.getExpMonth()));
            card.put("exp_year", Integer.parseInt(dto.getExpYear()));
            card.put("cvc", dto.getCvc());
            
            Map<String, Object> params = new HashMap<>();
            params.put("type", "card");
            params.put("card", card);

            return PaymentMethod.create(params);
        } catch (StripeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public Customer createCustomer(String email, String name) {
        switchToStripeSecretKey();
        try {
            return Customer.create(Map.of("email", email, "name", name));
        } catch (StripeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    private PaymentMethod attachCustomerToPaymentMethod(Customer customer, PaymentMethod paymentMethod) {
        switchToStripeSecretKey();
        try {
            paymentMethod = PaymentMethod.retrieve(paymentMethod.getId());

            Map<String, Object> params = new HashMap<>();
            params.put("customer", customer.getId());
            paymentMethod = paymentMethod.attach(params);
            return paymentMethod;
        } catch (StripeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    private Subscription createSubscription(Customer customer, PaymentMethod paymentMethod) {
        switchToStripeSecretKey();
        try {
            List<Object> items = new ArrayList<>();
            Map<String, Object> item = new HashMap<>();
            item.put("price", subscriptionPriceId);
            item.put("quantity", 1);
            items.add(item);

            Map<String, Object> params = new HashMap<>();
            params.put("customer", customer.getId());
            params.put("default_payment_method", paymentMethod.getId());
            params.put("items",  items);
            return Subscription.create(params);
        } catch (StripeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public Subscription cancelSubscription(String subcriptionId) {
        switchToStripeSecretKey();
        try {
            Subscription subscription = Subscription.retrieve(subcriptionId);
            return subscription.cancel();
        } catch (StripeException e) {
            return null;
        }
    }

}
