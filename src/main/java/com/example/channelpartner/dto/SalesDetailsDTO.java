package com.example.channelpartner.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class SalesDetailsDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String projectName;
    private String buildingName;
    private String flatNo;
    private String floorNo;
    private String flatType;
    private BigDecimal carpetArea;
    private BigDecimal agreementValue;
    private BigDecimal bookingAmount;
    private BigDecimal remainingAmount;
    private String paymentStatus;
    private LocalDate agreementDate;
    private LocalDate possessionDate;
    private Long salesExecutiveId;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

