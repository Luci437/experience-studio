package com.dashboardbuilder.controller;

import com.dashboardbuilder.dto.LayoutRequest;
import com.dashboardbuilder.dto.LayoutResponse;
import com.dashboardbuilder.model.User;
import com.dashboardbuilder.service.LayoutService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/layouts")
public class LayoutController {

    private final LayoutService layoutService;

    public LayoutController(LayoutService layoutService) {
        this.layoutService = layoutService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<LayoutResponse> getAllLayouts() {
        return layoutService.getAllLayouts();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public LayoutResponse getLayoutById(@PathVariable Long id) {
        return layoutService.getLayoutById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LayoutResponse createLayout(@Valid @RequestBody LayoutRequest request,
                                       @AuthenticationPrincipal User currentUser) {
        return layoutService.createLayout(request, currentUser);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public LayoutResponse updateLayout(@PathVariable Long id,
                                       @Valid @RequestBody LayoutRequest request) {
        return layoutService.updateLayout(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLayout(@PathVariable Long id) {
        layoutService.deleteLayout(id);
    }

    @PostMapping("/{id}/duplicate")
    @ResponseStatus(HttpStatus.CREATED)
    public LayoutResponse duplicateLayout(@PathVariable Long id) {
        return layoutService.duplicateLayout(id);
    }
}
