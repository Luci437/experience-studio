package com.dashboardbuilder.dto;

import com.dashboardbuilder.model.Role;
import com.dashboardbuilder.model.User;

public class UserDto {

    private Long id;
    private String username;
    private String email;
    private Role role;
    private Long assignedLayoutId;
    private String assignedLayoutName;

    public UserDto() {
    }

    public UserDto(Long id, String username, String email, Role role, Long assignedLayoutId, String assignedLayoutName) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.assignedLayoutId = assignedLayoutId;
        this.assignedLayoutName = assignedLayoutName;
    }

    public static UserDto fromEntity(User user) {
        if (user == null) {
            return null;
        }
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        if (user.getAssignedLayout() != null) {
            dto.setAssignedLayoutId(user.getAssignedLayout().getId());
            dto.setAssignedLayoutName(user.getAssignedLayout().getName());
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Long getAssignedLayoutId() {
        return assignedLayoutId;
    }

    public void setAssignedLayoutId(Long assignedLayoutId) {
        this.assignedLayoutId = assignedLayoutId;
    }

    public String getAssignedLayoutName() {
        return assignedLayoutName;
    }

    public void setAssignedLayoutName(String assignedLayoutName) {
        this.assignedLayoutName = assignedLayoutName;
    }
}
