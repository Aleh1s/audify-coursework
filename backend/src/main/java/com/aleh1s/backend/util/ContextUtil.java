package com.aleh1s.backend.util;

import com.aleh1s.backend.user.UserEntity;
import org.springframework.security.core.context.SecurityContextHolder;

public class ContextUtil {

    public static UserEntity getPrincipal() {
        return (UserEntity) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }
}
