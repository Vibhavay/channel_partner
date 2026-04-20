package com.example.channelpartner.config;

import com.example.channelpartner.model.User;
import com.example.channelpartner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("========================================");
        System.out.println("Starting Data Initialization");
        System.out.println("========================================");
        
        try {
            // Initialize admin user if it doesn't exist
            if (userRepository.findByUsername("admin").isEmpty()) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setPassword(passwordEncoder.encode("admin123"));
                adminUser.setRole("ADMIN");
                adminUser.setEmail("admin@example.com");
                adminUser.setName("Admin User");
                userRepository.save(adminUser);
                System.out.println("✓ Created admin user with password: admin123");
            } else {
                System.out.println("✓ Admin user already exists");
            }

            // Initialize partner user if it doesn't exist
            if (userRepository.findByUsername("partner").isEmpty()) {
                User partnerUser = new User();
                partnerUser.setUsername("partner");
                partnerUser.setPassword(passwordEncoder.encode("partner123"));
                partnerUser.setRole("PARTNER");
                partnerUser.setEmail("partner@example.com");
                partnerUser.setName("Partner User");
                userRepository.save(partnerUser);
                System.out.println("✓ Created partner user with password: partner123");
            } else {
                System.out.println("✓ Partner user already exists");
            }
            
            System.out.println("========================================");
            System.out.println("Data Initialization Complete");
            System.out.println("========================================");
        } catch (Exception e) {
            System.err.println("✗ Error during data initialization: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

