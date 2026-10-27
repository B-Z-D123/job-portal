<!-- src/views/FavoritesView.vue -->
<template>
  <div class="favorites">
    <div class="header-row">
      <div>
        <h1>⭐ 我的收藏</h1>
        <p class="subtitle">你收藏的岗位都在这里</p>
      </div>

      <!-- 清空收藏按钮 -->
      <button
        v-if="jobStore.favorites.length > 0"
        class="btn-clear"
        @click="clearFavorites"
      >
        🗑️ 清空全部
      </button>
    </div>

    <!-- 空状态：没有收藏时显示 -->
    <div v-if="jobStore.favorites.length === 0" class="empty-state">
      <div style="font-size: 48px; margin-bottom: 16px;">📭</div>
      <p>还没有收藏的岗位，去首页看看吧！</p>
      <router-link to="/" class="link">👉 浏览岗位</router-link>
    </div>

    <!-- 收藏列表 -->
    <div v-else class="job-list">
      <JobCard 
        v-for="job in jobStore.favoriteJobs" 
        :key="job.id" 
        :job="job" 
      />
    </div>
  </div>
</template>

<script setup>
import { useJobStore } from '../stores/jobStore'
import JobCard from '../components/JobCard.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const jobStore = useJobStore()

// ========== 清空收藏（带确认对话框） ==========
const clearFavorites = async () => {
  try {
    // 使用 Element Plus 的确认对话框
    await ElMessageBox.confirm(
      '确定要清空所有收藏吗？此操作不可撤销！',
      '确认清空',
      { type: 'warning' }
    )

    jobStore.clearFavorites()
    ElMessage.success('已清空所有收藏')
  } catch {
    // 用户点击取消，不做任何操作
  }
}
</script>

<style scoped>
.favorites {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 头部行：标题和清空按钮并排 */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.subtitle {
  color: #999;
  margin-top: 4px;
}

.btn-clear {
  background: none;
  border: 1px solid #f56c6c;
  color: #f56c6c;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-clear:hover {
  background: #f56c6c;
  color: white;
}

.job-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
}

.empty-state p {
  color: #999;
  font-size: 18px;
  margin: 16px 0;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}
</style>
