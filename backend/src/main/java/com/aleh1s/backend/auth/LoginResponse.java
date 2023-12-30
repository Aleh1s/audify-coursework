package com.aleh1s.backend.auth;

public record LoginResponse(
        String jwt,
        String username
) {
}
