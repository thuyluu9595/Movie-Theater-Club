package com.example.MovieTheaterAPI.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.NonNull;

@Data
public class UpgradeAccountDTO {
    @NonNull
    private String cardNumber;

    @NonNull
    private String expMonth;

    @NonNull
    private String expYear;

    @NonNull
    private String cvc;
}
