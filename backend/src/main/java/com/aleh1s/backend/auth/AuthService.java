package com.aleh1s.backend.auth;

import com.aleh1s.backend.dto.DtoMapper;
import com.aleh1s.backend.jwt.JwtUtil;
import com.aleh1s.backend.user.UserDto;
import com.aleh1s.backend.user.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final DtoMapper dtoMapper;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.username(),
                loginRequest.password()
        ));

        UserEntity customer = (UserEntity) authenticate.getPrincipal();
        UserDto customerDto = dtoMapper.toUserDto(customer);

        String jwt = jwtUtil.issueToken(
                customerDto.username(),
                customerDto.roles()
        );

        return new LoginResponse(jwt, customerDto.username());
    }
}
