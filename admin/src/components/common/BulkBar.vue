<!--
  批量操作栏 — 严格遵循「筛选与批量操作分离」规范（UI-03 类 bug 修复规则）
  仅在有选中行时显示，不与筛选区混用
-->
<template>
  <transition name="bulk-slide">
    <div v-if="selectedCount > 0" class="bulk-bar">
      <span class="bulk-bar-count">
        已选 <strong>{{ selectedCount }}</strong> 项
      </span>
      <slot />
      <el-button size="small" @click="emit('clear')">取消选择</el-button>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  selectedCount: number
}>()

const emit = defineEmits<{
  (e: 'clear'): void
}>()
</script>

<style scoped>
.bulk-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  margin-bottom: 10px;
  background: var(--primary-light);
  border: 1px solid var(--primary-border);
  border-radius: var(--radius-sm);
}

.bulk-bar-count {
  font-size: 13px;
  color: var(--text-secondary);
  flex: 1;
}
.bulk-bar-count strong {
  color: var(--primary);
}

/* 出现动画 */
.bulk-slide-enter-active,
.bulk-slide-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease, max-height 0.18s ease;
  max-height: 60px;
  overflow: hidden;
}
.bulk-slide-enter-from,
.bulk-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
  max-height: 0;
}
</style>
