package com.example.MovieTheaterAPI.user.dto;

import lombok.*;

@Data
public class ChangePasswordDTO {
    @NonNull
    private String password;

    @NonNull
    private String newPassword;
}

