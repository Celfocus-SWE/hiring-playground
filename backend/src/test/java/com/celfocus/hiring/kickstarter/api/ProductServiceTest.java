package com.celfocus.hiring.kickstarter.api;

import com.celfocus.hiring.kickstarter.db.entity.ProductEntity;
import com.celfocus.hiring.kickstarter.db.repo.ProductRepository;
import com.celfocus.hiring.kickstarter.domain.Product;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest(classes = ProductService.class)
class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @MockBean
    private ProductRepository productRepository;

    @Test
    void getProducts_shouldReturnAllProducts() {
        ProductEntity p = new ProductEntity();
        p.setSku("ABC");
        p.setPrice(BigDecimal.valueOf(10));
        when(productRepository.findAll()).thenReturn(List.of(p));
        List<? extends Product> result = productService.getProducts();
        assertThat(result).hasSize(1);
        assertThat(result.getFirst().getSku()).isEqualTo("ABC");
    }

    @Test
    void getProduct_shouldReturnProduct_whenItExists() {
        ProductEntity p = new ProductEntity();
        p.setSku("ABC");
        p.setPrice(BigDecimal.valueOf(10));
        when(productRepository.findBySku("ABC")).thenReturn(Optional.of(p));
        Optional<? extends Product> result = productService.getProduct("ABC");
        assertThat(result).isPresent();
    }

    @Test
    void getProduct_shouldReturnEmpty_whenItDoesNotExist() {
        when(productRepository.findBySku("XYZ")).thenReturn(Optional.empty());
        Optional<? extends Product> result = productService.getProduct("XYZ");
        assertThat(result).isEmpty();
    }

}
