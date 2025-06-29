# 海洋牧场大数据可视化系统

一个基于前后端分离架构的现代化海洋牧场管理系统，集成了实时监控、设备控制、数据分析、智能预警等功能，致力于推进"物联网 + 渔业"的深度融合，构建以数据驱动、智能感知、可视化运维为核心的现代养殖体系。

## 📋 目录

- [项目概述](#项目概述)
- [技术架构](#技术架构)
- [功能特色](#功能特色)
- [快速启动](#快速启动)
- [API文档](#api文档)
- [部署指南](#部署指南)
- [开发团队](#开发团队)
- [许可证](#许可证)

## 🌊 项目概述

### 开发背景

随着中国水产养殖业的规模不断扩大，传统渔场管理方式面临着人力依赖高、环境监测不及时、设备控制效率低、病害预警机制不足等问题。为应对这些挑战，国家"十四五"发展规划提出"建设智慧海洋牧场"，推进"物联网 + 渔业"的深度融合。

本项目正是在这一背景下提出，旨在借助物联网技术、传感器网络、大数据分析和现代前后端开发框架，打造一个可视化、智能化、平台化的现代渔场管理系统。

### 项目目标

- 🎯 构建基于前后端分离架构的渔场管理系统，实现多角色、多终端协同管理
- 📊 实现对渔场环境的实时监测与可视化展示，提升养殖风险感知能力
- 🎮 提供设备远程控制与状态管理能力，降低人工成本
- ⚠️ 支持环境异常预警、鱼群变化分析等智能辅助决策功能
- 📈 提供图形化仪表盘，直观展示各类监测与分析结果

### 用户角色

| 角色 | 描述 | 权限范围 |
|------|------|----------|
| **管理员** | 系统全权限管理者 | 用户管理、系统配置、数据导出、权限分配 |
| **养殖户** | 日常运营管理者 | 设备控制、数据查看、报警处理、渔场管理 |
| **普通用户** | 基础信息查看者 | 查看公开数据、监控视频、帮助文档 |

## 🏗️ 技术架构

### 整体架构

```
前端(React) -> API网关(8000) -> 微服务集群
                                  ├── 用户服务(8081)
                                  ├── 渔场服务
                                  ├── 设备服务
                                  └── 报警服务
                    ↓
                 数据库(MySQL + Redis)
```

### 后端技术栈

- **核心框架**: Spring Boot 2.6.3 + Spring Cloud
- **微服务治理**: Eureka (服务注册发现) + Gateway (API网关)
- **数据库**: MySQL 8.0 + Redis 6.2
- **安全认证**: Spring Security + JWT
- **数据处理**: Spring Data JPA + Hibernate
- **API文档**: Swagger/OpenAPI 3.0
- **构建工具**: Maven 3.8+
- **数据分析**: Apache Commons Math3, Commons CSV

### 前端技术栈

- **核心框架**: React 18.2.0
- **UI组件库**: Ant Design 5.25.1
- **状态管理**: Redux Toolkit 2.2.1 + React-Redux 8.1.3
- **路由管理**: React Router DOM 6.30.0
- **HTTP客户端**: Axios 1.6.2
- **图表可视化**: ECharts 5.4.3 + Chart.js 4.4.9
- **时间处理**: Day.js + Moment.js
- **文件处理**: html2canvas (图表导出) + PapaParse (CSV处理)
- **构建工具**: Create React App 5.0.1

### 项目结构

```
NKU_Software/
├── backend/                 # 后端微服务架构
│   ├── registry/           # Eureka注册中心 (8761)
│   ├── gateway/            # Spring Cloud Gateway (8000)
│   ├── user-service/       # 用户服务 (8081)
│   ├── farm-service/       # 渔场服务 (数据分析、环境监测)
│   ├── device-service/     # 设备服务 (IoT设备控制)
│   ├── alarm-service/      # 预警服务 (智能告警)
│   └── common/             # 公共模块 (工具类、响应格式)
├── frontend/               # React前端应用
│   ├── src/
│   │   ├── components/     # 可复用组件
│   │   ├── pages/          # 页面组件
│   │   │   ├── MainInfo/   # 主控制台
│   │   │   ├── DataCenter/ # 数据中心
│   │   │   ├── SmartCenter/# 智能中心
│   │   │   └── RealTimeInfo/# 实时监控
│   │   ├── services/       # API服务层
│   │   ├── utils/          # 工具函数
│   │   └── assets/         # 静态资源
│   ├── public/             # 公共静态文件
│   └── package.json        # 依赖配置
├── 软件工程大作业数据/        # 测试数据集
├── 项目文档.md              # 详细项目文档
└── README.md               # 项目说明文档
```

## ✨ 功能特色

### 🔄 全流程数字化渔场管理
覆盖用户注册、权限分配、渔场基础信息、鱼群数据、环境监测、设备控制、预警通知、数据分析等渔业养殖全流程，实现一站式数字化管理。

### 🌊 环境与鱼群双重监控
不仅实时采集和展示水质等环境参数，还对鱼群数量、种类、健康状况等进行集中管理，支持后续智能识别和评分，提升养殖科学性。

### 🚨 智能预警与辅助决策
支持多维度预警规则配置，自动检测环境异常、设备故障等风险，及时通知养殖户，辅助其科学决策和风险防控。

### 🎮 设备远程控制与维护
实现对各类渔场设备的远程启停、状态监控和维护管理，降低人工干预，提高运维效率。

### 👥 多角色多终端协同
支持不同用户角色（如管理员、养殖员等）分工协作，系统适配桌面和移动端，满足多场景、多用户的实际需求。

### 📊 数据驱动的养殖优化
通过数据统计、趋势分析、报表生成等功能，帮助用户发现养殖过程中的问题和优化空间，推动养殖模式向智能化、精细化转型。

### 📈 高级数据分析功能
- **图表下载**: 支持将雷达图、桑基图等可视化图表导出为PNG格式
- **数据导出**: 支持将原始数据导出为CSV格式，便于进一步分析
- **实时统计**: 提供数据库交互统计、设备运行状态等实时数据展示
- **多维度可视化**: 集成ECharts、Chart.js等多种图表库，提供丰富的数据展示方式

## 🚀 快速启动

### 环境要求

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| **Node.js** | 16.20.0+ | 前端运行环境 |
| **Java** | 1.8.0+ | 后端运行环境 |
| **MySQL** | 8.0+ | 主数据库 |
| **Redis** | 6.2+ | 缓存数据库 |
| **Maven** | 3.8+ | 后端构建工具 |

### 数据库配置

1. 创建数据库：
```sql
CREATE DATABASE ocean_farm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 配置数据库连接（backend/*/src/main/resources/application.yml）：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ocean_farm?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC
    username: your_username
    password: your_password
```

### 后端服务启动

**按以下顺序启动微服务：**

```bash
# 1. 启动注册中心 (端口: 8761)
cd backend/registry
mvn clean compile
mvn spring-boot:run

# 2. 启动API网关 (端口: 8000)
cd backend/gateway
mvn clean compile
mvn spring-boot:run

# 3. 启动用户服务 (端口: 8081)
cd backend/user-service
mvn clean compile
mvn spring-boot:run

# 4. 启动渔场服务
cd backend/farm-service
mvn clean compile
mvn spring-boot:run

# 5. 启动设备服务
cd backend/device-service
mvn clean compile
mvn spring-boot:run

# 6. 启动预警服务
cd backend/alarm-service
mvn clean compile
mvn spring-boot:run
```

### 前端服务启动

```bash
cd frontend

# 安装依赖（包含新增的图表下载功能依赖）
npm install

# 启动开发服务器
npm start
```

### 🌐 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| **前端应用** | http://localhost:3000 | React应用主页 |
| **API网关** | http://localhost:8000 | 统一API入口 |
| **注册中心** | http://localhost:8761 | Eureka控制台 |
| **用户服务** | http://localhost:8081 | 用户管理API |

### 👤 默认账户

| 角色 | 用户名 | 密码 | 权限说明 |
|------|--------|------|----------|
| **管理员** | admin | admin123 | 系统全部功能权限 |
| **普通用户** | user | user123 | 基础查看权限 |

## 📚 API文档

### Swagger文档
启动后端服务后，可通过以下地址访问API文档：
- **用户服务API**: http://localhost:8081/swagger-ui.html
- **完整API文档**: http://localhost:8000/swagger-ui.html

### 主要API接口

#### 用户管理
```http
# 用户注册
POST /api/users/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com"
}

# 用户登录
POST /api/users/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

#### 设备控制
```http
# 获取设备列表
GET /api/devices
Authorization: Bearer {jwt_token}

# 控制设备
POST /api/devices/{deviceId}/control
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "command": "ON",
  "parameters": {}
}
```

#### 数据分析
```http
# 获取环境数据统计
GET /api/farm/environmental-stats
Authorization: Bearer {jwt_token}

# 获取数据库交互统计
GET /api/farm/database-stats
Authorization: Bearer {jwt_token}
```

## 🚀 部署指南

### 生产环境部署

#### 宝塔服务器部署

**服务器配置要求：**
- CPU: 2核心以上
- 内存: 4GB以上
- 存储: 50GB以上
- 操作系统: CentOS 7.9+ / Ubuntu 18.04+

**部署步骤：**

1. **安装宝塔面板**
```bash
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
```

2. **安装必要组件**
- Nginx 1.20+
- MySQL 8.0+
- Redis 6.2+
- Java 1.8+
- Node.js 16+

3. **前端部署**
```bash
# 构建前端项目
cd frontend
npm run build

# 配置Nginx
server {
    listen 3000;
    server_name your_domain.com;
    root /www/wwwroot/ocean_farm/frontend/build;
    index index.html;
    
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

4. **后端部署**
```bash
# 打包后端服务
cd backend
mvn clean package -DskipTests

# 使用Docker Compose部署（推荐）
docker-compose up -d
```

### Docker部署

```yaml
# docker-compose.yml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: ocean_farm
    ports:
      - "3306:3306"
  
  redis:
    image: redis:6.2
    ports:
      - "6379:6379"
  
  registry:
    build: ./backend/registry
    ports:
      - "8761:8761"
  
  gateway:
    build: ./backend/gateway
    ports:
      - "8000:8000"
    depends_on:
      - registry
```

## 👨‍💻 开发团队

| 成员 | 角色 | 主要职责 |
|------|------|----------|
| **钟坤原** | 架构师 & 全栈开发 | 项目整体架构设计、框架搭建、智能Agent模块、移动端适配 |
| **刘星宇** | 前端开发工程师 | 前端功能开发、UI/UX设计、用户体验优化、前后端接口联调 |
| **崔扬** | 后端开发工程师 | 后端核心功能开发、业务逻辑实现、系统集成与优化 |
| **文雅竹** | 运维工程师 | 系统部署、服务器管理、数据收集整理、API调研与集成 |

## 📄 许可证

MIT License

Copyright (c) 2024 海洋牧场大数据可视化系统开发团队

本项目采用MIT许可证，详情请参阅 [LICENSE](LICENSE) 文件。

---

**🌟 如果这个项目对您有帮助，请给我们一个Star！**

**📧 联系我们**: 如有问题或建议，欢迎提交Issue或Pull Request。
