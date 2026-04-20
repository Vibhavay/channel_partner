package com.example.channelpartner.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SaleDTO {
    private Long id;
    private LocalDate saleDate;
    private BigDecimal amount;
    private BigDecimal commission;
    private String status;
    private Long customerId;
}
