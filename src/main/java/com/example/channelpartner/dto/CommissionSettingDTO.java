package com.example.channelpartner.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CommissionSettingDTO {

    private Long id;
    private Long projectId;
    private String projectName;
    private Long builderId;
    private String builderName;
    private BigDecimal commissionPercentage;
    private String notes;
}
