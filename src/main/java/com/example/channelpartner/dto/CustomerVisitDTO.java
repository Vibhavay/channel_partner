package com.example.channelpartner.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CustomerVisitDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private LocalDateTime visitDate;
    private String visitType;
    private String status;
    private String notes;
    private Long projectId;
    private String projectName;
    private String flatType;
    private Double flatSize;
    private String visitStatus;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

