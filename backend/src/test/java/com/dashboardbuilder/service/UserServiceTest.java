package com.dashboardbuilder.service;

import com.dashboardbuilder.dto.UserDto;
import com.dashboardbuilder.exception.BadRequestException;
import com.dashboardbuilder.exception.ResourceNotFoundException;
import com.dashboardbuilder.model.Layout;
import com.dashboardbuilder.model.Role;
import com.dashboardbuilder.model.User;
import com.dashboardbuilder.repository.LayoutRepository;
import com.dashboardbuilder.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private LayoutRepository layoutRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;
    private Layout layout;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(5L);
        user.setUsername("john");
        user.setEmail("john@example.com");
        user.setRole(Role.USER);

        layout = new Layout();
        layout.setId(20L);
        layout.setName("Marketing Dashboard");
    }

    @Test
    void testGetAllUsers() {
        when(userRepository.findAll()).thenReturn(List.of(user));

        List<UserDto> users = userService.getAllUsers();
        assertEquals(1, users.size());
        assertEquals("john", users.get(0).getUsername());
    }

    @Test
    void testGetUserById_Success() {
        when(userRepository.findById(5L)).thenReturn(Optional.of(user));

        UserDto userDto = userService.getUserById(5L);
        assertNotNull(userDto);
        assertEquals("john", userDto.getUsername());
    }

    @Test
    void testGetUserById_NotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(99L));
    }

    @Test
    void testAssignLayout() {
        when(userRepository.findById(5L)).thenReturn(Optional.of(user));
        when(layoutRepository.findById(20L)).thenReturn(Optional.of(layout));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDto result = userService.assignLayout(5L, 20L);
        assertNotNull(result);
        assertEquals(20L, result.getAssignedLayoutId());
        assertEquals("Marketing Dashboard", result.getAssignedLayoutName());
    }

    @Test
    void testUnassignLayout() {
        user.setAssignedLayout(layout);
        when(userRepository.findById(5L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDto result = userService.assignLayout(5L, null);
        assertNotNull(result);
        assertNull(result.getAssignedLayoutId());
        assertNull(result.getAssignedLayoutName());
    }

    @Test
    void testCreateUser_DuplicateUsername() {
        when(userRepository.existsByUsername("john")).thenReturn(true);

        assertThrows(BadRequestException.class, () ->
                userService.createUser("john", "john2@example.com", "pass123", Role.USER)
        );
    }
}
