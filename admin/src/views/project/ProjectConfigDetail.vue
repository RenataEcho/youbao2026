<template>
  <div class="pcd-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">品牌项目</span>
      <span class="bc-sep">/</span>
      <router-link to="/project/config" style="color:var(--text-secondary);text-decoration:none">项目配置</router-link>
      <span class="bc-sep">/</span>
      <span class="bc-cur">项目详情</span>
    </div>

    <div v-if="p" class="page-content pcd-page">
      <div class="pcd-page-inner">
      <div class="page-header pcd-header">
        <div class="pcd-header-left">
          <button type="button" class="btn btn-default btn-sm" @click="goList">
            返回列表
          </button>
          <div>
            <h1 class="page-title">{{ p.frontTitle }}</h1>
            <p class="page-desc pcd-sub">{{ p.backTitle }} · <span class="ul-mono">{{ p.projectEn }}</span></p>
          </div>
        </div>
        <div class="pcd-header-actions">
          <div class="pcd-config-strip">
            <router-link :to="{ name: 'ProjectKeywordConfig', params: { projectId: p.id } }" class="btn btn-default btn-sm">关键词配置</router-link>
            <router-link :to="{ name: 'ProjectBackfillConfig', params: { projectId: p.id } }" class="btn btn-default btn-sm">回填配置</router-link>
            <router-link :to="{ name: 'ProjectSettlementConfigRoute', params: { projectId: p.id } }" class="btn btn-default btn-sm">结算配置</router-link>
            <router-link :to="{ name: 'ProjectDataTableConfigRoute', params: { projectId: p.id } }" class="btn btn-default btn-sm">数据表配置</router-link>
          </div>
          <router-link :to="{ name: 'ProjectConfigEdit', params: { id: p.id } }" class="btn btn-primary">
            编辑
          </router-link>
        </div>
      </div>

      <!-- Hero -->
      <div class="glass-card pcd-hero">
        <div class="pcd-hero-glow" aria-hidden="true" />
        <div class="pcd-hero-main">
          <div class="pcd-iconpair-hero">
            <div class="pcd-icon-frame pcd-icon-frame--lg">
              <img v-if="p.projectIcon" :src="p.projectIcon" alt="" class="pcd-icon-img">
              <span v-else class="pcd-icon-ph">{{ p.frontTitle.slice(0, 1) }}</span>
            </div>
            <div v-if="p.tagIcons.some(Boolean)" class="pcd-tag-icons-hero">
              <template v-for="(url, i) in p.tagIcons" :key="i">
                <div v-if="url" class="pcd-tag-icon-slot">
                  <img :src="url" alt="" class="pcd-tag-icon-img">
                </div>
              </template>
            </div>
          </div>
          <div class="pcd-hero-text">
            <div class="pcd-badges">
              <span class="tag tag-gray">{{ p.category }}</span>
              <span class="tag tag-blue">{{ p.trackRef }}</span>
              <span class="tag tag-purple">{{ p.business }}</span>
              <span class="badge" :class="p.projectStatus === 'show' ? 'badge-success' : 'badge-gray'">
                {{ p.projectStatus === 'show' ? '前台展示' : '前台隐藏' }}
              </span>
              <span class="badge" :class="p.onlineState === 'online' ? 'badge-success' : 'badge-warning'">
                {{ p.onlineState === 'online' ? '已上线' : '未上线' }}
              </span>
            </div>
            <p v-if="p.projectTags" class="pcd-tags-line">
              <span class="pcd-k">项目标签</span>{{ p.projectTags }}
              <template v-if="p.tagTitle"><span class="pcd-k pcd-k-indent">角标标题</span><span class="pcd-tag-title">{{ p.tagTitle }}</span></template>
            </p>
          </div>
        </div>
        <div class="pcd-stat-strip">
          <div class="pcd-stat">
            <span class="pcd-stat-label">排序权重</span>
            <strong class="pcd-stat-val">{{ p.sort }}</strong>
          </div>
          <div class="pcd-stat">
            <span class="pcd-stat-label">结算</span>
            <strong class="pcd-stat-val">{{ p.settlement_cycle }}{{ p.settlement_cycle === 'T+N' ? ` · N=${p.settlementTN}` : '' }}</strong>
          </div>
          <div class="pcd-stat">
            <span class="pcd-stat-label">订单有效期</span>
            <strong class="pcd-stat-val">{{ p.expireDays }} 天</strong>
          </div>
        </div>
      </div>

      <!-- 基础信息 -->
      <div class="glass-card pcd-section">
        <h2 class="pcd-section-title">基础信息</h2>
        <dl class="pcd-dl">
          <div class="pcd-dl-row"><dt>前台标题</dt><dd>{{ p.frontTitle }}</dd></div>
          <div class="pcd-dl-row"><dt>后台标题</dt><dd>{{ p.backTitle }}</dd></div>
          <div class="pcd-dl-row"><dt>英文标识</dt><dd><span class="ul-mono">{{ p.projectEn }}</span></dd></div>
          <div class="pcd-dl-row"><dt>书单链接</dt><dd>
            <a v-if="p.booklistLink" :href="p.booklistLink" target="_blank" rel="noopener" class="pcd-link">{{ p.booklistLink }}</a>
            <span v-else class="pcd-dash">—</span>
          </dd></div>
          <div class="pcd-dl-row"><dt>门槛</dt><dd>{{ p.entryBarrier }}</dd></div>
          <div class="pcd-dl-row"><dt>可见用户</dt><dd>{{ p.memberType }}</dd></div>
          <div class="pcd-dl-row"><dt>系统编号</dt><dd><span class="ul-mono">id={{ p.id }} · seq={{ p.seq }}</span></dd></div>
          <div class="pcd-dl-row"><dt>更新时间</dt><dd>{{ p.updateTime || '—' }}</dd></div>
        </dl>
      </div>

      <!-- 状态开关 -->
      <div class="glass-card pcd-section">
        <h2 class="pcd-section-title">状态与开关</h2>
        <div class="pcd-flag-grid">
          <div v-for="item in FLAG_FIELDS" :key="item.key" class="pcd-flag-cell">
            <span class="pcd-flag-label">{{ item.label }}</span>
            <span class="pcd-flag-val">{{ flagLabel(item.key) }}</span>
          </div>
        </div>
      </div>

      <!-- 详情介绍 -->
      <div class="glass-card pcd-section pcd-section--detail">
        <h2 class="pcd-section-title">详情介绍</h2>
        <p class="pcd-section-lead">四大板块结构；以下为前台可配置的图文 / 视频内容及显隐状态。切换 Tab 查看对应板块。</p>

        <div class="pcd-detail-main-tabs ud-tabs" role="tablist">
          <button
            type="button"
            class="ud-tab"
            role="tab"
            :aria-selected="detailMainTab === 'introduction'"
            :class="{ active: detailMainTab === 'introduction' }"
            @click="detailMainTab = 'introduction'"
          >
            项目介绍
          </button>
          <button
            type="button"
            class="ud-tab"
            role="tab"
            :aria-selected="detailMainTab === 'process'"
            :class="{ active: detailMainTab === 'process' }"
            @click="detailMainTab = 'process'"
          >
            项目流程
          </button>
          <button
            type="button"
            class="ud-tab"
            role="tab"
            :aria-selected="detailMainTab === 'notice'"
            :class="{ active: detailMainTab === 'notice' }"
            @click="detailMainTab = 'notice'"
          >
            特别注意
          </button>
          <button
            type="button"
            class="ud-tab"
            role="tab"
            :aria-selected="detailMainTab === 'teaching'"
            :class="{ active: detailMainTab === 'teaching' }"
            @click="detailMainTab = 'teaching'"
          >
            项目教学
          </button>
        </div>

        <div
          v-if="detailMainTab === 'introduction'"
          class="pcd-detail-sub-tabs ud-tabs"
          role="tablist"
        >
          <button
            v-for="sub in INTRO_CHILDREN"
            :key="sub.key"
            type="button"
            class="ud-tab"
            role="tab"
            :aria-selected="detailIntroSub === sub.key"
            :class="{ active: detailIntroSub === sub.key }"
            @click="detailIntroSub = sub.key"
          >
            {{ sub.label }}
          </button>
        </div>

        <div class="pcd-detail-tab-panel glass-panel-inner">
          <template v-if="detailMainTab === 'introduction'">
            <div class="pcd-nested-label">{{ introSubLabel }}</div>
            <ProjectDetailSectionReadonly :section="p.detail.introduction.children[detailIntroSub]" />
          </template>
          <template v-else-if="detailMainTab === 'process'">
            <ProjectDetailSectionReadonly :section="p.detail.process" />
          </template>
          <template v-else-if="detailMainTab === 'notice'">
            <ProjectDetailSectionReadonly :section="p.detail.notice" />
          </template>
          <template v-else-if="detailMainTab === 'teaching'">
            <ProjectDetailSectionReadonly :section="p.detail.teaching" />
          </template>
        </div>
      </div>
      </div>
    </div>

    <div v-else class="page-content">
      <div class="glass-card" style="padding:48px;text-align:center">
        <p style="color:var(--text-muted);margin:0 0 16px">未找到该项目或已被删除。</p>
        <router-link to="/project/config" class="btn btn-primary btn-sm">返回项目列表</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import type { ProjectRow, IntroChildKey } from '@/utils/projectManagement'
import { useProjectConfigStore } from '@/stores/projectConfig'
import { FLAG_FIELDS, INTRO_CHILDREN } from './projectConfigConstants'
import ProjectDetailSectionReadonly from './ProjectDetailSectionReadonly.vue'

const route = useRoute()
const router = useRouter()
const store = useProjectConfigStore()
const { rows } = storeToRefs(store)

const id = computed(() => Number(route.params.id))

const detailMainTab = ref<'introduction' | 'process' | 'notice' | 'teaching'>('introduction')
const detailIntroSub = ref<IntroChildKey>('projectDescription')

const introSubLabel = computed(() => INTRO_CHILDREN.find((s) => s.key === detailIntroSub.value)?.label ?? '')

const p = computed<ProjectRow | undefined>(() => {
  store.ensureSeed()
  return rows.value.find((r) => r.id === id.value)
})

function goList() {
  router.push({ name: 'ProjectConfig' })
}

function flagLabel(key: (typeof FLAG_FIELDS)[number]['key']) {
  const row = p.value
  if (!row) return '—'
  const val = String(row[key])
  const field = FLAG_FIELDS.find((f) => f.key === key)
  const opt = field?.options.find((o) => o.v === val)
  return opt?.l ?? val
}

onBeforeMount(() => {
  store.ensureSeed()
  if (!Number.isFinite(id.value)) router.replace({ name: 'ProjectConfig' })
})
</script>

<style scoped>
.pcd-wrap { min-height: 100%; }
.pcd-page {
  box-sizing: border-box;
}
.pcd-page-inner {
  max-width: 1040px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}
.pcd-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.pcd-header-left {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.pcd-header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.pcd-config-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pcd-sub { margin-top: 4px; }
.pcd-hero {
  position: relative;
  overflow: hidden;
  padding: 22px 24px 18px;
  margin-bottom: 14px;
}
.pcd-hero-glow {
  position: absolute;
  inset: -40% -20% auto auto;
  width: 55%;
  height: 120%;
  background: radial-gradient(circle, rgba(99,102,241,0.18), transparent 58%);
  pointer-events: none;
}
[data-theme="dark"] .pcd-hero-glow {
  background: radial-gradient(circle, rgba(99,102,241,0.28), transparent 55%);
}
.pcd-hero-main {
  position: relative;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.pcd-iconpair-hero {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.pcd-tag-icons-hero {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pcd-tag-icon-slot {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  overflow: hidden;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}
.pcd-tag-icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.pcd-icon-frame {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.pcd-icon-frame--lg {
  width: 96px;
  height: 96px;
}
.pcd-icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pcd-icon-ph {
  font-size: 36px;
  font-weight: 700;
  color: var(--primary);
}
.pcd-hero-text {
  flex: 1;
  min-width: 200px;
}
.pcd-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}
.pcd-tags-line {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}
.pcd-k {
  font-size: 11px;
  color: var(--text-muted);
  margin-right: 8px;
}
.pcd-k-indent {
  margin-left: 16px;
}
.pcd-tag-title {
  display: inline-block;
  margin-left: 6px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: var(--warning-bg);
  color: var(--warning);
}
.pcd-stat-strip {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
@media (max-width: 720px) {
  .pcd-stat-strip { grid-template-columns: 1fr; }
}
.pcd-stat {
  padding: 10px 14px;
  border-radius: var(--radius);
  background: var(--surface-hover);
  border: 1px solid var(--border);
}
.pcd-stat-label {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.pcd-stat-val {
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 600;
}
.pcd-section {
  padding: 18px 22px 20px;
  margin-bottom: 14px;
}
.pcd-section--detail {
  margin-bottom: 32px;
}
.pcd-section-title {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}
.pcd-section-lead {
  font-size: 12px;
  color: var(--text-muted);
  margin: -6px 0 18px;
  line-height: 1.5;
}
.pcd-dl {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px 20px;
}
@media (max-width: 1400px) {
  .pcd-dl { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 1100px) {
  .pcd-dl { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .pcd-dl { grid-template-columns: 1fr; }
}
.pcd-dl-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.pcd-dl dt {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}
.pcd-dl dd {
  margin: 0;
  font-size: 13px;
  color: var(--text-primary);
  word-break: break-all;
}
.pcd-link {
  color: var(--primary);
  text-decoration: none;
}
.pcd-link:hover {
  text-decoration: underline;
}
.pcd-dash { color: var(--text-muted); }
.pcd-flag-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px 14px;
}
@media (max-width: 1400px) {
  .pcd-flag-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 960px) {
  .pcd-flag-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 560px) {
  .pcd-flag-grid {
    grid-template-columns: 1fr;
  }
}
.pcd-flag-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--surface-hover);
  border: 1px solid var(--border);
}
.pcd-flag-label {
  font-size: 11px;
  color: var(--text-muted);
}
.pcd-flag-val {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.pcd-detail-main-tabs {
  margin-bottom: 0;
  flex-wrap: wrap;
}
.pcd-detail-sub-tabs {
  margin-top: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.pcd-detail-tab-panel {
  padding: 14px 16px 16px;
  border-radius: var(--radius);
  margin-top: 4px;
}
.pcd-detail-tab-panel.glass-panel-inner {
  background: var(--surface-hover);
  border: 1px solid var(--border);
}
[data-theme='dark'] .pcd-detail-tab-panel.glass-panel-inner {
  background: rgba(255, 255, 255, 0.04);
}
.pcd-nested-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 8px;
}
</style>
