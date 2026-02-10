package com.celfocus.hiring.kickstarter.exception;

public class CartNotFoundException extends RuntimeException {

    public CartNotFoundException(String userId) {
        super("Cart not found for userId: " + userId);
    }

}
