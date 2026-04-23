package com.example.channelpartner.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CommissionDTO {

    private Long id;
    private Long saleId;
    private Long bookingId;
    private Long customerId;
    private String customerName;
    private String projectName;
    private BigDecimal expectedCommission;
    private BigDecimal receivedCommission;
    private BigDecimal pendingCommission;
    private LocalDate paymentDate;
    private String status;
    private String notes;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
