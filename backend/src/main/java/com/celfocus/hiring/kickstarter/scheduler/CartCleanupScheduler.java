package com.celfocus.hiring.kickstarter.scheduler;

import com.celfocus.hiring.kickstarter.db.repo.CartRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class CartCleanupScheduler {

    private static final Logger log = LoggerFactory.getLogger(CartCleanupScheduler.class);

    private final CartRepository cartRepository;

    public CartCleanupScheduler(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @Scheduled(fixedRate = 60 * 60 * 1000) // every hour
    public void cleanupInactiveCarts() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(24);
        cartRepository.findAll().stream()
            .filter(cart -> cart.getLastUpdated() != null && cart.getLastUpdated().isBefore(threshold))
            .forEach(cart -> {
                log.info("Deleting expired cart for user {}", cart.getUserId());
                cartRepository.delete(cart);
            });
    }

}
