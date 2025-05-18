package com.ocean.farm.repository;

import com.ocean.farm.entity.Farm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FarmRepository extends JpaRepository<Farm, Long> {
    // 可根据需要扩展自定义查询，如根据坐标查找渔场等
}
