package com.aleh1s.backend.user;

import com.aleh1s.backend.BaseTestcontainers;
import com.aleh1s.backend.TestHelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest extends BaseTestcontainers {


    @Autowired
    private UserRepository underTest;

    @BeforeEach
    public void setUp() {
        underTest.deleteAll();
    }

    @Test
    void findUserByEmail() {
        // given
        UserEntity userEntity = TestHelper.newUserEntity();
        underTest.save(userEntity);
        // when
        UserEntity userEntityByEmail = underTest.findUserByEmail(userEntity.getEmail()).get();
        // then
        assertEquals(userEntity, userEntityByEmail);
    }

}