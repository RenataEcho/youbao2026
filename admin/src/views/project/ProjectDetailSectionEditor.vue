<template>
  <div class="pc-section-editor">
    <div class="pc-fields-row">
      <div class="ul-form-group">
        <label class="ul-label">板块标题</label>
        <input v-model="local.title" type="text" class="ul-input">
      </div>
      <div class="ul-form-group">
        <label class="ul-label">描述 / 摘要</label>
        <input v-model="local.description" type="text" class="ul-input">
      </div>
      <div class="ul-form-group">
        <label class="ul-label">前台展示该块</label>
        <select v-model="local.visible" class="ul-input ul-select">
          <option value="yes">展示</option>
          <option value="no">隐藏</option>
        </select>
      </div>
    </div>

    <div class="pc-content-row">
      <span class="pc-content-label">内容</span>
      <div class="pc-content-editor">
        <RichTextChrome
          v-model="local.content"
          placeholder="输入正文 HTML，或使用上方工具栏样式参考排版…"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { DetailSection } from '@/utils/projectManagement'
import RichTextChrome from '@/components/project/RichTextChrome.vue'

const props = defineProps<{ modelValue: DetailSection }>()
const emit = defineEmits<{ 'update:modelValue': [DetailSection] }>()

const local = reactive<DetailSection>({ ...props.modelValue, contentType: 'article' })

watch(
  () => props.modelValue,
  (v) => {
    local.title = v.title
    local.description = v.description
    local.contentType = 'article'
    local.content = v.content
    local.visible = v.visible
  },
  { deep: true },
)

watch(
  local,
  () => {
    emit('update:modelValue', { ...local, contentType: 'article' })
  },
  { deep: true },
)
</script>

<style scoped>
.pc-section-editor {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.pc-fields-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px 14px;
  align-items: start;
}
@media (max-width: 900px) {
  .pc-fields-row {
    grid-template-columns: 1fr;
  }
}

.pc-content-row {
  display: flex;
  gap: 12px;
  align-items: stretch;
}
.pc-content-label {
  flex-shrink: 0;
  width: 36px;
  padding-top: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.4;
}
.pc-content-editor {
  flex: 1;
  min-width: 0;
}
@media (max-width: 640px) {
  .pc-content-row {
    flex-direction: column;
  }
  .pc-content-label {
    width: auto;
    padding-top: 0;
  }
}
</style>
