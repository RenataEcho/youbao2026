<template>
  <header class="topnav">
    <!-- Logo -->
    <a class="topnav-logo" href="#" @click.prevent>
      <div class="logo-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      </div>
      <span class="logo-name">右豹管理后台</span>
    </a>

    <!-- 一级域 Tab -->
    <nav class="primary-nav">
      <button
        v-for="domain in DOMAINS"
        :key="domain.key"
        class="pnav-item"
        :class="{ active: appStore.activeDomain === domain.key }"
        @click="switchDomain(domain.key as DomainKey)"
      >
        <!-- 使用内联 SVG 对应图标 -->
        <!-- 所有域的图标用同一个 SVG 切换，避免 v-else-if 链断裂 -->
        <span class="pnav-svg-icon" v-html="getDomainIcon(domain.key)"></span>
        <span>{{ domain.label }}</span>
      </button>
    </nav>

    <!-- 右侧操作区 -->
    <div class="topnav-actions">
      <!-- 主题切换 -->
      <button class="nav-icon-btn" :title="themeStore.theme === 'dark' ? '切换浅色' : '切换深色'" @click="themeStore.toggle()">
        <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </button>

      <!-- 消息 -->
      <button class="nav-icon-btn" title="消息通知" style="position:relative">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span class="badge-dot"></span>
      </button>

      <!-- 用户头像下拉 -->
      <div class="nav-user" @click="toggleUserMenu" v-click-outside="() => userMenuOpen = false">
        <div class="user-avatar">
          {{ loginUser.slice(0, 1).toUpperCase() }}
        </div>
        <div>
          <div class="user-name">{{ loginUser }}</div>
          <div class="user-role">超级管理员</div>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.6">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
        <!-- 下拉菜单 -->
        <div class="dropdown" :class="{ show: userMenuOpen }">
          <button class="dropdown-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            个人信息
          </button>
          <button class="dropdown-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            修改密码
          </button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item danger" @click="handleLogout">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            退出登录
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { DOMAINS } from '@/router/menus'
import { useAppStore, type DomainKey } from '@/stores/app'
import { useThemeStore } from '@/stores/theme'

const appStore = useAppStore()
const themeStore = useThemeStore()
const router = useRouter()

const DOMAIN_ICONS: Record<string, string> = {
  dashboard: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  user:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  project:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  data:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  ops:       `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>`,
  system:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
}
function getDomainIcon(key: string) {
  return DOMAIN_ICONS[key] ?? DOMAIN_ICONS['dashboard']
}

const userMenuOpen = ref(false)
const loginUser = computed(() => localStorage.getItem('loginUser') || '管理员')

// 自定义指令：点击外部关闭
interface ElWithHandler extends HTMLElement {
  _clickOutsideHandler?: (e: MouseEvent) => void
}
const vClickOutside = {
  beforeMount(el: ElWithHandler, binding: { value: () => void }) {
    el._clickOutsideHandler = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) binding.value()
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el: ElWithHandler) {
    if (el._clickOutsideHandler) {
      document.removeEventListener('click', el._clickOutsideHandler)
    }
  },
}

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value
}

function switchDomain(key: DomainKey) {
  appStore.setDomain(key)
  if (key === 'dashboard') {
    router.push('/dashboard')
    return
  }
  const domain = DOMAINS.find((d) => d.key === key)
  const first = domain?.groups[0]?.children[0]
  if (first) router.push(first.path)
}

async function handleLogout() {
  userMenuOpen.value = false
  if (confirm('确认退出登录？')) {
    router.push('/login')
  }
}
</script>

<style scoped>
.topnav {
  position: fixed; top: 0; left: 0; right: 0;
  height: var(--topnav-h); z-index: 300;
  display: flex; align-items: center;
  background: var(--topnav-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--topnav-border);
  box-shadow: 0 2px 16px rgba(99,102,241,0.10);
}

/* Logo */
.topnav-logo {
  display: flex; align-items: center; gap: 9px;
  padding: 0 18px; height: 100%; flex-shrink: 0;
  text-decoration: none;
  border-right: 1px solid var(--topnav-border);
}
.logo-icon {
  width: 30px; height: 30px; border-radius: 8px;
  background: linear-gradient(135deg, #6366f1, #2563eb);
  border: 1px solid rgba(255,255,255,0.5);
  display: flex; align-items: center; justify-content: center;
  color: #fff; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(99,102,241,0.30);
}
[data-theme="dark"] .logo-icon {
  background: rgba(255,255,255,0.18);
  border-color: rgba(255,255,255,0.25);
  box-shadow: none;
}
.logo-name { font-size: 15px; font-weight: 700; color: var(--topnav-text-active); white-space: nowrap; }

/* 一级菜单 */
.primary-nav {
  display: flex; align-items: stretch;
  flex: 1; height: 100%;
  overflow-x: auto; overflow-y: hidden;
  padding: 0 6px;
  scrollbar-width: none;
}
.primary-nav::-webkit-scrollbar { display: none; }

.pnav-item {
  display: flex; align-items: center; gap: 6px;
  padding: 0 14px; height: 100%;
  font-size: 13px; font-weight: 500;
  color: var(--topnav-text);
  cursor: pointer; white-space: nowrap;
  border: none; background: none; font-family: inherit;
  position: relative; transition: color .15s, background .15s;
  flex-shrink: 0; border-radius: 0;
}
.pnav-item:hover { color: var(--topnav-text-active); background: var(--topnav-hover-bg); }
.pnav-item.active { color: var(--topnav-text-active); background: var(--topnav-active-bg); font-weight: 600; }
.pnav-item.active::after {
  content: ''; position: absolute; bottom: 0; left: 10px; right: 10px;
  height: 2px; border-radius: 2px 2px 0 0; background: #4f46e5;
}
[data-theme="dark"] .pnav-item.active::after { background: rgba(255,255,255,0.85); }
.pnav-item svg { flex-shrink: 0; opacity: .80; }
.pnav-item.active svg { opacity: 1; }
.pnav-svg-icon { display: flex; align-items: center; flex-shrink: 0; opacity: .80; }
.pnav-svg-icon :deep(svg) { color: inherit; }
.pnav-item.active .pnav-svg-icon { opacity: 1; }

/* 右侧操作 */
.topnav-actions {
  display: flex; align-items: center; gap: 4px;
  flex-shrink: 0; padding: 0 12px;
  border-left: 1px solid var(--topnav-border);
}
.nav-icon-btn {
  width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  background: none; border: none; cursor: pointer;
  color: var(--topnav-text); transition: var(--transition);
}
.nav-icon-btn:hover { background: var(--topnav-hover-bg); color: var(--topnav-text-active); }
.badge-dot {
  position: absolute; top: 6px; right: 6px;
  width: 7px; height: 7px; border-radius: 50%;
  background: #f87171; border: 1.5px solid transparent;
}

.nav-user {
  display: flex; align-items: center; gap: 7px;
  padding: 4px 10px; border-radius: 8px;
  cursor: pointer; transition: var(--transition);
  position: relative;
}
.nav-user:hover { background: var(--topnav-hover-bg); }
.user-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #2563eb);
  border: 1.5px solid rgba(255,255,255,0.65);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 11px; font-weight: 700; flex-shrink: 0;
  box-shadow: 0 1px 6px rgba(99,102,241,0.28);
}
[data-theme="dark"] .user-avatar { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.3); box-shadow: none; }
.user-name { font-size: 13px; font-weight: 600; color: var(--topnav-text-active); }
.user-role { font-size: 10px; color: var(--topnav-text); }

/* 下拉菜单 */
.dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  min-width: 160px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); box-shadow: var(--shadow-lg);
  padding: 4px; z-index: 1000; display: none;
}
.dropdown.show { display: block; animation: fadeDown .15s ease; }
@keyframes fadeDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
.dropdown-item {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 10px; border-radius: 6px;
  font-size: 13px; color: var(--text-secondary);
  cursor: pointer; transition: var(--transition);
  border: none; background: none; width: 100%; font-family: inherit;
}
.dropdown-item:hover { background: var(--surface-hover); color: var(--text-primary); }
.dropdown-item.danger:hover { background: var(--danger-bg); color: var(--danger); }
.dropdown-divider { height: 1px; background: var(--border); margin: 4px 0; }

/* 主题图标 */
.icon-sun { display: none; }
:global([data-theme="dark"]) .icon-moon { display: none; }
:global([data-theme="dark"]) .icon-sun { display: block; }
</style>
