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

    // 查询预警阈值列表
    public List<AlarmThreshold> getThresholds(Long farmId) {
        return thresholdRepository.findByFarmId(farmId);
    }

    // 添加或更新阈值
    public AlarmThreshold addOrUpdateThreshold(AlarmThreshold threshold) {
        threshold.setCreatedAt(LocalDateTime.now());
        return thresholdRepository.save(threshold);
    }

    // 删除阈值
    public void deleteThreshold(Long id) {
        thresholdRepository.deleteById(id);
    }

    // 查询告警记录
    public List<AlarmRecord> getAlarmRecords(Long farmId) {
        return recordRepository.findByFarmId(farmId);
    }

    // 模拟告警检测与记录
    public void checkAndTriggerAlarm(Long farmId, String parameter, Double currentValue) {
        List<AlarmThreshold> thresholds = thresholdRepository.findByFarmId(farmId);
        for (AlarmThreshold threshold : thresholds) {
            if (parameter.equals(threshold.getParameter())) {
                boolean alarmTriggered = false;
                switch (threshold.getOperator()) {
                    case ">":
                        alarmTriggered = currentValue > threshold.getThresholdValue();
                        break;
                    case "<":
                        alarmTriggered = currentValue < threshold.getThresholdValue();
                        break;
                    // 可以根据需要添加更多比较符
                    default:
                        break;
                }

                if (alarmTriggered) {
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
