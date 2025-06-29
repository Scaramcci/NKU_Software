package com.ocean.farm.controller;

import com.ocean.farm.entity.EnvironmentData;
import com.ocean.farm.service.DataAnalysisService;
import com.ocean.common.response.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/data-analysis")
@Api(tags = "数据处理与分析接口")
public class DataAnalysisController {

    private final DataAnalysisService dataAnalysisService;

    public DataAnalysisController(DataAnalysisService dataAnalysisService) {
        this.dataAnalysisService = dataAnalysisService;
    }

    @ApiOperation("上传环境数据文件")
    @PostMapping("/upload")
    public Result<String> uploadData(@RequestParam("file") MultipartFile file,
                                   @RequestParam("farmId") Long farmId) {
        try {
            int count = dataAnalysisService.importDataFromFile(file, farmId);
            return Result.success("成功导入 " + count + " 条数据");
        } catch (Exception e) {
            return Result.error("数据导入失败: " + e.getMessage());
        }
    }

    @ApiOperation("导出环境数据")
    @GetMapping("/export/{farmId}")
    public ResponseEntity<byte[]> exportData(@PathVariable Long farmId,
                                           @RequestParam(required = false) String startDate,
                                           @RequestParam(required = false) String endDate) {
        try {
            byte[] csvData = dataAnalysisService.exportDataToCsv(farmId, startDate, endDate);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "environment_data_" + farmId + ".csv");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(csvData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @ApiOperation("获取数据统计分析")
    @GetMapping("/statistics/{farmId}")
    public Result<Map<String, Object>> getDataStatistics(@PathVariable Long farmId,
                                                        @RequestParam(required = false) String period) {
        Map<String, Object> statistics = dataAnalysisService.getDataStatistics(farmId, period);
        return Result.success(statistics);
    }

    @ApiOperation("获取数据趋势分析")
    @GetMapping("/trends/{farmId}")
    public Result<Map<String, Object>> getDataTrends(@PathVariable Long farmId,
                                                    @RequestParam(required = false) String period) {
        Map<String, Object> trends = dataAnalysisService.getDataTrends(farmId, period);
        return Result.success(trends);
    }

    @ApiOperation("获取异常数据检测")
    @GetMapping("/anomalies/{farmId}")
    public Result<List<EnvironmentData>> getAnomalies(@PathVariable Long farmId) {
        List<EnvironmentData> anomalies = dataAnalysisService.detectAnomalies(farmId);
        return Result.success(anomalies);
    }

    @ApiOperation("生成数据报告")
    @GetMapping("/report/{farmId}")
    public Result<Map<String, Object>> generateReport(@PathVariable Long farmId,
                                                     @RequestParam(required = false) String reportType) {
        Map<String, Object> report = dataAnalysisService.generateReport(farmId, reportType);
        return Result.success(report);
    }
}