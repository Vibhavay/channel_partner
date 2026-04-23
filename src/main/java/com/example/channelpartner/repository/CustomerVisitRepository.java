package com.example.channelpartner.repository;

import com.example.channelpartner.model.CustomerVisit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CustomerVisitRepository extends JpaRepository<CustomerVisit, Long> {

    // Query by Customer ID
    List<CustomerVisit> findByCustomerIdOrderByVisitDateDesc(Long customerId);

    Page<CustomerVisit> findByCustomerIdOrderByVisitDateDesc(Long customerId, Pageable pageable);

    // Query by Status
    Page<CustomerVisit> findByStatusOrderByVisitDateDesc(String status, Pageable pageable);

    // Query by Visit Type
    Page<CustomerVisit> findByVisitTypeOrderByVisitDateDesc(String visitType, Pageable pageable);

    // Query by Created By (Employee/User)
    Page<CustomerVisit> findByCreatedByOrderByVisitDateDesc(String createdBy, Pageable pageable);

    // Query by Date Range
    @Query("SELECT cv FROM CustomerVisit cv WHERE cv.visitDate BETWEEN :startDate AND :endDate ORDER BY cv.visitDate DESC")
    Page<CustomerVisit> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);

    // Query by Customer ID and Date Range
    @Query("SELECT cv FROM CustomerVisit cv WHERE cv.customer.id = :customerId AND cv.visitDate BETWEEN :startDate AND :endDate ORDER BY cv.visitDate DESC")
    List<CustomerVisit> findByCustomerIdAndDateRange(@Param("customerId") Long customerId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Get Last Visit for a Customer
    @Query("SELECT cv FROM CustomerVisit cv WHERE cv.customer.id = :customerId ORDER BY cv.visitDate DESC LIMIT 1")
    CustomerVisit findLastVisitByCustomerId(@Param("customerId") Long customerId);

    // Count by Status
    long countByStatus(String status);

    // Count by Visit Type
    long countByVisitType(String visitType);

    // Count by Customer
    long countByCustomerId(Long customerId);

    // Get Upcoming Visits
    @Query("SELECT cv FROM CustomerVisit cv WHERE cv.visitDate > NOW() AND cv.status = 'Scheduled' ORDER BY cv.visitDate ASC")
    Page<CustomerVisit> findUpcomingVisits(Pageable pageable);

    // Get Visits by Status and Customer
    @Query("SELECT cv FROM CustomerVisit cv WHERE cv.customer.id = :customerId AND cv.status = :status ORDER BY cv.visitDate DESC")
    List<CustomerVisit> findByCustomerIdAndStatus(@Param("customerId") Long customerId, @Param("status") String status);

    // Count Confirmed Visits (for dashboard)
    @Query("SELECT COUNT(cv) FROM CustomerVisit cv WHERE cv.visitStatus = 'confirmed'")
    long countConfirmedVisits();

    // Count Completed Visits
    @Query("SELECT COUNT(cv) FROM CustomerVisit cv WHERE cv.status = 'Completed'")
    long countCompletedVisits();

    // Count Scheduled Visits
    @Query("SELECT COUNT(cv) FROM CustomerVisit cv WHERE cv.status = 'Scheduled'")
    long countScheduledVisits();
}

