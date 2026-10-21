package com.dashboardbuilder.controller;

import com.dashboardbuilder.config.JwtTokenProvider;
import com.dashboardbuilder.dto.LayoutRequest;
import com.dashboardbuilder.dto.LayoutResponse;
import com.dashboardbuilder.model.User;
import com.dashboardbuilder.repository.UserRepository;
import com.dashboardbuilder.service.LayoutService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = LayoutController.class)
@AutoConfigureMockMvc(addFilters = false)
class LayoutControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LayoutService layoutService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllLayouts() throws Exception {
        LayoutResponse response = new LayoutResponse(1L, "Default Layout", "Description", "[]", "{}", "admin", LocalDateTime.now(), Collections.emptyList());
        when(layoutService.getAllLayouts()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/layouts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Default Layout"));
    }

    @Test
    void testGetLayoutById() throws Exception {
        LayoutResponse response = new LayoutResponse(1L, "Default Layout", "Description", "[]", "{}", "admin", LocalDateTime.now(), Collections.emptyList());
        when(layoutService.getLayoutById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/layouts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Default Layout"));
    }

    @Test
    void testCreateLayout() throws Exception {
        LayoutRequest request = new LayoutRequest("New Layout", "Desc", "[]", "{}");
        LayoutResponse response = new LayoutResponse(2L, "New Layout", "Desc", "[]", "{}", "admin", LocalDateTime.now(), Collections.emptyList());

        when(layoutService.createLayout(any(LayoutRequest.class), any())).thenReturn(response);

        mockMvc.perform(post("/api/layouts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.name").value("New Layout"));
    }

    @Test
    void testUpdateLayout() throws Exception {
        LayoutRequest request = new LayoutRequest("Updated Layout", "Updated Desc", "[]", "{}");
        LayoutResponse response = new LayoutResponse(1L, "Updated Layout", "Updated Desc", "[]", "{}", "admin", LocalDateTime.now(), Collections.emptyList());

        when(layoutService.updateLayout(eq(1L), any(LayoutRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/layouts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Updated Layout"));
    }

    @Test
    void testDeleteLayout() throws Exception {
        doNothing().when(layoutService).deleteLayout(1L);

        mockMvc.perform(delete("/api/layouts/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDuplicateLayout() throws Exception {
        LayoutResponse response = new LayoutResponse(3L, "Copy of Default Layout", "Description", "[]", "{}", "admin", LocalDateTime.now(), Collections.emptyList());
        when(layoutService.duplicateLayout(1L)).thenReturn(response);

        mockMvc.perform(post("/api/layouts/1/duplicate"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.name").value("Copy of Default Layout"));
    }
}
