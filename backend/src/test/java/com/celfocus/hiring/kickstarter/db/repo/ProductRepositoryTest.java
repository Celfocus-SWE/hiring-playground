package com.celfocus.hiring.kickstarter.db.repo;

import com.celfocus.hiring.kickstarter.db.entity.ProductEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


class ProductRepositoryTest {

    @Test
    void testFindProductBySku() {
        // Given
        ProductRepository productRepository = ProductRepository.create(new ObjectMapper());
        // When
        Optional<ProductEntity> product = productRepository.findBySku("SKUTEST2");
        // Then
        assertTrue(product.isPresent());
        assertEquals("Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.", product.get().getDescription());
    }
} 