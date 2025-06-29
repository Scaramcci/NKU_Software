package com.ocean.farm.service;

import com.ocean.farm.entity.EnvironmentData;
import com.ocean.farm.entity.Farm;
import com.ocean.farm.repository.EnvironmentDataRepository;
import com.ocean.farm.repository.FarmRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DataAnalysisService {

    private final EnvironmentDataRepository environmentDataRepository;
    private final FarmRepository farmRepository;

    public DataAnalysisService(EnvironmentDataRepository environmentDataRepository, 
                             FarmRepository farmRepository) {
        this.environmentDataRepository = environmentDataRepository;
        this.farmRepository = farmRepository;
    }

    /**
     * 从CSV文件导入环境数据
     */
    public int importDataFromFile(MultipartFile file, Long farmId) throws Exception {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }

        Farm farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new RuntimeException("渔场不存在"));

        List<EnvironmentData> dataList = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            
            String line;
            boolean isFirstLine = true;
            
            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // 跳过标题行
                }
                
                String[] values = line.split(",");
                if (values.length >= 4) {
                    EnvironmentData data = new EnvironmentData();
                    data.setFarm(farm);
                    
                    try {
                        data.setWaterTemperature(Double.parseDouble(values[0].trim()));
                        data.setSalinity(Double.parseDouble(values[1].trim()));
                        data.setDissolvedOxygen(Double.parseDouble(values[2].trim()));
                        data.setPh(Double.parseDouble(values[3].trim()));
                        
                        if (values.length > 4 && !values[4].trim().isEmpty()) {
                            data.setRecordedAt(LocalDateTime.parse(values[4].trim(), 
                                    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                        } else {
                            data.setRecordedAt(LocalDateTime.now());
                        }
                        
                        dataList.add(data);
                    } catch (NumberFormatException e) {
                        // 跳过格式错误的行
                        continue;
                    }
                }
            }
        }
        
        environmentDataRepository.saveAll(dataList);
        return dataList.size();
    }

    /**
     * 导出环境数据为CSV格式
     */
    public byte[] exportDataToCsv(Long farmId, String startDate, String endDate) throws Exception {
        List<EnvironmentData> dataList;
        
        if (startDate != null && endDate != null) {
            LocalDateTime start = LocalDateTime.parse(startDate + " 00:00:00", 
                    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            LocalDateTime end = LocalDateTime.parse(endDate + " 23:59:59", 
                    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            dataList = environmentDataRepository.findByFarmIdAndRecordedAtBetween(farmId, start, end);
        } else {
            dataList = environmentDataRepository.findByFarmId(farmId);
        }
        
        StringBuilder csv = new StringBuilder();
        csv.append("水温(℃),盐度(PSU),溶解氧(mg/L),pH值,记录时间\n");
        
        for (EnvironmentData data : dataList) {
            csv.append(data.getWaterTemperature()).append(",")
               .append(data.getSalinity()).append(",")
               .append(data.getDissolvedOxygen()).append(",")
               .append(data.getPh()).append(",")
               .append(data.getRecordedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
               .append("\n");
        }
        
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    /**
     * 获取数据统计分析
     */
    public Map<String, Object> getDataStatistics(Long farmId, String period) {
        List<EnvironmentData> dataList = getDataByPeriod(farmId, period);
        
        Map<String, Object> statistics = new HashMap<>();
        
        if (!dataList.isEmpty()) {
            // 水温统计
            DoubleSummaryStatistics tempStats = dataList.stream()
                    .mapToDouble(EnvironmentData::getWaterTemperature)
                    .summaryStatistics();
            
            // 盐度统计
            DoubleSummaryStatistics salinityStats = dataList.stream()
                    .mapToDouble(EnvironmentData::getSalinity)
                    .summaryStatistics();
            
            // 溶解氧统计
            DoubleSummaryStatistics oxygenStats = dataList.stream()
                    .mapToDouble(EnvironmentData::getDissolvedOxygen)
                    .summaryStatistics();
            
            // pH统计
            DoubleSummaryStatistics phStats = dataList.stream()
                    .mapToDouble(EnvironmentData::getPh)
                    .summaryStatistics();
            
            statistics.put("waterTemperature", Map.of(
                    "avg", tempStats.getAverage(),
                    "min", tempStats.getMin(),
                    "max", tempStats.getMax(),
                    "count", tempStats.getCount()
            ));
            
            statistics.put("salinity", Map.of(
                    "avg", salinityStats.getAverage(),
                    "min", salinityStats.getMin(),
                    "max", salinityStats.getMax(),
                    "count", salinityStats.getCount()
            ));
            
            statistics.put("dissolvedOxygen", Map.of(
                    "avg", oxygenStats.getAverage(),
                    "min", oxygenStats.getMin(),
                    "max", oxygenStats.getMax(),
                    "count", oxygenStats.getCount()
            ));
            
            statistics.put("ph", Map.of(
                    "avg", phStats.getAverage(),
                    "min", phStats.getMin(),
                    "max", phStats.getMax(),
                    "count", phStats.getCount()
            ));
        }
        
        return statistics;
    }

    /**
     * 获取数据趋势分析
     */
    public Map<String, Object> getDataTrends(Long farmId, String period) {
        List<EnvironmentData> dataList = getDataByPeriod(farmId, period);
        
        Map<String, Object> trends = new HashMap<>();
        
        // 按时间排序
        dataList.sort(Comparator.comparing(EnvironmentData::getRecordedAt));
        
        List<Map<String, Object>> timeSeriesData = dataList.stream()
                .map(data -> Map.of(
                        "time", data.getRecordedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")),
                        "waterTemperature", data.getWaterTemperature(),
                        "salinity", data.getSalinity(),
                        "dissolvedOxygen", data.getDissolvedOxygen(),
                        "ph", data.getPh()
                ))
                .collect(Collectors.toList());
        
        trends.put("timeSeries", timeSeriesData);
        trends.put("dataCount", dataList.size());
        
        return trends;
    }

    /**
     * 检测异常数据
     */
    public List<EnvironmentData> detectAnomalies(Long farmId) {
        List<EnvironmentData> allData = environmentDataRepository.findByFarmId(farmId);
        List<EnvironmentData> anomalies = new ArrayList<>();
        
        for (EnvironmentData data : allData) {
            boolean isAnomaly = false;
            
            // 水温异常检测 (正常范围: 15-25℃)
            if (data.getWaterTemperature() < 15 || data.getWaterTemperature() > 25) {
                isAnomaly = true;
            }
            
            // pH异常检测 (正常范围: 7.0-8.5)
            if (data.getPh() < 7.0 || data.getPh() > 8.5) {
                isAnomaly = true;
            }
            
            // 溶解氧异常检测 (正常范围: 5-10 mg/L)
            if (data.getDissolvedOxygen() < 5 || data.getDissolvedOxygen() > 10) {
                isAnomaly = true;
            }
            
            // 盐度异常检测 (正常范围: 28-35 PSU)
            if (data.getSalinity() < 28 || data.getSalinity() > 35) {
                isAnomaly = true;
            }
            
            if (isAnomaly) {
                anomalies.add(data);
            }
        }
        
        return anomalies;
    }

    /**
     * 生成数据报告
     */
    public Map<String, Object> generateReport(Long farmId, String reportType) {
        Map<String, Object> report = new HashMap<>();
        
        // 获取基础统计信息
        Map<String, Object> statistics = getDataStatistics(farmId, "month");
        
        // 获取异常数据
        List<EnvironmentData> anomalies = detectAnomalies(farmId);
        
        // 获取趋势数据
        Map<String, Object> trends = getDataTrends(farmId, "week");
        
        report.put("farmId", farmId);
        report.put("reportType", reportType != null ? reportType : "comprehensive");
        report.put("generatedAt", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        report.put("statistics", statistics);
        report.put("anomaliesCount", anomalies.size());
        report.put("trends", trends);
        
        // 生成建议
        List<String> recommendations = generateRecommendations(statistics, anomalies);
        report.put("recommendations", recommendations);
        
        return report;
    }

    private List<EnvironmentData> getDataByPeriod(Long farmId, String period) {
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime;
        
        switch (period != null ? period : "week") {
            case "day":
                startTime = endTime.minusDays(1);
                break;
            case "month":
                startTime = endTime.minusMonths(1);
                break;
            case "year":
                startTime = endTime.minusYears(1);
                break;
            default:
                startTime = endTime.minusWeeks(1);
        }
        
        return environmentDataRepository.findByFarmIdAndRecordedAtBetween(farmId, startTime, endTime);
    }

    private List<String> generateRecommendations(Map<String, Object> statistics, List<EnvironmentData> anomalies) {
        List<String> recommendations = new ArrayList<>();
        
        if (!anomalies.isEmpty()) {
            recommendations.add("检测到 " + anomalies.size() + " 条异常数据，建议及时检查设备和环境状况");
        }
        
        // 基于统计数据生成建议
        if (statistics.containsKey("waterTemperature")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> tempStats = (Map<String, Object>) statistics.get("waterTemperature");
            double avgTemp = (Double) tempStats.get("avg");
            
            if (avgTemp < 18) {
                recommendations.add("平均水温偏低，建议适当加温以促进鱼类生长");
            } else if (avgTemp > 23) {
                recommendations.add("平均水温偏高，建议加强通风或降温措施");
            }
        }
        
        if (recommendations.isEmpty()) {
            recommendations.add("环境数据正常，继续保持良好的管理状态");
        }
        
        return recommendations;
    }
}