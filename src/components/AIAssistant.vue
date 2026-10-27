<!-- src/components/AIAssistant.vue -->
<template>
  <div class="ai-assistant">
    <!-- 触发按钮（悬浮在右下角） -->
    <el-button
      class="trigger-btn"
      type="primary"
      circle
      size="large"
      @click="dialogVisible = true"
    >
      <el-icon><ChatDotRound /></el-icon>
    </el-button>

    <!-- 对话弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="🤖 AI岗位推荐助手"
      width="480px"
      :before-close="handleClose"
      destroy-on-close
    >
      <div class="chat-container">
        <!-- 消息列表 -->
        <div class="messages" ref="messagesRef">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message', msg.role]"
          >
            <div class="message-content">
              <div class="avatar">
                <el-avatar
                  :size="28"
                  :icon="msg.role === 'user' ? 'User' : 'Robot'"
                />
              </div>
              <div class="bubble">{{ msg.content }}</div>
            </div>
          </div>

          <!-- 加载状态（AI正在思考） -->
          <div v-if="loading" class="message assistant">
            <div class="message-content">
              <div class="avatar">
                <el-avatar :size="28" icon="Robot" />
              </div>
              <div class="bubble typing">
                <span class="dot">●</span>
                <span class="dot">●</span>
                <span class="dot">●</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷问题按钮 -->
        <div class="quick-questions">
          <el-tag
            v-for="q in quickQuestions"
            :key="q"
            @click="sendQuickMessage(q)"
            class="quick-tag"
            size="large"
            effect="plain"
          >
            {{ q }}
          </el-tag>
        </div>

        <!-- 输入区 -->
        <div class="input-area">
          <el-input
            v-model="inputText"
            placeholder="输入你想了解的问题..."
            @keyup.enter="sendMessage"
            :disabled="loading"
            clearable
          />
          <el-button
            type="primary"
            @click="sendMessage"
            :loading="loading"
            :disabled="!inputText.trim()"
          >
            发送
          </el-button>
        </div>
      </div>

      <!-- 底部提示 -->
      <template #footer>
        <span class="dialog-footer">
          💡 你可以询问：推荐岗位、公司介绍、职业规划等
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound } from '@element-plus/icons-vue'
import { chatWithDeepSeek } from '../api/deepseek.js'

// ========== 状态 ==========
const dialogVisible = ref(false)
const inputText = ref('')
const loading = ref(false)
const messagesRef = ref(null)

// ========== 对话历史 ==========
const messages = ref([
  {
    role: 'assistant',
    content: '👋 你好！我是AI岗位推荐助手。我可以帮你：\n• 推荐适合你的岗位\n• 介绍公司信息\n• 提供职业规划建议\n你有什么问题尽管问我！'
  }
])

// ========== 快捷问题 ==========
const quickQuestions = [
  '推荐3个前端开发岗位',
  '北京有哪些高薪岗位？',
  '我适合什么方向？',
  '介绍一下字节跳动'
]

// ========== 系统提示词 ==========
const SYSTEM_PROMPT = '你是「就业职通车」招聘平台的AI岗位推荐助手，擅长根据用户情况推荐岗位、介绍公司信息、提供职业规划建议。请用简洁、友好的中文回复。'

// ========== 组装真正发给API的消息列表 ==========
// ⚠️ 第 1 条只是给用户看的欢迎语，不是真实对话。
//    如果原样发出去，对话历史会以 assistant 角色开头，部分接口会直接返回 400。
//    这里把它过滤掉，并换成一条真正的 system 提示，让 AI 保持"岗位推荐助手"的人设。
const buildApiMessages = () => {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.value
      .filter((msg, index) => !(index === 0 && msg.role === 'assistant'))
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
  ]
}

// ========== 滚动到底部 ==========
const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

// ========== 发送消息 ==========
const sendMessage = async () => {
  // 输入为空或正在加载，不发送
  if (!inputText.value.trim() || loading.value) return

  const userMessage = inputText.value.trim()
  inputText.value = ''

  // 添加用户消息到列表
  messages.value.push({
    role: 'user',
    content: userMessage
  })
  await scrollToBottom()

  // 显示加载状态
  loading.value = true

  try {
    // 构建对话历史（传给API的消息列表）
    const apiMessages = buildApiMessages()

    // 调用API
    const reply = await chatWithDeepSeek(apiMessages)

    // 添加AI回复到列表
    messages.value.push({
      role: 'assistant',
      content: reply
    })
  } catch (error) {
    // 错误处理
    console.error('AI回复失败:', error)
    ElMessage.error(error.message || 'AI服务暂不可用，请稍后重试')
    messages.value.push({
      role: 'assistant',
      content: '😅 抱歉，我暂时无法回答。请检查网络连接或稍后再试。'
    })
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}

// ========== 快捷问题发送 ==========
const sendQuickMessage = (question) => {
  inputText.value = question
  sendMessage()
}

// ========== 关闭对话框 ==========
const handleClose = () => {
  dialogVisible.value = false
}

// ========== 键盘快捷键 ==========
// Ctrl+Enter 发送（在输入框中）
const handleKeydown = (event) => {
  if (event.key === 'Enter' && event.ctrlKey) {
    sendMessage()
  }
}
</script>

<style scoped>
/* ========== 悬浮触发按钮 ========== */
.ai-assistant {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 999;
}

.trigger-btn {
  width: 60px;
  height: 60px;
  font-size: 28px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.trigger-btn:hover {
  transform: scale(1.05);
}

/* ========== 对话框样式 ========= */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 420px;
}

/* 消息列表 */
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 4px;
  background: #f8f9fc;
  border-radius: 8px;
  min-height: 200px;
}

.message {
  margin-bottom: 12px;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.message.user .message-content {
  flex-direction: row-reverse;
}

.message.user .bubble {
  background: #667eea;
  color: white;
  border-radius: 12px 12px 4px 12px;
}

.message.assistant .bubble {
  background: white;
  color: #333;
  border-radius: 12px 12px 12px 4px;
  border: 1px solid #e8ecf1;
}

.bubble {
  max-width: 75%;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.avatar {
  flex-shrink: 0;
  padding-top: 2px;
}

/* 打字动画 */
.typing .dot {
  display: inline-block;
  margin: 0 2px;
  opacity: 0.3;
  animation: typing 1.4s infinite;
}

.typing .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  30% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 快捷问题 */
.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 0 8px;
}

.quick-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.quick-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

/* 输入区 */
.input-area {
  display: flex;
  gap: 12px;
  padding-top: 10px;
}

.input-area .el-input {
  flex: 1;
}

/* 底部提示 */
.dialog-footer {
  font-size: 12px;
  color: #999;
}
</style>
