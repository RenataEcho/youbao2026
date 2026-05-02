<!--
  筛选区组件
  规范：
  - 查询/重置两个按钮始终分离（UIUX §筛选与批量操作分离）
  - 重置必须清空所有字段值，不能只 showToast（UI-02 类 bug 修复规则）
  - 通过 slot 注入具体筛选字段，避免组件耦合
-->
<template>
  <div class="filter-card glass-card">
    <el-form :model="modelValue" :inline="true" class="filter-form" @keyup.enter="emit('search')">
      <slot />
    </el-form>
    <div class="filter-actions">
      <el-button type="primary" :icon="Search" size="small" @click="emit('search')">查询</el-button>
      <el-button :icon="RefreshRight" size="small" @click="handleReset">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, RefreshRight } from '@element-plus/icons-vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

const props = defineProps<{
  modelValue: AnyRecord
  defaultValue?: AnyRecord
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: AnyRecord): void
  (e: 'search'): void
  (e: 'reset'): void
}>()

function handleReset() {
  const cleared: AnyRecord = {}
  for (const key of Object.keys(props.modelValue)) {
    const v = props.modelValue[key]
    if (Array.isArray(v)) {
      cleared[key] = props.defaultValue?.[key] ?? []
    } else {
      cleared[key] = props.defaultValue?.[key] ?? ''
    }
  }
  emit('update:modelValue', cleared)
  emit('reset')
  emit('search')
}
</script>

<style scoped>
.filter-card {
  padding: 14px 16px 10px;
  margin-bottom: 14px;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
  flex: 1;
}

.filter-form :deep(.el-form-item) {
  margin: 0;
}

.filter-form :deep(.el-form-item__label) {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  padding-right: 6px;
}

.filter-form :deep(.el-input__wrapper),
.filter-form :deep(.el-select .el-input__wrapper) {
  width: 160px;
}

.filter-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
</style>
