package com.example.channelpartner.repository;

import com.example.channelpartner.model.SalesDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalesDetailsRepository extends JpaRepository<SalesDetails, Long> {

    // Query by Customer ID
    List<SalesDetails> findByCustomerIdOrderByAgreementDateDesc(Long customerId);

    Page<SalesDetails> findByCustomerIdOrderByAgreementDateDesc(Long customerId, Pageable pageable);

    // Query by Payment Status
    Page<SalesDetails> findByPaymentStatusOrderByAgreementDateDesc(String paymentStatus, Pageable pageable);

    // Query by Project Name
    Page<SalesDetails> findByProjectNameOrderByAgreementDateDesc(String projectName, Pageable pageable);

    // Query by Date Range
    @Query("SELECT sd FROM SalesDetails sd WHERE sd.agreementDate BETWEEN :startDate AND :endDate ORDER BY sd.agreementDate DESC")
    Page<SalesDetails> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, Pageable pageable);

    // Query by Customer ID and Date Range
    @Query("SELECT sd FROM SalesDetails sd WHERE sd.customer.id = :customerId AND sd.agreementDate BETWEEN :startDate AND :endDate ORDER BY sd.agreementDate DESC")
    List<SalesDetails> findByCustomerIdAndDateRange(@Param("customerId") Long customerId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Get Last Sale for a Customer
    @Query("SELECT sd FROM SalesDetails sd WHERE sd.customer.id = :customerId ORDER BY sd.agreementDate DESC LIMIT 1")
    SalesDetails findLastSaleByCustomerId(@Param("customerId") Long customerId);

    // Count by Payment Status
    long countByPaymentStatus(String paymentStatus);

    // Count by Project
    long countByProjectName(String projectName);

    // Count by Customer
    long countByCustomerId(Long customerId);

    // Get Upcoming Possessions
    @Query("SELECT sd FROM SalesDetails sd WHERE sd.possessionDate > CURRENT_DATE AND sd.paymentStatus IN ('Pending', 'Partial') ORDER BY sd.possessionDate ASC")
    Page<SalesDetails> findUpcomingPossessions(Pageable pageable);

    // Get Sales by Status and Customer
    @Query("SELECT sd FROM SalesDetails sd WHERE sd.customer.id = :customerId AND sd.paymentStatus = :status ORDER BY sd.agreementDate DESC")
    List<SalesDetails> findByCustomerIdAndPaymentStatus(@Param("customerId") Long customerId, @Param("status") String status);

    // Count Completed Sales
    @Query("SELECT COUNT(sd) FROM SalesDetails sd WHERE sd.paymentStatus = 'Completed'")
    long countCompletedSales();

    // Count Pending Sales
    @Query("SELECT COUNT(sd) FROM SalesDetails sd WHERE sd.paymentStatus = 'Pending'")
    long countPendingSales();

    // Count Partial Sales
    @Query("SELECT COUNT(sd) FROM SalesDetails sd WHERE sd.paymentStatus = 'Partial'")
    long countPartialSales();
}

