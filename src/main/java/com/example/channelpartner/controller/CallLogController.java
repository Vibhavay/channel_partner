package com.example.channelpartner.controller;

import com.example.channelpartner.dto.CallLogDTO;
import com.example.channelpartner.service.CallLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calls")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CallLogController {

    private final CallLogService callLogService;

    @GetMapping
    public ResponseEntity<Page<CallLogDTO>> getAllCallLogs(Pageable pageable) {
        return ResponseEntity.ok(callLogService.getAllCallLogs(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CallLogDTO> getCallLogById(@PathVariable Long id) {
        return ResponseEntity.ok(callLogService.getCallLogById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Page<CallLogDTO>> getCallLogsByCustomerId(
            @PathVariable Long customerId,
            Pageable pageable) {
        return ResponseEntity.ok(callLogService.getCallLogsByCustomerId(customerId, pageable));
    }

    @GetMapping("/history/{customerId}")
    public ResponseEntity<List<CallLogDTO>> getCallHistoryByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(callLogService.getCallHistoryByCustomerId(customerId));
    }

    @GetMapping("/last/{customerId}")
    public ResponseEntity<CallLogDTO> getLastCallByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(callLogService.getLastCallByCustomerId(customerId));
    }

    @PostMapping
    public ResponseEntity<CallLogDTO> createCallLog(@RequestBody CallLogDTO callLogDTO) {
        return ResponseEntity.ok(callLogService.createCallLog(callLogDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CallLogDTO> updateCallLog(
            @PathVariable Long id,
            @RequestBody CallLogDTO callLogDTO) {
        return ResponseEntity.ok(callLogService.updateCallLog(id, callLogDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCallLog(@PathVariable Long id) {
        callLogService.deleteCallLog(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<CallLogDTO>> getCallsByStatus(
            @PathVariable String status,
            Pageable pageable) {
        return ResponseEntity.ok(callLogService.getCallsByStatus(status, pageable));
    }

    @GetMapping("/type/{callType}")
    public ResponseEntity<Page<CallLogDTO>> getCallsByType(
            @PathVariable String callType,
            Pageable pageable) {
        return ResponseEntity.ok(callLogService.getCallsByType(callType, pageable));
    }

    @GetMapping("/employee/{employeeName}")
    public ResponseEntity<Page<CallLogDTO>> getCallsByEmployee(
            @PathVariable String employeeName,
            Pageable pageable) {
        return ResponseEntity.ok(callLogService.getCallsByEmployee(employeeName, pageable));
    }

    @GetMapping("/stats/today/count")
    public ResponseEntity<Long> getTodaysCallCount() {
        return ResponseEntity.ok(callLogService.getTodaysCallCount());
    }

    @GetMapping("/stats/today/incoming")
    public ResponseEntity<Long> getTodaysIncomingCallCount() {
        return ResponseEntity.ok(callLogService.getTodaysIncomingCallCount());
    }

    @GetMapping("/stats/today/outgoing")
    public ResponseEntity<Long> getTodaysOutgoingCallCount() {
        return ResponseEntity.ok(callLogService.getTodaysOutgoingCallCount());
    }

    @GetMapping("/followups/today")
    public ResponseEntity<List<CallLogDTO>> getTodaysFollowUpCalls() {
        return ResponseEntity.ok(callLogService.getTodaysFollowUpCalls());
    }
}

