<template>
  <div class="pdr-block" :class="{ 'pdr-block--hidden': section.visible === 'no' }">
    <div class="pdr-head">
      <h4 class="pdr-title">{{ section.title || '（未命名板块）' }}</h4>
      <span v-if="section.description" class="pdr-desc">{{ section.description }}</span>
      <span class="badge" :class="section.visible === 'yes' ? 'badge-success' : 'badge-gray'">
        {{ section.visible === 'yes' ? '前台展示' : '前台隐藏' }}
      </span>
      <span class="pdr-ctype">{{ section.contentType === 'video' ? '视频' : '图文' }}</span>
    </div>
    <div v-if="section.visible === 'no'" class="pdr-muted">该块已隐藏，前台不展示（后台可查看预览）。</div>
    <div v-else-if="section.contentType === 'article'" class="pdr-rich" v-html="section.content || '<p class=\'pdr-empty\'>暂无内容</p>'" />
    <div v-else class="pdr-video">
      <template v-if="section.content?.trim()">
        <video :src="section.content" controls class="pdr-video-el" />
      </template>
      <p v-else class="pdr-empty">未填写视频地址</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DetailSection } from '@/utils/projectManagement'

defineProps<{ section: DetailSection }>()
</script>

<style scoped>
.pdr-block {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface-hover);
  padding: 14px 16px;
  margin-bottom: 12px;
}
.pdr-block--hidden {
  opacity: 0.85;
  border-style: dashed;
}
.pdr-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}
.pdr-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
.pdr-desc {
  font-size: 12px;
  color: var(--text-muted);
  flex: 1 1 100%;
}
.pdr-ctype {
  font-size: 11px;
  color: var(--text-muted);
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--border);
}
.pdr-muted {
  font-size: 12px;
  color: var(--text-muted);
}
.pdr-rich {
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-secondary);
}
.pdr-rich :deep(p) {
  margin: 0 0 8px;
}
.pdr-rich :deep(p:last-child) {
  margin-bottom: 0;
}
.pdr-video-el {
  max-width: 100%;
  max-height: 280px;
  border-radius: var(--radius-sm);
  margin-top: 4px;
}
.pdr-empty {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
}
</style>
