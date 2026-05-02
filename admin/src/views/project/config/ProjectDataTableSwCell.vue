<template>
  <td class="pdt-switch-cell">
    <div class="pdt-sw-wrap">
      <label class="pdt-switch">
        <input
          type="checkbox"
          :checked="checked"
          :disabled="disabled"
          @change="onChange"
        >
        <span class="pdt-switch-slider" />
      </label>
      <div class="pdt-switch-lbl">{{ checked ? '是' : '否' }}</div>
    </div>
  </td>
</template>

<script setup lang="ts">
defineProps<{
  checked: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:checked': [boolean]
}>()

function onChange(e: Event) {
  const v = (e.target as HTMLInputElement).checked
  emit('update:checked', v)
}
</script>

<style scoped>
.pdt-switch-cell { text-align: center; }
.pdt-sw-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.pdt-switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  vertical-align: middle;
}
.pdt-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.pdt-switch-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: var(--border);
  border-radius: 20px;
  transition: 0.2s;
}
.pdt-switch-slider::before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background: #fff;
  border-radius: 50%;
  transition: 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.15);
}
.pdt-switch input:checked + .pdt-switch-slider { background: var(--primary); }
.pdt-switch input:checked + .pdt-switch-slider::before { transform: translateX(16px); }
.pdt-switch input:disabled + .pdt-switch-slider { opacity: 0.45; cursor: not-allowed; }
.pdt-switch-lbl {
  font-size: 11px;
  color: var(--text-muted);
}
</style>
