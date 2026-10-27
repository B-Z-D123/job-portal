<!-- src/components/JobCard.vue -->
<template>
  <!-- 用 el-card 包裹整个卡片 -->
  <el-card class="job-card" shadow="hover" @click="goToDetail">
    <div class="card-content">
      <div class="card-header">
        <el-avatar :size="56" :src="job.logo" shape="square" />
        <div class="company-info">
          <h3 class="position">{{ job.position }}</h3>
          <p class="company">{{ job.company }}</p>
        </div>
        <el-tag v-if="job.isUrgent" type="danger" size="small" effect="dark">
          🔥 急聘
        </el-tag>
        <el-tag
          v-if="job.isPostedByUser"
          class="posted-tag"
          type="success"
          size="small"
          effect="plain"
        >
          我发布的
        </el-tag>
      </div>

      <el-divider />

      <div class="card-body">
        <el-row>
          <el-col :span="12">
            <span class="label">💰 薪资</span>
            <span class="value salary">{{ job.salary }}</span>
          </el-col>
          <el-col :span="12">
            <span class="label">📍 城市</span>
            <span class="value">{{ job.city }}</span>
          </el-col>
        </el-row>
      </div>

      <el-divider />

      <div class="card-footer">
        <el-button
          :type="isFavorited ? 'danger' : 'default'"
          size="small"
          plain
          @click.stop="toggleFavorite"
        >
          {{ isFavorited ? '❤️ 已收藏' : '🤍 收藏' }}
        </el-button>
        <el-button type="primary" size="small" plain>
          查看详情 →
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useJobStore } from '../stores/jobStore'

// 接收父组件传入的数据
const props = defineProps({
  job: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const jobStore = useJobStore()

// 计算当前岗位是否已收藏
const isFavorited = computed(() => jobStore.isFavorite(props.job.id))

// 切换收藏
const toggleFavorite = () => {
  jobStore.toggleFavorite(props.job.id)
}

// 跳转到详情页
const goToDetail = () => {
  router.push(`/job/${props.job.id}`)
}
</script>

<style scoped>
.job-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.job-card:hover {
  transform: translateY(-4px);
}

.card-content {
  padding: 4px 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.company-info {
  flex: 1;
}

.position {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1a1a2e;
}

.company {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.card-body {
  padding: 4px 0;
}

.label {
  color: #999;
  font-size: 14px;
  margin-right: 8px;
}

.value {
  color: #333;
  font-size: 14px;
}

.salary {
  color: #e74c3c;
  font-weight: 600;
}

.posted-tag {
  margin-left: 4px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
