package com.example.channelpartner.controller;

import com.example.channelpartner.model.User;
import com.example.channelpartner.repository.UserRepository;
import com.example.channelpartner.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/init")
@CrossOrigin(origins = "*")
public class InitController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/users")
    public ResponseEntity<String> initializeUsers() {
        try {
            // Delete existing users to ensure clean slate
            userRepository.deleteAll();

            // Create admin user
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole("ADMIN");
            adminUser.setEmail("admin@example.com");
            adminUser.setName("Admin User");
            userRepository.save(adminUser);

            // Create partner user
            User partnerUser = new User();
            partnerUser.setUsername("partner");
            partnerUser.setPassword(passwordEncoder.encode("partner123"));
            partnerUser.setRole("PARTNER");
            partnerUser.setEmail("partner@example.com");
            partnerUser.setName("Partner User");
            userRepository.save(partnerUser);

            return ResponseEntity.ok("✓ Users initialized successfully: admin & partner");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}

