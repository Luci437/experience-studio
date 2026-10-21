package com.dashboardbuilder.service;

import com.dashboardbuilder.dto.LayoutRequest;
import com.dashboardbuilder.dto.LayoutResponse;
import com.dashboardbuilder.dto.UserDto;
import com.dashboardbuilder.exception.ResourceNotFoundException;
import com.dashboardbuilder.model.Layout;
import com.dashboardbuilder.model.User;
import com.dashboardbuilder.repository.LayoutRepository;
import com.dashboardbuilder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LayoutService {

    private final LayoutRepository layoutRepository;
    private final UserRepository userRepository;

    public LayoutService(LayoutRepository layoutRepository, UserRepository userRepository) {
        this.layoutRepository = layoutRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<LayoutResponse> getAllLayouts() {
        List<Layout> layouts = layoutRepository.findAll();
        List<LayoutResponse> responses = new ArrayList<>();
        for (Layout layout : layouts) {
            List<UserDto> assignedUsers = userRepository.findByAssignedLayout(layout)
                    .stream()
                    .map(UserDto::fromEntity)
                    .collect(Collectors.toList());
            responses.add(LayoutResponse.fromEntity(layout, assignedUsers));
        }
        return responses;
    }

    @Transactional(readOnly = true)
    public LayoutResponse getLayoutById(Long id) {
        Layout layout = layoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Layout not found with id: " + id));
        List<UserDto> assignedUsers = userRepository.findByAssignedLayout(layout)
                .stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
        return LayoutResponse.fromEntity(layout, assignedUsers);
    }

    @Transactional
    public LayoutResponse createLayout(LayoutRequest request, User creator) {
        Layout layout = new Layout();
        layout.setName(request.getName());
        layout.setDescription(request.getDescription());
        layout.setWidgets(request.getWidgets());
        layout.setBreakpoints(request.getBreakpoints());

        if (creator != null && creator.getId() != null) {
            User managedCreator = userRepository.findById(creator.getId()).orElse(creator);
            layout.setCreatedBy(managedCreator);
        }

        Layout savedLayout = layoutRepository.save(layout);
        return LayoutResponse.fromEntity(savedLayout, Collections.emptyList());
    }

    @Transactional
    public LayoutResponse updateLayout(Long id, LayoutRequest request) {
        Layout layout = layoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Layout not found with id: " + id));

        layout.setName(request.getName());
        layout.setDescription(request.getDescription());
        layout.setWidgets(request.getWidgets());
        layout.setBreakpoints(request.getBreakpoints());

        Layout updatedLayout = layoutRepository.save(layout);
        List<UserDto> assignedUsers = userRepository.findByAssignedLayout(updatedLayout)
                .stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());

        return LayoutResponse.fromEntity(updatedLayout, assignedUsers);
    }

    @Transactional
    public void deleteLayout(Long id) {
        Layout layout = layoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Layout not found with id: " + id));

        List<User> assignedUsers = userRepository.findByAssignedLayout(layout);
        for (User user : assignedUsers) {
            user.setAssignedLayout(null);
            userRepository.save(user);
        }

        layoutRepository.delete(layout);
    }

    @Transactional
    public LayoutResponse duplicateLayout(Long id) {
        Layout source = layoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Layout not found with id: " + id));

        Layout duplicate = new Layout();
        duplicate.setName("Copy of " + source.getName());
        duplicate.setDescription(source.getDescription());
        duplicate.setWidgets(source.getWidgets());
        duplicate.setBreakpoints(source.getBreakpoints());
        duplicate.setCreatedBy(source.getCreatedBy());

        Layout savedDuplicate = layoutRepository.save(duplicate);
        return LayoutResponse.fromEntity(savedDuplicate, Collections.emptyList());
    }

    @Transactional(readOnly = true)
    public LayoutResponse getMyDashboard(User user) {
        if (user == null || user.getId() == null) {
            return null;
        }

        User freshUser = userRepository.findById(user.getId()).orElse(user);
        Layout assignedLayout = freshUser.getAssignedLayout();

        if (assignedLayout == null) {
            return null;
        }

        List<UserDto> assignedUsers = userRepository.findByAssignedLayout(assignedLayout)
                .stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());

        return LayoutResponse.fromEntity(assignedLayout, assignedUsers);
    }
}
