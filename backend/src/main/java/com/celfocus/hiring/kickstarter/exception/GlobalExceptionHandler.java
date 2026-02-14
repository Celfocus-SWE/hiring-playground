package com.celfocus.hiring.kickstarter.exception;

import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(EntityNotFoundException ex, WebRequest request) {
        log.error("Entity not found: {}", ex.getMessage(), ex);
        return buildResponseEntity(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(),
            request.getDescription(false).replace("uri=", ""));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequestException(IllegalArgumentException ex, WebRequest request) {
        log.error("Bad request: {}", ex.getMessage(), ex);
        return buildResponseEntity(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(),
            request.getDescription(false).replace("uri=", ""));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, WebRequest request) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        return buildResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error",
            "An unexpected error occurred",
            request.getDescription(false).replace("uri=", ""));
    }

    @ExceptionHandler(CartNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCartNotFound(CartNotFoundException ex, WebRequest request) {
        log.error("Cart not found: {}", ex.getMessage(), ex);
        return buildResponseEntity(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(),
            request.getDescription(false).replace("uri=", ""));
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleProductNotFound(ProductNotFoundException ex, WebRequest request) {
        log.error("Product not found: {}", ex.getMessage(), ex);
        return buildResponseEntity(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(),
            request.getDescription(false).replace("uri=", ""));
    }

    @ExceptionHandler(InvalidCartOperationException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCartOperation(InvalidCartOperationException ex,
        WebRequest request) {
        log.error("Invalid cart operation: {}", ex.getMessage(), ex);
        return buildResponseEntity(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(),
            request.getDescription(false).replace("uri=", ""));
    }

    private ResponseEntity<ErrorResponse> buildResponseEntity(HttpStatus status,
        String error,
        String message,
        String path) {
        ErrorResponse response = new ErrorResponse(
            LocalDateTime.now(),
            status.value(),
            error,
            message,
            path
        );
        return new ResponseEntity<>(response, status);
    }

}