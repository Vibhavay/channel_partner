package com.example.channelpartner.service;

import com.example.channelpartner.dto.CommissionSettingDTO;
import com.example.channelpartner.model.CommissionSetting;
import com.example.channelpartner.model.Project;
import com.example.channelpartner.model.Builder;
import com.example.channelpartner.repository.CommissionSettingRepository;
import com.example.channelpartner.repository.ProjectRepository;
import com.example.channelpartner.repository.BuilderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommissionSettingService {

    private final CommissionSettingRepository commissionSettingRepository;
    private final ProjectRepository projectRepository;
    private final BuilderRepository builderRepository;

    public List<CommissionSettingDTO> getAllCommissionSettings() {
        return commissionSettingRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CommissionSettingDTO getCommissionSettingById(Long id) {
        CommissionSetting setting = commissionSettingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commission setting not found"));
        return convertToDTO(setting);
    }

    public CommissionSettingDTO createCommissionSetting(CommissionSettingDTO dto) {
        CommissionSetting setting = convertToEntity(dto);
        CommissionSetting saved = commissionSettingRepository.save(setting);
        return convertToDTO(saved);
    }

    public CommissionSettingDTO updateCommissionSetting(Long id, CommissionSettingDTO dto) {
        CommissionSetting setting = commissionSettingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commission setting not found"));

        setting.setCommissionPercentage(dto.getCommissionPercentage());
        setting.setNotes(dto.getNotes());

        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            setting.setProject(project);
        }

        if (dto.getBuilderId() != null) {
            Builder builder = builderRepository.findById(dto.getBuilderId())
                    .orElseThrow(() -> new RuntimeException("Builder not found"));
            setting.setBuilder(builder);
        }

        CommissionSetting updated = commissionSettingRepository.save(setting);
        return convertToDTO(updated);
    }

    public void deleteCommissionSetting(Long id) {
        commissionSettingRepository.deleteById(id);
    }

    public CommissionSettingDTO getSettingByProject(Long projectId) {
        return commissionSettingRepository.findByProjectId(projectId)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public CommissionSettingDTO getSettingByBuilder(Long builderId) {
        return commissionSettingRepository.findByBuilderId(builderId)
                .map(this::convertToDTO)
                .orElse(null);
    }

    private CommissionSettingDTO convertToDTO(CommissionSetting setting) {
        CommissionSettingDTO dto = new CommissionSettingDTO();
        dto.setId(setting.getId());
        if (setting.getProject() != null) {
            dto.setProjectId(setting.getProject().getId());
            dto.setProjectName(setting.getProject().getName());
        }
        if (setting.getBuilder() != null) {
            dto.setBuilderId(setting.getBuilder().getId());
            dto.setBuilderName(setting.getBuilder().getFirstName() + " " + setting.getBuilder().getLastName());
        }
        dto.setCommissionPercentage(setting.getCommissionPercentage());
        dto.setNotes(setting.getNotes());
        return dto;
    }

    private CommissionSetting convertToEntity(CommissionSettingDTO dto) {
        CommissionSetting setting = new CommissionSetting();
        setting.setCommissionPercentage(dto.getCommissionPercentage());
        setting.setNotes(dto.getNotes());

        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            setting.setProject(project);
        }

        if (dto.getBuilderId() != null) {
            Builder builder = builderRepository.findById(dto.getBuilderId())
                    .orElseThrow(() -> new RuntimeException("Builder not found"));
            setting.setBuilder(builder);
        }

        return setting;
    }
}
