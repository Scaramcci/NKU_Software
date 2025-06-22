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

    @Column(name = "farm_id")
    private Long farmId;

    @Column(name = "parameter")
    private String parameter;

    @Column(name = "current_value")
    private Double currentValue;

    @Column(name = "threshold_value")
    private Double thresholdValue;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    /**
     * 在保存实体前设置默认时间戳
     */
    @PrePersist
    protected void onCreate() {
        this.recordedAt = LocalDateTime.now();
    }
}
