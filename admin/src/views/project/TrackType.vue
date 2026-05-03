<template>
  <div class="tt-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">类目配置</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">赛道类型</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">赛道类型</h1>
          </div>
          <p class="page-desc">管理平台推广赛道分类配置，支持排序与显示状态控制</p>
        </div>
        <button class="btn btn-primary" @click="openAdd">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新增赛道
        </button>
      </div>

      <!-- 筛选 -->
      <div ref="prdTipFilterRef" class="glass-card tt-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">赛道名称</label>
            <input v-model="filters.name" type="text" class="ul-input" placeholder="输入赛道名称">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">状态</label>
            <select v-model="filters.status" class="ul-input ul-select">
              <option value="">全部状态</option>
              <option value="show">显示</option>
              <option value="hide">隐藏</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">标签</label>
            <input v-model="filters.tag" type="text" class="ul-input" placeholder="输入标签关键词">
          </div>
        </div>
        <div class="ul-filter-footer">
          <span></span>
          <div style="display:flex;gap:8px">
            <button class="btn btn-default btn-sm" @click="resetFilter">重置</button>
            <button class="btn btn-primary btn-sm" @click="fetchList(1)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              查询
            </button>
          </div>
        </div>
      </div>

      <!-- 表格 -->
      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            赛道列表
            <span class="table-count">共 {{ total }} 条</span>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table">
            <thead>
              <tr>
                <th style="width:60px">序号</th>
                <th style="min-width:120px">赛道名称</th>
                <th style="min-width:80px">标签</th>
                <th style="width:90px;text-align:right">关联项目</th>
                <th style="width:90px;text-align:right">用户数</th>
                <th style="width:70px;text-align:right">排序</th>
                <th style="width:80px">状态</th>
                <th style="min-width:140px">创建时间</th>
                <th style="min-width:140px">更新时间</th>
                <th ref="prdTipOpsRef" class="col-action" style="width:88px;text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 6" :key="i"><td colspan="10"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td colspan="10">
                  <div class="ul-empty">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    <div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin:8px 0 4px">暂无赛道数据</div>
                  </div>
                </td></tr>
              </template>
              <template v-else>
                <tr v-for="(row, idx) in list" :key="row.id" class="ul-row">
                  <td><span class="ul-mono">{{ (page-1)*pageSize + idx + 1 }}</span></td>
                  <td><span style="font-weight:600;color:var(--text-primary)">{{ row.trackName }}</span></td>
                  <td>
                    <span v-if="row.tag" class="tag tag-blue" style="font-size:10.5px">{{ row.tag }}</span>
                    <span v-else class="ul-muted">—</span>
                  </td>
                  <td style="text-align:right"><span class="ul-mono">{{ row.projectNumber }}</span></td>
                  <td style="text-align:right"><span class="ul-mono">{{ row.userCount.toLocaleString() }}</span></td>
                  <td style="text-align:right"><span class="ul-mono">{{ row.sort }}</span></td>
                  <td>
                    <span class="badge" :class="row.status === 'show' ? 'badge-success' : 'badge-gray'">
                      {{ row.status === 'show' ? '显示' : '隐藏' }}
                    </span>
                  </td>
                  <td><span class="ul-muted">{{ row.createTime }}</span></td>
                  <td><span class="ul-muted">{{ row.updateTime }}</span></td>
                  <td class="col-action">
                    <div class="action-btns">
                      <button type="button" class="action-btn edit" title="编辑" @click="openEdit(row)">编辑</button>
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
            <button class="ul-pg-btn" :disabled="page<=1" @click="fetchList(1)">«</button>
            <button class="ul-pg-btn" :disabled="page<=1" @click="fetchList(page-1)">‹</button>
            <button v-for="p in paginationPages" :key="p" class="ul-pg-btn" :class="{active:p===page}" @click="fetchList(Number(p))">{{ p }}</button>
            <button class="ul-pg-btn" :disabled="page>=totalPages" @click="fetchList(page+1)">›</button>
            <button class="ul-pg-btn" :disabled="page>=totalPages" @click="fetchList(totalPages)">»</button>
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)">
            每页
            <select class="ul-pg-size" @change="(e)=>{pageSize=Number((e.target as HTMLSelectElement).value);fetchList(1)}">
              <option value="10">10</option><option value="20" selected>20</option><option value="50">50</option>
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

    <!-- 新增/编辑弹窗 -->
    <div class="ul-overlay" :class="{show:formVisible}" @click="formVisible=false"></div>
    <div class="ul-modal tt-modal" :class="{show:formVisible}">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--text-primary);display:flex;align-items:center;gap:7px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          {{ formMode === 'add' ? '新增赛道类型' : '编辑赛道类型' }}
        </div>
        <button class="ul-icon-btn" @click="formVisible=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="ul-form-group">
          <label class="ul-label">赛道名称 <span style="color:var(--danger)">*</span></label>
          <input v-model="form.trackName" type="text" class="ul-input" placeholder="如：推文达人、短剧达人">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">标签</label>
          <input v-model="form.tag" type="text" class="ul-input" placeholder="前端展示标签（选填）">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">排序 <span style="color:var(--danger)">*</span></label>
          <input v-model.number="form.sort" type="number" min="0" class="ul-input" placeholder="数值越大越靠前">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">状态 <span style="color:var(--danger)">*</span></label>
          <select v-model="form.status" class="ul-input ul-select">
            <option value="show">显示</option>
            <option value="hide">隐藏</option>
          </select>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="formVisible=false">取消</button>
        <button class="btn btn-primary" @click="submitForm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          确认保存
        </button>
      </div>
    </div>

    <!-- Toast -->
    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type">
        <span style="flex:1;color:var(--text-primary);line-height:1.5">{{ t.msg }}</span>
        <button style="background:none;border:none;cursor:pointer;color:var(--text-muted)" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PrdTipMarker from '@/components/prd/PrdTipMarker.vue'
import { useAdminPrdTips } from '@/composables/useAdminPrdTips'
import { ref, computed, onMounted } from 'vue'

const { bundle, opsTipId, prdTipAnchorRef, prdTipFilterRef, prdTipOpsRef } = useAdminPrdTips()
import { TRACK_TYPE_MOCK_SEED, type ProjectTrackTypeRow } from '@/data/projectCategoryCatalog'

type TrackItem = ProjectTrackTypeRow
interface Toast { id: number; msg: string; type: 'success' | 'error' | 'info' }

const loading = ref(false)
const list = ref<TrackItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const filters = ref({ name: '', status: '', tag: '' })
const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const form = ref<Partial<TrackItem> & { trackName: string; tag: string; sort: number; status: 'show' | 'hide' }>({
  id: 0, trackName: '', tag: '', sort: 0, status: 'show',
})
const toasts = ref<Toast[]>([])
let toastId = 0

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

async function fetchList(p = 1) {
  loading.value = true
  page.value = p
  await new Promise(r => setTimeout(r, 200))
  let data = [...TRACK_TYPE_MOCK_SEED]
  if (filters.value.name) data = data.filter(d => d.trackName.includes(filters.value.name))
  if (filters.value.status) data = data.filter(d => d.status === filters.value.status)
  if (filters.value.tag) data = data.filter(d => d.tag.includes(filters.value.tag))
  total.value = data.length
  const start = (p - 1) * pageSize.value
  list.value = data.slice(start, start + pageSize.value)
  loading.value = false
}

function resetFilter() {
  filters.value = { name: '', status: '', tag: '' }
  fetchList(1)
}

function openAdd() {
  formMode.value = 'add'
  form.value = { id: 0, trackName: '', tag: '', sort: 0, status: 'show' }
  formVisible.value = true
}

function openEdit(row: TrackItem) {
  formMode.value = 'edit'
  form.value = { ...row }
  formVisible.value = true
}

function submitForm() {
  if (!form.value.trackName?.trim()) { showToast('赛道名称不能为空', 'error'); return }
  if (form.value.sort === undefined || form.value.sort < 0) { showToast('排序值不能为空', 'error'); return }
  formVisible.value = false
  showToast(formMode.value === 'add' ? '新增成功' : '修改成功', 'success')
  fetchList(page.value)
}

function showToast(msg: string, type: Toast['type'] = 'info') {
  const id = ++toastId
  toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 3000)
}
function removeToast(id: number) { toasts.value = toasts.value.filter(t => t.id !== id) }

onMounted(() => fetchList(1))
</script>

<style scoped>
.tt-wrap { min-height: 100%; }
.tt-filter { padding: 16px 18px 14px; margin-bottom: 14px; }
.tt-modal { width: 560px !important; }
</style>
