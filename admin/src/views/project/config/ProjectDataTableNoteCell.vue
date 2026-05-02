<template>
  <span class="pdt-note-inner">
    <span v-if="tag === 'config'" class="pdt-tag pdt-tag-cfg">关键词配置</span>
    <span v-if="tag === 'fixed'" class="pdt-tag pdt-tag-fix">写死</span>
    <span v-if="tag === 'orderAdd'" class="pdt-tag pdt-tag-ord">订单表新增</span>
    <span v-if="text" class="pdt-note-text">{{ text }}</span>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  tag?: 'fixed' | 'config' | 'orderAdd'
  text: string
}>()
</script>

<style scoped>
.pdt-note-inner {
  display: inline;
  line-height: 1.45;
}
.pdt-tag {
  display: inline-block;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 4px;
  margin-bottom: 2px;
  vertical-align: middle;
}
.pdt-tag-fix {
  background: rgba(0, 180, 42, 0.12);
  color: var(--success);
}
.pdt-tag-cfg {
  background: rgba(54, 110, 244, 0.12);
  color: var(--primary);
}
.pdt-tag-ord {
  background: rgba(54, 110, 244, 0.12);
  color: var(--primary);
}
.pdt-note-text {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
