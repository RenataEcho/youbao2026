<template>
  <div
    class="att-field"
    :class="{ 'att-field--compact': compact, 'att-field--minimal': hideFormatHints }"
  >
    <label v-if="label" class="ul-label">{{ label }}<span v-if="required" class="req">*</span></label>
    <p v-if="hint" class="att-hint">{{ hint }}</p>
    <div class="att-upload" @click="triggerPick">
      <input
        ref="inputRef"
        type="file"
        class="att-input"
        :accept="accept"
        @change="onFile"
      >
      <div v-if="previewSrc" class="att-preview-wrap">
        <img :src="previewSrc" alt="" class="att-preview-img" :style="previewStyle">
        <div class="att-actions">
          <button type="button" class="btn btn-default btn-sm" @click.stop="clear">移除</button>
        </div>
      </div>
      <div v-else class="att-placeholder">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <span>{{ placeholderText }}</span>
        <span v-if="limitText" class="att-limit">{{ limitText }}</span>
      </div>
    </div>
    <div v-if="!hideUrl" class="att-url-row">
      <span class="att-url-label">或填写 URL</span>
      <input
        :value="modelValue"
        type="text"
        class="ul-input att-url-input"
        placeholder="https://…"
        @input="onUrlInput"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    hint?: string
    required?: boolean
    accept?: string
    /** 建议尺寸文案，如 96×96 */
    sizeHint?: string
    maxMb?: number
    /** 紧凑布局：缩小占位区与预览尺寸，用于表单内多图并排 */
    compact?: boolean
    /** 不展示「或填写 URL」行 */
    hideUrl?: boolean
    /** 占位区内不展示建议尺寸、格式等说明 */
    hideFormatHints?: boolean
  }>(),
  {
    accept: 'image/png,image/jpeg,image/webp,image/gif',
    maxMb: 5,
    compact: false,
    hideUrl: false,
    hideFormatHints: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [string] }>()

const inputRef = ref<HTMLInputElement | null>(null)
const objectUrl = ref<string | null>(null)

const previewSrc = computed(() => {
  const v = props.modelValue?.trim()
  if (!v) return ''
  if (v.startsWith('data:') || v.startsWith('blob:') || v.startsWith('http')) return v
  return ''
})

const previewStyle = computed(() => {
  const c = props.compact
  const sm = props.hideFormatHints && c
  if (props.sizeHint?.includes('64')) {
    const n = sm ? 36 : c ? 44 : 64
    return { width: `${n}px`, height: `${n}px`, objectFit: 'cover' as const }
  }
  const n = sm ? 56 : c ? 72 : 96
  return { width: `${n}px`, height: `${n}px`, objectFit: 'cover' as const }
})

const limitText = computed(() => {
  if (props.hideFormatHints) return ''
  const parts = [`PNG / JPG / WebP / GIF，≤ ${props.maxMb}MB`]
  if (props.sizeHint) parts.unshift(`建议 ${props.sizeHint}`)
  return parts.join(' · ')
})

const placeholderText = computed(() => (props.hideFormatHints ? '点击上传' : '点击或拖拽上传图片'))

function triggerPick() {
  inputRef.value?.click()
}

function onUrlInput(e: Event) {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value)
    objectUrl.value = null
  }
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  if (file.size > props.maxMb * 1024 * 1024) {
    return
  }
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = typeof reader.result === 'string' ? reader.result : ''
    emit('update:modelValue', dataUrl)
  }
  reader.readAsDataURL(file)
}

function clear() {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  objectUrl.value = null
  emit('update:modelValue', '')
}

watch(
  () => props.modelValue,
  () => {
    /* URL 来自外部时无需 objectUrl */
  },
)
</script>

<style scoped>
.att-field { width: 100%; }
.att-hint {
  font-size: 11px;
  color: var(--text-muted);
  margin: 0 0 8px;
  line-height: 1.45;
}
.req { color: var(--danger); margin-left: 2px; }

.att-upload {
  position: relative;
  border: 1px dashed var(--border-hover);
  border-radius: var(--radius);
  background: var(--surface-hover);
  min-height: 112px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}
.att-field--compact .att-upload {
  min-height: 52px;
}
.att-field--compact.att-field--minimal .att-upload {
  min-height: 44px;
}
.att-upload:hover {
  border-color: var(--primary-border);
  background: var(--primary-light);
}

.att-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.att-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  color: var(--text-secondary);
  font-size: 13px;
}
.att-field--compact .att-placeholder {
  padding: 8px 10px;
  gap: 4px;
  font-size: 11px;
}
.att-field--minimal .att-placeholder svg {
  width: 20px;
  height: 20px;
}
.att-limit {
  font-size: 11px;
  color: var(--text-muted);
}

.att-preview-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  width: 100%;
}
.att-field--compact .att-preview-wrap {
  gap: 8px;
  padding: 6px 8px;
}
.att-preview-img {
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  background: var(--surface);
}
.att-actions {
  margin-left: auto;
}

.att-url-row {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.att-field--compact .att-url-row {
  margin-top: 6px;
}
.att-field--compact .att-url-input {
  height: 28px;
  font-size: 12px;
}
.att-url-label {
  font-size: 11px;
  color: var(--text-muted);
}
.att-url-input {
  font-size: 13px;
}
</style>
