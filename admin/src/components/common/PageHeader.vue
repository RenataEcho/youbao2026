<!-- 页面统一标题区 -->
<template>
  <div class="page-header">
    <div class="page-header-title">
      <h2 class="page-title">{{ title }}</h2>
      <span v-if="subtitle" class="page-subtitle">{{ subtitle }}</span>
    </div>
    <div v-if="$slots.actions" class="page-header-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.page-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.4;
}
.page-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  margin-left: 8px;
}
.page-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
