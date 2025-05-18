package com.ocean.device.service;

import com.ocean.device.entity.Device;
import com.ocean.device.repository.DeviceRepository;
import com.ocean.farm.repository.FarmRepository;
import com.ocean.farm.entity.Farm;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final FarmRepository farmRepository;

    public DeviceService(DeviceRepository deviceRepository, FarmRepository farmRepository) {
        this.deviceRepository = deviceRepository;
        this.farmRepository = farmRepository;
    }

    // 获取所有设备
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    // 根据渔场ID获取设备列表
    public List<Device> getDevicesByFarmId(Long farmId) {
        return deviceRepository.findByFarmId(farmId);
    }

    // 获取设备详情
    public Device getDeviceById(Long id) {
        return deviceRepository.findById(id).orElseThrow(() -> new RuntimeException("设备不存在"));
    }

    // 新增设备
    public Device createDevice(Device device, Long farmId) {
        Farm farm = farmRepository.findById(farmId).orElseThrow(() -> new RuntimeException("渔场不存在"));
        device.setFarm(farm);
        device.setCreatedAt(LocalDateTime.now());
        device.setUpdatedAt(LocalDateTime.now());
        return deviceRepository.save(device);
    }

    // 更新设备信息
    public Device updateDevice(Long id, Device updated) {
        Device device = getDeviceById(id);
        device.setName(updated.getName());
        device.setType(updated.getType());
        device.setStatus(updated.getStatus());
        device.setDescription(updated.getDescription());
        device.setUpdatedAt(LocalDateTime.now());
        return deviceRepository.save(device);
    }

    // 删除设备
    public void deleteDevice(Long id) {
        deviceRepository.deleteById(id);
    }

    // 设备远程控制模拟
    public Device controlDevice(Long id, String command) {
        Device device = getDeviceById(id);
        // 简单模拟控制命令：ON/OFF
        if ("ON".equalsIgnoreCase(command)) {
            device.setStatus("ON");
        } else if ("OFF".equalsIgnoreCase(command)) {
            device.setStatus("OFF");
        } else {
            throw new RuntimeException("无效控制命令");
        }
        device.setUpdatedAt(LocalDateTime.now());
        return deviceRepository.save(device);
    }
}
