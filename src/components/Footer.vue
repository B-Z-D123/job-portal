<!-- src/components/Footer.vue -->
<!-- 作业署名：用来区分自己的作业和别人的（学号 + 姓名） -->
<template>
  <footer class="footer">
    <p class="watermark">学号：24290112&nbsp;&nbsp;|&nbsp;&nbsp;姓名：王英健</p>
    <p class="course">《就业职通车》项目作业</p>
  </footer>
</template>

<style scoped>
.footer {
  padding: 20px 40px;
  text-align: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #2d2b55 100%);
  color: rgba(255, 255, 255, 0.6);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.watermark {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 6px 0;
}

.course {
  font-size: 12px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}
</style>