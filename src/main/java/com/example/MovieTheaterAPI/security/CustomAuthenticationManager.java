package com.example.MovieTheaterAPI.security;

import com.example.MovieTheaterAPI.user.User;
import com.example.MovieTheaterAPI.user.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@AllArgsConstructor
public class CustomAuthenticationManager implements AuthenticationManager {
    private final UserService userService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String username = authentication.getName();
        log.info("Authenticating user {}", username);
        try {
            User user = userService.getUser(username);
            log.info(authentication.getCredentials().toString());
            log.info(user.getPassword());

            if (!bCryptPasswordEncoder.matches(authentication.getCredentials().toString(), user.getPassword())) {
                throw new BadCredentialsException("You provided an incorrect password");
            }

            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().toString().toUpperCase()));

            return new CustomAuthentication(
                    user.getId(),
                    user.getRole().toString(),
                    user.getFirstname(),
                    user.getLastname(),
                    authentication.getName(),
                    user.getPassword(),
                    authorities
            );
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new BadCredentialsException(e.getMessage());
        }

//        return new UsernamePasswordAuthenticationToken(
//                authentication.getName(),
//                user.getPassword(),
//                authorities);
    }
}
