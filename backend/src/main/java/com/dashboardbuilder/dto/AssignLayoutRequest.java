package com.dashboardbuilder.dto;

public class AssignLayoutRequest {

    private Long layoutId;

    public AssignLayoutRequest() {
    }

    public AssignLayoutRequest(Long layoutId) {
        this.layoutId = layoutId;
    }

    public Long getLayoutId() {
        return layoutId;
    }

    public void setLayoutId(Long layoutId) {
        this.layoutId = layoutId;
    }
}
