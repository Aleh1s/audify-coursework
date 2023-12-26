package com.aleh1s.backend.auth;

public record LoginRequest(
        String username,
        String password
) {
}
