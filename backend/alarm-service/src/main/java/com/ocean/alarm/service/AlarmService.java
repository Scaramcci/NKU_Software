package com.ocean.alarm.service;

import com.ocean.alarm.entity.AlarmRecord;
import com.ocean.alarm.entity.AlarmThreshold;
import com.ocean.alarm.repository.AlarmRecordRepository;
import com.ocean.alarm.repository.AlarmThresholdRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlarmService {

    private final AlarmThresholdRepository thresholdRepository;
    private final AlarmRecordRepository recordRepository;

    public AlarmService(AlarmThresholdRepository thresholdRepository, AlarmRecordRepository recordRepository) {
        this.thresholdRepository = thresholdRepository;
        this.recordRepository = recordRepository;
    }

    // 预警阈值增删改查
    public List<AlarmThreshold> getThresholds(Long farmId) {
        return thresholdRepository.findByFarmId(farmId);
    }

    public AlarmThreshold addOrUpdateThreshold(AlarmThreshold threshold) {
        threshold.setCreatedAt(LocalDateTime.now());
        return thresholdRepository.save(threshold);
    }

    public void deleteThreshold(Long id) {
        thresholdRepository.deleteById(id);
    }

    // 查询告警记录
    public List<AlarmRecord> getAlarmRecords(Long farmId) {
        return recordRepository.findByFarmId(farmId);
    }

    // 模拟告警触发（可由定时任务调用）
    public void checkAndTriggerAlarm(Long farmId, String parameter, Double currentValue) {
        List<AlarmThreshold> thresholds = thresholdRepository.findByFarmId(farmId);
        for (AlarmThreshold threshold : thresholds) {
            if (threshold.getParameter().equals(parameter)) {
                boolean alarm = false;
                switch (threshold.getOperator()) {
                    case ">":
                        alarm = currentValue > threshold.getThresholdValue();
                        break;
                    case "<":
                        alarm = currentValue < threshold.getThresholdValue();
                        break;
                    default:
                        break;
                }
                if (alarm) {
                    AlarmRecord record = new AlarmRecord();
                    record.setFarmId(farmId);
                    record.setParameter(parameter);
                    record.setCurrentValue(currentValue);
                    record.setThresholdValue(threshold.getThresholdValue());
                    record.setRecordedAt(LocalDateTime.now());
                    recordRepository.save(record);
                }
            }
        }
    }
}
