<template>
  <div class="glass-card dv-stat-kpi dv-kpi-interactive" :class="`dv-stat-kpi--${tint}`">
    <div class="dv-stat-kpi__icon" aria-hidden="true">
      <slot name="icon" />
    </div>
    <div class="dv-stat-kpi__body">
      <div class="dv-stat-kpi__val" :title="valueTitle || undefined">{{ value }}</div>
      <div class="dv-stat-kpi__lab">{{ label }}</div>
      <div v-if="sub || slots.sub" class="dv-stat-kpi__sub">
        <slot name="sub">{{ sub }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'

const slots = useSlots()

withDefaults(
  defineProps<{
    value: string
    label: string
    sub?: string
    /** 悬浮主数字时展示的完整文案（如完整人民币金额） */
    valueTitle?: string
    /** 主题色：与 theme.css 中 .dv-stat-kpi--* 对应 */
    tint?: 'blue' | 'cyan' | 'violet' | 'amber' | 'emerald' | 'rose' | 'slate'
  }>(),
  { tint: 'slate', sub: '', valueTitle: '' },
)
</script>
