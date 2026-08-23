package com.example.employeemanagement.config;

import com.example.employeemanagement.model.User;
import com.example.employeemanagement.repository.UserRepository;
import com.example.employeemanagement.webauthn.UserHandles;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Seeds a known admin account for local Raspberry Pi and development installs. */
@Component
public class AdminUserSeeder implements CommandLineRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public AdminUserSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    User admin = userRepository.findByUsername("admin").orElseGet(User::new);
    admin.setUsername("admin");
    admin.setPassword(passwordEncoder.encode("admin123"));
    admin.setRole("ADMIN");
    admin.setStatus("APPROVED");
    if (admin.getUserHandle() == null || admin.getUserHandle().isBlank()) {
      admin.setUserHandle(UserHandles.generate());
    }
    userRepository.save(admin);
  }
}
