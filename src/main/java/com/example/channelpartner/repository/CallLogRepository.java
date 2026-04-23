package com.example.channelpartner.repository;

import com.example.channelpartner.model.CallLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CallLogRepository extends JpaRepository<CallLog, Long> {
    
    Page<CallLog> findByCustomerId(Long customerId, Pageable pageable);
    
    List<CallLog> findByCustomerIdOrderByCallDateTimeDesc(Long customerId);
    
    CallLog findFirstByCustomerIdOrderByCallDateTimeDesc(Long customerId);
    
    Page<CallLog> findByCallStatusAndCallDateTimeBetween(
            String callStatus, LocalDateTime startDateTime, LocalDateTime endDateTime, Pageable pageable);
    
    Page<CallLog> findByCallTypeAndCallDateTimeBetween(
            String callType, LocalDateTime startDateTime, LocalDateTime endDateTime, Pageable pageable);
    
    Page<CallLog> findByCreatedByAndCallDateTimeBetween(
            String createdBy, LocalDateTime startDateTime, LocalDateTime endDateTime, Pageable pageable);
    
    long countByCallStatus(String callStatus);
    
    long countByCallType(String callType);
    
    List<CallLog> findByCustomerIdAndCallDateTimeGreaterThanOrderByCallDateTimeDesc(
            Long customerId, LocalDateTime dateTime);
}

