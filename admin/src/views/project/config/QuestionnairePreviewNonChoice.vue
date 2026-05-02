<template>
  <div>
    <div v-if="comp === 'text'" class="kce-preview-input">待填写者输入…</div>
    <div v-else-if="comp === 'textarea'" class="kce-preview-textarea">待填写者输入…</div>
    <div v-else-if="comp === 'number'" class="kce-preview-input">请输入数字</div>
    <div v-else-if="comp === 'url'" class="kce-preview-input kce-preview-row">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
      请输入链接，以 https:// 开头
    </div>
    <div v-else-if="comp === 'date'" class="kce-preview-date">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      请选择日期
    </div>
    <div v-else-if="comp === 'image'" class="kce-preview-upload">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      点击或拖拽上传图片
    </div>
    <div v-else-if="comp === 'video'" class="kce-preview-upload">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
      点击或拖拽上传视频
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ comp: string }>()
</script>

<style scoped>
.kce-preview-textarea {
  width: 100%;
  min-height: 68px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-hover);
  padding: 8px 10px;
  font-size: 13px;
  color: var(--text-muted);
  pointer-events: none;
  line-height: 1.6;
}
.kce-preview-input {
  width: 100%;
  height: 34px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-hover);
  padding: 0 10px;
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  pointer-events: none;
}
.kce-preview-row { gap: 6px; }
.kce-preview-date {
  width: 100%;
  height: 34px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-hover);
  padding: 0 10px;
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 7px;
  pointer-events: none;
}
.kce-preview-upload {
  width: 100%;
  min-height: 76px;
  border: 1.5px dashed var(--border);
  border-radius: 4px;
  background: var(--bg-hover);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: var(--text-muted);
  font-size: 12px;
  pointer-events: none;
}
</style>
