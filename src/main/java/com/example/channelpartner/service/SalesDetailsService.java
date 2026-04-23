package com.example.channelpartner.service;

import com.example.channelpartner.dto.SalesDetailsDTO;
import com.example.channelpartner.model.Customer;
import com.example.channelpartner.model.SalesDetails;
import com.example.channelpartner.repository.CustomerRepository;
import com.example.channelpartner.repository.SalesDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalesDetailsService {

    private final SalesDetailsRepository salesDetailsRepository;
    private final CustomerRepository customerRepository;

    // ==================== GET Operations ====================

    public Page<SalesDetailsDTO> getAllSales(Pageable pageable) {
        return salesDetailsRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    public SalesDetailsDTO getSalesById(Long id) {
        SalesDetails sales = salesDetailsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales record not found"));
        return convertToDTO(sales);
    }

    public Page<SalesDetailsDTO> getSalesByCustomerId(Long customerId, Pageable pageable) {
        return salesDetailsRepository.findByCustomerIdOrderByAgreementDateDesc(customerId, pageable)
                .map(this::convertToDTO);
    }

    public List<SalesDetailsDTO> getSalesHistoryByCustomerId(Long customerId) {
        return salesDetailsRepository.findByCustomerIdOrderByAgreementDateDesc(customerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SalesDetailsDTO getLastSaleByCustomerId(Long customerId) {
        SalesDetails lastSale = salesDetailsRepository.findLastSaleByCustomerId(customerId);
        return lastSale != null ? convertToDTO(lastSale) : null;
    }

    public Page<SalesDetailsDTO> getSalesByPaymentStatus(String paymentStatus, Pageable pageable) {
        return salesDetailsRepository.findByPaymentStatusOrderByAgreementDateDesc(paymentStatus, pageable)
                .map(this::convertToDTO);
    }

    public Page<SalesDetailsDTO> getSalesByProject(String projectName, Pageable pageable) {
        return salesDetailsRepository.findByProjectNameOrderByAgreementDateDesc(projectName, pageable)
                .map(this::convertToDTO);
    }

    public Page<SalesDetailsDTO> getSalesByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return salesDetailsRepository.findByDateRange(startDate, endDate, pageable)
                .map(this::convertToDTO);
    }

    public Page<SalesDetailsDTO> getUpcomingPossessions(Pageable pageable) {
        return salesDetailsRepository.findUpcomingPossessions(pageable)
                .map(this::convertToDTO);
    }

    // ==================== CREATE Operation ====================

    public SalesDetailsDTO createSales(SalesDetailsDTO salesDTO) {
        Customer customer = customerRepository.findById(salesDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        SalesDetails sales = convertToEntity(salesDTO);
        sales.setCustomer(customer);

        SalesDetails savedSales = salesDetailsRepository.save(sales);
        return convertToDTO(savedSales);
    }

    // ==================== UPDATE Operation ====================

    public SalesDetailsDTO updateSales(Long id, SalesDetailsDTO salesDTO) {
        SalesDetails sales = salesDetailsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales record not found"));

        Customer customer = customerRepository.findById(salesDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        sales.setCustomer(customer);
        sales.setProjectName(salesDTO.getProjectName());
        sales.setBuildingName(salesDTO.getBuildingName());
        sales.setFlatNo(salesDTO.getFlatNo());
        sales.setFloorNo(salesDTO.getFloorNo());
        sales.setFlatType(salesDTO.getFlatType());
        sales.setCarpetArea(salesDTO.getCarpetArea());
        sales.setAgreementValue(salesDTO.getAgreementValue());
        sales.setBookingAmount(salesDTO.getBookingAmount());
        sales.setAgreementDate(salesDTO.getAgreementDate());
        sales.setPossessionDate(salesDTO.getPossessionDate());
        sales.setSalesExecutiveId(salesDTO.getSalesExecutiveId());
        sales.setNotes(salesDTO.getNotes());

        SalesDetails updatedSales = salesDetailsRepository.save(sales);
        return convertToDTO(updatedSales);
    }

    // ==================== DELETE Operation ====================

    public void deleteSales(Long id) {
        salesDetailsRepository.deleteById(id);
    }

    // ==================== Statistics Operations ====================

    public long getCompletedSalesCount() {
        return salesDetailsRepository.countCompletedSales();
    }

    public long getPendingSalesCount() {
        return salesDetailsRepository.countPendingSales();
    }

    public long getPartialSalesCount() {
        return salesDetailsRepository.countPartialSales();
    }

    public long getSalesCountByStatus(String paymentStatus) {
        return salesDetailsRepository.countByPaymentStatus(paymentStatus);
    }

    public long getSalesCountByProject(String projectName) {
        return salesDetailsRepository.countByProjectName(projectName);
    }

    public long getSalesCountByCustomer(Long customerId) {
        return salesDetailsRepository.countByCustomerId(customerId);
    }

    // ==================== DTO Conversion Methods ====================

    public SalesDetailsDTO convertToDTO(SalesDetails sales) {
        SalesDetailsDTO dto = new SalesDetailsDTO();
        dto.setId(sales.getId());
        dto.setCustomerId(sales.getCustomer().getId());
        dto.setCustomerName(sales.getCustomer().getFirstName() + " " + sales.getCustomer().getLastName());
        dto.setCustomerEmail(sales.getCustomer().getEmail());
        dto.setCustomerPhone(sales.getCustomer().getPhone());
        dto.setProjectName(sales.getProjectName());
        dto.setBuildingName(sales.getBuildingName());
        dto.setFlatNo(sales.getFlatNo());
        dto.setFloorNo(sales.getFloorNo());
        dto.setFlatType(sales.getFlatType());
        dto.setCarpetArea(sales.getCarpetArea());
        dto.setAgreementValue(sales.getAgreementValue());
        dto.setBookingAmount(sales.getBookingAmount());
        dto.setRemainingAmount(sales.getRemainingAmount());
        dto.setPaymentStatus(sales.getPaymentStatus());
        dto.setAgreementDate(sales.getAgreementDate());
        dto.setPossessionDate(sales.getPossessionDate());
        dto.setSalesExecutiveId(sales.getSalesExecutiveId());
        dto.setNotes(sales.getNotes());
        dto.setCreatedAt(sales.getCreatedAt());
        dto.setUpdatedAt(sales.getUpdatedAt());
        return dto;
    }

    private SalesDetails convertToEntity(SalesDetailsDTO dto) {
        SalesDetails sales = new SalesDetails();
        sales.setProjectName(dto.getProjectName());
        sales.setBuildingName(dto.getBuildingName());
        sales.setFlatNo(dto.getFlatNo());
        sales.setFloorNo(dto.getFloorNo());
        sales.setFlatType(dto.getFlatType());
        sales.setCarpetArea(dto.getCarpetArea());
        sales.setAgreementValue(dto.getAgreementValue());
        sales.setBookingAmount(dto.getBookingAmount());
        sales.setAgreementDate(dto.getAgreementDate());
        sales.setPossessionDate(dto.getPossessionDate());
        sales.setSalesExecutiveId(dto.getSalesExecutiveId());
        sales.setNotes(dto.getNotes());
        return sales;
    }
}

