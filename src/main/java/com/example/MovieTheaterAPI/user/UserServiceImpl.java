package com.example.MovieTheaterAPI.user;

import com.example.MovieTheaterAPI.user.dto.ChangePasswordDTO;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final MemberService memberService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

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
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user = userRepository.save(user);
        memberService.createMember(user);
        return user;
    }

    @Override
    public User createEmployee(User user) {
        user.setRole(Role.Employee);
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User changePassword(User user, ChangePasswordDTO dto) {
        // Todo: generate hashed password
        if (!bCryptPasswordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Unable to change password");
        }
        user.setPassword(bCryptPasswordEncoder.encode(dto.getNewPassword()));
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
