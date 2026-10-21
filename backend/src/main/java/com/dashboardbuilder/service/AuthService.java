package com.dashboardbuilder.service;

import com.dashboardbuilder.config.JwtTokenProvider;
import com.dashboardbuilder.dto.LoginRequest;
import com.dashboardbuilder.dto.LoginResponse;
import com.dashboardbuilder.exception.BadRequestException;
import com.dashboardbuilder.model.User;
import com.dashboardbuilder.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider,
                       UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        if (request == null || request.getUsername() == null || request.getPassword() == null) {
            throw new BadRequestException("Username and password must be provided");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        // Ensure we have the latest user entity
        User managedUser = userRepository.findByUsername(user.getUsername())
                .orElse(user);

        String token = jwtTokenProvider.generateToken(managedUser);

        return new LoginResponse(
                token,
                managedUser.getUsername(),
                managedUser.getRole(),
                managedUser.getId()
        );
    }
}
