// 渔场管理服务

// 模拟API调用，实际项目中应替换为真实的API请求
const farmService = {
  // 获取所有渔场
  getAllFarms: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const farms = JSON.parse(localStorage.getItem('farms') || '[]');
        resolve(farms);
      }, 500);
    });
  },

  // 获取单个渔场详情
  getFarmById: async (farmId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const farms = JSON.parse(localStorage.getItem('farms') || '[]');
        const farm = farms.find(f => f.id === farmId);
        if (farm) {
          resolve(farm);
        } else {
          reject(new Error('渔场不存在'));
        }
      }, 300);
    });
  },

  // 创建新渔场
  createFarm: async (farmData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const farms = JSON.parse(localStorage.getItem('farms') || '[]');
        const newFarm = {
          ...farmData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        };
        farms.push(newFarm);
        localStorage.setItem('farms', JSON.stringify(farms));
        resolve(newFarm);
      }, 500);
    });
  },

  // 更新渔场信息
  updateFarm: async (farmId, farmData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const farms = JSON.parse(localStorage.getItem('farms') || '[]');
        const index = farms.findIndex(f => f.id === farmId);
        if (index !== -1) {
          const updatedFarm = {
            ...farms[index],
            ...farmData,
            updatedAt: new Date().toISOString()
          };
          farms[index] = updatedFarm;
          localStorage.setItem('farms', JSON.stringify(farms));
          resolve(updatedFarm);
        } else {
          reject(new Error('渔场不存在'));
        }
      }, 500);
    });
  },

  // 删除渔场
  deleteFarm: async (farmId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const farms = JSON.parse(localStorage.getItem('farms') || '[]');
        const index = farms.findIndex(f => f.id === farmId);
        if (index !== -1) {
          farms.splice(index, 1);
          localStorage.setItem('farms', JSON.stringify(farms));
          resolve({ success: true });
        } else {
          reject(new Error('渔场不存在'));
        }
      }, 500);
    });
  },

  // 获取环境监测数据
  getEnvironmentData: async (farmId, period = 'today') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟不同时间段的环境数据
        const mockData = {
          today: {
            temperature: [25.2, 25.5, 26.1, 26.8, 27.2, 27.0, 26.5, 26.0],
            ph: [7.2, 7.3, 7.4, 7.3, 7.2, 7.1, 7.2, 7.3],
            oxygen: [6.8, 6.7, 6.5, 6.3, 6.2, 6.4, 6.6, 6.8],
            turbidity: [12, 13, 15, 14, 13, 12, 11, 12]
          },
          week: {
            temperature: [25.0, 25.5, 26.0, 25.8, 25.2, 25.5, 26.1],
            ph: [7.1, 7.2, 7.3, 7.4, 7.3, 7.2, 7.1],
            oxygen: [6.5, 6.6, 6.8, 6.7, 6.5, 6.3, 6.4],
            turbidity: [11, 12, 13, 14, 15, 13, 12]
          },
          month: {
            temperature: [24.5, 25.0, 25.8, 26.2, 25.5, 24.8, 25.0, 25.5, 26.0, 26.5, 27.0, 26.5],
            ph: [7.0, 7.1, 7.2, 7.3, 7.4, 7.3, 7.2, 7.1, 7.0, 7.1, 7.2, 7.3],
            oxygen: [6.2, 6.3, 6.5, 6.7, 6.8, 6.7, 6.5, 6.3, 6.4, 6.6, 6.8, 6.7],
            turbidity: [10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 12, 13]
          }
        };
        
        resolve(mockData[period] || mockData.today);
      }, 500);
    });
  }
};

export default farmService;