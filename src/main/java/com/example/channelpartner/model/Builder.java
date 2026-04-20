package com.example.channelpartner.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@Table(name = "builders")
public class Builder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String firstName;

    @Column(nullable = true)
    private String lastName;

    private String email;

    private String contactNumber;

    private String address;

    private String city;

    private String state;

    private String office;

    private String pin;

    private String gstNo;

    @OneToMany(mappedBy = "builder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Project> projects;
}
