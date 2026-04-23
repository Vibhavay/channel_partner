package com.example.channelpartner.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "customer_visits")
public class CustomerVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false)
    private LocalDateTime visitDate;

    @Column(length = 50)
    private String visitType; // SITE_VISIT, VIDEO_TOUR, CONSULTATION, FOLLOW_UP, etc.

    @Column(length = 50)
    private String status; // Scheduled, Completed, Cancelled, Rescheduled

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(length = 50)
    private String flatType; // 1 BHK, 2 BHK, 3 BHK

    @Column(name = "flat_size")
    private Double flatSize; // in square feet

    @Column(length = 50)
    private String visitStatus; // rejected, liked, confirmed

    @Column(nullable = false, length = 100)
    private String createdBy; // User/Employee name

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (visitDate == null) {
            visitDate = LocalDateTime.now();
        }
        if (createdBy == null) {
            createdBy = "System";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

