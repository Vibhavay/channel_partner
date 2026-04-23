package com.example.channelpartner.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "commission_settings")
public class CommissionSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "builder_id")
    private Builder builder;

    @Column(nullable = false)
    private BigDecimal commissionPercentage;

    @Column(length = 500)
    private String notes;
}
