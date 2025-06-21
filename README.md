# 渔场管理系统

基于前后端分离架构的渔场管理系统，提供渔场环境监测、设备控制、鱼群管理等功能。

## 项目结构

```
渔场管理系统/
├── frontend/                # 前端React应用
│   ├── public/              # 静态资源
│   ├── src/                 # 源代码
│   │   ├── components/      # 组件
│   │   ├── pages/           # 页面
│   │   ├── services/        # API服务
│   │   ├── utils/           # 工具函数
│   │   └── App.js           # 应用入口
│   ├── package.json         # 依赖配置
│   └── README.md            # 前端说明
│
├── backend/                 # 后端微服务
│   ├── common/              # 公共模块
│   ├── user-service/        # 用户服务
│   ├── farm-service/        # 渔场服务
│   ├── device-service/      # 设备服务
│   ├── alarm-service/       # 预警服务
│   ├── gateway/             # API网关
│   ├── registry/            # 服务注册中心
│   └── README.md            # 后端说明
│
└── docs/                    # 项目文档
    ├── 项目框架设计.md       # 框架设计文档
    └── 软件设计报告.md       # 设计报告
```

## 技术栈

### 前端
- React.js - 前端框架
- Ant Design - UI组件库
- Redux - 状态管理
- ECharts - 数据可视化

### 后端
- Spring Boot - 应用框架
- Spring Cloud - 微服务框架
- Spring Security + JWT - 安全框架
- MySQL - 关系型数据库
- Redis - 缓存
- InfluxDB - 时序数据库
- RabbitMQ - 消息队列
- MQTT - 物联网通信协议

## 快速开始

### 前端启动
```bash
cd frontend
npm install
npm start
```

### 后端启动
```bash
cd backend
# 启动注册中心
cd registry
./mvnw spring-boot:run

# 启动各微服务
cd ../user-service
./mvnw spring-boot:run

# 启动其他服务...
```

## 功能模块

- 用户管理 - 用户注册、登录、权限管理
- 渔场管理 - 渔场信息、环境监测、鱼群管理
- 设备控制 - 设备状态监控、远程控制
- 预警通知 - 阈值设置、异常检测、通知推送
- 数据可视化 - 环境数据图表、鱼群统计

## 开发团队

南开大学软件工程课程团队项目 终期