package com.example.channelpartner.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "sales_details")
public class SalesDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false, length = 100)
    private String projectName;

    @Column(length = 100)
    private String buildingName;

    @Column(nullable = false, length = 50)
    private String flatNo;

    @Column(length = 20)
    private String floorNo;

    @Column(length = 50)
    private String flatType; // 1BHK, 2BHK, 3BHK

    @Column(name = "carpet_area")
    private BigDecimal carpetArea; // in square feet

    @Column(nullable = false)
    private BigDecimal agreementValue;

    @Column(nullable = false)
    private BigDecimal bookingAmount;

    @Column(name = "remaining_amount")
    private BigDecimal remainingAmount;

    @Column(length = 50)
    private String paymentStatus; // Pending, Partial, Completed

    private LocalDate agreementDate;

    private LocalDate possessionDate;

    @Column(name = "sales_executive_id")
    private Long salesExecutiveId;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculateRemainingAmount();
        updatePaymentStatus();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateRemainingAmount();
        updatePaymentStatus();
    }

    private void calculateRemainingAmount() {
        if (agreementValue != null && bookingAmount != null) {
            this.remainingAmount = agreementValue.subtract(bookingAmount);
        }
    }

    private void updatePaymentStatus() {
        if (bookingAmount == null || agreementValue == null) {
            return;
        }
        
        if (bookingAmount.compareTo(BigDecimal.ZERO) == 0) {
            this.paymentStatus = "Pending";
        } else if (bookingAmount.compareTo(agreementValue) >= 0) {
            this.paymentStatus = "Completed";
        } else {
            this.paymentStatus = "Partial";
        }
    }
}

