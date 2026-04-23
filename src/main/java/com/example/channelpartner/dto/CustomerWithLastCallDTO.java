package com.example.channelpartner.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CustomerWithLastCallDTO {
    // Customer fields
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private BigDecimal budget;
    private String status;
    private Long projectId;
    private String projectName;

    // Last Call fields
    private Long lastCallId;
    private LocalDateTime lastCallDateTime;
    private String lastCallType;
    private String lastCallStatus;
    private String lastCallNotes;
    private LocalDateTime lastCallCreatedAt;
}

