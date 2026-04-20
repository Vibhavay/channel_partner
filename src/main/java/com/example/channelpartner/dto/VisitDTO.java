package com.example.channelpartner.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class VisitDTO {
    private Long id;
    private LocalDate visitDate;
    private String status;
    private String notes;
    private Long customerId;
    private String customerName;
    private Long projectId;
    private String projectName;
    private String flatType;
    private Double flatSize;
    private String visitStatus;
}
