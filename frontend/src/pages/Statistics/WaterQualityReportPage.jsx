import React, { useState } from 'react';
import { Card, Row, Col, Select, DatePicker, Space, Typography, Divider } from 'antd';
import { AreaChartOutlined } from '@ant-design/icons';
import WaterQualityReport from '../../components/WaterQualityReport';
import moment from 'moment';

const { Option } = Select;
const { Title } = Typography;

// 水质数据报表页面
const WaterQualityReportPage = () => {
  // 默认选择当前年月的上一个月
  const defaultDate = moment().subtract(1, 'months');
  const [year, setYear] = useState(defaultDate.format('YYYY'));
  const [month, setMonth] = useState(defaultDate.format('MM'));

  // 处理年份变化
  const handleYearChange = (value) => {
    setYear(value);
  };

  // 处理月份变化
  const handleMonthChange = (value) => {
    setMonth(value);
  };

  // 处理日期选择器变化
  const handleDatePickerChange = (date) => {
    if (date) {
      setYear(date.format('YYYY'));
      setMonth(date.format('MM'));
    }
  };

  // 生成年份选项
  const generateYearOptions = () => {
    const currentYear = moment().year();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear; i++) {
      years.push(i.toString());
    }
    return years;
  };

  // 生成月份选项
  const generateMonthOptions = () => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i < 10 ? `0${i}` : `${i}`);
    }
    return months;
  };

  return (
    <div className="water-quality-report-page">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={4}>
                  <AreaChartOutlined /> 水质数据报表
                </Title>
                <Divider style={{ margin: '12px 0' }} />
                <Typography.Paragraph>
                  本报表基于水质监测数据，提供水质趋势分析、水质类别分布、异常数据分析和综合评估报告，
                  帮助您全面了解水质状况并做出科学决策。
                </Typography.Paragraph>
              </div>
              <Space size="large">
                <Space>
                  <span>选择年份：</span>
                  <Select 
                    value={year} 
                    onChange={handleYearChange} 
                    style={{ width: 100 }}
                  >
                    {generateYearOptions().map(y => (
                      <Option key={y} value={y}>{y}年</Option>
                    ))}
                  </Select>
                </Space>
                <Space>
                  <span>选择月份：</span>
                  <Select 
                    value={month} 
                    onChange={handleMonthChange} 
                    style={{ width: 100 }}
                  >
                    {generateMonthOptions().map(m => (
                      <Option key={m} value={m}>{m}月</Option>
                    ))}
                  </Select>
                </Space>
                <Space>
                  <span>快速选择：</span>
                  <DatePicker 
                    picker="month" 
                    onChange={handleDatePickerChange}
                    defaultValue={defaultDate}
                    format="YYYY年MM月"
                  />
                </Space>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <WaterQualityReport year={year} month={month} />
        </Col>
      </Row>
    </div>
  );
};

export default WaterQualityReportPage;