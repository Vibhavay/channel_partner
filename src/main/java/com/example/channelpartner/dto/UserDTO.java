package com.example.channelpartner.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String role;
    private String email;
    private String name;
}
