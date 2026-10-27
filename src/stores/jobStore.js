// src/stores/jobStore.js
import { defineStore } from 'pinia'
import { mockJobs } from '../mock/data'

// ========== 定义localStorage的键名（避免拼写错误） ==========
const STORAGE_KEY = 'job_portal_favorites'
// 用户自己「发布」的岗位（无后端，只能存在本机浏览器里）
const POSTS_KEY = 'job_portal_posts'

// 从localStorage读出用户发布的岗位；数据损坏时兜底为空数组，避免整个应用白屏
const loadPostedJobs = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

export const useJobStore = defineStore('job', {
  // ========== state：数据 ==========
  state: () => ({
    // 岗位数据 = 用户发布的岗位（最新在前） + 固定不变的mock数据
    jobs: [...loadPostedJobs(), ...mockJobs],

    // 收藏列表（从localStorage读取，如果没有则初始为空数组）
    favorites: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  }),

  // ========== getters：计算属性 ==========
  getters: {
    // 岗位总数
    totalJobs: (state) => state.jobs.length,

    // 急聘岗位列表
    urgentJobs: (state) => state.jobs.filter(job => job.isUrgent),

    // 收藏的岗位列表（根据favorites中的id，从jobs中查找完整数据）
    favoriteJobs: (state) => {
      return state.jobs.filter(job => state.favorites.includes(job.id))
    },

    // 收藏数量
    favoriteCount: (state) => state.favorites.length,

    // 用户自己发布的岗位（带 isPostedByUser 标记，供页面区分展示）
    postedJobs: (state) => state.jobs.filter(job => job.isPostedByUser)
  },

  // ========== actions：修改数据的方法 ==========
  actions: {
    // 发布岗位（无后端：只写进内存 + localStorage）
    addJob(jobData) {
      // id 策略：取现有岗位的最大 id 再 +1（mock 最大是 20，所以第一个新岗位是 21）
      const maxId = this.jobs.reduce((max, job) => Math.max(max, Number(job.id) || 0), 0)

      const newJob = {
        ...jobData,
        id: maxId + 1,
        isFavorite: false,
        isPostedByUser: true   // 打标记，方便首页/详情页区分
      }

      // 放在最前面，首页列表第一条就能看到
      this.jobs.unshift(newJob)

      // 关键步骤：只把「用户发布的岗位」存进localStorage，刷新页面不丢
      this.persistPosts()

      return newJob
    },

    // 保存用户发布的岗位到localStorage
    persistPosts() {
      localStorage.setItem(POSTS_KEY, JSON.stringify(this.postedJobs))
    },

    // 切换收藏状态
    toggleFavorite(id) {
      // 查找id是否已在收藏列表中
      const index = this.favorites.indexOf(id)

      if (index > -1) {
        // 已收藏 → 移除
        this.favorites.splice(index, 1)
      } else {
        // 未收藏 → 添加
        this.favorites.push(id)
      }

      // 👇 关键步骤：同步保存到localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.favorites))
    },

    // 判断是否已收藏
    isFavorite(id) {
      return this.favorites.includes(id)
    },

    // 清空所有收藏
    clearFavorites() {
      this.favorites = []
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.favorites))
    }
  }
})
