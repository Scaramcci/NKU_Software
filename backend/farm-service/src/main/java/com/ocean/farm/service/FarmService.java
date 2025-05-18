package com.ocean.farm.service;

import com.ocean.farm.entity.EnvironmentData;
import com.ocean.farm.entity.Farm;
import com.ocean.farm.repository.EnvironmentDataRepository;
import com.ocean.farm.repository.FarmRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class FarmService {

    private final FarmRepository farmRepository;
    private final EnvironmentDataRepository environmentDataRepository;
    private final Random random = new Random();

    public FarmService(FarmRepository farmRepository, EnvironmentDataRepository environmentDataRepository) {
        this.farmRepository = farmRepository;
        this.environmentDataRepository = environmentDataRepository;
    }

    // CRUD 渔场
    public List<Farm> getAllFarms() {
        return farmRepository.findAll();
    }

    public Farm getFarmById(Long id) {
        return farmRepository.findById(id).orElseThrow(() -> new RuntimeException("渔场不存在"));
    }

    public Farm createFarm(Farm farm) {
        return farmRepository.save(farm);
    }

    public Farm updateFarm(Long id, Farm updated) {
        Farm farm = getFarmById(id);
        farm.setName(updated.getName());
        farm.setDescription(updated.getDescription());
        farm.setVideoUrl(updated.getVideoUrl());
        farm.setLatitude(updated.getLatitude());
        farm.setLongitude(updated.getLongitude());
        farm.setUpdatedAt(LocalDateTime.now());
        return farmRepository.save(farm);
    }

    public void deleteFarm(Long id) {
        farmRepository.deleteById(id);
    }

    // 获取渔场环境数据（模拟生成）
    public List<EnvironmentData> getEnvData(Long farmId) {
        // 也可以用真实传感器，这里模拟 1 条
        EnvironmentData data = new EnvironmentData();
        data.setFarm(getFarmById(farmId));
        data.setWaterTemperature(18.0 + random.nextDouble() * 5); // 18~23℃
        data.setSalinity(30.0 + random.nextDouble() * 2);         // 30~32 PSU
        data.setDissolvedOxygen(6.0 + random.nextDouble() * 2);   // 6~8 mg/L
        data.setPh(7.5 + random.nextDouble() * 0.5);              // 7.5~8.0
        data.setRecordedAt(LocalDateTime.now());
        environmentDataRepository.save(data);

        return environmentDataRepository.findByFarmId(farmId);
    }
}
