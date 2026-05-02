<template>
  <div class="dashboard-wrap">
    <!-- 面包屑 -->
    <div class="breadcrumb-bar">
      <span>工作台</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">工作台</span>
    </div>

    <div class="page-content">
      <!-- ===== 欢迎横幅 ===== -->
      <div class="dash-welcome">
        <div class="dash-welcome-inner">
          <div class="dash-wb-left">
            <div class="dash-wb-time">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ dateStr }}
            </div>
            <div class="dash-wb-title">
              <span>{{ greetingWord }}</span>，<em>{{ loginUser }}</em>&nbsp;👋
            </div>
            <div class="dash-wb-sub">{{ subtitleText }}</div>
          </div>
          <div class="dash-wb-right">
            <div class="dash-status-row">
              <div class="dash-status-item">
                <span class="dash-status-dot"></span>系统运行正常
              </div>
              <div class="dash-status-sep"></div>
              <div class="dash-status-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                数据安全
              </div>
              <div class="dash-status-sep"></div>
              <div class="dash-status-item dash-status-warn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                4 项待处理
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 数据概览标题行 ===== -->
      <div class="page-header">
        <div>
          <h1 class="page-title">数据概览</h1>
          <p class="page-desc">今天是 {{ dateStr }}</p>
        </div>
        <button class="btn btn-default btn-sm" @click="refreshData">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          刷新
        </button>
      </div>

      <!-- ===== 统计卡片 ===== -->
      <div class="dash-stat-grid">
        <div class="glass-card dash-stat-card" v-for="stat in stats" :key="stat.label">
          <div class="dash-stat-icon" :style="{ background: stat.iconBg, color: stat.iconColor }">
            <span v-html="stat.icon"></span>
          </div>
          <div class="dash-stat-body">
            <div class="dash-stat-value">{{ stat.value }}</div>
            <div class="dash-stat-label">{{ stat.label }}</div>
            <div class="dash-stat-change">↑ {{ stat.change }}</div>
          </div>
        </div>
      </div>

      <!-- ===== 中部双列 ===== -->
      <div class="dash-mid-grid">
        <!-- 待处理事项 -->
        <div class="glass-card">
          <div class="dash-card-header">
            <div class="dash-card-title">
              <div class="dash-card-icon" style="background:#fef3c7;color:#d97706">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              待处理事项
            </div>
            <span class="tag tag-amber">4 项</span>
          </div>
          <div class="dash-card-body">
            <div class="dash-todo-list">
              <div class="dash-todo-item" v-for="todo in todos" :key="todo.text" @click="navTo(todo.path)">
                <div class="dash-todo-left">
                  <div class="dash-todo-dot" :style="{ background: todo.color }"></div>
                  <span>{{ todo.text }}</span>
                </div>
                <span class="dash-todo-num" :style="{ color: todo.color }">{{ todo.num }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 品牌项目分布 -->
        <div class="glass-card">
          <div class="dash-card-header">
            <div class="dash-card-title">
              <div class="dash-card-icon" style="background:#ede9fe;color:#7c3aed">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              品牌项目分布
            </div>
            <span class="tag tag-purple">本月</span>
          </div>
          <div class="dash-card-body">
            <div class="dash-bar-list">
              <div class="dash-bar-item" v-for="bar in brandBars" :key="bar.label">
                <span class="dash-bar-label">{{ bar.label }}</span>
                <div class="dash-bar-track">
                  <div class="dash-bar-fill" :style="{ width: bar.pct + '%', background: bar.color }"></div>
                </div>
                <span class="dash-bar-val">{{ bar.val }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 快捷入口 + 系统动态 ===== -->
      <div class="dash-mid-grid">
        <!-- 快捷入口 -->
        <div class="glass-card">
          <div class="dash-card-header">
            <div class="dash-card-title">
              <div class="dash-card-icon" style="background:#ecfeff;color:#0891b2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              快捷入口
            </div>
          </div>
          <div class="dash-card-body">
            <div class="dash-shortcut-grid">
              <div class="dash-shortcut-item" v-for="sc in shortcuts" :key="sc.label" @click="navTo(sc.path)">
                <div class="dash-shortcut-icon" :style="{ background: sc.bg }" v-html="sc.icon"></div>
                <span class="dash-shortcut-label">{{ sc.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 系统更新动态 -->
        <div class="glass-card">
          <div class="dash-card-header">
            <div class="dash-card-title">
              <div class="dash-card-icon" style="background:#f0fdf4;color:#16a34a">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              系统更新动态
            </div>
            <a href="#" style="font-size:12px;color:var(--primary);text-decoration:none">查看全部</a>
          </div>
          <div class="dash-card-body">
            <div class="dash-update-list">
              <div class="dash-update-item" v-for="u in updates" :key="u.title">
                <div class="dash-update-dot" :style="{ background: u.dotColor }"></div>
                <div>
                  <div class="dash-update-title">{{ u.title }}</div>
                  <div class="dash-update-meta">
                    {{ u.date }} · <span class="tag" :class="u.tagClass" style="font-size:10px">{{ u.tagLabel }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import type { DomainKey } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()
const loginUser = computed(() => localStorage.getItem('loginUser') || '管理员')

const now = new Date()
const dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
const hour = now.getHours()
let greetingWord = '你好'
let subtitleText = '今天也是充满活力的一天，加油！'
if (hour >= 5 && hour < 9)   { greetingWord = '早上好'; subtitleText = '新的一天从这里开始，愿工作顺利、事事高效 🌅' }
else if (hour >= 9 && hour < 12)  { greetingWord = '上午好'; subtitleText = '专注上午的黄金时段，把最重要的事先做完 ☀️' }
else if (hour >= 12 && hour < 14) { greetingWord = '中午好'; subtitleText = '午间小憩片刻，下午将更有活力 🌿' }
else if (hour >= 14 && hour < 18) { greetingWord = '下午好'; subtitleText = '保持节奏，稳步推进每一项任务 💪' }
else if (hour >= 18 && hour < 22) { greetingWord = '晚上好'; subtitleText = '辛苦了，今天的坚持都是明天的积累 🌙' }
else                               { greetingWord = '夜深了'; subtitleText = '记得早点休息，明天依然充满可能 ✨' }

const stats = [
  { label: '今日活跃用户', value: '3,284', change: '较昨日 +12.4%', iconBg: '#dbeafe', iconColor: '#2563eb', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
  { label: '今日新增用户', value: '486',   change: '较昨日 +8.7%',  iconBg: '#dcfce7', iconColor: '#16a34a', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>` },
  { label: '累计品牌项目', value: '128',   change: '本月 +3',        iconBg: '#ede9fe', iconColor: '#7c3aed', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>` },
  { label: '海外文娱项目', value: '47',    change: '本月 +2',        iconBg: '#fef3c7', iconColor: '#d97706', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>` },
]

const todos = [
  { text: '品牌订单待审核', num: 23, color: '#2563eb', path: '/system/project-payment' },
  { text: '品牌订单待打款', num: 8,  color: '#7c3aed', path: '/system/project-payment' },
  { text: '海外文娱待审核', num: 16, color: '#0891b2', path: '/project/overseas-order?audit=pending' },
  { text: '海外文娱待打款', num: 5,  color: '#16a34a', path: '/project/overseas-order?payout=pending' },
]

const brandBars = [
  { label: '推文达人', pct: 82, val: '2,841', color: 'linear-gradient(90deg,#2563eb,#7c3aed)' },
  { label: '短剧达人', pct: 65, val: '2,253', color: 'linear-gradient(90deg,#0891b2,#2563eb)' },
  { label: '网盘运营', pct: 48, val: '1,664', color: 'linear-gradient(90deg,#16a34a,#0891b2)' },
  { label: '漫剧达人', pct: 32, val: '1,109', color: 'linear-gradient(90deg,#d97706,#dc2626)' },
  { label: '创意工具', pct: 21, val: '728',   color: 'linear-gradient(90deg,#7c3aed,#d97706)' },
  { label: '其他任务', pct: 12, val: '416',   color: '#9aa5b4' },
]

const shortcuts = [
  { label: '用户管理', path: '/user/list',               bg: '#dbeafe', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>` },
  { label: '品牌项目', path: '/project/config',          bg: '#ede9fe', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>` },
  { label: '财务管理', path: '/system/project-payment',  bg: '#fef3c7', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>` },
  { label: '数据看板', path: '/data/user-data',          bg: '#dcfce7', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>` },
  { label: '海外文娱', path: '/project/overseas-project',bg: '#ecfeff', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>` },
  { label: '站内信',   path: '/user/inbox-notify',       bg: '#fef2f2', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>` },
  { label: '权限管理', path: '/system/role',             bg: '#f0f9ff', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` },
  { label: '系统设置', path: '/system/config',           bg: '#f5f3ff', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>` },
]

const updates = [
  { title: '用户管理新增批量导出，支持 Excel 格式',        date: '2026-04-27', tagClass: 'tag-blue',   tagLabel: '功能更新', dotColor: '#2563eb' },
  { title: '品牌项目订单审核支持批量操作',                 date: '2026-04-25', tagClass: 'tag-green',  tagLabel: '流程优化', dotColor: '#16a34a' },
  { title: '工作台新增海外文娱业务线指标',                 date: '2026-04-22', tagClass: 'tag-amber',  tagLabel: '界面升级', dotColor: '#d97706' },
  { title: '黑名单管理支持站内信联动通知',                 date: '2026-04-18', tagClass: 'tag-gray',   tagLabel: '功能增强', dotColor: '#9aa5b4' },
  { title: '系统升级 v2.0.0，全面重构 UI 与权限体系',     date: '2026-04-10', tagClass: 'tag-purple', tagLabel: '大版本更新', dotColor: '#7c3aed' },
]

function navTo(path: string) {
  const domainMap: Record<string, DomainKey> = {
    '/user': 'user', '/project': 'project', '/data': 'data', '/ops': 'ops', '/system': 'system',
  }
  for (const [prefix, domain] of Object.entries(domainMap)) {
    if (path.startsWith(prefix)) { appStore.setDomain(domain); break }
  }
  router.push(path)
}

function refreshData() {}
</script>

<style>
/* 使用非 scoped 样式，确保全局 CSS 变量和类正常继承 */
.dashboard-wrap { min-height: 100%; }

/* ===== 欢迎横幅 ===== */
.dash-welcome {
  position: relative; overflow: hidden;
  border-radius: var(--radius-lg); margin-bottom: 14px;
  padding: 22px 26px;
  background: linear-gradient(135deg, rgba(219,234,254,.90) 0%, rgba(237,233,254,.88) 45%, rgba(224,242,254,.85) 100%);
  border: 1px solid rgba(196,211,255,.6);
  box-shadow: 0 4px 24px rgba(99,102,241,.10), inset 0 1px 0 rgba(255,255,255,.8);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
}
[data-theme="dark"] .dash-welcome {
  background: linear-gradient(135deg, rgba(30,27,75,.80) 0%, rgba(15,23,42,.85) 100%);
  border-color: rgba(99,102,241,.25);
  box-shadow: 0 4px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06);
}
.dash-welcome::before { content:''; position:absolute; top:-60px; right:-60px; width:240px; height:240px; border-radius:50%; background:radial-gradient(circle,rgba(99,102,241,.12) 0%,transparent 65%); pointer-events:none; }
.dash-welcome-inner { position:relative; z-index:1; display:flex; align-items:center; justify-content:space-between; gap:20px; }
.dash-wb-left { flex:1; min-width:0; }
.dash-wb-time { display:flex; align-items:center; gap:5px; font-size:11px; color:#6b7a9e; margin-bottom:5px; }
[data-theme="dark"] .dash-wb-time { color:rgba(148,163,184,.75); }
.dash-wb-title { font-size:20px; font-weight:700; color:#1e3a8a; line-height:1.3; margin-bottom:6px; }
[data-theme="dark"] .dash-wb-title { color:#e2e8f0; }
.dash-wb-title em { font-style:normal; background:linear-gradient(90deg,#6366f1,#2563eb); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.dash-wb-sub { font-size:12.5px; color:#5a6a8e; }
[data-theme="dark"] .dash-wb-sub { color:rgba(148,163,184,.8); }
.dash-wb-right { flex-shrink:0; }
.dash-status-row { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,.55); border:1px solid rgba(196,211,255,.55); border-radius:99px; padding:7px 16px; backdrop-filter:blur(8px); }
[data-theme="dark"] .dash-status-row { background:rgba(255,255,255,.07); border-color:rgba(255,255,255,.12); }
.dash-status-item { display:flex; align-items:center; gap:5px; font-size:12px; color:#3b4d6b; white-space:nowrap; }
[data-theme="dark"] .dash-status-item { color:rgba(203,213,225,.82); }
.dash-status-warn { color:#d97706 !important; }
[data-theme="dark"] .dash-status-warn { color:#fbbf24 !important; }
.dash-status-dot { width:7px; height:7px; border-radius:50%; background:#16a34a; box-shadow:0 0 6px rgba(22,163,74,.55); flex-shrink:0; }
.dash-status-sep { width:1px; height:14px; background:rgba(99,120,180,.2); }

/* ===== 统计卡片 ===== */
.dash-stat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:14px; }
@media (max-width:1200px) { .dash-stat-grid { grid-template-columns:repeat(2,1fr); } }
.dash-stat-card { padding:18px; display:flex; align-items:flex-start; gap:14px; transition:var(--transition); }
.dash-stat-card:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(30,40,80,.13); }
.dash-stat-icon { width:42px; height:42px; border-radius:var(--radius); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.dash-stat-body { flex:1; min-width:0; }
.dash-stat-value { font-size:26px; font-weight:700; line-height:1.1; color:var(--text-primary); }
.dash-stat-label { font-size:12px; color:var(--text-muted); margin-top:4px; }
.dash-stat-change { font-size:11px; color:var(--success); margin-top:5px; }

/* ===== 卡片组件 ===== */
.dash-mid-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
@media (max-width:900px) { .dash-mid-grid { grid-template-columns:1fr; } }
.dash-card-header { display:flex; align-items:center; justify-content:space-between; padding:13px 16px 11px; border-bottom:1px solid var(--border); }
.dash-card-title { font-size:13.5px; font-weight:600; display:flex; align-items:center; gap:7px; color:var(--text-primary); }
.dash-card-icon { width:20px; height:20px; border-radius:5px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.dash-card-body { padding:13px 16px; }

/* ===== 待办列表 ===== */
.dash-todo-list { display:flex; flex-direction:column; gap:8px; }
.dash-todo-item { display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-radius:var(--radius); background:var(--surface-hover); border:1px solid var(--border); cursor:pointer; transition:var(--transition); }
.dash-todo-item:hover { border-color:var(--primary); background:var(--primary-light); }
.dash-todo-left { display:flex; align-items:center; gap:9px; }
.dash-todo-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.dash-todo-left span { font-size:13px; color:var(--text-secondary); }
.dash-todo-num { font-size:17px; font-weight:700; font-family:monospace; }

/* ===== 柱状图 ===== */
.dash-bar-list { display:flex; flex-direction:column; gap:8px; }
.dash-bar-item { display:flex; align-items:center; gap:10px; }
.dash-bar-label { width:72px; font-size:12px; color:var(--text-secondary); flex-shrink:0; text-align:right; }
.dash-bar-track { flex:1; height:8px; background:var(--border); border-radius:4px; overflow:hidden; }
.dash-bar-fill { height:100%; border-radius:4px; }
.dash-bar-val { width:44px; font-size:12px; color:var(--text-muted); font-family:monospace; text-align:right; }

/* ===== 快捷入口 ===== */
.dash-shortcut-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:9px; }
.dash-shortcut-item { display:flex; flex-direction:column; align-items:center; gap:6px; padding:12px 6px; border-radius:var(--radius); border:1px solid var(--border); background:var(--surface-hover); cursor:pointer; transition:var(--transition); }
.dash-shortcut-item:hover { border-color:var(--primary); background:var(--primary-light); transform:translateY(-2px); box-shadow:var(--shadow); }
.dash-shortcut-icon { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; }
.dash-shortcut-label { font-size:11.5px; color:var(--text-secondary); text-align:center; }

/* ===== 系统更新 ===== */
.dash-update-list { display:flex; flex-direction:column; }
.dash-update-item { display:flex; gap:11px; padding:10px 0; border-bottom:1px solid var(--border); }
.dash-update-item:last-child { border-bottom:none; }
.dash-update-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; margin-top:5px; }
.dash-update-title { font-size:12.5px; color:var(--text-primary); line-height:1.5; }
.dash-update-meta { font-size:11px; color:var(--text-muted); margin-top:2px; }
</style>
