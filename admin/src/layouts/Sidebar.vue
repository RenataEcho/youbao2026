<template>
  <aside class="sidebar" :class="{ collapsed: appStore.sidebarCollapsed }">
    <!-- 侧边栏头部：当前域名 -->
    <div class="sidebar-header">
      <div class="sidebar-module-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <component :is="currentDomainIcon" />
        </svg>
      </div>
      <span class="sidebar-module-name">{{ currentDomainLabel }}</span>
    </div>

    <!-- 滚动菜单区 -->
    <div class="sidebar-scroll">
      <template v-for="group in currentGroups" :key="group.key">
        <!-- 分组标签 -->
        <div class="nav-group-label">{{ group.label }}</div>

        <!-- 菜单项 -->
        <template v-for="item in group.children" :key="item.key">
          <!-- 有子菜单的二级项（如果有 children） -->
          <template v-if="item.children && item.children.length">
            <button
              class="nav-item"
              :class="{ active: isGroupActive(item), open: openGroups.has(item.key) }"
              @click="toggleGroup(item.key)"
            >
              <span class="nav-icon" v-html="getItemIcon(item.icon)"></span>
              <span class="nav-text">{{ item.label }}</span>
              <span class="nav-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </span>
            </button>
            <div class="nav-submenu" :class="{ open: openGroups.has(item.key) }">
              <button
                v-for="sub in item.children"
                :key="sub.key"
                class="nav-subitem"
                :class="{ active: isActive(sub.path) }"
                @click="navigate(sub.path)"
              >
                <span class="sub-dot"></span>
                {{ sub.label }}
              </button>
            </div>
          </template>

          <!-- 无子菜单的叶子项 -->
          <template v-else>
            <el-tooltip
              :content="item.label"
              placement="right"
              :disabled="!appStore.sidebarCollapsed"
              :show-after="100"
            >
              <button
                class="nav-item"
                :class="{ active: isActive(item.path) }"
                :data-prd-menu-key="appStore.activeDomain === 'ops' ? item.key : undefined"
                @click="navigate(item.path)"
              >
                <span class="nav-icon" v-html="getItemIcon(item.icon)"></span>
                <span class="nav-text">{{ item.label }}</span>
              </button>
            </el-tooltip>
          </template>
        </template>
      </template>
    </div>

    <!-- 底部折叠按钮 -->
    <div class="sidebar-footer">
      <span class="sidebar-version">v2.0.0</span>
      <button class="sidebar-toggle" :title="appStore.sidebarCollapsed ? '展开' : '收起'" @click="appStore.toggleSidebar()">
        <svg v-if="!appStore.sidebarCollapsed" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { DOMAIN_MAP, DOMAINS } from '@/router/menus'

const appStore = useAppStore()
const route = useRoute()
const router = useRouter()
const openGroups = ref(new Set<string>())

const currentGroups = computed(() => DOMAIN_MAP[appStore.activeDomain]?.groups ?? [])
const currentDomainLabel = computed(() => DOMAIN_MAP[appStore.activeDomain]?.label ?? '')
const currentDomainIcon = computed(() => DOMAIN_MAP[appStore.activeDomain]?.icon ?? 'Setting')

function isActive(path: string) {
  if (!path) return false
  return route.path === path || route.path.startsWith(path + '/')
}

function isGroupActive(item: import('@/router/menus').MenuItem) {
  return item.children?.some((c) => isActive(c.path)) ?? false
}

function toggleGroup(key: string) {
  if (openGroups.value.has(key)) openGroups.value.delete(key)
  else openGroups.value.add(key)
}

function navigate(path: string) {
  if (path) router.push(path)
}

/** 进入带三级子菜单的父级（如字典管理）时自动展开，避免找不到当前页 */
watch(
  () => route.path,
  (path) => {
    for (const domain of DOMAINS) {
      for (const g of domain.groups) {
        for (const item of g.children) {
          if (item.children?.length) {
            const hit = item.children.some(
              (c) => c.path && (path === c.path || path.startsWith(c.path + '/')),
            )
            if (hit) openGroups.value.add(item.key)
          }
        }
      }
    }
  },
  { immediate: true },
)

// SVG 图标映射（对照 index.html 中使用的图标风格）
const ICON_MAP: Record<string, string> = {
  List: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  Postcard: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
  VideoCamera: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  CreditCard: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  Remove: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
  Gift: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
  Refresh: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  Wallet: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>`,
  PieChart: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
  Trophy: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8m-4 0v-4m-7-4H3a1 1 0 0 1-1-1V6h4m14 6h2a1 1 0 0 0 1-1V6h-4M5 6h14v8a7 7 0 0 1-14 0z"/></svg>`,
  Document: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  ChatDotRound: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  Message: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  Medal: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="6"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>`,
  Star: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  Flag: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
  SetUp: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
  Management: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
  Setting: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`,
  Search: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  Film: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`,
  Tickets: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/></svg>`,
  Monitor: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  TrendCharts: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  Money: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  Histogram: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  UserFilled: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  User: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  Key: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
  Lock: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  Bell: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  Picture: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  Tools: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  Ticket: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/></svg>`,
  ChatSquare: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  QuestionFilled: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  Menu: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  Notebook: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  Folder: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  Finished: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  OfficeBuilding: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  Share: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  DataAnalysis: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 14l3-3 3 3 4-4"/></svg>`,
  Globe: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  DocumentChecked: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>`,
  ChatDotSquare: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="12" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/></svg>`,
  Briefcase: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  Lightning: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  DataLine: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  Operation: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  FolderOpened: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
}

function getItemIcon(name?: string): string {
  if (!name) return ICON_MAP['Document']
  return ICON_MAP[name] ?? ICON_MAP['Document']
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  position: fixed;
  top: var(--topnav-h); bottom: 0; left: 0;
  z-index: 200;
  display: flex; flex-direction: column;
  background: var(--sidebar-bg);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border-right: 1px solid var(--sidebar-border);
  box-shadow: 2px 0 12px rgba(99,102,241,0.07);
  transition: width 0.22s ease, transform 0.22s ease;
  overflow: hidden;
}
[data-theme="dark"] .sidebar {
  background: var(--sidebar-bg);
  border-right-color: var(--sidebar-border);
  box-shadow: 2px 0 12px rgba(0,0,0,0.3);
}
.sidebar.collapsed { width: var(--sidebar-w-collapsed); }

/* 头部：略增顶内边距，避免与顶栏衔接处产生裁切感 */
.sidebar-header {
  display: flex; align-items: center; gap: 8px;
  padding: 16px 14px 10px;
  border-bottom: 1px solid var(--sidebar-border);
  flex-shrink: 0; min-height: 48px;
  box-sizing: border-box;
}
.sidebar-module-icon {
  width: 24px; height: 24px; border-radius: 6px;
  background: rgba(99,102,241,0.12);
  display: flex; align-items: center; justify-content: center;
  color: #4f46e5; flex-shrink: 0;
}
[data-theme="dark"] .sidebar-module-icon { background: rgba(99,102,241,0.22); color: #a5b4fc; }
.sidebar-module-name {
  font-size: 13px; font-weight: 700; color: #1e3a8a;
  white-space: nowrap; overflow: hidden;
  transition: opacity 0.18s ease;
}
[data-theme="dark"] .sidebar-module-name { color: #e2e8f0; }
.sidebar.collapsed .sidebar-module-name { opacity: 0; pointer-events: none; }
.sidebar.collapsed .sidebar-header { justify-content: center; }

/* 滚动区：min-height:0 使 flex 子项可收缩并正确出现滚动条，避免底部菜单被截断/出现色块 */
.sidebar-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 0 20px;
  -webkit-overflow-scrolling: touch;
}
.sidebar-scroll::-webkit-scrollbar { width: 3px; }
.sidebar-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

/* 分组标签：与上一组留出稳定间距，避免「用户体系」与「团长体系」贴得过近 */
.nav-group-label {
  padding: 16px 22px 4px;
  font-size: 10.5px; font-weight: 700; color: #8a9abf;
  text-transform: uppercase; letter-spacing: 0.8px;
  white-space: nowrap; overflow: hidden;
  transition: opacity 0.18s, height 0.18s; line-height: 1;
}
[data-theme="dark"] .nav-group-label { color: #475569; }
.sidebar.collapsed .nav-group-label { opacity: 0; pointer-events: none; height: 0; padding: 0; overflow: hidden; }

/* 二级菜单项 */
.nav-item {
  display: flex; align-items: center; gap: 8px;
  padding: 0 10px 0 12px; height: 40px;
  font-size: 13px; font-weight: 500; color: #4a5680;
  cursor: pointer; transition: var(--transition);
  position: relative; white-space: nowrap;
  border: none; background: none; font-family: inherit;
  overflow: hidden; border-radius: 8px; text-align: left;
  margin: 1px 8px; width: calc(100% - 16px);
}
[data-theme="dark"] .nav-item { color: rgba(203,213,225,0.75); }
.nav-item:hover { color: #1e3a8a; background: rgba(99,102,241,0.09); }
[data-theme="dark"] .nav-item:hover { color: #c7d2fe; background: rgba(99,102,241,0.15); }
.nav-item.active { color: #2563eb; background: rgba(37,99,235,0.12); font-weight: 600; }
.nav-item.active::before {
  content: ''; position: absolute; left: 0; top: 7px; bottom: 7px;
  width: 3px; border-radius: 0 2px 2px 0; background: #2563eb;
}
[data-theme="dark"] .nav-item.active { color: #93c5fd; background: rgba(37,99,235,0.22); }
[data-theme="dark"] .nav-item.active::before { background: #60a5fa; }

.nav-icon { flex-shrink: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; color: inherit; }
.nav-icon :deep(svg) { color: inherit; flex-shrink: 0; }
.nav-text { flex: 1; transition: opacity 0.18s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; }
.sidebar.collapsed .nav-text { opacity: 0; pointer-events: none; }
.nav-arrow { width: 14px; height: 14px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: transform 0.18s, opacity 0.18s; }
.sidebar.collapsed .nav-arrow { opacity: 0; pointer-events: none; }
.nav-item.open > .nav-arrow { transform: rotate(90deg); }

/* 三级菜单 */
.nav-submenu { overflow: hidden; max-height: 0; transition: max-height 0.22s ease; }
.nav-submenu.open { max-height: 600px; }
.sidebar.collapsed .nav-submenu { max-height: 0 !important; }
.nav-subitem {
  display: flex; align-items: center;
  padding: 0 14px 0 40px; height: 36px;
  font-size: 12.5px; color: #5a6a8a;
  cursor: pointer; transition: var(--transition);
  border: none; background: none; width: calc(100% - 16px); font-family: inherit;
  position: relative; white-space: nowrap; overflow: hidden;
  border-radius: 7px; margin: 1px 8px;
}
[data-theme="dark"] .nav-subitem { color: rgba(148,163,184,0.80); }
.nav-subitem:hover { color: #2563eb; background: rgba(37,99,235,0.07); }
[data-theme="dark"] .nav-subitem:hover { color: #93c5fd; background: rgba(37,99,235,0.12); }
.nav-subitem.active { color: #2563eb; font-weight: 600; background: rgba(37,99,235,0.10); }
[data-theme="dark"] .nav-subitem.active { color: #93c5fd; background: rgba(37,99,235,0.18); }
.sub-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: .35; flex-shrink: 0; margin-right: 8px; }
.nav-subitem.active .sub-dot { opacity: 1; }

/* 底部 */
.sidebar-footer {
  padding: 8px 10px; border-top: 1px solid var(--sidebar-border);
  display: flex; align-items: center; justify-content: space-between;
  flex-shrink: 0;
}
.sidebar-version { font-size: 10px; color: var(--text-muted); transition: opacity 0.18s; }
.sidebar.collapsed .sidebar-version { opacity: 0; }
.sidebar-toggle {
  width: 26px; height: 26px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  background: none; border: 1px solid var(--border);
  cursor: pointer; color: var(--text-muted); transition: var(--transition);
  flex-shrink: 0;
}
.sidebar-toggle:hover { color: var(--primary); border-color: var(--primary-border); }
</style>
