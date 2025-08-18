package com.celfocus.hiring.kickstarter.exception;

public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(String productId) {
        super("Product not found for productId: " + productId);
    }

}
