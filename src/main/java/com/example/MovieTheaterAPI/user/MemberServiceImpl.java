package com.example.MovieTheaterAPI.user;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.MovieTheaterAPI.payment.StripeService;
import com.example.MovieTheaterAPI.user.dto.UpgradeAccountDTO;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Subscription;

import java.util.Optional;

@Service
@AllArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final StripeService stripeService;
    
    @Override
    public Member createMember(User user) {
        Member member = new Member();
        Customer customer = stripeService.createCustomer(user.getEmail(), user.getUsername());
        member.setUser(user);
        member.setStripeCustomerId(customer.getId());
        return memberRepository.save(member);
    }



    public Member upgradePremium(long id, UpgradeAccountDTO dto){
        Optional<Member> entity = memberRepository.findByUserId(id);
        Member member = unwrapMember(entity);
        if (member.getMembershipTier() == Tier.Premium) {
            throw new RuntimeException("Already upgraded to Premium account.");
        }
        Subscription subscription;
        try {
            subscription = stripeService.createSubscription(dto, member);
        } catch (RuntimeException e) {
            throw new RuntimeException(e.getMessage());
        }
        member.setSubscriptionId(subscription.getId());
        member.setMembershipTier(Tier.Premium);
        return memberRepository.save(member);
    }

    public Member cancelPremium(long id){
        Optional<Member> entity = memberRepository.findByUserId(id);
        Member member = unwrapMember(entity);
        if (member.getMembershipTier() == Tier.Regular) {
            throw new RuntimeException("Already cancel to Regular account.");
        }
        try {
            stripeService.cancelSubscription(member.getSubscriptionId());
            member.setSubscriptionId(null);
            member.setMembershipTier(Tier.Regular);
            return memberRepository.save(member);
        } catch (RuntimeException e) {
            throw e;
        }
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