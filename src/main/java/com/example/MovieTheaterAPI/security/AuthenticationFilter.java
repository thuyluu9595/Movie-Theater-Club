package com.example.MovieTheaterAPI.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.MovieTheaterAPI.user.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.core.GrantedAuthority;


import java.io.IOException;
import java.util.Date;
import java.util.stream.Collectors;

@AllArgsConstructor
public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final CustomAuthenticationManager authenticationManager;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            User user = new ObjectMapper().readValue(request.getInputStream(), User.class);
            Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
            return authenticationManager.authenticate(authentication);
        } catch (IOException e) {
            throw new RuntimeException();
        }
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write(failed.getMessage());
        response.getWriter().flush();
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        if (authResult instanceof CustomAuthentication) {
            CustomAuthentication auth = (CustomAuthentication) authResult;
            String token = JWT.create()
                    .withClaim("id", auth.getId())
                    .withClaim("firstname", auth.getFirstname())
                    .withClaim("lastname", auth.getLastname())
                    .withClaim("username", auth.getName())
                    .withClaim("roles", auth
                            .getAuthorities()
                            .stream()
                            .map(GrantedAuthority::getAuthority)
                            .collect(Collectors.toList()))
                    .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstants.TOKEN_EXPIRATION))
                    .sign(Algorithm.HMAC512(SecurityConstants.SECRET_KEY));

            String JSONString = String.format("{\"id\":%d,\"role\":\"%s\",\"firstname\":\"%s\",\"lastname\":\"%s\",\"token\":\"%s\"}",
                    auth.getId(),
                    auth.getRole(),
                    auth.getFirstname(),
                    auth.getLastname(),
                    token);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            response.getWriter().write(JSONString);
            response.getWriter().flush();
        }


//        response.addHeader(SecurityConstants.AUTHORIZATION, SecurityConstants.BEARER + token);
//        response.setContentType("application/json");
//        response.setCharacterEncoding("UTF-8");
//
//        response.getWriter().write(token);
//        response.getWriter().flush();


    }
}
