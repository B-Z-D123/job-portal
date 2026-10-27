<!-- src/App.vue -->
<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <!-- 在所有页面显示AI助手 -->
    <AIAssistant />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import AIAssistant from './components/AIAssistant.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;   /* 清掉浏览器默认的 8px 外边距，否则底部会露出一条白缝、页脚贴不到最底 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC',
    'Microsoft YaHei', sans-serif;
  color: #1f2430;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;

  /* 页面背景：三团柔光 + 一层浅色渐变，fixed 让它不随内容滚动 */
  background-color: #f7f8fd;
  background-image:
    radial-gradient(1100px 520px at 8% -10%, rgba(102, 126, 234, 0.28), transparent 68%),
    radial-gradient(900px 480px at 98% 2%, rgba(118, 75, 162, 0.22), transparent 70%),
    radial-gradient(1100px 620px at 50% 112%, rgba(96, 180, 255, 0.20), transparent 72%),
    radial-gradient(700px 420px at -6% 88%, rgba(120, 115, 245, 0.14), transparent 70%),
    linear-gradient(170deg, #f4f6ff 0%, #f8f9fc 42%, #f6f3ff 100%);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}

#app {
  min-height: 100vh;
  position: relative;
  /* 让伪元素的 z-index 只在 #app 内部生效，避免盖住内容 */
  isolation: isolate;
}

/* 顶部细点阵纹理，往下渐隐，纯装饰、不拦点击 */
#app::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image: radial-gradient(rgba(102, 126, 234, 0.22) 1px, transparent 1.2px);
  background-size: 22px 22px;
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.55), transparent 45%);
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.55), transparent 45%);
}

.main-content {
  min-height: calc(100vh - 80px);
}
</style>