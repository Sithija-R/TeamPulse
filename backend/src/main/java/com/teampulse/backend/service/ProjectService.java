package com.teampulse.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.teampulse.backend.dto.ProjectRequest;
import com.teampulse.backend.dto.ProjectResponse;
import com.teampulse.backend.exception.ResourceNotFoundException;
import com.teampulse.backend.model.Project;
import com.teampulse.backend.repository.ProjectRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectResponse createProject(ProjectRequest request) {

        Project project = Project.builder()
                .name(request.name())
                .description(request.description())
                .active(request.active())
                .build();

        Project savedProject = projectRepository.save(project);

        return toResponse(savedProject);
    }

    public List<ProjectResponse> getAllProjects() {

        return projectRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProjectResponse getProjectById(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        return toResponse(project);
    }

    public ProjectResponse updateProject( Long id, ProjectRequest request) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        project.setName(request.name());
        project.setDescription(request.description());
        project.setActive(request.active());

        Project updatedProject = projectRepository.save(project);

        return toResponse(updatedProject);
    }

    public void deleteProject(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        projectRepository.delete(project);
    }

    private ProjectResponse toResponse(Project project) {

        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.isActive());
    }
}