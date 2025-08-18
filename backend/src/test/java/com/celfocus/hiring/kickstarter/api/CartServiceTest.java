package com.celfocus.hiring.kickstarter.api;

import com.celfocus.hiring.kickstarter.api.dto.CartItemInput;
import com.celfocus.hiring.kickstarter.db.entity.CartEntity;
import com.celfocus.hiring.kickstarter.db.entity.CartItemEntity;
import com.celfocus.hiring.kickstarter.db.entity.ProductEntity;
import com.celfocus.hiring.kickstarter.db.repo.CartItemRepository;
import com.celfocus.hiring.kickstarter.db.repo.CartRepository;
import com.celfocus.hiring.kickstarter.db.repo.ProductRepository;
import com.celfocus.hiring.kickstarter.exception.CartNotFoundException;
import com.celfocus.hiring.kickstarter.exception.ProductNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@SpringBootTest(classes = CartService.class)
@ActiveProfiles("test")
class CartServiceTest {

    @Autowired
    private CartService cartService;

    @MockBean
    private CartRepository cartRepository;

    @MockBean
    private CartItemRepository cartItemRepository;

    @MockBean
    private ProductRepository productRepository;

    @Test
    void getCart_shouldThrowCartNotFoundException_whenCartDoesNotExist() {
        String username = "user1";
        when(cartRepository.findByUserId(username)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> cartService.getCart(username))
            .isInstanceOf(CartNotFoundException.class);
    }

    @Test
    void addItemToCart_shouldThrowProductNotFoundException_whenSkuDoesNotExist() {
        String username = "user1";
        String sku = "DOES_NOT_EXIST";
        CartItemInput input = new CartItemInput(sku);
        CartEntity cartEntity = new CartEntity();
        cartEntity.setUserId(username);
        when(cartRepository.findByUserId(username)).thenReturn(Optional.of(cartEntity));
        when(productRepository.findBySku(sku)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> cartService.addItemToCart(username, input))
            .isInstanceOf(ProductNotFoundException.class);
    }

    @Test
    void addItemToCart_shouldAddItemSuccessfully_whenSkuExists() {
        String username = "user1";
        String sku = "SKU-123";
        CartItemInput input = new CartItemInput(sku);
        CartEntity cartEntity = new CartEntity();
        cartEntity.setId(1L);
        cartEntity.setUserId(username);
        ProductEntity productEntity = new ProductEntity();
        productEntity.setSku(sku);
        productEntity.setPrice(BigDecimal.valueOf(9.99));
        when(cartRepository.findByUserId(username)).thenReturn(Optional.of(cartEntity));
        when(productRepository.findBySku(sku)).thenReturn(Optional.of(productEntity));
        cartService.addItemToCart(username, input);
        verify(cartItemRepository, times(1)).save(any(CartItemEntity.class));
    }

}