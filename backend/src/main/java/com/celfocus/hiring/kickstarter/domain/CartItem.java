package com.celfocus.hiring.kickstarter.domain;

import java.io.Serializable;
import java.math.BigDecimal;

public class CartItem implements Serializable {
    private String itemId;
    private BigDecimal price;
    private Integer quantity;

    private Long cartId;

    public String getItemId() {
        return itemId;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Long getCartId() {
        return cartId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }
}
