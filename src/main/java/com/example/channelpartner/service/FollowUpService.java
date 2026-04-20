package com.example.channelpartner.service;

import com.example.channelpartner.dto.FollowUpDTO;
import com.example.channelpartner.model.Customer;
import com.example.channelpartner.model.FollowUp;
import com.example.channelpartner.repository.CustomerRepository;
import com.example.channelpartner.repository.FollowUpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowUpService {

    private final FollowUpRepository followUpRepository;
    private final CustomerRepository customerRepository;

    public List<FollowUpDTO> getAllFollowUps() {
        return followUpRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FollowUpDTO getFollowUpById(Long id) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FollowUp not found"));
        return convertToDTO(followUp);
    }

    public FollowUpDTO createFollowUp(FollowUpDTO followUpDTO) {
        Customer customer = customerRepository.findById(followUpDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        FollowUp followUp = convertToEntity(followUpDTO);
        followUp.setCustomer(customer);
        FollowUp savedFollowUp = followUpRepository.save(followUp);
        return convertToDTO(savedFollowUp);
    }

    public FollowUpDTO updateFollowUp(Long id, FollowUpDTO followUpDTO) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FollowUp not found"));
        Customer customer = customerRepository.findById(followUpDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        followUp.setFollowUpDate(followUpDTO.getFollowUpDate());
        followUp.setNotes(followUpDTO.getNotes());
        followUp.setStatus(followUpDTO.getStatus());
        followUp.setCustomer(customer);
        FollowUp updatedFollowUp = followUpRepository.save(followUp);
        return convertToDTO(updatedFollowUp);
    }

    public void deleteFollowUp(Long id) {
        followUpRepository.deleteById(id);
    }

    public List<FollowUpDTO> getCurrentWeekFollowUps() {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.minusDays(today.getDayOfWeek().getValue() - 1);
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        return customerRepository.findAll().stream()
                .filter(customer -> {
                    LocalDate followUpDate = customer.getFollowUpDate();
                    return followUpDate != null &&
                           !followUpDate.isBefore(startOfWeek) &&
                           !followUpDate.isAfter(endOfWeek);
                })
                .map(this::convertCustomerToDTO)
                .collect(Collectors.toList());
    }

    private FollowUpDTO convertToDTO(FollowUp followUp) {
        FollowUpDTO dto = new FollowUpDTO();
        dto.setId(followUp.getId());
        dto.setFollowUpDate(followUp.getFollowUpDate());
        dto.setNotes(followUp.getNotes());
        dto.setStatus(followUp.getStatus());
        dto.setCustomerId(followUp.getCustomer().getId());
        dto.setCustomerName(followUp.getCustomer().getFirstName() + " " + followUp.getCustomer().getLastName());
        return dto;
    }

    private FollowUp convertToEntity(FollowUpDTO dto) {
        FollowUp followUp = new FollowUp();
        followUp.setFollowUpDate(dto.getFollowUpDate());
        followUp.setNotes(dto.getNotes());
        followUp.setStatus(dto.getStatus());
        return followUp;
    }

    private FollowUpDTO convertCustomerToDTO(Customer customer) {
        FollowUpDTO dto = new FollowUpDTO();
        dto.setId(customer.getId()); // Using customer ID as the ID
        dto.setFollowUpDate(customer.getFollowUpDate());
        dto.setNotes("Follow up with customer - " + customer.getStatus()); // Default notes based on status
        dto.setStatus(customer.getStatus());
        dto.setCustomerId(customer.getId());
        dto.setCustomerName(customer.getFirstName() + " " + customer.getLastName());
        return dto;
    }
}
