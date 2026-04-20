package com.example.channelpartner.service;

import com.example.channelpartner.dto.VisitDTO;
import com.example.channelpartner.model.Customer;
import com.example.channelpartner.model.Project;
import com.example.channelpartner.model.Visit;
import com.example.channelpartner.repository.CustomerRepository;
import com.example.channelpartner.repository.ProjectRepository;
import com.example.channelpartner.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisitService {

    private final VisitRepository visitRepository;
    private final CustomerRepository customerRepository;
    private final ProjectRepository projectRepository;

    public List<VisitDTO> getAllVisits() {
        return visitRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public VisitDTO getVisitById(Long id) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));
        return convertToDTO(visit);
    }

    public List<VisitDTO> getVisitsByCustomerId(Long customerId) {
        return visitRepository.findAll().stream()
                .filter(visit -> visit.getCustomer().getId().equals(customerId))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public long getConfirmedVisitCount() {
        return visitRepository.countConfirmedVisits();
    }

    public VisitDTO createVisit(VisitDTO visitDTO) {
        Customer customer = customerRepository.findById(visitDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Visit visit = convertToEntity(visitDTO);
        visit.setCustomer(customer);
        if (visitDTO.getProjectId() != null) {
            Project project = projectRepository.findById(visitDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            visit.setProject(project);
        }
        Visit savedVisit = visitRepository.save(visit);
        return convertToDTO(savedVisit);
    }

    public VisitDTO updateVisit(Long id, VisitDTO visitDTO) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));
        Customer customer = customerRepository.findById(visitDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        visit.setVisitDate(visitDTO.getVisitDate());
        visit.setStatus(visitDTO.getStatus());
        visit.setNotes(visitDTO.getNotes());
        visit.setFlatType(visitDTO.getFlatType());
        visit.setFlatSize(visitDTO.getFlatSize());
        visit.setVisitStatus(visitDTO.getVisitStatus());
        visit.setCustomer(customer);
        if (visitDTO.getProjectId() != null) {
            Project project = projectRepository.findById(visitDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            visit.setProject(project);
        }
        Visit updatedVisit = visitRepository.save(visit);
        return convertToDTO(updatedVisit);
    }

    public void deleteVisit(Long id) {
        visitRepository.deleteById(id);
    }

    private VisitDTO convertToDTO(Visit visit) {
        VisitDTO dto = new VisitDTO();
        dto.setId(visit.getId());
        dto.setVisitDate(visit.getVisitDate());
        dto.setStatus(visit.getStatus());
        dto.setNotes(visit.getNotes());
        dto.setCustomerId(visit.getCustomer().getId());
        dto.setCustomerName(visit.getCustomer().getFirstName() + " " + visit.getCustomer().getLastName());
        dto.setFlatType(visit.getFlatType());
        dto.setFlatSize(visit.getFlatSize());
        dto.setVisitStatus(visit.getVisitStatus());
        if (visit.getProject() != null) {
            dto.setProjectId(visit.getProject().getId());
            dto.setProjectName(visit.getProject().getName());
        }
        return dto;
    }

    private Visit convertToEntity(VisitDTO dto) {
        Visit visit = new Visit();
        visit.setVisitDate(dto.getVisitDate());
        visit.setStatus(dto.getStatus());
        visit.setNotes(dto.getNotes());
        visit.setFlatType(dto.getFlatType());
        visit.setFlatSize(dto.getFlatSize());
        visit.setVisitStatus(dto.getVisitStatus());
        return visit;
    }
}
