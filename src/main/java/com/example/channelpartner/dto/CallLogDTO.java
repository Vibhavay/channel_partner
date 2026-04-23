package com.example.channelpartner.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CallLogDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private LocalDateTime callDateTime;
    private String callType; // Incoming, Outgoing
    private String callStatus; // Connected, Not Answered, Busy, Wrong Number, Follow-up Required
    private String callNotes;
    private String createdBy; // User/Employee name
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String customerEmail;
    private String customerPhone;
}

