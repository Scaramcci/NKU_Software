package com.ocean.alarm.controller;
import com.ocean.alarm.entity.AlarmRecord;
import com.ocean.alarm.entity.AlarmThreshold;
import com.ocean.alarm.service.AlarmService;
import com.ocean.common.response.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alarms")
@Api(tags = "预警管理接口")
public class AlarmController {

    private final AlarmService alarmService;

    public AlarmController(AlarmService alarmService) {
        this.alarmService = alarmService;
    }

    @ApiOperation("获取预警阈值列表")
    @GetMapping("/thresholds")
    public Result<List<AlarmThreshold>> getThresholds(@RequestParam Long farmId) {
        return Result.success(alarmService.getThresholds(farmId));
    }

    @ApiOperation("添加或更新预警阈值")
    @PostMapping("/thresholds")
    public Result<AlarmThreshold> addOrUpdateThreshold(@RequestBody AlarmThreshold threshold) {
        return Result.success(alarmService.addOrUpdateThreshold(threshold));
    }

    @ApiOperation("删除预警阈值")
    @DeleteMapping("/thresholds/{id}")
    public Result<String> deleteThreshold(@PathVariable Long id) {
        alarmService.deleteThreshold(id);
        return Result.success("删除成功");
    }

    @ApiOperation("查询告警记录")
    @GetMapping("/records")
    public Result<List<AlarmRecord>> getAlarmRecords(@RequestParam Long farmId) {
        return Result.success(alarmService.getAlarmRecords(farmId));
    }
}
