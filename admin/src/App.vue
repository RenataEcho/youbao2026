<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// 初始化主题 — 必须在 mounted 后执行，避免 BUG-05（DOM 未就绪就操作图标）
onMounted(() => {
  themeStore.init()
})
</script>
