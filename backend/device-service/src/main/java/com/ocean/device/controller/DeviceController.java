package com.ocean.device.controller;

import com.ocean.common.response.Result;
import com.ocean.device.entity.Device;
import com.ocean.device.service.DeviceService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/devices")
@Api(tags = "设备管理接口")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @ApiOperation("获取所有设备")
    @GetMapping
    public Result<List<Device>> getAllDevices(@RequestParam(required = false) Long farmId) {
        if (farmId != null) {
            return Result.success(deviceService.getDevicesByFarmId(farmId));
        }
        return Result.success(deviceService.getAllDevices());
    }

    @ApiOperation("获取设备详情")
    @GetMapping("/{id}")
    public Result<Device> getDeviceById(@PathVariable Long id) {
        return Result.success(deviceService.getDeviceById(id));
    }

    @ApiOperation("新增设备")
    @PostMapping
    public Result<Device> createDevice(@RequestBody Device device, @RequestParam Long farmId) {
        return Result.success(deviceService.createDevice(device, farmId));
    }

    @ApiOperation("更新设备")
    @PutMapping("/{id}")
    public Result<Device> updateDevice(@PathVariable Long id, @RequestBody Device updated) {
        return Result.success(deviceService.updateDevice(id, updated));
    }

    @ApiOperation("删除设备")
    @DeleteMapping("/{id}")
    public Result<String> deleteDevice(@PathVariable Long id) {
        deviceService.deleteDevice(id);
        return Result.success("设备删除成功");
    }

    @ApiOperation("远程控制设备")
    @PostMapping("/{id}/control")
    public Result<Device> controlDevice(@PathVariable Long id, @RequestBody Map<String, String> command) {
        String cmd = command.get("command");
        return Result.success(deviceService.controlDevice(id, cmd));
    }
}
