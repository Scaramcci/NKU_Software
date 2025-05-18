package com.ocean.device.repository;

import com.ocean.device.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByFarmId(Long farmId);
}
