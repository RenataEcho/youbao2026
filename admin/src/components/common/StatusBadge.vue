<!-- 语义状态徽章 — 严格按 UIUX §Badge 规范使用语义色，禁止 badge-primary -->
<template>
  <span class="badge" :class="`badge-${variant}`">{{ label }}</span>
</template>

<script setup lang="ts">
import type { BadgeVariant } from '@/types'

defineProps<{
  label: string
  variant: BadgeVariant
}>()
</script>
