<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
    <!-- 顶部横幅（主视觉） -->
    <el-row class="hero" justify="center">
      <el-col :span="20" style="text-align: center;">
        <p class="hero-badge">🔥 本周热招 · {{ jobStore.jobs.length }} 个岗位在等你</p>
        <h1>
          <span class="hero-emoji">🚀</span><span class="hero-title">找到你的理想工作</span>
        </h1>
        <p class="subtitle">海量名企岗位，精准匹配你的职业方向</p>

        <el-row class="stats" justify="center" :gutter="40">
          <el-col :span="6">
            <el-statistic :value="totalCount" title="全部岗位" />
          </el-col>
          <el-col :span="6">
            <el-statistic :value="urgentCount" title="🔥 急聘" />
          </el-col>
          <el-col :span="6">
            <el-statistic :value="jobStore.favorites.length" title="⭐ 已收藏" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 筛选栏：保留第3周的城市筛选，未做改动 -->
    <FilterBar v-model="filterType" v-model:city="cityFilter" :cities="cities" />

    <!-- 岗位列表 -->
    <JobList :jobs="filteredJobs" />
  </div>

  <!-- 页脚署名：用来区分自己的作业和别人的（只放在首页，且整幅贴底） -->
  <Footer />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useJobStore } from '../stores/jobStore'
import FilterBar from '../components/FilterBar.vue'
import JobList from '../components/JobList.vue'
import Footer from '../components/Footer.vue'

const jobStore = useJobStore()

const filterType = ref('all')
const cityFilter = ref('')  // 空字符串 = 不限城市

// 从岗位数据中提取不重复的城市列表，传给FilterBar显示按钮
const cities = computed(() => [...new Set(jobStore.jobs.map(job => job.city))])

const filteredJobs = computed(() => {
  // 第一步：按城市筛选
  let jobs = jobStore.jobs
  if (cityFilter.value) {
    jobs = jobs.filter(job => job.city === cityFilter.value)
  }
  // 第二步：按类型筛选（两个条件叠加）
  switch (filterType.value) {
    case 'urgent':
      return jobs.filter(job => job.isUrgent)
    case 'high':
      return jobs.filter(job => parseInt(job.salary.split('-')[0]) >= 20)
    default:
      return jobs
  }
})

const totalCount = computed(() => filteredJobs.value.length)

// 急聘数量跟随当前筛选结果：选了城市后，只统计该城市内的急聘岗位
const urgentCount = computed(() => filteredJobs.value.filter(job => job.isUrgent).length)
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 20px 40px;
}

/* ========== 主视觉横幅：玻璃面板 + 彩色光斑 ========== */
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  margin: 4px auto 30px;
  padding: 52px 40px 40px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  background:
    radial-gradient(620px 280px at 12% 0%, rgba(102, 126, 234, 0.18), transparent 70%),
    radial-gradient(560px 280px at 90% 6%, rgba(167, 139, 250, 0.18), transparent 70%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.66));
  box-shadow:
    0 26px 60px rgba(84, 96, 200, 0.16),
    0 2px 6px rgba(84, 96, 200, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
}

/* 两团模糊光斑，让横幅有发光感 */
.hero::before,
.hero::after {
  content: '';
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  filter: blur(48px);
  pointer-events: none;
}

.hero::before {
  width: 340px;
  height: 340px;
  left: -90px;
  top: -140px;
  background: rgba(102, 126, 234, 0.38);
}

.hero::after {
  width: 300px;
  height: 300px;
  right: -70px;
  bottom: -150px;
  background: rgba(167, 139, 250, 0.38);
}

.hero-badge {
  display: inline-block;
  margin-bottom: 18px;
  padding: 6px 18px;
  font-size: 14px;
  font-weight: 600;
  color: #4a4fa8;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(102, 126, 234, 0.28);
  border-radius: 999px;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.14);
}

.hero h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font-size: 44px;
  line-height: 1.2;
}

.hero-emoji {
  font-size: 40px;
}

/* 标题用渐变字，比纯黑色更"有设计感" */
.hero-title {
  background: linear-gradient(95deg, #4b5bd6 0%, #7b5ce0 55%, #b45cd6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 1px;
}

.subtitle {
  margin-top: 12px;
  font-size: 18px;
  color: #5f6479;
}

.stats {
  margin-top: 26px;
}

.stats :deep(.el-statistic__head) {
  font-size: 14px;
  color: #6b7189;
}

.stats :deep(.el-statistic__number) {
  font-size: 26px;
  font-weight: 700;
  color: #3b45a8;
}

@media (max-width: 768px) {
  .hero {
    padding: 36px 20px 28px;
  }

  .hero h1 {
    font-size: 30px;
  }

  .hero-emoji {
    font-size: 28px;
  }
}
</style>
