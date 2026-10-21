package com.dashboardbuilder.dto;

import com.dashboardbuilder.model.Layout;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class LayoutResponse {

    private Long id;
    private String name;
    private String description;
    private String widgets;
    private String breakpoints;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private List<UserDto> assignedUsers = new ArrayList<>();

    public LayoutResponse() {
    }

    public LayoutResponse(Long id, String name, String description, String widgets,
                          String breakpoints, String createdByUsername, LocalDateTime createdAt,
                          List<UserDto> assignedUsers) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.widgets = widgets;
        this.breakpoints = breakpoints;
        this.createdByUsername = createdByUsername;
        this.createdAt = createdAt;
        this.assignedUsers = assignedUsers != null ? assignedUsers : new ArrayList<>();
    }

    public static LayoutResponse fromEntity(Layout layout, List<UserDto> assignedUsers) {
        if (layout == null) {
            return null;
        }
        LayoutResponse response = new LayoutResponse();
        response.setId(layout.getId());
        response.setName(layout.getName());
        response.setDescription(layout.getDescription());
        response.setWidgets(layout.getWidgets());
        response.setBreakpoints(layout.getBreakpoints());
        if (layout.getCreatedBy() != null) {
            response.setCreatedByUsername(layout.getCreatedBy().getUsername());
        }
        response.setCreatedAt(layout.getCreatedAt());
        response.setAssignedUsers(assignedUsers != null ? assignedUsers : new ArrayList<>());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getWidgets() {
        return widgets;
    }

    public void setWidgets(String widgets) {
        this.widgets = widgets;
    }

    public String getBreakpoints() {
        return breakpoints;
    }

    public void setBreakpoints(String breakpoints) {
        this.breakpoints = breakpoints;
    }

    public String getCreatedByUsername() {
        return createdByUsername;
    }

    public void setCreatedByUsername(String createdByUsername) {
        this.createdByUsername = createdByUsername;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<UserDto> getAssignedUsers() {
        return assignedUsers;
    }

    public void setAssignedUsers(List<UserDto> assignedUsers) {
        this.assignedUsers = assignedUsers;
    }
}
