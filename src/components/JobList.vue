<!-- src/components/JobList.vue -->
<template>
  <!--
    jobs 通过 props 从父组件传入
    如果数组为空，显示空状态
    否则渲染岗位卡片列表
  -->
  <div v-if="jobs.length === 0" class="empty-state">
    <p>😅 暂无匹配的岗位，试试其他筛选条件吧</p>
  </div>
  <div v-else class="job-list">
    <JobCard
      v-for="job in jobs"
      :key="job.id"
      :job="job"
    />
  </div>
</template>

<script setup>
// ========== 导入子组件 ==========
import JobCard from './JobCard.vue'

// ========== 定义props ==========
// jobs 是从父组件传入的岗位数组
const props = defineProps({
  jobs: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.job-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  margin-top: 10px;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #999;
  font-size: 18px;
}
</style>
