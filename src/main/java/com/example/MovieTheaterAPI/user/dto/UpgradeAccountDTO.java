package com.example.MovieTheaterAPI.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.NonNull;

@Data
public class UpgradeAccountDTO {
    @NonNull
    @JsonProperty("card_number")
    private String cardNumber;

    @NonNull
    @JsonProperty("exp_month")
    private String expMonth;

    @NonNull
    @JsonProperty("exp_year")
    private String expYear;

    @NonNull
    private String cvc;
}
