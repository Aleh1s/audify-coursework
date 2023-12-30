package com.aleh1s.backend.registration;

import com.aleh1s.backend.TestHelper;
import com.aleh1s.backend.dto.DtoMapper;
import com.aleh1s.backend.user.AuthProvider;
import com.aleh1s.backend.user.UserEntity;
import com.aleh1s.backend.user.UserRole;
import com.aleh1s.backend.user.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @InjectMocks
    private RegistrationService underTest;
    @Mock
    private UserService userService;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Spy
    private DtoMapper dtoMapper;

    @Test
    void registerUser() {
        // given
        RegistrationRequest request = TestHelper.newRegistrationRequest();
        given(userService.isUserEmailExist(request.email())).willReturn(false);
        String encodedPassword = Base64.getEncoder().encodeToString(request.password().getBytes());
        given(passwordEncoder.encode(request.password())).willReturn(encodedPassword);
        ArgumentCaptor<UserEntity> argumentCaptor = ArgumentCaptor.forClass(UserEntity.class);
        // when
        underTest.registerUser(request);
        // then
        verify(userService).saveUserEntity(argumentCaptor.capture());
        UserEntity argumentCaptorValue = argumentCaptor.getValue();
        assertThat(argumentCaptorValue.getPassword()).isEqualTo(encodedPassword);
        assertThat(argumentCaptorValue.getAuthProvider()).isEqualTo(AuthProvider.INTERNAL);
        assertThat(argumentCaptorValue.getName()).isEqualTo(request.name());
        assertThat(argumentCaptorValue.getEmail()).isEqualTo(request.email());
        assertThat(argumentCaptorValue.getRole()).isEqualTo(UserRole.USER);
    }
}