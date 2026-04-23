package com.example.channelpartner.controller;

import com.example.channelpartner.dto.CustomerVisitDTO;
import com.example.channelpartner.service.CustomerVisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customer-visits")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CustomerVisitController {

    private final CustomerVisitService customerVisitService;

    // ==================== GET Operations ====================

    @GetMapping
    public ResponseEntity<Page<CustomerVisitDTO>> getAllVisits(Pageable pageable) {
        return ResponseEntity.ok(customerVisitService.getAllVisits(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerVisitDTO> getVisitById(@PathVariable Long id) {
        return ResponseEntity.ok(customerVisitService.getVisitById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Page<CustomerVisitDTO>> getVisitsByCustomerId(
            @PathVariable Long customerId,
            Pageable pageable) {
        return ResponseEntity.ok(customerVisitService.getVisitsByCustomerId(customerId, pageable));
    }

    @GetMapping("/customer/{customerId}/history")
    public ResponseEntity<List<CustomerVisitDTO>> getVisitHistoryByCustomerId(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(customerVisitService.getVisitHistoryByCustomerId(customerId));
    }

    @GetMapping("/customer/{customerId}/last")
    public ResponseEntity<CustomerVisitDTO> getLastVisitByCustomerId(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(customerVisitService.getLastVisitByCustomerId(customerId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<CustomerVisitDTO>> getVisitsByStatus(
            @PathVariable String status,
            Pageable pageable) {
        return ResponseEntity.ok(customerVisitService.getVisitsByStatus(status, pageable));
    }

    @GetMapping("/type/{visitType}")
    public ResponseEntity<Page<CustomerVisitDTO>> getVisitsByType(
            @PathVariable String visitType,
            Pageable pageable) {
        return ResponseEntity.ok(customerVisitService.getVisitsByType(visitType, pageable));
    }

    @GetMapping("/created-by/{createdBy}")
    public ResponseEntity<Page<CustomerVisitDTO>> getVisitsByCreatedBy(
            @PathVariable String createdBy,
            Pageable pageable) {
        return ResponseEntity.ok(customerVisitService.getVisitsByCreatedBy(createdBy, pageable));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<Page<CustomerVisitDTO>> getUpcomingVisits(Pageable pageable) {
        return ResponseEntity.ok(customerVisitService.getUpcomingVisits(pageable));
    }

    @GetMapping("/date-range")
    public ResponseEntity<Page<CustomerVisitDTO>> getVisitsByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate,
            Pageable pageable) {
        return ResponseEntity.ok(customerVisitService.getVisitsByDateRange(startDate, endDate, pageable));
    }

    // ==================== CREATE Operation ====================

    @PostMapping
    public ResponseEntity<CustomerVisitDTO> createVisit(@RequestBody CustomerVisitDTO visitDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(customerVisitService.createVisit(visitDTO));
    }

    // ==================== UPDATE Operation ====================

    @PutMapping("/{id}")
    public ResponseEntity<CustomerVisitDTO> updateVisit(
            @PathVariable Long id,
            @RequestBody CustomerVisitDTO visitDTO) {
        return ResponseEntity.ok(customerVisitService.updateVisit(id, visitDTO));
    }

    // ==================== DELETE Operation ====================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisit(@PathVariable Long id) {
        customerVisitService.deleteVisit(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== Statistics Operations ====================

    @GetMapping("/stats/confirmed-count")
    public ResponseEntity<Long> getConfirmedVisitCount() {
        return ResponseEntity.ok(customerVisitService.getConfirmedVisitCount());
    }

    @GetMapping("/stats/completed-count")
    public ResponseEntity<Long> getCompletedVisitCount() {
        return ResponseEntity.ok(customerVisitService.getCompletedVisitCount());
    }

    @GetMapping("/stats/scheduled-count")
    public ResponseEntity<Long> getScheduledVisitCount() {
        return ResponseEntity.ok(customerVisitService.getScheduledVisitCount());
    }

    @GetMapping("/stats/by-status/{status}")
    public ResponseEntity<Long> getVisitCountByStatus(@PathVariable String status) {
        return ResponseEntity.ok(customerVisitService.getVisitCountByStatus(status));
    }

    @GetMapping("/stats/by-type/{visitType}")
    public ResponseEntity<Long> getVisitCountByType(@PathVariable String visitType) {
        return ResponseEntity.ok(customerVisitService.getVisitCountByType(visitType));
    }

    @GetMapping("/stats/by-customer/{customerId}")
    public ResponseEntity<Long> getVisitCountByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerVisitService.getVisitCountByCustomer(customerId));
    }

    @GetMapping("/stats/summary")
    public ResponseEntity<Map<String, Long>> getVisitStatistics() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalConfirmed", customerVisitService.getConfirmedVisitCount());
        stats.put("totalCompleted", customerVisitService.getCompletedVisitCount());
        stats.put("totalScheduled", customerVisitService.getScheduledVisitCount());
        return ResponseEntity.ok(stats);
    }
}

