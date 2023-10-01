package com.example.MovieTheaterAPI.discount;

import java.util.List;
import java.util.Optional;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DiscountServiceImpl implements DiscountService{

    private final DiscountRepository discountRepository;

    @Override
    public Discount updateTuedayDiscount(float percent) {
        return updateDiscount(DiscountType.TuedaySpecial, percent);
    }

    @Override
    public Discount updateBefore6PMDiscount(float percent) {
        return updateDiscount(DiscountType.Before6PM, percent);
    }

    @Override
    public List<Discount> getAllDiscount() {
        return discountRepository.findAll();
    }

    private Discount updateDiscount(DiscountType type, float percent) {
        Optional<Discount> entity = discountRepository.findById(type);
        Discount discount;
        if (entity.isPresent()) {
            discount = entity.get();
            discount.setPercentDiscount(percent);
        } else {
            discount = new Discount(type, percent);
        }
        return discountRepository.save(discount);
    }
}
