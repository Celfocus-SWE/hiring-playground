package com.celfocus.hiring.kickstarter.api;

import com.celfocus.hiring.kickstarter.api.dto.CartItemInput;
import com.celfocus.hiring.kickstarter.api.dto.CartItemResponse;
import com.celfocus.hiring.kickstarter.api.dto.CartResponse;
import com.celfocus.hiring.kickstarter.domain.Cart;
import com.celfocus.hiring.kickstarter.domain.CartItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping(CartAPIController.CARTS_PATH)
public class CartAPIController implements CartAPI {

    static final String CARTS_PATH = "/api/v1/carts";

    private final CartService cartService;
    private final ProductService productService;

    private static final Logger log = LoggerFactory.getLogger(CartAPIController.class);

    @Autowired
    public CartAPIController(CartService cartService, ProductService productService) {
        this.cartService = cartService;
        this.productService = productService;
    }

    @GetMapping("/")
    public String index() {
        return "Greetings from Celfocus!";
    }

    @Override
    public ResponseEntity<Void> addItemToCart(String username, CartItemInput itemInput) {
        log.info("Adding item to cart: {}", itemInput);
        cartService.addItemToCart(username, itemInput);
        return ResponseEntity.status(201).build();
    }

    @Override
    public ResponseEntity<Void> clearCart(String username) {
        log.info("Clearing cart for user: {}", username);
        cartService.clearCart(username);
        return ResponseEntity.status(204).build();
    }

    @Override
    public ResponseEntity<CartResponse> getCart(String username) {
        log.info("Getting cart for user: {}", username);
        var cart = cartService.getCart(username);
        return ResponseEntity.ok(mapToCartResponse(cart));
    }

    @Override
    public ResponseEntity<Void> removeItemFromCart(String username, String itemId) {
        log.info("Removing item from cart: {}", itemId);
        cartService.removeItemFromCart(username, itemId);
        return ResponseEntity.status(204).build();
    }

    private CartResponse mapToCartResponse(Cart<? extends CartItem> cart) {
        return new CartResponse(cart.getItems().stream().map(this::mapToCartItemResponse).collect(Collectors.toList()));
    }

    private CartItemResponse mapToCartItemResponse(CartItem item) {
        var product = productService.getProduct(item.getItemId());
        return new CartItemResponse(item.getItemId(), item.getQuantity(), product.orElseThrow().getPrice(), product.orElseThrow().getName());
    }
}
