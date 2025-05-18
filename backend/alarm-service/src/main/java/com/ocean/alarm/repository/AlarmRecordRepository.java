package com.ocean.alarm.repository;

import com.ocean.alarm.entity.AlarmThreshold;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlarmThresholdRepository extends JpaRepository<AlarmThreshold, Long> {
    List<AlarmThreshold> findByFarmId(Long farmId);
}
