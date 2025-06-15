// AI配置文件
export const AI_CONFIG = {
  // 豆包API配置
  DOUBAO: {
    API_URL: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    MODEL_ID: 'ep-20241230140648-8xzpz', // 请替换为您的实际模型ID
    API_KEY: process.env.REACT_APP_DOUBAO_API_KEY || 'YOUR_DOUBAO_API_KEY', // 从环境变量获取API密钥
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.7
  },
  
  // 系统提示词配置
  SYSTEM_PROMPTS: {
    FISHERY_ASSISTANT: `你是一个专业的智慧渔场AI助手，具备以下专业知识：

🐟 **水质管理专家**
- pH值监测与调节（适宜范围：7.0-8.5）
- 溶解氧管理（适宜范围：6-8mg/L）
- 氨氮控制（应低于0.5mg/L）
- 水温监控（根据鱼种调节）
- 水质检测频率建议

⚙️ **设备控制顾问**
- 增氧机运行策略
- 水泵系统管理
- 投饵机操作指导
- 过滤系统维护
- 设备故障诊断

🎣 **养殖技术专家**
- 不同鱼类生长习性
- 科学投喂策略
- 鱼病预防与治疗
- 养殖密度控制
- 生长周期管理

🌤️ **环境监测师**
- 天气变化应对
- 季节性管理调整
- 预警系统设置
- 应急处理方案

📊 **数据分析师**
- 历史数据分析
- 趋势预测
- 效益优化建议
- 成本控制策略

请用专业、友好的语气回答用户问题，提供实用的建议。回答要简洁明了，重点突出，必要时使用表格或列表形式展示信息。`
  },
  
  // 快捷回复模板
  QUICK_REPLIES: {
    WATER_QUALITY: {
      keywords: ['水质', '水温', 'pH', '溶解氧', '氨氮'],
      response: `🌊 **水质管理建议**

**关键指标监测：**
• pH值：7.0-8.5（最适宜范围）
• 溶解氧：≥6mg/L（充足供氧）
• 氨氮：<0.5mg/L（避免中毒）
• 水温：根据鱼种调节

**日常管理要点：**
1. 每日检测关键参数
2. 及时调节异常指标
3. 保持水体循环流动
4. 定期更换部分水体`
    },
    FEEDING: {
      keywords: ['投喂', '饲料', '喂食', '投饵'],
      response: `🐟 **科学投喂指导**

**投喂原则：**
• 定时：每日2-3次固定时间
• 定量：根据鱼体重的2-4%
• 定质：选择优质专用饲料
• 定位：固定投喂区域

**注意事项：**
1. 水温低于15℃减少投喂
2. 观察摄食情况调整用量
3. 避免过量投喂污染水质
4. 雨天或鱼病期间暂停投喂`
    },
    EQUIPMENT: {
      keywords: ['设备', '增氧', '水泵', '故障', '维护'],
      response: `⚙️ **设备管理指南**

**增氧系统：**
• 24小时监控溶解氧水平
• 夜间和阴雨天加强增氧
• 定期清洁增氧头

**水泵系统：**
• 保持水体循环流动
• 检查管道是否堵塞
• 定期更换滤网

**维护要点：**
1. 每周检查设备运行状态
2. 及时清理设备表面污垢
3. 建立设备维护记录
4. 准备备用设备应急`
    },
    WEATHER: {
      keywords: ['天气', '降雨', '台风', '高温', '低温'],
      response: `🌤️ **天气应对策略**

**降雨天气：**
• 加强增氧防缺氧
• 减少或停止投喂
• 监测水质变化

**高温天气：**
• 增加换水频率
• 加强遮阳措施
• 提高增氧强度

**低温天气：**
• 减少投喂量
• 保持水体深度
• 防止结冰

**极端天气：**
1. 提前做好防护准备
2. 加固设备和设施
3. 准备应急预案
4. 密切关注鱼群状态`
    }
  }
};

// 获取智能回复
export const getSmartReply = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  for (const [category, config] of Object.entries(AI_CONFIG.QUICK_REPLIES)) {
    if (config.keywords.some(keyword => message.includes(keyword))) {
      return config.response;
    }
  }
  
  return null;
};