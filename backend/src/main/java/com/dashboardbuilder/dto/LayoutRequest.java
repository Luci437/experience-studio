package com.dashboardbuilder.dto;

import jakarta.validation.constraints.NotBlank;

public class LayoutRequest {

    @NotBlank(message = "Layout name is required")
    private String name;

    private String description;

    private String widgets;

    private String breakpoints;

    public LayoutRequest() {
    }

    public LayoutRequest(String name, String description, String widgets, String breakpoints) {
        this.name = name;
        this.description = description;
        this.widgets = widgets;
        this.breakpoints = breakpoints;
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
}
