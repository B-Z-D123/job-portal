// src/api/deepseek.js
import axios from 'axios'

// ========== 配置 ==========
const API_URL = 'https://api.deepseek.com/v1/chat/completions'

// 从环境变量读取API Key
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY

// 请求超时时间（毫秒）
// 📌 手册原文没给 axios 配 timeout，导致下面判断超时的那个分支永远走不到，
//    网络卡住时按钮会一直转圈。这里补上。
const TIMEOUT = 30000

// 未配置 Key 时的演示降级文案：页面其余功能（筛选、收藏、发布）不受影响
const DEMO_NOTICE = '【演示环境】AI 助手需在本地配置 DeepSeek API Key 才能使用；筛选、收藏、发布等功能不受影响。'

// ========== 调用DeepSeek API ==========
export const chatWithDeepSeek = async (messages) => {
  // 未配置API Key时直接返回演示提示，而不是抛错卡住界面
  if (!API_KEY || API_KEY === '你的API密钥') {
    return DEMO_NOTICE
  }

  try {
    // 发送请求到DeepSeek API
    const response = await axios.post(
      API_URL,
      {
        model: 'deepseek-chat',        // 使用的模型
        messages: messages,             // 对话历史
        temperature: 0.7,               // 创意度（0-1，越高越有创意）
        max_tokens: 500                 // 最大回复长度
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: TIMEOUT                // ✅ 补上的超时配置
      }
    )

    // 返回AI的回复内容
    return response.data.choices[0].message.content
  } catch (error) {
    // 错误处理
    console.error('DeepSeek API调用失败:', error)

    // 提取更详细的错误信息
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      if (status === 401) {
        throw new Error('API Key无效，请检查 .env 文件中的配置')
      } else if (status === 429) {
        throw new Error('API调用频率过高，请稍后再试')
      } else if (status === 402) {
        throw new Error('账户余额不足，请检查DeepSeek控制台')
      } else {
        throw new Error(`API错误 (${status}): ${data.error?.message || '未知错误'}`)
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('请求超时，请检查网络连接')
    } else {
      throw new Error(`请求失败: ${error.message}`)
    }
  }
}

// ========== 快捷函数：岗位推荐 ==========
export const getJobRecommendation = async (skill, city) => {
  const messages = [
    {
      role: 'system',
      content: '你是一个专业的职业规划师，擅长根据用户的技能和偏好推荐合适的岗位。请用简洁、友好的方式回复。'
    },
    {
      role: 'user',
      content: `我是一名计算机专业大三学生，我的技能是${skill}，希望在城市${city}工作。请推荐3个适合我的岗位，并说明理由。`
    }
  ]

  return await chatWithDeepSeek(messages)
}

// ========== 快捷函数：公司信息查询 ==========
export const getCompanyInfo = async (companyName) => {
  const messages = [
    {
      role: 'system',
      content: '你是一个专业的企业信息顾问，了解各大科技公司的情况。请用简洁的方式介绍公司。'
    },
    {
      role: 'user',
      content: `请介绍一下${companyName}这家公司，包括主要业务、企业文化和招聘特点。`
    }
  ]

  return await chatWithDeepSeek(messages)
}
