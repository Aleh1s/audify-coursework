package com.aleh1s.backend.registration;

import com.aleh1s.backend.jwt.JwtUtil;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@AllArgsConstructor
@RequestMapping(path = "/api/v1/registration")
public class RegistrationController {

    private final RegistrationService registrationService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody RegistrationRequest request) {
        registrationService.registerUser(request);
        String jwt = jwtUtil.issueToken(request.email(), "ROLE_USER");
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .build();
    }
}
