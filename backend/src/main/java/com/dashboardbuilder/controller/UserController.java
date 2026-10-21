package com.dashboardbuilder.controller;

import com.dashboardbuilder.dto.AssignLayoutRequest;
import com.dashboardbuilder.dto.UserDto;
import com.dashboardbuilder.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{userId}/layout")
    @ResponseStatus(HttpStatus.OK)
    public UserDto assignLayout(@PathVariable Long userId,
                                @RequestBody AssignLayoutRequest request) {
        Long layoutId = request != null ? request.getLayoutId() : null;
        return userService.assignLayout(userId, layoutId);
    }
}
