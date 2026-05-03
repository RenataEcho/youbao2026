<template>
  <div class="ul-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">运营</span>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">运营配置</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">通用配置</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">通用配置</h1>
          </div>
          <p class="page-desc">
            一般为<strong>全局</strong>相关配置入口；下列子模块以 Tab 规划，当前为占位说明，详规与接口待后续补充。
          </p>
        </div>
      </div>

      <PrdTipMarker
        :anchor-el="prdTipAnchorRef"
        :tip-id="1"
        module-name="通用配置（页头汇总）"
        :markdown="OPS_TIP_COMMON_CONFIG"
      />

      <div class="glass-card" style="padding: 16px 20px">
        <p class="page-desc" style="margin: 0; line-height: 1.65">
          <strong>子菜单 Tab（规划）</strong>：说明文案、个人中心、开发测试账号、全局背景图、收益台图标、银行图标、邀请素材（配置邀请海报、文案）。
        </p>
      </div>

      <div class="glass-card tab-nav-shell" role="tablist" aria-label="通用配置子模块">
        <div class="tab-nav">
          <button
            v-for="t in tabs"
            :id="`cc-tab-${t.key}`"
            :key="t.key"
            class="tab-item"
            :class="{ active: activeTab === t.key }"
            type="button"
            role="tab"
            :aria-selected="activeTab === t.key"
            :tabindex="activeTab === t.key ? 0 : -1"
            @click="activeTab = t.key"
          >
            {{ t.label }}
          </button>
        </div>
      </div>

      <div
        class="glass-card table-card"
        role="tabpanel"
        :aria-labelledby="`cc-tab-${activeTab}`"
      >
        <div class="table-header">
          <div class="table-title">{{ activeTabMeta.label }}<span class="table-count">占位</span></div>
        </div>
        <div style="padding: 40px 24px; color: var(--text-muted)">
          <p style="font-size: 15px; font-weight: 600; color: var(--text-secondary); margin: 0 0 10px">功能规划中</p>
          <p class="page-desc" style="margin: 0; max-width: 720px; line-height: 1.65">{{ activeTabMeta.hint }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PrdTipMarker from '@/components/prd/PrdTipMarker.vue'
import { OPS_TIP_COMMON_CONFIG } from '@/prd-tips/opsDomainTips'
import { computed, ref } from 'vue'

type TabKey =
  | 'copy'
  | 'profile'
  | 'devtest'
  | 'bg'
  | 'earning'
  | 'bank'
  | 'invite'

const prdTipAnchorRef = ref<HTMLElement | null>(null)

const tabs: { key: TabKey; label: string; hint: string }[] = [
  { key: 'copy', label: '说明文案', hint: '配置各前端页面使用的说明类文案；列表与编辑表单待 PRD 字段级补充。' },
  { key: 'profile', label: '个人中心', hint: '配置个人中心模块展示内容；与 C 端个人中心结构对齐后定稿。' },
  { key: 'devtest', label: '开发测试账号', hint: '维护开发、联调或测试用途账号/白名单；权限与安全策略与实现对齐。' },
  { key: 'bg', label: '全局背景图', hint: '管理端内全局背景图资源；上传规格与生效范围待产品确认。' },
  { key: 'earning', label: '收益台图标', hint: '管理收益台相关图标资源；尺寸与命名规范待统一。' },
  { key: 'bank', label: '银行图标', hint: '管理银行品牌图标资源，供绑卡、提现等场景展示。' },
  {
    key: 'invite',
    label: '邀请素材',
    hint: '配置邀请海报、邀请文案等拉新素材；与分享链路、预览规则待后续详规。',
  },
]

const activeTab = ref<TabKey>('copy')
const activeTabMeta = computed(() => tabs.find((t) => t.key === activeTab.value)!)
</script>
