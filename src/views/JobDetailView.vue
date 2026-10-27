<!-- src/views/JobDetailView.vue -->
<template>
  <div class="detail">
    <!-- 返回按钮 -->
    <div class="back">
      <button @click="router.back()">← 返回列表</button>
    </div>

    <!-- 加载状态：job未找到时显示 -->
    <div v-if="!job" class="loading">
      <p>⏳ 加载中...</p>
    </div>

    <!-- 详情内容 -->
    <div v-else class="detail-card">
      <div class="header">
        <img :src="job.logo" alt="公司Logo" class="logo" />
        <div class="info">
          <h1>{{ job.position }}</h1>
          <p class="company">{{ job.company }}</p>
          <div class="tags">
            <span class="salary">{{ job.salary }}</span>
            <span class="city">📍 {{ job.city }}</span>
            <span v-if="job.isUrgent" class="tag-urgent">🔥 急聘</span>
            <span v-if="job.isPostedByUser" class="tag-posted">我发布的</span>
          </div>
        </div>
      </div>

      <div class="description">
        <h3>📋 岗位描述</h3>
        <p>{{ job.description || '暂无详细描述' }}</p>
      </div>

      <div class="actions">
        <button
          class="btn-favorite"
          :class="{ 'is-favorite': isFavorited }"
          @click="toggleFavorite"
        >
          {{ isFavorited ? '❤️ 已收藏' : '🤍 收藏' }}
        </button>
        <button class="btn-apply">📩 立即应聘</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobStore } from '../stores/jobStore'

// ========== 获取路由信息 ==========
const route = useRoute()    // 获取当前路由信息（包括参数）
const router = useRouter()  // 获取路由实例（用于跳转）

const jobStore = useJobStore()

// ========== 计算属性：根据路由参数id查找岗位 ==========
// route.params.id 来自路由配置 /job/:id
// 当访问 /job/1 时，route.params.id = '1'
const job = computed(() => {
  const id = parseInt(route.params.id)  // 转为数字
  return jobStore.jobs.find(j => j.id === id)
})

// ========== 判断是否已收藏 ==========
const isFavorited = computed(() => {
  return job.value && jobStore.isFavorite(job.value.id)
})

// ========== 切换收藏 ==========
const toggleFavorite = () => {
  if (job.value) {
    jobStore.toggleFavorite(job.value.id)
  }
}
</script>

<style scoped>
.detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 返回按钮 */
.back button {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 16px;
  padding: 8px 0;
}

.back button:hover {
  color: #764ba2;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 80px 0;
  color: #999;
  font-size: 18px;
}

/* 详情卡片 */
.detail-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-top: 20px;
}

/* 头部信息 */
.header {
  display: flex;
  gap: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid #eee;
}

.info h1 {
  margin: 0 0 8px 0;
  font-size: 26px;
  color: #1a1a2e;
}

.info .company {
  color: #666;
  font-size: 16px;
  margin: 0 0 12px 0;
}

.tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.tags .salary {
  color: #e74c3c;
  font-size: 18px;
  font-weight: 600;
}

.tags .city {
  color: #888;
  font-size: 14px;
}

.tag-posted {
  background: #67c23a;
  color: white;
  font-size: 12px;
  padding: 2px 12px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
}

.tag-urgent {
  background: #ff6b6b;
  color: white;
  font-size: 12px;
  padding: 2px 12px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
}

/* 岗位描述 */
.description {
  padding: 24px 0;
  border-bottom: 1px solid #f0f0f0;
}

.description h3 {
  margin-bottom: 12px;
  color: #333;
}

.description p {
  line-height: 1.8;
  color: #555;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.btn-favorite {
  padding: 12px 32px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.btn-favorite:hover {
  border-color: #667eea;
}

.btn-favorite.is-favorite {
  background: #fff0f0;
  border-color: #ff6b6b;
  color: #e74c3c;
}

.btn-apply {
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  background: #667eea;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.btn-apply:hover {
  background: #5a6fd6;
}
</style>
