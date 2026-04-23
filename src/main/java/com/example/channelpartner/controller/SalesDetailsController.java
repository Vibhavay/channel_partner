package com.example.channelpartner.controller;

import com.example.channelpartner.dto.SalesDetailsDTO;
import com.example.channelpartner.service.SalesDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales-details")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SalesDetailsController {

    private final SalesDetailsService salesDetailsService;

    // ==================== GET Operations ====================

    @GetMapping
    public ResponseEntity<Page<SalesDetailsDTO>> getAllSales(Pageable pageable) {
        return ResponseEntity.ok(salesDetailsService.getAllSales(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesDetailsDTO> getSalesById(@PathVariable Long id) {
        return ResponseEntity.ok(salesDetailsService.getSalesById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Page<SalesDetailsDTO>> getSalesByCustomerId(
            @PathVariable Long customerId,
            Pageable pageable) {
        return ResponseEntity.ok(salesDetailsService.getSalesByCustomerId(customerId, pageable));
    }

    @GetMapping("/customer/{customerId}/history")
    public ResponseEntity<List<SalesDetailsDTO>> getSalesHistoryByCustomerId(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(salesDetailsService.getSalesHistoryByCustomerId(customerId));
    }

    @GetMapping("/customer/{customerId}/last")
    public ResponseEntity<SalesDetailsDTO> getLastSaleByCustomerId(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(salesDetailsService.getLastSaleByCustomerId(customerId));
    }

    @GetMapping("/payment-status/{status}")
    public ResponseEntity<Page<SalesDetailsDTO>> getSalesByPaymentStatus(
            @PathVariable String status,
            Pageable pageable) {
        return ResponseEntity.ok(salesDetailsService.getSalesByPaymentStatus(status, pageable));
    }

    @GetMapping("/project/{projectName}")
    public ResponseEntity<Page<SalesDetailsDTO>> getSalesByProject(
            @PathVariable String projectName,
            Pageable pageable) {
        return ResponseEntity.ok(salesDetailsService.getSalesByProject(projectName, pageable));
    }

    @GetMapping("/date-range")
    public ResponseEntity<Page<SalesDetailsDTO>> getSalesByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            Pageable pageable) {
        return ResponseEntity.ok(salesDetailsService.getSalesByDateRange(startDate, endDate, pageable));
    }

    @GetMapping("/upcoming-possessions")
    public ResponseEntity<Page<SalesDetailsDTO>> getUpcomingPossessions(Pageable pageable) {
        return ResponseEntity.ok(salesDetailsService.getUpcomingPossessions(pageable));
    }

    // ==================== CREATE Operation ====================

    @PostMapping
    public ResponseEntity<SalesDetailsDTO> createSales(@RequestBody SalesDetailsDTO salesDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(salesDetailsService.createSales(salesDTO));
    }

    // ==================== UPDATE Operation ====================

    @PutMapping("/{id}")
    public ResponseEntity<SalesDetailsDTO> updateSales(
            @PathVariable Long id,
            @RequestBody SalesDetailsDTO salesDTO) {
        return ResponseEntity.ok(salesDetailsService.updateSales(id, salesDTO));
    }

    // ==================== DELETE Operation ====================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSales(@PathVariable Long id) {
        salesDetailsService.deleteSales(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== Statistics Operations ====================

    @GetMapping("/stats/completed-count")
    public ResponseEntity<Long> getCompletedSalesCount() {
        return ResponseEntity.ok(salesDetailsService.getCompletedSalesCount());
    }

    @GetMapping("/stats/pending-count")
    public ResponseEntity<Long> getPendingSalesCount() {
        return ResponseEntity.ok(salesDetailsService.getPendingSalesCount());
    }

    @GetMapping("/stats/partial-count")
    public ResponseEntity<Long> getPartialSalesCount() {
        return ResponseEntity.ok(salesDetailsService.getPartialSalesCount());
    }

    @GetMapping("/stats/by-status/{status}")
    public ResponseEntity<Long> getSalesCountByStatus(@PathVariable String status) {
        return ResponseEntity.ok(salesDetailsService.getSalesCountByStatus(status));
    }

    @GetMapping("/stats/by-project/{projectName}")
    public ResponseEntity<Long> getSalesCountByProject(@PathVariable String projectName) {
        return ResponseEntity.ok(salesDetailsService.getSalesCountByProject(projectName));
    }

    @GetMapping("/stats/by-customer/{customerId}")
    public ResponseEntity<Long> getSalesCountByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(salesDetailsService.getSalesCountByCustomer(customerId));
    }

    @GetMapping("/stats/summary")
    public ResponseEntity<Map<String, Long>> getSalesStatistics() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalCompleted", salesDetailsService.getCompletedSalesCount());
        stats.put("totalPending", salesDetailsService.getPendingSalesCount());
        stats.put("totalPartial", salesDetailsService.getPartialSalesCount());
        return ResponseEntity.ok(stats);
    }
}

