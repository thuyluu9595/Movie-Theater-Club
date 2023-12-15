package com.example.MovieTheaterAPI.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Getter
@Setter
public class CustomAuthentication extends UsernamePasswordAuthenticationToken {
    private long id;
    private String role;
    private String firstname;
    private String lastname;

    public CustomAuthentication(long id, String role, String firstname, String lastname, String username, String password, Collection<? extends GrantedAuthority> authorities){
        super(username, password, authorities);
        this.id = id;
        this.role = role;
        this.firstname = firstname;
        this.lastname = lastname;
    }
}
