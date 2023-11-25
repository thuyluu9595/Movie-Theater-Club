package com.example.MovieTheaterAPI.user;

import com.example.MovieTheaterAPI.security.CustomAuthentication;
import com.example.MovieTheaterAPI.user.dto.ChangePasswordDTO;
import com.example.MovieTheaterAPI.user.dto.UpgradeAccountDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final MemberService memberService;
    private final UserService userService;

    @GetMapping("")
    public ResponseEntity<List<User>> getAllUser() {
        return new ResponseEntity<>(userService.getAllUser(), HttpStatus.OK);
    }

    @GetMapping("/info")
    public ResponseEntity<?> getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomAuthentication auth = (CustomAuthentication) authentication;
        try {
            User user = userService.getUser(auth.getId());
            return ResponseEntity.ok(user);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/")
    public ResponseEntity<User> createMember(@RequestBody User user) {
        return new ResponseEntity<>(userService.createMember(user), HttpStatus.CREATED);
    }

    @PostMapping("/admin")
    public ResponseEntity<User> createAdmin(@RequestBody User user) {
        return new ResponseEntity<>(userService.createEmployee(user), HttpStatus.CREATED);
    }

    @PutMapping("/changepw")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomAuthentication auth = (CustomAuthentication) authentication;
        try {
            User user = userService.getUser(auth.getId());
            userService.changePassword(user, req);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @PutMapping("/{id}/update-info")
    public ResponseEntity<HttpStatus> updateInfo(
            @PathVariable long id,
            @RequestBody(required = false) InfoChangeRequest req) {
        User user;
        try {
            user = userService.getUser(id);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        userService.updateInfo(user, req.getFirstname(), req.getLastname(), req.getEmail());
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }


    @PutMapping("/{id}/upgradeAccount")
    public ResponseEntity<HttpStatus> upgradeToPremium(
        @PathVariable long id,
        @RequestBody(required = true) UpgradeAccountDTO req) {
        try {
            memberService.upgradePremium(id, req);
        } catch (MemberNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<HttpStatus> downgradeToRegular(@PathVariable long id) {
        try {
            memberService.cancelPremium(id);
        } catch (MemberNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
}



@Getter
@Setter
@NoArgsConstructor
class InfoChangeRequest {
    private String firstname;
    private String lastname;
    private String email;
}