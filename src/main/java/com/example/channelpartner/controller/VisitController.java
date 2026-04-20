package com.example.channelpartner.controller;

import com.example.channelpartner.dto.VisitDTO;
import com.example.channelpartner.service.VisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visits")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VisitController {

    private final VisitService visitService;

    @GetMapping
    public ResponseEntity<List<VisitDTO>> getAllVisits() {
        return ResponseEntity.ok(visitService.getAllVisits());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VisitDTO> getVisitById(@PathVariable Long id) {
        return ResponseEntity.ok(visitService.getVisitById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<VisitDTO>> getVisitsByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(visitService.getVisitsByCustomerId(customerId));
    }

    @GetMapping("/confirmed-count")
    public ResponseEntity<Long> getConfirmedVisitCount() {
        return ResponseEntity.ok(visitService.getConfirmedVisitCount());
    }

    @PostMapping
    public ResponseEntity<VisitDTO> createVisit(@RequestBody VisitDTO visitDTO) {
        return ResponseEntity.ok(visitService.createVisit(visitDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VisitDTO> updateVisit(@PathVariable Long id, @RequestBody VisitDTO visitDTO) {
        return ResponseEntity.ok(visitService.updateVisit(id, visitDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisit(@PathVariable Long id) {
        visitService.deleteVisit(id);
        return ResponseEntity.noContent().build();
    }
}
