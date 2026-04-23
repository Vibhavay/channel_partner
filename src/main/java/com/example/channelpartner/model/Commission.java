package com.example.channelpartner.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "commissions")
public class Commission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id")
    private SalesDetails sale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false)
    private BigDecimal expectedCommission;

    private BigDecimal receivedCommission;

    @Column(nullable = false)
    private BigDecimal pendingCommission;

    private LocalDate paymentDate;

    private String status; // Pending, Partial, Received

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private LocalDate createdAt;

    private LocalDate updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
        if (pendingCommission == null) {
            pendingCommission = expectedCommission.subtract(receivedCommission != null ? receivedCommission : BigDecimal.ZERO);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDate.now();
        if (pendingCommission == null) {
            pendingCommission = expectedCommission.subtract(receivedCommission != null ? receivedCommission : BigDecimal.ZERO);
        }
    }
}
