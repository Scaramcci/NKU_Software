package com.ocean.alarm.repository;

import com.ocean.alarm.entity.AlarmRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlarmRecordRepository extends JpaRepository<AlarmRecord, Long> {
    List<AlarmRecord> findByFarmId(Long farmId);
}
