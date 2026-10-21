package com.dashboardbuilder.controller;

import com.dashboardbuilder.config.JwtTokenProvider;
import com.dashboardbuilder.dto.LayoutResponse;
import com.dashboardbuilder.repository.UserRepository;
import com.dashboardbuilder.service.LayoutService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DashboardController.class)
@AutoConfigureMockMvc(addFilters = false)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LayoutService layoutService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserRepository userRepository;

    @Test
    void testGetMyDashboard() throws Exception {
        LayoutResponse response = new LayoutResponse(1L, "User Dashboard", "Desc", "[]", "{}", "admin", LocalDateTime.now(), Collections.emptyList());
        when(layoutService.getMyDashboard(any())).thenReturn(response);

        mockMvc.perform(get("/api/dashboard/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("User Dashboard"));
    }
}
