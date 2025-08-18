package com.celfocus.hiring.kickstarter.db.entity;

import com.celfocus.hiring.kickstarter.domain.Cart;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.NaturalId;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "TB_CART", uniqueConstraints = @UniqueConstraint(name = "UK_CART_TO_USER", columnNames = "USER_ID"))
public class CartEntity extends Cart<CartItemEntity> implements Serializable {

    private Long id;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    @NaturalId
    @Column(name = "USER_ID")
    @Override
    public String getUserId() {
        return super.getUserId();
    }

    @OneToMany(mappedBy = "cart", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Override
    public List<CartItemEntity> getItems() {
        return super.getItems();
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

}