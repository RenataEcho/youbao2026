<template>
  <!-- 富文本编辑器视觉占位（无真实编辑能力），工具栏与编辑区样式参考后台常见 RTE -->
  <div class="rte-chrome">
    <div class="rte-toolbar" aria-hidden="true">
      <div class="rte-toolbar-row">
        <span class="rte-fake-select">正文 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></span>
        <span class="rte-fake-select">字号 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></span>
        <span class="rte-divider" />
        <button type="button" class="rte-tbtn" title="引用">❝</button>
        <button type="button" class="rte-tbtn rte-tbtn--on" title="加粗"><strong>B</strong></button>
        <button type="button" class="rte-tbtn" title="下划线"><span class="rte-ul">U</span></button>
        <button type="button" class="rte-tbtn" title="斜体"><em>I</em></button>
        <button type="button" class="rte-tbtn" title="删除线"><s>S</s></button>
        <span class="rte-divider" />
        <button type="button" class="rte-tbtn rte-color" title="文字颜色">A</button>
        <button type="button" class="rte-tbtn rte-hl" title="背景色">A</button>
        <span class="rte-divider" />
        <button type="button" class="rte-tbtn" title="有序列表">1.</button>
        <button type="button" class="rte-tbtn" title="无序列表">•</button>
      </div>
      <div class="rte-toolbar-row rte-toolbar-row--sub">
        <span class="rte-fake-select rte-fake-select--sm">对齐 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></span>
        <span class="rte-divider" />
        <button type="button" class="rte-tbtn" title="链接">🔗</button>
        <button type="button" class="rte-tbtn" title="图片">🖼</button>
        <button type="button" class="rte-tbtn" title="视频">▶</button>
        <button type="button" class="rte-tbtn" title="代码">&lt;/&gt;</button>
        <button type="button" class="rte-tbtn" title="表格">⊞</button>
        <button type="button" class="rte-tbtn" title="分割线">—</button>
        <span class="rte-divider" />
        <button type="button" class="rte-tbtn" title="撤销">↶</button>
        <button type="button" class="rte-tbtn" title="重做">↷</button>
        <button type="button" class="rte-tbtn rte-tbtn--fs" title="全屏">⛶</button>
      </div>
    </div>
    <textarea
      class="rte-textarea"
      :value="modelValue"
      :placeholder="placeholder"
      spellcheck="false"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>()
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<style scoped>
.rte-chrome {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  overflow: hidden;
}
.rte-toolbar {
  padding: 8px 10px;
  background: var(--surface-hover);
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.rte-toolbar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
}
.rte-toolbar-row--sub {
  padding-top: 2px;
  border-top: 1px dashed var(--border);
}
.rte-fake-select {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 10px;
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: default;
  user-select: none;
}
.rte-fake-select--sm {
  min-width: 72px;
}
.rte-fake-select svg {
  opacity: 0.55;
}
.rte-divider {
  width: 1px;
  height: 18px;
  background: var(--border);
  margin: 0 2px;
}
.rte-tbtn {
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--surface);
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: default;
  line-height: 1;
}
.rte-tbtn:hover {
  border-color: var(--border);
  color: var(--text-primary);
}
.rte-tbtn--on {
  background: rgba(37, 99, 235, 0.12);
  border-color: rgba(37, 99, 235, 0.35);
  color: var(--primary);
}
.rte-tbtn--fs {
  margin-left: auto;
}
.rte-ul {
  text-decoration: underline;
  text-underline-offset: 2px;
}
.rte-color {
  font-weight: 700;
  border-bottom: 3px solid #111827;
}
.rte-hl {
  font-weight: 700;
  background: linear-gradient(transparent 60%, #fde047 60%);
}
.rte-textarea {
  display: block;
  width: 100%;
  min-height: 220px;
  padding: 14px 16px;
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-primary);
  font-family: inherit;
  border: none;
  resize: vertical;
  outline: none;
  background: var(--surface);
  box-sizing: border-box;
}
.rte-textarea::placeholder {
  color: var(--text-muted);
}
[data-theme='dark'] .rte-chrome {
  border-color: rgba(255, 255, 255, 0.1);
}
[data-theme='dark'] .rte-toolbar {
  background: rgba(255, 255, 255, 0.04);
}
</style>
