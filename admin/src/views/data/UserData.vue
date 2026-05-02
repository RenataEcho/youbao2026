<template>
  <div class="ud-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">数据</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">用户数据</span>
    </div>

    <div class="page-content dv-board-stagger">
      <div class="page-header">
        <div>
          <h1 class="page-title">用户数据</h1>
          <p class="page-desc">
            单页聚合看板（全局筛选、KPI 与各模块图表）；口径与范围以仓库根目录
            <code class="ud-code">user- dashboard.md</code>
            为准。当前为演示数据，未接 API。
          </p>
        </div>
      </div>

      <UserChannelAnalytics />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserChannelAnalytics from './UserChannelAnalytics.vue'
</script>

<style scoped>
.ud-wrap { min-height: 100%; }
.ud-code { font-size: 12px; padding: 2px 6px; border-radius: 4px; background: var(--surface); border: 1px solid var(--border); }
</style>
