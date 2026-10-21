package com.dashboardbuilder.service;

import com.dashboardbuilder.config.JwtTokenProvider;
import com.dashboardbuilder.dto.LoginRequest;
import com.dashboardbuilder.dto.LoginResponse;
import com.dashboardbuilder.exception.BadRequestException;
import com.dashboardbuilder.model.Role;
import com.dashboardbuilder.model.User;
import com.dashboardbuilder.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("admin");
        user.setPassword("encodedPassword");
        user.setEmail("admin@dashboard.com");
        user.setRole(Role.ADMIN);
    }

    @Test
    void testLogin_Success() {
        LoginRequest request = new LoginRequest("admin", "admin123");
        Authentication authentication = mock(Authentication.class);

        when(authentication.getPrincipal()).thenReturn(user);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));
        when(jwtTokenProvider.generateToken(user)).thenReturn("mocked.jwt.token");

        LoginResponse response = authService.login(request);
        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getToken());
        assertEquals("admin", response.getUsername());
        assertEquals(Role.ADMIN, response.getRole());
        assertEquals(1L, response.getUserId());
    }

    @Test
    void testLogin_BadCredentials() {
        LoginRequest request = new LoginRequest("admin", "wrongpassword");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }

    @Test
    void testLogin_NullRequest() {
        assertThrows(BadRequestException.class, () -> authService.login(null));
    }
}
