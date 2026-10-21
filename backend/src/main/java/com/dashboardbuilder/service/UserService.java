package com.dashboardbuilder.service;

import com.dashboardbuilder.dto.UserDto;
import com.dashboardbuilder.exception.BadRequestException;
import com.dashboardbuilder.exception.ResourceNotFoundException;
import com.dashboardbuilder.model.Layout;
import com.dashboardbuilder.model.Role;
import com.dashboardbuilder.model.User;
import com.dashboardbuilder.repository.LayoutRepository;
import com.dashboardbuilder.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final LayoutRepository layoutRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       LayoutRepository layoutRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.layoutRepository = layoutRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto assignLayout(Long userId, Long layoutId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (layoutId == null) {
            user.setAssignedLayout(null);
        } else {
            Layout layout = layoutRepository.findById(layoutId)
                    .orElseThrow(() -> new ResourceNotFoundException("Layout not found with id: " + layoutId));
            user.setAssignedLayout(layout);
        }

        User savedUser = userRepository.save(user);
        return UserDto.fromEntity(savedUser);
    }

    @Transactional
    public User createUser(String username, String email, String password, Role role) {
        if (username == null || username.trim().isEmpty()) {
            throw new BadRequestException("Username cannot be blank");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new BadRequestException("Email cannot be blank");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new BadRequestException("Password cannot be blank");
        }
        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException("Username is already taken: " + username);
        }
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already in use: " + email);
        }

        User user = new User();
        user.setUsername(username.trim());
        user.setEmail(email.trim());
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role != null ? role : Role.USER);
        return userRepository.save(user);
    }
}
