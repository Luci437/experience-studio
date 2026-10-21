package com.dashboardbuilder.service;

import com.dashboardbuilder.dto.LayoutRequest;
import com.dashboardbuilder.dto.LayoutResponse;
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

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LayoutServiceTest {

    @Mock
    private LayoutRepository layoutRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LayoutService layoutService;

    private User admin;
    private User regularUser;
    private Layout testLayout;

    @BeforeEach
    void setUp() {
        admin = new User();
        admin.setId(1L);
        admin.setUsername("admin");
        admin.setEmail("admin@dashboard.com");
        admin.setRole(Role.ADMIN);

        testLayout = new Layout();
        testLayout.setId(10L);
        testLayout.setName("Main Dashboard");
        testLayout.setDescription("Primary layout");
        testLayout.setWidgets("[{\"i\":\"widget-1\",\"type\":\"chart\"}]");
        testLayout.setBreakpoints("{\"lg\":[{\"i\":\"widget-1\",\"x\":0,\"y\":0,\"w\":6,\"h\":4}]}");
        testLayout.setCreatedBy(admin);
        testLayout.setCreatedAt(LocalDateTime.now());
        testLayout.setUpdatedAt(LocalDateTime.now());

        regularUser = new User();
        regularUser.setId(2L);
        regularUser.setUsername("user");
        regularUser.setEmail("user@dashboard.com");
        regularUser.setRole(Role.USER);
        regularUser.setAssignedLayout(testLayout);
    }

    @Test
    void testGetAllLayouts() {
        when(layoutRepository.findAll()).thenReturn(List.of(testLayout));
        when(userRepository.findByAssignedLayout(testLayout)).thenReturn(List.of(regularUser));

        List<LayoutResponse> responses = layoutService.getAllLayouts();
        assertEquals(1, responses.size());
        assertEquals("Main Dashboard", responses.get(0).getName());
        assertEquals(1, responses.get(0).getAssignedUsers().size());
        assertEquals("user", responses.get(0).getAssignedUsers().get(0).getUsername());
    }

    @Test
    void testGetLayoutById_Success() {
        when(layoutRepository.findById(10L)).thenReturn(Optional.of(testLayout));
        when(userRepository.findByAssignedLayout(testLayout)).thenReturn(List.of(regularUser));

        LayoutResponse response = layoutService.getLayoutById(10L);
        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Main Dashboard", response.getName());
        assertEquals("admin", response.getCreatedByUsername());
    }

    @Test
    void testGetLayoutById_NotFound() {
        when(layoutRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> layoutService.getLayoutById(999L));
    }

    @Test
    void testCreateLayout() {
        LayoutRequest request = new LayoutRequest("New Layout", "New Desc", "[]", "{}");
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(layoutRepository.save(any(Layout.class))).thenAnswer(invocation -> {
            Layout l = invocation.getArgument(0);
            l.setId(11L);
            l.setCreatedAt(LocalDateTime.now());
            return l;
        });

        LayoutResponse response = layoutService.createLayout(request, admin);
        assertNotNull(response);
        assertEquals("New Layout", response.getName());
        assertEquals("New Desc", response.getDescription());
        assertEquals(11L, response.getId());
        assertEquals("admin", response.getCreatedByUsername());
    }

    @Test
    void testUpdateLayout() {
        LayoutRequest request = new LayoutRequest("Updated Layout", "Updated Desc", "[{\"i\":\"w1\"}]", "{}");
        when(layoutRepository.findById(10L)).thenReturn(Optional.of(testLayout));
        when(layoutRepository.save(any(Layout.class))).thenReturn(testLayout);
        when(userRepository.findByAssignedLayout(testLayout)).thenReturn(List.of(regularUser));

        LayoutResponse response = layoutService.updateLayout(10L, request);
        assertNotNull(response);
        assertEquals("Updated Layout", response.getName());
        assertEquals("Updated Desc", response.getDescription());
    }

    @Test
    void testDeleteLayout() {
        when(layoutRepository.findById(10L)).thenReturn(Optional.of(testLayout));
        when(userRepository.findByAssignedLayout(testLayout)).thenReturn(List.of(regularUser));

        layoutService.deleteLayout(10L);

        assertNull(regularUser.getAssignedLayout());
        verify(userRepository).save(regularUser);
        verify(layoutRepository).delete(testLayout);
    }

    @Test
    void testDuplicateLayout() {
        when(layoutRepository.findById(10L)).thenReturn(Optional.of(testLayout));
        when(layoutRepository.save(any(Layout.class))).thenAnswer(invocation -> {
            Layout l = invocation.getArgument(0);
            l.setId(12L);
            l.setCreatedAt(LocalDateTime.now());
            return l;
        });

        LayoutResponse response = layoutService.duplicateLayout(10L);
        assertNotNull(response);
        assertEquals("Copy of Main Dashboard", response.getName());
        assertEquals(testLayout.getWidgets(), response.getWidgets());
        assertEquals(testLayout.getBreakpoints(), response.getBreakpoints());
    }

    @Test
    void testGetMyDashboard_WithAssignedLayout() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(regularUser));
        when(userRepository.findByAssignedLayout(testLayout)).thenReturn(List.of(regularUser));

        LayoutResponse response = layoutService.getMyDashboard(regularUser);
        assertNotNull(response);
        assertEquals("Main Dashboard", response.getName());
    }

    @Test
    void testGetMyDashboard_NoAssignedLayout() {
        regularUser.setAssignedLayout(null);
        when(userRepository.findById(2L)).thenReturn(Optional.of(regularUser));

        LayoutResponse response = layoutService.getMyDashboard(regularUser);
        assertNull(response);
    }
}
