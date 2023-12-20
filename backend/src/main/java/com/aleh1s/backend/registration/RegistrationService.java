package com.aleh1s.backend.registration;

import com.aleh1s.backend.exception.DuplicateResourceException;
import com.aleh1s.backend.user.AuthProvider;
import com.aleh1s.backend.user.UserEntity;
import com.aleh1s.backend.user.UserService;
import com.aleh1s.backend.dto.DtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RegistrationService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final DtoMapper dtoMapper;

    @Transactional
    public void registerUser(RegistrationRequest request) {
        requireUniqueEmail(request.email());
        UserEntity newUserEntity = dtoMapper.toUser(request);
        newUserEntity.setPassword(passwordEncoder.encode(request.password()));
        newUserEntity.setAuthProvider(AuthProvider.INTERNAL);
        userService.saveUserEntity(newUserEntity);
    }

    private void requireUniqueEmail(String email) {
        if (userService.isUserEmailExist(email)) {
            throw new DuplicateResourceException("User with email: %s already exists".formatted(email));
        }
    }
}
