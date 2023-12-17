package com.aleh1s.backend.user;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum UserRole {
    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN");

    public final String name;

}
