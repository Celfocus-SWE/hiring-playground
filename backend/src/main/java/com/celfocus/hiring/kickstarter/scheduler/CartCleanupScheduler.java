package com.celfocus.hiring.kickstarter.scheduler;

import com.celfocus.hiring.kickstarter.db.repo.CartRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class CartCleanupScheduler {

    private static final Logger log = LoggerFactory.getLogger(CartCleanupScheduler.class);

    private final CartRepository cartRepository;

    @Value("${cart.expiration.hours:24}")
    private int expirationHours;

    public CartCleanupScheduler(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @Scheduled(fixedRateString = "${cart.cleanup.rate.ms:3600000}") // default 1h
    public void cleanupInactiveCarts() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(expirationHours);
        log.debug("Running cart cleanup job (threshold={})", threshold);
        cartRepository.findAll().stream()
            .filter(cart -> cart.getLastUpdated() != null && cart.getLastUpdated().isBefore(threshold))
            .forEach(cart -> {
                log.info("Deleting expired cart for user {}", cart.getUserId());
                cartRepository.delete(cart);
            });
    }

}
