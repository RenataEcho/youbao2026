<template>
  <div class="pc-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">品牌项目</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">项目配置</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">项目配置</h1>
          </div>
          <p class="page-desc">
            对推广项目全生命周期配置管理：基础信息、状态开关、详情介绍（四大板块 + 项目介绍下五子模块），规则见 project.md
          </p>
        </div>
        <router-link :to="{ name: 'ProjectConfigNew' }" class="btn btn-primary">
          新增项目
        </router-link>
      </div>

      <div ref="prdTipFilterRef" class="glass-card pc-filter">
        <div class="ul-filter-grid pc-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">前台标题</label>
            <input v-model="filters.frontTitle" type="text" class="ul-input" placeholder="模糊匹配前台标题">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">英文标识</label>
            <input v-model="filters.projectEn" type="text" class="ul-input" placeholder="projectEn">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">项目类别</label>
            <select v-model="filters.category" class="ul-input ul-select">
              <option value="">全部类别</option>
              <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">项目状态</label>
            <select v-model="filters.projectStatus" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="show">前台展示</option>
              <option value="hide">前台隐藏</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">上线状态</label>
            <select v-model="filters.onlineState" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="online">已上线</option>
              <option value="offline">未上线</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">所属赛道</label>
            <select v-model="filters.trackRef" class="ul-input ul-select">
              <option value="">全部赛道</option>
              <option v-for="t in TRACK_OPTIONS" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">所属业务</label>
            <select v-model="filters.business" class="ul-input ul-select">
              <option value="">全部业务</option>
              <option v-for="b in BIZ_OPTIONS" :key="b" :value="b">{{ b }}</option>
            </select>
          </div>
        </div>
        <div class="ul-filter-footer">
          <span></span>
          <div style="display:flex;gap:8px">
            <button class="btn btn-default btn-sm" @click="resetFilter">重置</button>
            <button class="btn btn-primary btn-sm" @click="fetchList(1)">
              查询
            </button>
          </div>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">
            项目列表
            <span class="table-count">共 {{ total }} 条</span>
          </div>
        </div>
        <div class="ul-table-wrap pc-table-scroll">
          <table class="ul-table">
            <thead>
              <tr>
                <th style="width:52px">序号</th>
                <th style="min-width:72px">类别</th>
                <th style="min-width:140px">前台标题</th>
                <th style="min-width:120px">后台标题</th>
                <th style="min-width:88px">英文标识</th>
                <th style="min-width:96px">所属赛道</th>
                <th style="min-width:72px">业务</th>
                <th style="min-width:80px">项目状态</th>
                <th style="min-width:80px">上线</th>
                <th style="width:72px">是否海外</th>
                <th style="width:52px">热门</th>
                <th style="width:52px">新品</th>
                <th style="width:56px">排序</th>
                <th style="min-width:136px">更新时间</th>
                <th ref="prdTipOpsRef" class="col-action" style="min-width:280px;text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 6" :key="i"><td colspan="15"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td colspan="15">
                  <div class="ul-empty">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="0.9"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin:8px 0 4px">暂无项目数据</div>
                  </div>
                </td></tr>
              </template>
              <template v-else>
                <tr v-for="(row, idx) in list" :key="row.id" class="ul-row">
                  <td><span class="ul-mono">{{ (page - 1) * pageSize + idx + 1 }}</span></td>
                  <td><span class="tag tag-gray" style="font-size:10.5px">{{ row.category }}</span></td>
                  <td><span style="font-weight:600;color:var(--text-primary)">{{ row.frontTitle }}</span></td>
                  <td class="td-muted">{{ row.backTitle }}</td>
                  <td><span class="ul-mono" style="font-size:11px">{{ row.projectEn }}</span></td>
                  <td><span class="tag tag-blue" style="font-size:10.5px">{{ row.trackRef }}</span></td>
                  <td><span class="tag tag-purple" style="font-size:10.5px">{{ row.business }}</span></td>
                  <td>
                    <span class="badge" :class="row.projectStatus === 'show' ? 'badge-success' : 'badge-gray'">
                      {{ row.projectStatus === 'show' ? '展示' : '隐藏' }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" :class="row.onlineState === 'online' ? 'badge-success' : 'badge-warning'">
                      {{ row.onlineState === 'online' ? '已上线' : '未上线' }}
                    </span>
                  </td>
                  <td>{{ row.isOverseas === 'yes' ? '是' : '否' }}</td>
                  <td>{{ row.hotProject === 'yes' ? '是' : '否' }}</td>
                  <td>{{ row.isNewProduct === 'yes' ? '是' : '否' }}</td>
                  <td><span class="ul-mono">{{ row.sort }}</span></td>
                  <td class="td-muted" style="font-size:12px">{{ row.updateTime || '—' }}</td>
                  <td class="col-action pc-td-ops">
                    <div class="action-btns" style="justify-content: center; max-width: 360px; margin: 0 auto">
                      <router-link :to="{ name: 'ProjectConfigDetail', params: { id: row.id } }" class="action-btn view">详情</router-link>
                      <router-link :to="{ name: 'ProjectConfigEdit', params: { id: row.id } }" class="action-btn edit">编辑</router-link>
                      <router-link class="action-btn view" :to="{ name: 'ProjectKeywordConfig', params: { projectId: row.id } }">关键词</router-link>
                      <router-link class="action-btn view" :to="{ name: 'ProjectBackfillConfig', params: { projectId: row.id } }">回填</router-link>
                      <router-link class="action-btn view" :to="{ name: 'ProjectSettlementConfigRoute', params: { projectId: row.id } }">结算</router-link>
                      <router-link class="action-btn view" :to="{ name: 'ProjectDataTableConfigRoute', params: { projectId: row.id } }">数据表</router-link>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ total }}</strong> 条，第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
          <div style="display:flex;align-items:center;gap:4px">
            <button class="ul-pg-btn" :disabled="page <= 1" @click="fetchList(1)">«</button>
            <button class="ul-pg-btn" :disabled="page <= 1" @click="fetchList(page - 1)">‹</button>
            <button v-for="pn in paginationPages" :key="pn" class="ul-pg-btn" :class="{ active: pn === page }" @click="fetchList(Number(pn))">{{ pn }}</button>
            <button class="ul-pg-btn" :disabled="page >= totalPages" @click="fetchList(page + 1)">›</button>
            <button class="ul-pg-btn" :disabled="page >= totalPages" @click="fetchList(totalPages)">»</button>
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)">
            每页
            <select class="ul-pg-size" @change="onPageSizeChange">
              <option :value="10">10</option>
              <option :value="20" :selected="pageSize === 20">20</option>
              <option :value="50">50</option>
            </select>
            条
          </div>
        </div>
      </div>

      <PrdTipMarker
        :anchor-el="prdTipAnchorRef"
        :tip-id="1"
        :module-name="bundle.page.moduleName"
        :markdown="bundle.page.md"
      />
      <PrdTipMarker
        v-if="bundle.filter"
        variant="filterCard"
        :anchor-el="prdTipFilterRef"
        :tip-id="2"
        :module-name="bundle.filter.moduleName"
        :markdown="bundle.filter.md"
      />
      <PrdTipMarker
        v-if="bundle.ops"
        variant="opsHeader"
        :anchor-el="prdTipOpsRef"
        :tip-id="opsTipId"
        :module-name="bundle.ops.moduleName"
        :markdown="bundle.ops.md"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PrdTipMarker from '@/components/prd/PrdTipMarker.vue'
import { useAdminPrdTips } from '@/composables/useAdminPrdTips'
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import type { ProjectCategory, ProjectRow, ShowHide, OnlineOffline } from '@/utils/projectManagement'
import { useProjectConfigStore } from '@/stores/projectConfig'
import { CATEGORIES, TRACK_OPTIONS, BIZ_OPTIONS } from './projectConfigConstants'

const { bundle, opsTipId, prdTipAnchorRef, prdTipFilterRef, prdTipOpsRef } = useAdminPrdTips()

const store = useProjectConfigStore()
const { rows: allRows } = storeToRefs(store)

const loading = ref(false)
const list = ref<ProjectRow[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const filters = ref({
  frontTitle: '',
  projectEn: '',
  category: '' as '' | ProjectCategory,
  projectStatus: '' as '' | ShowHide,
  onlineState: '' as '' | OnlineOffline,
  trackRef: '',
  business: '',
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginationPages = computed(() => {
  const arr: number[] = []
  const t = totalPages.value
  const c = page.value
  const s = Math.max(1, c - 2)
  const e = Math.min(t, c + 2)
  for (let i = s; i <= e; i++) arr.push(i)
  return arr
})

function filteredRows(): ProjectRow[] {
  let data = [...allRows.value]
  const f = filters.value
  if (f.frontTitle) {
    const q = f.frontTitle.trim()
    data = data.filter((r) => r.frontTitle.includes(q) || r.backTitle.includes(q))
  }
  if (f.projectEn) data = data.filter((r) => r.projectEn.includes(f.projectEn.trim()))
  if (f.category) data = data.filter((r) => r.category === f.category)
  if (f.projectStatus) data = data.filter((r) => r.projectStatus === f.projectStatus)
  if (f.onlineState) data = data.filter((r) => r.onlineState === f.onlineState)
  if (f.trackRef) data = data.filter((r) => r.trackRef === f.trackRef)
  if (f.business) data = data.filter((r) => r.business === f.business)
  return data
}

async function fetchList(p = 1) {
  loading.value = true
  page.value = p
  store.ensureSeed()
  await new Promise((r) => setTimeout(r, 160))
  const data = filteredRows()
  total.value = data.length
  const start = (p - 1) * pageSize.value
  list.value = data.slice(start, start + pageSize.value)
  loading.value = false
}

function resetFilter() {
  filters.value = {
    frontTitle: '',
    projectEn: '',
    category: '',
    projectStatus: '',
    onlineState: '',
    trackRef: '',
    business: '',
  }
  fetchList(1)
}

function onPageSizeChange(e: Event) {
  pageSize.value = Number((e.target as HTMLSelectElement).value)
  fetchList(1)
}

onMounted(() => {
  fetchList(1)
})
</script>

<style scoped>
.pc-wrap { min-height: 100%; }
.pc-filter { padding: 16px 18px 14px; margin-bottom: 14px; }
.pc-filter-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
.pc-table-scroll { overflow-x: auto; }
.td-muted { color: var(--text-muted); }

.pc-td-ops {
  vertical-align: middle;
  padding: 10px 8px !important;
}
</style>
