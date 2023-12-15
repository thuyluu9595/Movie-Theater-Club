package com.example.MovieTheaterAPI.user;

import org.springframework.stereotype.Service;

import com.example.MovieTheaterAPI.user.dto.UpgradeAccountDTO;

public interface MemberService {
    Member createMember(User user);
    Member upgradePremium(long id, UpgradeAccountDTO dto);
    Member cancelPremium(long id);
    Member addPoint(long id, int point);
}
