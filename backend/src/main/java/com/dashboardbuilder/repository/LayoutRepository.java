package com.dashboardbuilder.repository;

import com.dashboardbuilder.model.Layout;
import com.dashboardbuilder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LayoutRepository extends JpaRepository<Layout, Long> {

    List<Layout> findByCreatedBy(User createdBy);

    List<Layout> findAll();
}
