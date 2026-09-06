package com.teampulse.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teampulse.backend.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}