package com.example.channelpartner.controller;

import com.example.channelpartner.dto.CommissionDTO;
import com.example.channelpartner.service.CommissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/commissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommissionController {

    private final CommissionService commissionService;

    @GetMapping
    public ResponseEntity<Page<CommissionDTO>> getAllCommissions(Pageable pageable) {
        return ResponseEntity.ok(commissionService.getAllCommissions(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommissionDTO> getCommissionById(@PathVariable Long id) {
        return ResponseEntity.ok(commissionService.getCommissionById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<CommissionDTO>> getCommissionsByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(commissionService.getCommissionsByCustomerId(customerId));
    }

    @PostMapping
    public ResponseEntity<CommissionDTO> createCommission(@RequestBody CommissionDTO dto) {
        return ResponseEntity.ok(commissionService.createCommission(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommissionDTO> updateCommission(@PathVariable Long id, @RequestBody CommissionDTO dto) {
        return ResponseEntity.ok(commissionService.updateCommission(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommission(@PathVariable Long id) {
        commissionService.deleteCommission(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/calculate/sale/{saleId}")
    public ResponseEntity<CommissionDTO> calculateCommissionForSale(@PathVariable Long saleId) {
        return ResponseEntity.ok(commissionService.calculateCommissionForSale(saleId));
    }

    @PostMapping("/calculate/booking/{bookingId}")
    public ResponseEntity<CommissionDTO> calculateCommissionForBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(commissionService.calculateCommissionForBooking(bookingId));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCommissionStats() {
        Map<String, BigDecimal> amounts = commissionService.getCommissionStats();
        Map<String, Long> counts = commissionService.getCommissionCounts();

        Map<String, Object> stats = new java.util.HashMap<>();
        stats.putAll(amounts);
        stats.putAll(counts);

        return ResponseEntity.ok(stats);
    }
}
