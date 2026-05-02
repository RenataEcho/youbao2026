<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`操作日志 · ${level}`"
    width="720px"
    align-center
    destroy-on-close
    class="clg-dialog"
    @closed="emit('update:visible', false)"
  >
    <el-table
      v-loading="loading"
      :data="logs"
      border
      size="small"
      stripe
      max-height="420"
      empty-text="暂无操作记录"
      class="clg-table"
    >
      <el-table-column prop="time" label="时间" width="168" />
      <el-table-column prop="op" label="操作类型" width="120">
        <template #default="{ row }">
          <span class="clg-op" :class="opClass(row.op)">{{ row.op }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="detail" label="详情" min-width="220" show-overflow-tooltip />
      <el-table-column prop="operator" label="操作人" width="100" />
    </el-table>
    <template #footer>
      <el-button size="small" @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CommissionLog } from '@/types'

const props = defineProps<{
  visible: boolean
  level: string
  logs: CommissionLog[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
}>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (v: boolean) => emit('update:visible', v),
})

function opClass(op: string) {
  if (op.includes('编辑')) return 'clg-op--blue'
  if (op.includes('启用')) return 'clg-op--green'
  if (op.includes('禁用')) return 'clg-op--amber'
  if (op.includes('创建')) return 'clg-op--purple'
  return 'clg-op--gray'
}
</script>

<style scoped>
.clg-op {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}
.clg-op--blue {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}
.clg-op--green {
  background: rgba(22, 163, 74, 0.1);
  color: #16a34a;
}
.clg-op--amber {
  background: rgba(217, 119, 6, 0.1);
  color: #d97706;
}
.clg-op--purple {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}
.clg-op--gray {
  background: var(--surface-hover);
  color: var(--text-muted);
}
[data-theme='dark'] .clg-op--blue {
  background: rgba(37, 99, 235, 0.18);
  color: #93c5fd;
}
[data-theme='dark'] .clg-op--green {
  background: rgba(22, 163, 74, 0.18);
  color: #86efac;
}
[data-theme='dark'] .clg-op--amber {
  background: rgba(217, 119, 6, 0.18);
  color: #fcd34d;
}
[data-theme='dark'] .clg-op--purple {
  background: rgba(124, 58, 237, 0.18);
  color: #c4b5fd;
}
</style>

<style>
.clg-dialog .el-dialog__body {
  padding-top: 8px;
}
</style>
