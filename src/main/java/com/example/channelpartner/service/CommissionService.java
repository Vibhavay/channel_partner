package com.example.channelpartner.service;

import com.example.channelpartner.dto.CommissionDTO;
import com.example.channelpartner.model.Commission;
import com.example.channelpartner.model.SalesDetails;
import com.example.channelpartner.model.Booking;
import com.example.channelpartner.model.Customer;
import com.example.channelpartner.repository.CommissionRepository;
import com.example.channelpartner.repository.SalesDetailsRepository;
import com.example.channelpartner.repository.BookingRepository;
import com.example.channelpartner.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommissionService {

    private final CommissionRepository commissionRepository;
    private final SalesDetailsRepository salesDetailsRepository;
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final CommissionSettingService commissionSettingService;

    public Page<CommissionDTO> getAllCommissions(Pageable pageable) {
        return commissionRepository.findAll(pageable).map(this::convertToDTO);
    }

    public CommissionDTO getCommissionById(Long id) {
        Commission commission = commissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commission not found"));
        return convertToDTO(commission);
    }

    public List<CommissionDTO> getCommissionsByCustomerId(Long customerId) {
        return commissionRepository.findByCustomerId(customerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CommissionDTO createCommission(CommissionDTO dto) {
        Commission commission = convertToEntity(dto);
        Commission saved = commissionRepository.save(commission);
        return convertToDTO(saved);
    }

    public CommissionDTO updateCommission(Long id, CommissionDTO dto) {
        Commission commission = commissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commission not found"));

        commission.setExpectedCommission(dto.getExpectedCommission());
        commission.setReceivedCommission(dto.getReceivedCommission());
        commission.setPendingCommission(dto.getPendingCommission());
        commission.setPaymentDate(dto.getPaymentDate());
        commission.setStatus(dto.getStatus());
        commission.setNotes(dto.getNotes());

        Commission updated = commissionRepository.save(commission);
        return convertToDTO(updated);
    }

    public void deleteCommission(Long id) {
        commissionRepository.deleteById(id);
    }

    public CommissionDTO calculateCommissionForSale(Long saleId) {
        SalesDetails sale = salesDetailsRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found"));

        // Check if commission already exists
        List<Commission> existing = commissionRepository.findBySaleId(saleId);
        if (!existing.isEmpty()) {
            throw new RuntimeException("Commission already calculated for this sale");
        }

        // Get commission setting
        BigDecimal percentage = getCommissionPercentage(sale.getCustomer().getProject().getId(),
                                                       sale.getCustomer().getProject().getBuilder().getId());

        BigDecimal expectedCommission = sale.getAgreementValue().multiply(percentage).divide(BigDecimal.valueOf(100));

        Commission commission = new Commission();
        commission.setSale(sale);
        commission.setCustomer(sale.getCustomer());
        commission.setExpectedCommission(expectedCommission);
        commission.setReceivedCommission(BigDecimal.ZERO);
        commission.setPendingCommission(expectedCommission);
        commission.setStatus("Pending");

        Commission saved = commissionRepository.save(commission);
        return convertToDTO(saved);
    }

    public CommissionDTO calculateCommissionForBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Check if commission already exists
        List<Commission> existing = commissionRepository.findByBookingId(bookingId);
        if (!existing.isEmpty()) {
            throw new RuntimeException("Commission already calculated for this booking");
        }

        // Get commission setting
        BigDecimal percentage = getCommissionPercentage(booking.getCustomer().getProject().getId(),
                                                       booking.getCustomer().getProject().getBuilder().getId());

        BigDecimal expectedCommission = booking.getAgreementValue().multiply(percentage).divide(BigDecimal.valueOf(100));

        Commission commission = new Commission();
        commission.setBooking(booking);
        commission.setCustomer(booking.getCustomer());
        commission.setExpectedCommission(expectedCommission);
        commission.setReceivedCommission(BigDecimal.ZERO);
        commission.setPendingCommission(expectedCommission);
        commission.setStatus("Pending");

        Commission saved = commissionRepository.save(commission);
        return convertToDTO(saved);
    }

    private BigDecimal getCommissionPercentage(Long projectId, Long builderId) {
        // Try project-specific first
        var projectSetting = commissionSettingService.getSettingByProject(projectId);
        if (projectSetting != null) {
            return projectSetting.getCommissionPercentage();
        }

        // Try builder-specific
        var builderSetting = commissionSettingService.getSettingByBuilder(builderId);
        if (builderSetting != null) {
            return builderSetting.getCommissionPercentage();
        }

        // Default 5%
        return BigDecimal.valueOf(5.0);
    }

    public Map<String, BigDecimal> getCommissionStats() {
        BigDecimal expected = commissionRepository.sumExpectedCommission();
        BigDecimal received = commissionRepository.sumReceivedCommission();
        BigDecimal pending = commissionRepository.sumPendingCommission();

        return Map.of(
                "expected", expected != null ? expected : BigDecimal.ZERO,
                "received", received != null ? received : BigDecimal.ZERO,
                "pending", pending != null ? pending : BigDecimal.ZERO
        );
    }

    public Map<String, Long> getCommissionCounts() {
        return Map.of(
                "pending", commissionRepository.countPending(),
                "received", commissionRepository.countReceived()
        );
    }

    private CommissionDTO convertToDTO(Commission commission) {
        CommissionDTO dto = new CommissionDTO();
        dto.setId(commission.getId());
        if (commission.getSale() != null) {
            dto.setSaleId(commission.getSale().getId());
        }
        if (commission.getBooking() != null) {
            dto.setBookingId(commission.getBooking().getId());
        }
        dto.setCustomerId(commission.getCustomer().getId());
        dto.setCustomerName(commission.getCustomer().getFirstName() + " " + commission.getCustomer().getLastName());
        dto.setProjectName(commission.getCustomer().getProject().getName());
        dto.setExpectedCommission(commission.getExpectedCommission());
        dto.setReceivedCommission(commission.getReceivedCommission());
        dto.setPendingCommission(commission.getPendingCommission());
        dto.setPaymentDate(commission.getPaymentDate());
        dto.setStatus(commission.getStatus());
        dto.setNotes(commission.getNotes());
        dto.setCreatedAt(commission.getCreatedAt());
        dto.setUpdatedAt(commission.getUpdatedAt());
        return dto;
    }

    private Commission convertToEntity(CommissionDTO dto) {
        Commission commission = new Commission();
        commission.setExpectedCommission(dto.getExpectedCommission());
        commission.setReceivedCommission(dto.getReceivedCommission());
        commission.setPendingCommission(dto.getPendingCommission());
        commission.setPaymentDate(dto.getPaymentDate());
        commission.setStatus(dto.getStatus());
        commission.setNotes(dto.getNotes());

        if (dto.getSaleId() != null) {
            SalesDetails sale = salesDetailsRepository.findById(dto.getSaleId())
                    .orElseThrow(() -> new RuntimeException("Sale not found"));
            commission.setSale(sale);
            commission.setCustomer(sale.getCustomer());
        } else if (dto.getBookingId() != null) {
            Booking booking = bookingRepository.findById(dto.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            commission.setBooking(booking);
            commission.setCustomer(booking.getCustomer());
        } else {
            Customer customer = customerRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            commission.setCustomer(customer);
        }

        return commission;
    }
}
