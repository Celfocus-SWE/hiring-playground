package com.celfocus.hiring.kickstarter.api;

import com.celfocus.hiring.kickstarter.db.repo.ProductRepository;
import com.celfocus.hiring.kickstarter.domain.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);


    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<? extends Product> getProducts() {
        log.info("Getting all products");
        return productRepository.findAll();
    }

    public Optional<? extends Product> getProduct(String sku) {
        log.info("Getting product with sku: {}", sku);
        return productRepository.findBySku(sku);
    }
}
