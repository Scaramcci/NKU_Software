package com.ocean.farm.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "environment_data")
public class EnvironmentData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double waterTemperature;
    private Double salinity;
    private Double dissolvedOxygen;
    private Double ph;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "farm_id")
    private Farm farm;
}
