<!-- src/views/PostView.vue -->
<!-- 发布岗位：无后端方案 —— 表单校验通过后写入 Pinia + localStorage -->
<template>
  <div class="post">
    <div class="post-header">
      <h1>📝 发布岗位</h1>
      <p class="subtitle">填写下面的信息，就能把岗位挂到首页列表里</p>
    </div>

    <!-- 未登录提示：只是引导，不阻止发布 -->
    <el-alert
      v-if="!authStore.isLoggedIn"
      class="login-tip"
      type="warning"
      :closable="false"
      show-icon
      title="你还没有登录"
      description="点击右上角「登录」按钮即可一键登录（虚拟登录，不需要账号密码）"
    />

    <!-- 已登录提示 -->
    <el-alert
      v-else
      class="login-tip"
      type="success"
      :closable="false"
      show-icon
      :title="`已登录：${authStore.userName}`"
      description="发布的岗位会保存在本机浏览器里，刷新页面不会丢失"
    />

    <!-- 发布表单 -->
    <el-card class="form-card" shadow="never">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="岗位名称" prop="position">
          <el-input v-model="form.position" placeholder="例如：前端开发工程师" clearable />
        </el-form-item>

        <el-form-item label="公司名称" prop="company">
          <el-input v-model="form.company" placeholder="例如：字节跳动" clearable />
        </el-form-item>

        <!-- 薪资：两个数字框，自动拼成 "20-35K" -->
        <el-form-item label="薪资范围" required>
          <div class="salary-row">
            <el-form-item prop="salaryMin">
              <el-input-number
                v-model="form.salaryMin"
                :min="1"
                :max="999"
                :controls="false"
                placeholder="最低"
                class="salary-input"
              />
            </el-form-item>
            <span class="salary-sep">—</span>
            <el-form-item prop="salaryMax">
              <el-input-number
                v-model="form.salaryMax"
                :min="1"
                :max="999"
                :controls="false"
                placeholder="最高"
                class="salary-input"
              />
            </el-form-item>
            <span class="salary-unit">K</span>
          </div>
          <div class="salary-hint">填写后会自动组合成「20-35K」，首页的 💰高薪 筛选靠的就是这个格式</div>
        </el-form-item>

        <el-form-item label="工作城市" prop="city">
          <el-select v-model="form.city" placeholder="请选择城市" class="city-select">
            <el-option v-for="city in cities" :key="city" :label="city" :value="city" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否急聘">
          <el-switch
            v-model="form.isUrgent"
            active-text="急聘 🔥"
            inactive-text="普通岗位"
          />
        </el-form-item>

        <el-form-item label="岗位描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="5"
            maxlength="200"
            show-word-limit
            placeholder="写清楚岗位职责和任职要求，例如：负责Web端功能开发，要求熟练掌握Vue 3…"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            🚀 发布岗位
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useJobStore } from '../stores/jobStore'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const jobStore = useJobStore()
const authStore = useAuthStore()

// 表单实例（validate / resetFields 都要用它）
const formRef = ref(null)

// 可选城市：与mock数据的城市保持一致，直接从岗位数据里取
const cities = [...new Set(jobStore.jobs.map(job => job.city))]

// 表单数据
const form = reactive({
  position: '',
  company: '',
  salaryMin: undefined,
  salaryMax: undefined,
  city: '',
  isUrgent: false,
  description: ''
})

const submitting = ref(false)

// ========== 自定义校验：最高薪资必须大于最低薪资 ==========
const validateSalaryMax = (rule, value, callback) => {
  if (value === undefined || value === null || value === '') {
    callback(new Error('请填写最高薪资'))
  } else if (form.salaryMin && Number(value) <= Number(form.salaryMin)) {
    callback(new Error('最高薪资必须大于最低薪资'))
  } else {
    callback()
  }
}

// ========== 校验规则 ==========
const rules = {
  position: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' },
    { min: 2, max: 20, message: '岗位名称长度需在 2 到 20 个字符之间', trigger: 'blur' }
  ],
  company: [
    { required: true, message: '请输入公司名称', trigger: 'blur' },
    { min: 2, max: 20, message: '公司名称长度需在 2 到 20 个字符之间', trigger: 'blur' }
  ],
  salaryMin: [
    { required: true, message: '请填写最低薪资', trigger: 'blur' }
  ],
  salaryMax: [
    { validator: validateSalaryMax, trigger: 'blur' }
  ],
  city: [
    { required: true, message: '请选择工作城市', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入岗位描述', trigger: 'blur' },
    { min: 10, message: '岗位描述至少 10 个字', trigger: 'blur' }
  ]
}

// ========== 提交 ==========
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) {
      ElMessage.warning('请先把表单填写完整')
      return
    }

    submitting.value = true

    try {
      // 拼成 "20-35K"，与mock数据格式完全一致（首页 💰高薪 用 parseInt 拆分判断）
      const salary = `${form.salaryMin}-${form.salaryMax}K`

      const newJob = jobStore.addJob({
        position: form.position.trim(),
        company: form.company.trim(),
        // 和mock数据一样用picsum占位图，种子取公司名，保证同一家公司图不变
        logo: `https://picsum.photos/seed/${encodeURIComponent(form.company.trim())}/80/80`,
        salary,
        city: form.city,
        isUrgent: form.isUrgent,
        description: form.description.trim()
      })

      ElMessage.success(`🎉 发布成功！岗位已上架（编号 ${newJob.id}）`)

      // 重置表单，回首页就能看到刚发布的岗位
      formRef.value.resetFields()
      router.push('/')
    } finally {
      submitting.value = false
    }
  })
}

// ========== 重置 ==========
const handleReset = () => {
  formRef.value.resetFields()
  ElMessage.info('表单已重置')
}
</script>

<style scoped>
.post {
  max-width: 760px;
  margin: 0 auto;
  padding: 40px 20px;
}

.post-header h1 {
  color: #1a1a2e;
  margin-bottom: 8px;
}

.subtitle {
  color: #888;
  margin-bottom: 20px;
}

.login-tip {
  margin-bottom: 20px;
}

.form-card {
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

/* 薪资那一行 */
.salary-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 去掉嵌套 el-form-item 自带的底部间距，让两个输入框在同一行对齐 */
.salary-row :deep(.el-form-item) {
  margin-bottom: 0;
}

.salary-input {
  width: 120px;
}

.salary-sep {
  color: #999;
}

.salary-unit {
  color: #666;
}

.salary-hint {
  font-size: 12px;
  color: #aaa;
  line-height: 1.6;
  margin-top: 4px;
}

.city-select {
  width: 220px;
}
</style>