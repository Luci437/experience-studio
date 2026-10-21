package com.dashboardbuilder.config;

import com.dashboardbuilder.model.Role;
import com.dashboardbuilder.model.User;
import com.dashboardbuilder.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            log.info("No users found in database. Initializing default admin and user accounts...");

            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@dashboard.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            log.info("Created default admin user: admin / admin123 (Role: ADMIN)");

            User user = new User();
            user.setUsername("user");
            user.setEmail("user@dashboard.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(Role.USER);
            userRepository.save(user);
            log.info("Created default regular user: user / user123 (Role: USER)");
        } else {
            log.info("Database already contains {} users. Skipping initial seed.", userRepository.count());
        }
    }
}
