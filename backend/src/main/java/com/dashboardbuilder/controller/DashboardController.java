package com.dashboardbuilder.controller;

import com.dashboardbuilder.dto.LayoutResponse;
import com.dashboardbuilder.model.User;
import com.dashboardbuilder.service.LayoutService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final LayoutService layoutService;

    public DashboardController(LayoutService layoutService) {
        this.layoutService = layoutService;
    }

    @GetMapping("/my")
    @ResponseStatus(HttpStatus.OK)
    public LayoutResponse getMyDashboard(@AuthenticationPrincipal User currentUser) {
        return layoutService.getMyDashboard(currentUser);
    }
}
