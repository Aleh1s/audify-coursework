package com.aleh1s.backend.user;

import com.aleh1s.backend.TestHelper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserService underTest;
    @Mock
    private UserRepository userRepository;

    @Test
    void saveUser() {
        // given
        UserEntity userEntity = TestHelper.newUserEntity();
        ArgumentCaptor<UserEntity> argumentCaptor = ArgumentCaptor.forClass(UserEntity.class);
        // when
        underTest.saveUserEntity(userEntity);
        // then
        verify(userRepository, times(1)).save(argumentCaptor.capture());
        assertEquals(userEntity, argumentCaptor.getValue());
    }

    @Test
    void isUserEmailExist() {
        // given
        UserEntity userEntity = TestHelper.newUserEntity();
        String email = userEntity.getEmail();
        ArgumentCaptor<String> argumentCaptor = ArgumentCaptor.forClass(String.class);
        given(userRepository.findUserByEmail(email)).willReturn(Optional.of(userEntity));
        // when
        boolean isUserEmailExist = underTest.isUserEmailExist(email);
        // then
        verify(userRepository, times(1)).findUserByEmail(argumentCaptor.capture());
        assertEquals(email, argumentCaptor.getValue());
        assertTrue(isUserEmailExist);
    }
}