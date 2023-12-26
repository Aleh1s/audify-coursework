package com.aleh1s.backend.user;

import java.util.List;

public record UserDto(
        Long id,
        String name,
        String email,
        AuthProvider authProvider,
        List<String> roles,
        String username
) {
}
