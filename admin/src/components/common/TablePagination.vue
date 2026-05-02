<!--
  统一分页组件
  规范：
  - pageSizes 必须包含 10/20/50/100（MISS-03 类 bug 修复规则）
  - 默认 pageSize = 20
-->
<template>
  <div class="table-pagination">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="currentPageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      background
      @size-change="emit('sizeChange', $event)"
      @current-change="emit('pageChange', $event)"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  total: number
  page?: number
  pageSize?: number
}>()

const emit = defineEmits<{
  (e: 'pageChange', page: number): void
  (e: 'sizeChange', size: number): void
}>()

const currentPage = defineModel<number>('page', { default: 1 })
const currentPageSize = defineModel<number>('pageSize', { default: 20 })
</script>

<style scoped>
.table-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0 4px;
}
</style>
