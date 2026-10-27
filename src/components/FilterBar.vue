<!-- src/components/FilterBar.vue -->
<template>
  <div class="filter-bar" ref="rootEl">
    <!--
      第一组：岗位类型筛选（全部 / 急聘 / 高薪）
      v-model="filterType" → modelValue + update:modelValue
    -->
    <div class="filter-group">
      <button
        v-for="item in filters"
        :key="item.value"
        class="filter-btn"
        :class="{ active: modelValue === item.value }"
        @click="emit('update:modelValue', item.value)"
      >
        {{ item.label }}
      </button>
    </div>

    <!--
      第二组：按城市分类
      一个按钮 + 下拉框，与上面三个按钮同级，整体靠最右边
      空字符串表示不限城市，所以默认文案是「按城市分类」，选中后显示城市名
    -->
    <div class="city-select">
      <button
        class="filter-btn city-btn"
        :class="{ active: city !== '', open: open }"
        aria-haspopup="listbox"
        :aria-expanded="open"
        @click.stop="open = !open"
      >
        📍 {{ city || '按城市分类' }}
        <span class="caret">▾</span>
      </button>

      <!-- 下拉框：点击按钮才出现，选择城市后自动收起 -->
      <ul v-if="open" class="city-dropdown" role="listbox">
        <li
          class="city-option"
          :class="{ selected: city === '' }"
          role="option"
          :aria-selected="city === ''"
          @click="selectCity('')"
        >
          全部城市
        </li>
        <li
          v-for="c in cities"
          :key="c"
          class="city-option"
          :class="{ selected: city === c }"
          role="option"
          :aria-selected="city === c"
          @click="selectCity(c)"
        >
          {{ c }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// ========== 定义props（父组件传入的值） ==========
const props = defineProps({
  // modelValue 是 v-model 的默认属性名（类型筛选）
  modelValue: {
    type: String,
    default: 'all'
  },
  // city 是具名v-model（v-model:city）的属性名（城市筛选）
  city: {
    type: String,
    default: ''
  },
  // cities 是可选城市列表，由父组件从岗位数据中提取后传入
  cities: {
    type: Array,
    default: () => []
  }
})

// ========== 定义emits（向父组件发送事件） ==========
const emit = defineEmits(['update:modelValue', 'update:city'])

// ========== 筛选选项数据 ==========
const filters = [
  { label: '全部', value: 'all' },
  { label: '🔥 急聘', value: 'urgent' },
  { label: '💰 高薪', value: 'high' }
]

// ========== 城市下拉框 ==========
const open = ref(false)
const rootEl = ref(null)

// 选中城市后把值发给父组件，并收起下拉框
function selectCity(value) {
  emit('update:city', value)
  open.value = false
}

// 点击组件外部收起下拉框
function handleClickOutside(e) {
  if (open.value && rootEl.value && !rootEl.value.contains(e.target)) {
    open.value = false
  }
}

// 按 Esc 收起下拉框
function handleEsc(e) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEsc)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
/*
  三列栅格：左、右两列等宽占位，中间的按钮组始终居中，
  城市按钮放在第三列并靠右对齐，因此永远贴在最右边、不会和左边按钮挤在一起
*/
.filter-bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  margin: 20px 0 30px;
}

.filter-group {
  grid-column: 2;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.city-select {
  grid-column: 3;
  justify-self: end;
  position: relative;
}

.filter-btn {
  padding: 8px 24px;
  border: 2px solid #e0e0e0;
  border-radius: 24px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* 城市按钮：文字和箭头排一行 */
.city-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* 展开时箭头翻转，给一点反馈 */
.city-btn.open {
  border-color: #667eea;
  color: #667eea;
}

.city-btn.active.open {
  color: white;
}

.caret {
  font-size: 10px;
  line-height: 1;
  transition: transform 0.3s;
}

.city-btn.open .caret {
  transform: rotate(180deg);
}

/* 下拉框：绝对定位挂在按钮下面，城市多时可滚动 */
.city-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 20;
  min-width: 160px;
  max-height: 280px;
  overflow-y: auto;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.city-option {
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.city-option:hover {
  background: #f2f3ff;
  color: #667eea;
}

.city-option.selected {
  background: #667eea;
  color: white;
}
</style>
