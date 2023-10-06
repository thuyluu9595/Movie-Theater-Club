package com.example.MovieTheaterAPI.user;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;



@Setter
@Getter
@RequiredArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @NonNull
    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @NonNull
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "password", nullable = false)
    private String password;

    @NonNull
    @Column(name = "first_name", nullable = false)
    private String firstname;

    @NonNull
    @Column(name = "last_name", nullable = false)
    private String lastname;

    @NonNull
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @JsonIgnore
    @OneToOne(mappedBy = "user", optional = true)
    private Member member;

    @Override
    public String toString() {
        return "User { \n" +
                    "\tid:'" + id + "',\n" +
                    "\tusername:'" + username + "',\n" +
                    "\tfirst_name:'" + firstname + "',\n" +
                    "\tlast_name:'" + lastname + "',\n" +
                    "\temail:'" + email + "',\n" +
                    "\trole:'" + role.toString() + "'\n}";
    }
}
