import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, List, Typography, Avatar, Spin, message } from 'antd';
import { RobotOutlined, UserOutlined, SendOutlined, CloseOutlined, MessageOutlined } from '@ant-design/icons';
import { AI_CONFIG, getSmartReply } from '../../config/aiConfig';
import './AIFloatingChat.css';

const { TextArea } = Input;
const { Text } = Typography;

const AIFloatingChat = ({ visible, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '您好！我是智慧渔场AI助手，可以为您提供渔场管理建议、水质分析、设备控制指导等服务。有什么可以帮助您的吗？',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 拖拽功能
  const handleMouseDown = (e) => {
    if (e.target.closest('.chat-header')) {
      setIsDragging(true);
      const rect = chatRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // 调用豆包API
  const callDoubaoAPI = async (userMessage) => {
    try {
      // 首先尝试智能快捷回复
      const quickReply = getSmartReply(userMessage);
      if (quickReply) {
        return quickReply;
      }

      // 构建对话上下文
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // 添加系统提示词
      const systemPrompt = {
        role: 'system',
        content: AI_CONFIG.SYSTEM_PROMPTS.FISHERY_ASSISTANT
      };

      const response = await fetch(AI_CONFIG.DOUBAO.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.DOUBAO.API_KEY}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.DOUBAO.MODEL_ID,
          messages: [
            systemPrompt,
            ...conversationHistory,
            { role: 'user', content: userMessage }
          ],
          max_tokens: AI_CONFIG.DOUBAO.MAX_TOKENS,
          temperature: AI_CONFIG.DOUBAO.TEMPERATURE
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('调用豆包API失败:', error);
      // 返回模拟回复
      return getSimulatedResponse(userMessage);
    }
  };

  // 模拟AI回复（当API调用失败时使用）
  const getSimulatedResponse = (userMessage) => {
    // 首先尝试智能快捷回复
    const quickReply = getSmartReply(userMessage);
    if (quickReply) {
      return quickReply;
    }

    // 通用回复
    return `🤖 **智慧渔场AI助手**

感谢您的咨询！我是您的专业渔场管理顾问，可以为您提供：

🌊 **水质管理** - pH、溶解氧、氨氮等参数优化
⚙️ **设备控制** - 增氧机、水泵、投饵机操作指导
🐟 **养殖技术** - 投喂策略、鱼病预防、密度控制
🌤️ **环境监测** - 天气应对、季节管理、预警处理
📊 **数据分析** - 历史趋势、效益优化、成本控制

**常用咨询关键词：**
• 输入"水质"了解水质管理
• 输入"投喂"获取投喂指导
• 输入"设备"查看设备维护
• 输入"天气"了解天气应对

请告诉我您遇到的具体问题，我将为您提供专业建议！`;
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const aiResponse = await callDoubaoAPI(inputValue);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      message.error('AI回复失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理回车发送
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={chatRef}
      className="ai-floating-chat"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1000,
        width: 400,
        height: 500
      }}
      onMouseDown={handleMouseDown}
    >
      <Card
        className="chat-card"
        title={
          <div className="chat-header" style={{ cursor: 'move', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>
              <MessageOutlined style={{ marginRight: 8 }} />
              AI智能助手
            </span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              style={{ color: '#fff' }}
            />
          </div>
        }
        bodyStyle={{ padding: 0, height: 420 }}
      >
        <div className="chat-messages" style={{ height: 350, overflowY: 'auto', padding: '16px' }}>
          <List
            dataSource={messages}
            renderItem={(message) => (
              <List.Item style={{ border: 'none', padding: '8px 0' }}>
                <div className={`message-item ${message.type}`}>
                  <Avatar
                    icon={message.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    style={{
                      backgroundColor: message.type === 'user' ? '#1890ff' : '#52c41a',
                      marginRight: 8
                    }}
                  />
                  <div className="message-content">
                    <div className="message-text">
                      {message.content.split('\n').map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {message.timestamp}
                    </Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
          {loading && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <Spin size="small" />
              <Text style={{ marginLeft: 8 }}>AI正在思考中...</Text>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input" style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="请输入您的问题..."
              autoSize={{ minRows: 1, maxRows: 3 }}
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              loading={loading}
              disabled={!inputValue.trim()}
            >
              发送
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIFloatingChat;