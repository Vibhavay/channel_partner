package com.example.channelpartner.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BookingDTO {

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
    private LocalDate bookingDate;
    private String paymentPlan;
    private String status;
    private Long salesExecutiveId;
    private String notes;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
