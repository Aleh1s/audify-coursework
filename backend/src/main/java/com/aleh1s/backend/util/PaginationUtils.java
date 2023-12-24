package com.aleh1s.backend.util;

import org.springframework.data.domain.PageRequest;

public class PaginationUtils {
    public static PageRequest getPageRequest(int page, int limit) {
        return PageRequest.of(
                Math.max(page, 0),
                Math.clamp(limit, 10, 100)
        );
    }
}
