package com.example.channelpartner.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FollowUpDTO {
    private Long id;
    private LocalDate followUpDate;
    private String notes;
    private String status;
    private Long customerId;
    private String customerName;
}
