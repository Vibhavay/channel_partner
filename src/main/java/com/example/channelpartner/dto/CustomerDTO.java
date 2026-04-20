package com.example.channelpartner.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CustomerDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private BigDecimal budget;
    private LocalDate dateOfInquiry;
    private String status;
    private Long projectId;
    private LocalDate followUpDate;
}
