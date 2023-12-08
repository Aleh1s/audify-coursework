package com.aleh1s.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@ControllerAdvice
public class DefaultExceptionHandler {

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

}
