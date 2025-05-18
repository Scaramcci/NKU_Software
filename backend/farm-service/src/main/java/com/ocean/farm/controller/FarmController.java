package com.ocean.farm.controller;

import com.ocean.farm.entity.EnvironmentData;
import com.ocean.farm.entity.Farm;
import com.ocean.farm.service.FarmService;
import com.ocean.common.response.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farms")
@Api(tags = "渔场管理接口")
public class FarmController {

    private final FarmService farmService;

    public FarmController(FarmService farmService) {
        this.farmService = farmService;
    }

    @ApiOperation("获取所有渔场列表")
    @GetMapping
    public Result<List<Farm>> getAllFarms() {
        return Result.success(farmService.getAllFarms());
    }

    @ApiOperation("获取指定渔场信息")
    @GetMapping("/{id}")
    public Result<Farm> getFarmById(@PathVariable Long id) {
        return Result.success(farmService.getFarmById(id));
    }

    @ApiOperation("创建渔场")
    @PostMapping
    public Result<Farm> createFarm(@RequestBody Farm farm) {
        return Result.success(farmService.createFarm(farm));
    }

    @ApiOperation("更新渔场信息")
    @PutMapping("/{id}")
    public Result<Farm> updateFarm(@PathVariable Long id, @RequestBody Farm updated) {
        return Result.success(farmService.updateFarm(id, updated));
    }

    @ApiOperation("删除渔场")
    @DeleteMapping("/{id}")
    public Result<String> deleteFarm(@PathVariable Long id) {
        farmService.deleteFarm(id);
        return Result.success("删除成功");
    }

    @ApiOperation("获取渔场环境数据（模拟）")
    @GetMapping("/{id}/env-data")
    public Result<List<EnvironmentData>> getEnvData(@PathVariable Long id) {
        return Result.success(farmService.getEnvData(id));
    }
}
