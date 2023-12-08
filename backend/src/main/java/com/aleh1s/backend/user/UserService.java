package com.aleh1s.backend.user;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void saveUserEntity(UserEntity userEntity) {
        userRepository.save(userEntity);
    }

    public boolean isUserEmailExist(String email) {
        return userRepository.findUserByEmail(email).isPresent();
    }
}
