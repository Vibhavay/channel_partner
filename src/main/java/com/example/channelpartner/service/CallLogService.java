package com.example.channelpartner.service;

import com.example.channelpartner.dto.CallLogDTO;
import com.example.channelpartner.model.CallLog;
import com.example.channelpartner.model.Customer;
import com.example.channelpartner.repository.CallLogRepository;
import com.example.channelpartner.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CallLogService {

    private final CallLogRepository callLogRepository;
    private final CustomerRepository customerRepository;

    public Page<CallLogDTO> getAllCallLogs(Pageable pageable) {
        return callLogRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    public Page<CallLogDTO> getCallLogsByCustomerId(Long customerId, Pageable pageable) {
        return callLogRepository.findByCustomerId(customerId, pageable)
                .map(this::convertToDTO);
    }

    public List<CallLogDTO> getCallHistoryByCustomerId(Long customerId) {
        return callLogRepository.findByCustomerIdOrderByCallDateTimeDesc(customerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CallLogDTO getCallLogById(Long id) {
        CallLog callLog = callLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Call log not found"));
        return convertToDTO(callLog);
    }

    public CallLogDTO createCallLog(CallLogDTO callLogDTO) {
        Customer customer = customerRepository.findById(callLogDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        CallLog callLog = convertToEntity(callLogDTO);
        callLog.setCustomer(customer);
        
        CallLog savedCallLog = callLogRepository.save(callLog);
        return convertToDTO(savedCallLog);
    }

    public CallLogDTO updateCallLog(Long id, CallLogDTO callLogDTO) {
        CallLog callLog = callLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Call log not found"));
        
        callLog.setCallType(callLogDTO.getCallType());
        callLog.setCallStatus(callLogDTO.getCallStatus());
        callLog.setCallNotes(callLogDTO.getCallNotes());
        callLog.setCallDateTime(callLogDTO.getCallDateTime());
        callLog.setCreatedBy(callLogDTO.getCreatedBy());
        
        CallLog updatedCallLog = callLogRepository.save(callLog);
        return convertToDTO(updatedCallLog);
    }

    public void deleteCallLog(Long id) {
        callLogRepository.deleteById(id);
    }

    public CallLogDTO getLastCallByCustomerId(Long customerId) {
        CallLog lastCall = callLogRepository.findFirstByCustomerIdOrderByCallDateTimeDesc(customerId);
        return lastCall != null ? convertToDTO(lastCall) : null;
    }

    public Page<CallLogDTO> getCallsByStatus(String status, Pageable pageable) {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        return callLogRepository.findByCallStatusAndCallDateTimeBetween(status, startOfDay, endOfDay, pageable)
                .map(this::convertToDTO);
    }

    public Page<CallLogDTO> getCallsByType(String callType, Pageable pageable) {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        return callLogRepository.findByCallTypeAndCallDateTimeBetween(callType, startOfDay, endOfDay, pageable)
                .map(this::convertToDTO);
    }

    public Page<CallLogDTO> getCallsByEmployee(String employeeName, Pageable pageable) {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        return callLogRepository.findByCreatedByAndCallDateTimeBetween(employeeName, startOfDay, endOfDay, pageable)
                .map(this::convertToDTO);
    }

    public long getTodaysCallCount() {
        return callLogRepository.countByCallStatus("Connected");
    }

    public long getTodaysIncomingCallCount() {
        return callLogRepository.countByCallType("Incoming");
    }

    public long getTodaysOutgoingCallCount() {
        return callLogRepository.countByCallType("Outgoing");
    }

    public List<CallLogDTO> getTodaysFollowUpCalls() {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
        // This would typically be called for today's date
        return callLogRepository.findAll().stream()
                .filter(call -> call.getCallStatus().equals("Follow-up Required") &&
                        call.getCallDateTime().isAfter(startOfDay))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CallLogDTO convertToDTO(CallLog callLog) {
        CallLogDTO dto = new CallLogDTO();
        dto.setId(callLog.getId());
        dto.setCustomerId(callLog.getCustomer().getId());
        dto.setCustomerName(callLog.getCustomer().getFirstName() + " " + callLog.getCustomer().getLastName());
        dto.setCustomerEmail(callLog.getCustomer().getEmail());
        dto.setCustomerPhone(callLog.getCustomer().getPhone());
        dto.setCallDateTime(callLog.getCallDateTime());
        dto.setCallType(callLog.getCallType());
        dto.setCallStatus(callLog.getCallStatus());
        dto.setCallNotes(callLog.getCallNotes());
        dto.setCreatedBy(callLog.getCreatedBy());
        dto.setCreatedAt(callLog.getCreatedAt());
        dto.setUpdatedAt(callLog.getUpdatedAt());
        return dto;
    }

    private CallLog convertToEntity(CallLogDTO dto) {
        CallLog callLog = new CallLog();
        callLog.setCallDateTime(dto.getCallDateTime() != null ? dto.getCallDateTime() : LocalDateTime.now());
        callLog.setCallType(dto.getCallType());
        callLog.setCallStatus(dto.getCallStatus());
        callLog.setCallNotes(dto.getCallNotes());
        callLog.setCreatedBy(dto.getCreatedBy());
        return callLog;
    }
}

