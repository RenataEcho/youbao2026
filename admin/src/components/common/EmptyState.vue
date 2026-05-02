<!-- 空数据状态组件 -->
<template>
  <div class="empty-state">
    <el-empty :description="description" :image-size="64" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  description?: string
}>()
</script>

<style scoped>
.empty-state {
  padding: 48px 0;
  display: flex;
  justify-content: center;
}
</style>
