<template>
  <div class="main-layout-root" :class="{ 'is-embed': isEmbed }">
    <TopNav v-if="!isEmbed" />
    <div class="layout" :class="{ embed: isEmbed }">
      <!-- 工作台无侧边栏；iframe 嵌入 admin-ui 时整页仅内容区 -->
      <Sidebar v-if="!isEmbed && appStore.activeDomain !== 'dashboard'" />
      <div
        class="main"
        :class="{
          collapsed: !isEmbed && appStore.sidebarCollapsed,
          'no-sidebar': appStore.activeDomain === 'dashboard' || isEmbed,
        }"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" :key="$route.fullPath" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNav from './TopNav.vue'
import Sidebar from './Sidebar.vue'
import { useAppStore } from '@/stores/app'
import { useRoute } from 'vue-router'
import { watch, computed } from 'vue'
import { DOMAINS } from '@/router/menus'
import type { DomainKey } from '@/stores/app'

const appStore = useAppStore()
const route = useRoute()

/** admin-ui 通过 iframe 嵌入时带 ?embed=1，隐藏顶栏与侧栏避免双壳 */
const isEmbed = computed(() => {
  const q = route.query.embed
  return q === '1' || q === 'true'
})

// 根据当前路由自动同步激活的域
watch(() => route.path, (path) => {
  for (const domain of DOMAINS) {
    if (path === '/dashboard') { appStore.setDomain('dashboard'); return }
    for (const group of domain.groups) {
      for (const item of group.children) {
        if (item.children?.length) {
          for (const sub of item.children) {
            if (sub.path && (path === sub.path || path.startsWith(sub.path + '/'))) {
              appStore.setDomain(domain.key as DomainKey)
              return
            }
          }
        }
        if (item.path && (path === item.path || path.startsWith(item.path + '/'))) {
          appStore.setDomain(domain.key as DomainKey)
          return
        }
      }
    }
  }
}, { immediate: true })
</script>

<style scoped>
.layout {
  display: flex;
  margin-top: var(--topnav-h);
  min-height: calc(100vh - var(--topnav-h));
}

.layout.embed {
  margin-top: 0;
  min-height: 100vh;
}

.is-embed .main {
  min-height: 100vh;
}

.main {
  flex: 1;
  margin-left: var(--sidebar-w);
  min-height: calc(100vh - var(--topnav-h));
  transition: margin-left 0.22s ease;
  min-width: 0;
}

.main.collapsed {
  margin-left: var(--sidebar-w-collapsed);
}

.main.no-sidebar {
  margin-left: 0;
}
</style>
