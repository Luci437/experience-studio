package com.dashboardbuilder.controller;

import com.dashboardbuilder.config.JwtTokenProvider;
import com.dashboardbuilder.dto.AssignLayoutRequest;
import com.dashboardbuilder.dto.UserDto;
import com.dashboardbuilder.model.Role;
import com.dashboardbuilder.repository.UserRepository;
import com.dashboardbuilder.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllUsers() throws Exception {
        UserDto userDto = new UserDto(1L, "user", "user@dashboard.com", Role.USER, null, null);
        when(userService.getAllUsers()).thenReturn(List.of(userDto));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].username").value("user"));
    }

    @Test
    void testAssignLayout() throws Exception {
        AssignLayoutRequest request = new AssignLayoutRequest(5L);
        UserDto userDto = new UserDto(1L, "user", "user@dashboard.com", Role.USER, 5L, "My Layout");

        when(userService.assignLayout(1L, 5L)).thenReturn(userDto);

        mockMvc.perform(put("/api/users/1/layout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.assignedLayoutId").value(5))
                .andExpect(jsonPath("$.assignedLayoutName").value("My Layout"));
    }
}
