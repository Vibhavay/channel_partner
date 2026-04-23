package com.example.channelpartner.repository;

import com.example.channelpartner.model.Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {

    List<Commission> findByCustomerId(Long customerId);

    List<Commission> findBySaleId(Long saleId);

    List<Commission> findByBookingId(Long bookingId);

    List<Commission> findByStatus(String status);

    @Query("SELECT SUM(c.expectedCommission) FROM Commission c")
    BigDecimal sumExpectedCommission();

    @Query("SELECT SUM(c.receivedCommission) FROM Commission c WHERE c.receivedCommission IS NOT NULL")
    BigDecimal sumReceivedCommission();

    @Query("SELECT SUM(c.pendingCommission) FROM Commission c")
    BigDecimal sumPendingCommission();

    @Query("SELECT COUNT(c) FROM Commission c WHERE c.status = 'Pending'")
    long countPending();

    @Query("SELECT COUNT(c) FROM Commission c WHERE c.status = 'Received'")
    long countReceived();
}
