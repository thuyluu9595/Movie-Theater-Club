package com.example.MovieTheaterAPI.user;

import org.springframework.stereotype.Service;

public interface MemberService {
    Member createMember(User user);
    Member upgradePremium(long id);
    Member cancelPremium(long id);
    Member addPoint(long id, int point);
}
