package com.example.channelpartner.service;

import com.example.channelpartner.dto.BuilderDTO;
import com.example.channelpartner.dto.ProjectDTO;
import com.example.channelpartner.model.Builder;
import com.example.channelpartner.model.Project;
import com.example.channelpartner.repository.BuilderRepository;
import com.example.channelpartner.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final BuilderRepository builderRepository;

    public Page<ProjectDTO> getAllProjects(Pageable pageable) {
        return projectRepository.findAll(pageable).map(this::convertToDTO);
    }

    public ProjectDTO getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return convertToDTO(project);
    }

    public ProjectDTO createProject(ProjectDTO projectDTO) {
        Builder builder = builderRepository.findById(projectDTO.getBuilderId())
                .orElseThrow(() -> new RuntimeException("Builder not found"));
        Project project = convertToEntity(projectDTO);
        project.setBuilder(builder);
        Project savedProject = projectRepository.save(project);
        return convertToDTO(savedProject);
    }

    public ProjectDTO updateProject(Long id, ProjectDTO projectDTO) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        Builder builder = builderRepository.findById(projectDTO.getBuilderId())
                .orElseThrow(() -> new RuntimeException("Builder not found"));
        project.setName(projectDTO.getName());
        project.setLocation(projectDTO.getLocation());
        project.setDescription(projectDTO.getDescription());
        project.setMinPrice(projectDTO.getMinPrice());
        project.setMaxPrice(projectDTO.getMaxPrice());
        project.setBuilder(builder);
        Project updatedProject = projectRepository.save(project);
        return convertToDTO(updatedProject);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setLocation(project.getLocation());
        dto.setDescription(project.getDescription());
        dto.setMinPrice(project.getMinPrice());
        dto.setMaxPrice(project.getMaxPrice());
        dto.setBuilderId(project.getBuilder().getId());

        BuilderDTO builderDTO = new BuilderDTO();
        builderDTO.setId(project.getBuilder().getId());
        builderDTO.setFirstName(project.getBuilder().getFirstName());
        builderDTO.setLastName(project.getBuilder().getLastName());
        builderDTO.setEmail(project.getBuilder().getEmail());
        builderDTO.setContactNumber(project.getBuilder().getContactNumber());
        builderDTO.setAddress(project.getBuilder().getAddress());
        builderDTO.setCity(project.getBuilder().getCity());
        builderDTO.setState(project.getBuilder().getState());
        builderDTO.setOffice(project.getBuilder().getOffice());
        builderDTO.setPin(project.getBuilder().getPin());
        builderDTO.setGstNo(project.getBuilder().getGstNo());
        dto.setBuilder(builderDTO);

        return dto;
    }

    private Project convertToEntity(ProjectDTO dto) {
        Project project = new Project();
        project.setName(dto.getName());
        project.setLocation(dto.getLocation());
        project.setDescription(dto.getDescription());
        project.setMinPrice(dto.getMinPrice());
        project.setMaxPrice(dto.getMaxPrice());
        return project;
    }
}
