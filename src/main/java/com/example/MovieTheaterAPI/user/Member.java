package com.example.MovieTheaterAPI.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "member")
public class Member{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private long id;

    @JsonIgnore
    @OneToOne(optional = false, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true, nullable = false)
    private User user;

    @NonNull
    @Column(name = "membership_tier", nullable = false)
    @Enumerated(EnumType.STRING)
    private Tier membershipTier = Tier.Regular;

    @Column(name = "reward_point", nullable = false)
    private int rewardPoint = 0;

    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;

    @Column(name = "subscription_id")
    private String subscriptionId;
}

