<!-- src/components/Header.vue -->
<template>
  <header class="header">
    <div class="logo" @click="$router.push('/')">
      <span class="icon">💼</span>
      <span class="title">就业职通车</span>
    </div>

    <!-- 导航按钮组：水平居中 -->
    <nav class="nav">
      <router-link to="/">首页</router-link>
      <router-link to="/favorites" class="favorites-link">
        我的收藏
        <span class="badge" v-if="jobStore.favorites.length > 0">
          {{ jobStore.favorites.length }}
        </span>
      </router-link>
      <router-link to="/post" class="post-btn">发布岗位</router-link>
    </nav>

    <!-- 虚拟登录：无后端，同一个按钮点一下就在 登录 / 退出登录 之间切换 -->
    <!-- 单独放在 header 的第三栏，固定在右上角（不参与居中的导航组） -->
    <button
      class="auth-btn"
      :class="{ 'is-logged-in': authStore.isLoggedIn }"
      :title="authStore.isLoggedIn
        ? `当前用户：${authStore.userName}（点击退出登录）`
        : '点击一键登录（虚拟登录，不需要账号密码）'"
      @click="handleAuthClick"
    >
      {{ authStore.loginButtonText }}
    </button>
  </header>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { useJobStore } from '../stores/jobStore'
import { useAuthStore } from '../stores/authStore'

const jobStore = useJobStore()
const authStore = useAuthStore()

// ========== 虚拟登录：点一下切换登录状态（无后端，不做账号密码校验） ==========
const handleAuthClick = () => {
  const willLogin = !authStore.isLoggedIn

  authStore.toggleLogin()

  if (willLogin) {
    ElMessage.success(`✅ 登录成功，欢迎回来，${authStore.userName}！`)
  } else {
    ElMessage.info('你已退出登录')
  }
}
</script>

<style scoped>
.header {
  /* 三栏布局：左「logo」/ 中「导航」/ 右「登录按钮」
     左右两栏都是 1fr，所以中间那条 auto 栏必然落在 header 的水平正中 */
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-areas: 'logo nav auth';
  align-items: center;
  gap: 16px;
  padding: 16px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
}

.logo {
  grid-area: logo;
  justify-self: start;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  cursor: pointer;
}

.logo .title {
  font-size: 24px;
  font-weight: bold;
}

.logo .icon {
  font-size: 28px;
}

.nav {
  grid-area: nav;
  justify-self: center;
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav a {
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  font-size: 16px;
  padding: 6px 14px;
  border-radius: 6px;
  transition: all 0.3s;
}

.nav a:hover {
  color: white;
  background: rgba(255,255,255,0.2);
}

.nav a.router-link-active {
  color: white;
  background: rgba(255,255,255,0.25);
}

.post-btn {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
}

.favorites-link {
  position: relative;
}

.badge {
  background: #ff6b6b;
  color: white;
  font-size: 12px;
  padding: 1px 8px;
  border-radius: 12px;
  margin-left: 4px;
  font-weight: bold;
}

/* ========== 虚拟登录按钮（沿用 FilterBar 的自定义按钮风格，不用 el-button） ========== */
.auth-btn {
  grid-area: auth;
  justify-self: end;
  font-family: inherit;
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.auth-btn:hover {
  color: white;
  background: rgba(255,255,255,0.35);
}

/* 已登录：实心高亮，和「未登录」一眼能区分 */
.auth-btn.is-logged-in {
  color: #ffd666;
  background: rgba(255,255,255,0.25);
  border-color: rgba(255,214,102,0.8);
  font-weight: 600;
}

/* 窄屏：导航换到第二行居中，登录按钮仍留在右上角 */
@media (max-width: 960px) {
  .header {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'logo auth'
      'nav nav';
    row-gap: 10px;
  }

  .nav {
    justify-self: center;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
