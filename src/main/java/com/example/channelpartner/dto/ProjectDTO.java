package com.example.channelpartner.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProjectDTO {
    private Long id;
    private String name;
    private String location;
    private String description;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Long builderId;
    private BuilderDTO builder;
}
