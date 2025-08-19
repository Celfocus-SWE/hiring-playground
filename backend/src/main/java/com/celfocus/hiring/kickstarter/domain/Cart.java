package com.celfocus.hiring.kickstarter.domain;

import java.io.Serializable;
import java.util.List;

public class Cart<T extends CartItem> implements Serializable {
    private String userId;
    private List<T> items;


    public List<T> getItems() {
        return items;
    }

    public void setItems(List<T> items) {
        this.items = items;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
