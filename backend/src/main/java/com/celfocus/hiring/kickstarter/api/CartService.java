package com.celfocus.hiring.kickstarter.api;

import com.celfocus.hiring.kickstarter.api.dto.CartItemInput;
import com.celfocus.hiring.kickstarter.db.entity.CartEntity;
import com.celfocus.hiring.kickstarter.db.entity.CartItemEntity;
import com.celfocus.hiring.kickstarter.db.entity.CartItemPK;
import com.celfocus.hiring.kickstarter.db.repo.CartItemRepository;
import com.celfocus.hiring.kickstarter.db.repo.CartRepository;
import com.celfocus.hiring.kickstarter.db.repo.ProductRepository;
import com.celfocus.hiring.kickstarter.domain.Cart;
import com.celfocus.hiring.kickstarter.domain.CartItem;
import com.celfocus.hiring.kickstarter.exception.CartNotFoundException;
import com.celfocus.hiring.kickstarter.exception.ProductNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    private static final Logger log = LoggerFactory.getLogger(CartService.class);


    @Autowired
    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    public void addItemToCart(String username, CartItemInput itemInput) {

        log.info("Adding item to cart: {}", itemInput);
        var cart = cartRepository.findByUserId(username).orElseGet(() -> {
            var newCart = new CartEntity();
            newCart.setUserId(username);
            return cartRepository.save(newCart);
        });

        log.info("Cart: {}", cart);

        cartItemRepository.findById(new CartItemPK(itemInput.itemId(), cart.getId()))
                .ifPresentOrElse((item) -> updateItemQuantity(item, 1), () -> {
                    addNewItemToCart(itemInput, cart);
                });
    }

    private void addNewItemToCart(CartItemInput itemInput, CartEntity cart) {
        var product = productRepository.findBySku(itemInput.itemId())
                .orElseThrow(() -> new ProductNotFoundException(itemInput.itemId()));
        var cartItem = new CartItemEntity();
        cartItem.setQuantity(1);
        cartItem.setItemId(itemInput.itemId());
        cartItem.setCartId(cart.getId());
        cartItem.setCart(cart);
        cartItem.setPrice(product.getPrice());
        cartItemRepository.save(cartItem);
    }

    private void updateItemQuantity(CartItemEntity item, int byCount) {
        log.info("Updating item quantity: {} by {}", item, byCount);
        setItemQuantity(item, item.getQuantity() + byCount);
    }

    private void setItemQuantity(CartItemEntity item, int quantity) {
        log.info("Setting item quantity: {} to {}", item, quantity);
        item.setQuantity(quantity);
        cartItemRepository.save(item);
    }

    public void clearCart(String username) {
        log.info("Clearing cart for user: {}", username);
        cartRepository.deleteByUserId(username);
    }

    public Cart<? extends CartItem> getCart(String username) {
        log.info("Getting cart for user: {}", username);
        return cartRepository.findByUserId(username)
                .map(this::mapToCart)
                .orElseThrow(() -> new CartNotFoundException(username));
    }

    public void removeItemFromCart(String username, String itemId) {
        log.info("Removing item from cart: {}", itemId);
        cartRepository.findByUserId(username)
                .ifPresent(cart -> cartItemRepository.deleteById(new CartItemPK(itemId, cart.getId())));
    }

    private Cart<? extends CartItem> mapToCart(CartEntity cartEntity) {
        Cart<CartItemEntity> cart = new Cart<>();
        cart.setUserId(cartEntity.getUserId());
        cart.setItems(cartEntity.getItems());
        return cart;
    }
}
