package com.aleh1s.backend.user;

import com.aleh1s.backend.exception.ForbiddenException;
import com.aleh1s.backend.exception.ResourceNotFoundException;
import com.aleh1s.backend.util.ContextUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void saveUserEntity(UserEntity userEntity) {
        userRepository.save(userEntity);
    }

    public boolean isUserEmailExist(String email) {
        return userRepository.findUserByEmail(email).isPresent();
    }

    public UserEntity getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("user with id %d not found".formatted(userId)));
    }

    public UserEntity getCurrentUser() {
        Long currentUserId = ContextUtil.getPrincipal().getId();
        return getUserById(currentUserId);
    }

    public UserEntity getUserByEmail(String email) {
        return userRepository.findUserByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User with email %s not found".formatted(email)));
    }


    @Transactional
    public void blockUserByEmail(String email) {
        UserEntity user = getUserByEmail(email);
        if (user.getRole().equals(UserRole.ADMIN)) {
            throw new ForbiddenException("User with email %s is admin, you cannot block him".formatted(email));
        }
        user.setBlocked(true);
    }

    @Transactional
    public void unblockUserByEmail(String email) {
        UserEntity user = getUserByEmail(email);
        user.setBlocked(false);
    }

    @Transactional
    public void changePassword(String email, String password) {
        UserEntity user = getUserByEmail(email);
        if (user.getRole().equals(UserRole.ADMIN)) {
            throw new ForbiddenException("User with email %s is admin, you cannot change his password");
        }
        if (!user.getAuthProvider().equals(AuthProvider.INTERNAL)) {
            throw new ForbiddenException("User with email %s used third party auth, you cannot change his password");
        }
        user.setPassword(passwordEncoder.encode(password));
    }

    @Transactional
    public void changePassword(String password) {
        UserEntity user = getCurrentUser();
        if (!user.getAuthProvider().equals(AuthProvider.INTERNAL)) {
            throw new ForbiddenException("You use third party auth, you cannot change password");
        }
        user.setPassword(passwordEncoder.encode(password));
    }

    @Transactional
    public void changeName(String name) {
        UserEntity user = getCurrentUser();
        if (!user.getAuthProvider().equals(AuthProvider.INTERNAL)) {
            throw new ForbiddenException("You use third party auth, you cannot change name");
        }
        user.setName(name);
    }
}
