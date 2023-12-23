package com.aleh1s.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@ControllerAdvice
public class DefaultExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(DefaultExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleException(MethodArgumentNotValidException e,
                                                    HttpServletRequest request) {
        String message = e.getBindingResult().getAllErrors().stream()
                .map((error) -> "%s - %s".formatted(
                        ((FieldError) error).getField(),
                        error.getDefaultMessage()
                )).collect(Collectors.joining(";"));
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                message,
                BAD_REQUEST.value(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(BAD_REQUEST).body(apiError);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleException(ResourceNotFoundException e,
                                                    HttpServletRequest request) {
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                NOT_FOUND.value(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(NOT_FOUND).body(apiError);
    }

    @ExceptionHandler(InvalidResourceException.class)
    public ResponseEntity<ApiError> handleException(InvalidResourceException e,
                                                    HttpServletRequest request) {
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                BAD_REQUEST.value(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(BAD_REQUEST).body(apiError);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiError> handleException(DuplicateResourceException e,
                                                    HttpServletRequest request) {
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                CONFLICT.value(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(CONFLICT).body(apiError);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(Exception e,
                                                    HttpServletRequest request) {
        log.error(e.getMessage(), e);
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(apiError);
    }
}
