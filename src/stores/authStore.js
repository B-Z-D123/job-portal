// src/stores/authStore.js
// ========== 虚拟登录（无后端） ==========
// 本项目没有后端，所以不做真实的账号密码校验。
// 全站只记录「一个」登录状态，点一下按钮就在 登录 / 未登录 之间切换。
// 状态写入 localStorage，刷新页面后依然是登录状态。
import { defineStore } from 'pinia'

// ========== 定义localStorage的键名（避免拼写错误） ==========
const STORAGE_KEY = 'job_portal_logged_in'

// 虚拟用户信息（不是真实账号，仅用于界面显示）
const VIRTUAL_USER = {
  name: '求职者小张'
}

export const useAuthStore = defineStore('auth', {
  // ========== state：数据 ==========
  state: () => ({
    // 登录状态（从localStorage读取，字符串 '1' 表示已登录）
    isLoggedIn: localStorage.getItem(STORAGE_KEY) === '1',

    // 虚拟用户名
    userName: VIRTUAL_USER.name
  }),

  // ========== getters：计算属性 ==========
  getters: {
    // 按钮上显示的文字
    loginButtonText: (state) => (state.isLoggedIn ? '退出登录' : '登录')
  },

  // ========== actions：修改数据的方法 ==========
  actions: {
    // 切换登录状态：未登录 → 登录；已登录 → 退出
    toggleLogin() {
      this.isLoggedIn = !this.isLoggedIn
      this.persist()
    },

    // 退出登录
    logout() {
      this.isLoggedIn = false
      this.persist()
    },

    // 👇 关键步骤：同步保存到localStorage
    persist() {
      localStorage.setItem(STORAGE_KEY, this.isLoggedIn ? '1' : '0')
    }
  }
})
