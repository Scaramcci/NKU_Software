package com.ocean.farm.repository;

import com.ocean.farm.entity.EnvironmentData;
import com.ocean.farm.entity.Farm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnvironmentDataRepository extends JpaRepository<EnvironmentData, Long> {
    List<EnvironmentData> findByFarmId(Long farmId);
}
