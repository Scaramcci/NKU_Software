package com.ocean.device.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "device")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String type;  // 设备类型，如“增氧机”、“监测仪”等

    @Column(length = 50)
    private String status; // 设备状态，如“ON”、“OFF”、“ONLINE”、“OFFLINE”

    @Column(length = 255)
    private String description;

    @ManyToOne
    @JoinColumn(name = "farm_id")
    private com.ocean.farm.entity.Farm farm;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
