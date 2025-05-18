package com.ocean.alarm.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "alarm_threshold")
public class AlarmThreshold {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long farmId;

    private String parameter; // 参数名，如 water_temperature

    private Double thresholdValue;

    private String operator; // 比较符号，如 >, <

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
