package com.teampulse.backend.exception;

public class ResourceOverlappingException extends RuntimeException {

    public ResourceOverlappingException(String message) {
        super(message);
    }
}