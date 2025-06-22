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

    @Column(name = "farm_id")
    private Long farmId;

    @Column(name = "parameter")
    private String parameter; // 参数名，如 water_temperature

    @Column(name = "threshold_value")
    private Double thresholdValue;

    @Column(name = "operator")
    private String operator; // 比较符号，如 >, <

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * 在插入数据库前设置默认时间
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
