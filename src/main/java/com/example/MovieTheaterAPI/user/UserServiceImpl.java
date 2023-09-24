package com.example.MovieTheaterAPI.user;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private MemberService memberService;

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public User getUser(long id) {
        Optional<User> user = userRepository.findById(id);
        return unwrapUser(user);
    }

    @Override
    public User getUser(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return unwrapUser(user);
    }

    @Override
    public User createMember(User user) {
        user.setRole(Role.Member);
        user = userRepository.save(user);
        Member member = memberService.createMember(user);
        return user;
    }

    @Override
    public User createEmployee(User user) {
        user.setRole(Role.Employee);
        user = userRepository.save(user);
        return user;
    }

    @Override
    public User changePassword(User user, String password) {
        // Todo: generate hashed password
        user.setPassword(password);
        return userRepository.save(user);
    }

    @Override
    public User updateInfo(User user, String firstname, String lastname, String email) {
        if (firstname != null) user.setFirstname(firstname);
        if (lastname != null) user.setLastname(lastname);
        if (email != null) user.setEmail(email);
        return userRepository.save(user);
    }


    static User unwrapUser(Optional<User> entity) {
        if (entity.isPresent()) return entity.get();
        else throw new UserNotFoundException();
    }
}

class UserNotFoundException extends RuntimeException {
    public UserNotFoundException() {
        super("The user does not exist in our records");
    }

}
