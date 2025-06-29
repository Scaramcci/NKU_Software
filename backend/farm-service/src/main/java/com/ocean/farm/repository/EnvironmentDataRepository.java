package com.ocean.farm.repository;

import com.ocean.farm.entity.EnvironmentData;
import com.ocean.farm.entity.Farm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EnvironmentDataRepository extends JpaRepository<EnvironmentData, Long> {
    List<EnvironmentData> findByFarmId(Long farmId);
    
    List<EnvironmentData> findByFarmIdAndRecordedAtBetween(Long farmId, LocalDateTime startTime, LocalDateTime endTime);
    
    @Query("SELECT e FROM EnvironmentData e WHERE e.farm.id = :farmId ORDER BY e.recordedAt DESC")
    List<EnvironmentData> findByFarmIdOrderByRecordedAtDesc(@Param("farmId") Long farmId);
    
    @Query("SELECT COUNT(e) FROM EnvironmentData e WHERE e.farm.id = :farmId")
    Long countByFarmId(@Param("farmId") Long farmId);
}
