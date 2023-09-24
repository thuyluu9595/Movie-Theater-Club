package com.example.MovieTheaterAPI.user;

import org.springframework.stereotype.Service;

import java.util.List;

public interface UserService {
    List<User> getAllUser();
    User getUser(long id);
    User getUser(String username);
    User createMember(User user);

    User createEmployee(User user);
    User changePassword(User user, String password);
    User updateInfo(User user, String firstname, String lastname, String email);
}
