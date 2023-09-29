package com.example.MovieTheaterAPI.user;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    @Override
    public Member createMember(User user) {
        Member member = new Member();
        member.setUser(user);
        return memberRepository.save(member);
    }
    public Member upgradePremium(long id){
        Optional<Member> entity = memberRepository.findByUserId(id);
        Member member = unwrapMember(entity);
        if (member.getMembershipTier() == Tier.Premium) {
            throw new RuntimeException("Already upgraded to Premium account.");
        }
        member.setMembershipTier(Tier.Premium);
        return memberRepository.save(member);
    }

    public Member cancelPremium(long id){
        Optional<Member> entity = memberRepository.findByUserId(id);
        Member member = unwrapMember(entity);
        if (member.getMembershipTier() == Tier.Regular) {
            throw new RuntimeException("Already cancel to Regular account.");
        }
        member.setMembershipTier(Tier.Regular);
        return memberRepository.save(member);
    }

    public Member addPoint(long id, int point) {
        Optional<Member> entity = memberRepository.findByUserId(id);
        Member member = unwrapMember(entity);
        int newPoint = member.getRewardPoint() + point;
        if (newPoint < 0) {
            throw new RuntimeException("Reward point cannot less than 0");
        }
        member.setRewardPoint(newPoint);
        return memberRepository.save(member);
    }

    static Member unwrapMember(Optional<Member> entity) {
        if (entity.isPresent()) return entity.get();
        else throw new MemberNotFoundException();
    }
}

class MemberNotFoundException extends RuntimeException {
    public MemberNotFoundException() {
        super("The user does not exist in our records");
    }
}