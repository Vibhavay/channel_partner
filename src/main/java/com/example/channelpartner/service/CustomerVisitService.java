package com.example.channelpartner.service;

import com.example.channelpartner.dto.CustomerVisitDTO;
import com.example.channelpartner.model.Customer;
import com.example.channelpartner.model.CustomerVisit;
import com.example.channelpartner.model.Project;
import com.example.channelpartner.repository.CustomerRepository;
import com.example.channelpartner.repository.CustomerVisitRepository;
import com.example.channelpartner.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerVisitService {

    private final CustomerVisitRepository customerVisitRepository;
    private final CustomerRepository customerRepository;
    private final ProjectRepository projectRepository;

    // ==================== GET Operations ====================

    public Page<CustomerVisitDTO> getAllVisits(Pageable pageable) {
        return customerVisitRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    public CustomerVisitDTO getVisitById(Long id) {
        CustomerVisit visit = customerVisitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));
        return convertToDTO(visit);
    }

    public Page<CustomerVisitDTO> getVisitsByCustomerId(Long customerId, Pageable pageable) {
        return customerVisitRepository.findByCustomerIdOrderByVisitDateDesc(customerId, pageable)
                .map(this::convertToDTO);
    }

    public List<CustomerVisitDTO> getVisitHistoryByCustomerId(Long customerId) {
        return customerVisitRepository.findByCustomerIdOrderByVisitDateDesc(customerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CustomerVisitDTO getLastVisitByCustomerId(Long customerId) {
        CustomerVisit lastVisit = customerVisitRepository.findLastVisitByCustomerId(customerId);
        return lastVisit != null ? convertToDTO(lastVisit) : null;
    }

    public Page<CustomerVisitDTO> getVisitsByStatus(String status, Pageable pageable) {
        return customerVisitRepository.findByStatusOrderByVisitDateDesc(status, pageable)
                .map(this::convertToDTO);
    }

    public Page<CustomerVisitDTO> getVisitsByType(String visitType, Pageable pageable) {
        return customerVisitRepository.findByVisitTypeOrderByVisitDateDesc(visitType, pageable)
                .map(this::convertToDTO);
    }

    public Page<CustomerVisitDTO> getVisitsByCreatedBy(String createdBy, Pageable pageable) {
        return customerVisitRepository.findByCreatedByOrderByVisitDateDesc(createdBy, pageable)
                .map(this::convertToDTO);
    }

    public Page<CustomerVisitDTO> getVisitsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return customerVisitRepository.findByDateRange(startDate, endDate, pageable)
                .map(this::convertToDTO);
    }

    public Page<CustomerVisitDTO> getUpcomingVisits(Pageable pageable) {
        return customerVisitRepository.findUpcomingVisits(pageable)
                .map(this::convertToDTO);
    }

    // ==================== CREATE Operation ====================

    public CustomerVisitDTO createVisit(CustomerVisitDTO visitDTO) {
        Customer customer = customerRepository.findById(visitDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        CustomerVisit visit = convertToEntity(visitDTO);
        visit.setCustomer(customer);

        if (visitDTO.getProjectId() != null) {
            Project project = projectRepository.findById(visitDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            visit.setProject(project);
        }

        CustomerVisit savedVisit = customerVisitRepository.save(visit);
        return convertToDTO(savedVisit);
    }

    // ==================== UPDATE Operation ====================

    public CustomerVisitDTO updateVisit(Long id, CustomerVisitDTO visitDTO) {
        CustomerVisit visit = customerVisitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        Customer customer = customerRepository.findById(visitDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        visit.setVisitDate(visitDTO.getVisitDate());
        visit.setVisitType(visitDTO.getVisitType());
        visit.setStatus(visitDTO.getStatus());
        visit.setNotes(visitDTO.getNotes());
        visit.setFlatType(visitDTO.getFlatType());
        visit.setFlatSize(visitDTO.getFlatSize());
        visit.setVisitStatus(visitDTO.getVisitStatus());
        visit.setCustomer(customer);
        visit.setCreatedBy(visitDTO.getCreatedBy());

        if (visitDTO.getProjectId() != null) {
            Project project = projectRepository.findById(visitDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            visit.setProject(project);
        }

        CustomerVisit updatedVisit = customerVisitRepository.save(visit);
        return convertToDTO(updatedVisit);
    }

    // ==================== DELETE Operation ====================

    public void deleteVisit(Long id) {
        customerVisitRepository.deleteById(id);
    }

    // ==================== Statistics Operations ====================

    public long getConfirmedVisitCount() {
        return customerVisitRepository.countConfirmedVisits();
    }

    public long getCompletedVisitCount() {
        return customerVisitRepository.countCompletedVisits();
    }

    public long getScheduledVisitCount() {
        return customerVisitRepository.countScheduledVisits();
    }

    public long getVisitCountByStatus(String status) {
        return customerVisitRepository.countByStatus(status);
    }

    public long getVisitCountByType(String visitType) {
        return customerVisitRepository.countByVisitType(visitType);
    }

    public long getVisitCountByCustomer(Long customerId) {
        return customerVisitRepository.countByCustomerId(customerId);
    }

    // ==================== DTO Conversion Methods ====================

    public CustomerVisitDTO convertToDTO(CustomerVisit visit) {
        CustomerVisitDTO dto = new CustomerVisitDTO();
        dto.setId(visit.getId());
        dto.setCustomerId(visit.getCustomer().getId());
        dto.setCustomerName(visit.getCustomer().getFirstName() + " " + visit.getCustomer().getLastName());
        dto.setCustomerEmail(visit.getCustomer().getEmail());
        dto.setCustomerPhone(visit.getCustomer().getPhone());
        dto.setVisitDate(visit.getVisitDate());
        dto.setVisitType(visit.getVisitType());
        dto.setStatus(visit.getStatus());
        dto.setNotes(visit.getNotes());
        dto.setFlatType(visit.getFlatType());
        dto.setFlatSize(visit.getFlatSize());
        dto.setVisitStatus(visit.getVisitStatus());
        dto.setCreatedBy(visit.getCreatedBy());
        dto.setCreatedAt(visit.getCreatedAt());
        dto.setUpdatedAt(visit.getUpdatedAt());
        if (visit.getProject() != null) {
            dto.setProjectId(visit.getProject().getId());
            dto.setProjectName(visit.getProject().getName());
        }
        return dto;
    }

    private CustomerVisit convertToEntity(CustomerVisitDTO dto) {
        CustomerVisit visit = new CustomerVisit();
        visit.setVisitDate(dto.getVisitDate() != null ? dto.getVisitDate() : LocalDateTime.now());
        visit.setVisitType(dto.getVisitType());
        visit.setStatus(dto.getStatus());
        visit.setNotes(dto.getNotes());
        visit.setFlatType(dto.getFlatType());
        visit.setFlatSize(dto.getFlatSize());
        visit.setVisitStatus(dto.getVisitStatus());
        visit.setCreatedBy(dto.getCreatedBy() != null ? dto.getCreatedBy() : "System");
        return visit;
    }
}

