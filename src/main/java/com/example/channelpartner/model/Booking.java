package com.example.channelpartner.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false)
    private String projectName;

    private String buildingName;

    @Column(nullable = false)
    private String flatNo;

    private String floorNo;

    private String flatType;

    private BigDecimal carpetArea;

    @Column(nullable = false)
    private BigDecimal agreementValue;

    @Column(nullable = false)
    private BigDecimal bookingAmount;

    @Column(nullable = false)
    private LocalDate bookingDate;

    private String paymentPlan;

    private String status; // Booked, Confirmed, Cancelled

    private Long salesExecutiveId;

    @Column(length = 1000)
    private String notes;

    @Column(nullable = false)
    private LocalDate createdAt;

    private LocalDate updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDate.now();
    }
}
