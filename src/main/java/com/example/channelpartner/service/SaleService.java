package com.example.channelpartner.service;

import com.example.channelpartner.dto.SaleDTO;
import com.example.channelpartner.model.Customer;
import com.example.channelpartner.model.Sale;
import com.example.channelpartner.repository.CustomerRepository;
import com.example.channelpartner.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final CustomerRepository customerRepository;

    public List<SaleDTO> getAllSales() {
        return saleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SaleDTO getSaleById(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found"));
        return convertToDTO(sale);
    }

    public SaleDTO createSale(SaleDTO saleDTO) {
        Customer customer = customerRepository.findById(saleDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Sale sale = convertToEntity(saleDTO);
        sale.setCustomer(customer);
        // Calculate commission if not provided, e.g., 5% of amount
        if (sale.getCommission() == null && sale.getAmount() != null) {
            sale.setCommission(sale.getAmount().multiply(BigDecimal.valueOf(0.05)));
        }
        Sale savedSale = saleRepository.save(sale);
        return convertToDTO(savedSale);
    }

    public SaleDTO updateSale(Long id, SaleDTO saleDTO) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found"));
        Customer customer = customerRepository.findById(saleDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        sale.setSaleDate(saleDTO.getSaleDate());
        sale.setAmount(saleDTO.getAmount());
        sale.setCommission(saleDTO.getCommission());
        sale.setStatus(saleDTO.getStatus());
        sale.setCustomer(customer);
        Sale updatedSale = saleRepository.save(sale);
        return convertToDTO(updatedSale);
    }

    public void deleteSale(Long id) {
        saleRepository.deleteById(id);
    }

    public BigDecimal getTotalEarnings() {
        return saleRepository.findAll().stream()
                .filter(sale -> "Completed".equals(sale.getStatus()))
                .map(Sale::getCommission)
                .filter(commission -> commission != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private SaleDTO convertToDTO(Sale sale) {
        SaleDTO dto = new SaleDTO();
        dto.setId(sale.getId());
        dto.setSaleDate(sale.getSaleDate());
        dto.setAmount(sale.getAmount());
        dto.setCommission(sale.getCommission());
        dto.setStatus(sale.getStatus());
        dto.setCustomerId(sale.getCustomer().getId());
        return dto;
    }

    private Sale convertToEntity(SaleDTO dto) {
        Sale sale = new Sale();
        sale.setSaleDate(dto.getSaleDate());
        sale.setAmount(dto.getAmount());
        sale.setCommission(dto.getCommission());
        sale.setStatus(dto.getStatus());
        return sale;
    }
}
