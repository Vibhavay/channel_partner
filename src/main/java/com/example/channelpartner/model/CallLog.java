package com.example.channelpartner.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "call_logs")
public class CallLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false, updatable = false)
    private LocalDateTime callDateTime;

    @Column(nullable = false)
    private String callType; // Incoming, Outgoing

    @Column(nullable = false)
    private String callStatus; // Connected, Not Answered, Busy, Wrong Number, Follow-up Required

    @Column(columnDefinition = "TEXT")
    private String callNotes;

    @Column(nullable = false)
    private String createdBy; // User/Employee name

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (callDateTime == null) {
            callDateTime = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

