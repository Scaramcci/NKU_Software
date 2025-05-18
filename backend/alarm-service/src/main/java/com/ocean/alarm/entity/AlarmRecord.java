package com.ocean.alarm.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "alarm_record")
public class AlarmRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long farmId;

    private String parameter;

    private Double currentValue;

    private Double thresholdValue;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();
}
