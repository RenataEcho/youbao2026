<template>
  <div class="ot-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">海外文娱</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">任务管理</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">任务管理</h1>
          <p class="page-desc">内容库任务：编辑、删除；支持批量显示/隐藏与上新、爆款标签</p>
        </div>
      </div>

      <div class="glass-card ot-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">任务名称 / ID</label>
            <input v-model="filters.keyword" type="text" class="ul-input" placeholder="模糊匹配名称或任务 ID">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">所属项目</label>
            <select v-model="filters.projectName" class="ul-input ul-select">
              <option value="">全部</option>
              <option v-for="p in PROJECTS" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">是否显示</label>
            <select v-model="filters.isVisible" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="1">显示</option>
              <option value="0">隐藏</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">标签</label>
            <select v-model="filters.tag" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="new">上新</option>
              <option value="hot">爆款</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">创建起</label>
            <input v-model="filters.createStart" type="date" class="ul-input">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">创建止</label>
            <input v-model="filters.createEnd" type="date" class="ul-input">
          </div>
        </div>
        <div class="ul-filter-footer">
          <span></span>
          <div style="display:flex;gap:8px">
            <button class="btn btn-default btn-sm" type="button" @click="resetFilter">重置</button>
            <button class="btn btn-primary btn-sm" type="button" @click="fetchList(1)">查询</button>
          </div>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            任务列表
            <span class="table-count">共 {{ total }} 条</span>
          </div>
          <div v-if="selectedIds.size > 0" class="bulk-bar show">
            <span class="bulk-count">已选 <strong>{{ selectedIds.size }}</strong> 条</span>
            <button class="btn btn-primary btn-sm" type="button" @click="bulkVisible(true)">批量显示</button>
            <button class="btn btn-default btn-sm" type="button" @click="bulkVisible(false)">批量隐藏</button>
            <button class="btn btn-default btn-sm" type="button" @click="bulkTag('new')">批量上新</button>
            <button class="btn btn-default btn-sm" type="button" @click="bulkTag('hot')">批量爆款</button>
            <button class="btn btn-default btn-sm" type="button" @click="selectedIds.clear()">取消</button>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table" style="min-width:1180px">
            <thead>
              <tr>
                <th style="width:40px"><input type="checkbox" class="ul-checkbox" :checked="allChecked" @change="toggleAll"></th>
                <th style="width:52px">ID</th>
                <th style="width:72px">封面</th>
                <th style="min-width:140px">任务名称</th>
                <th style="min-width:100px">任务 ID</th>
                <th style="min-width:120px">简介</th>
                <th style="width:88px">章节</th>
                <th style="min-width:120px">项目名称</th>
                <th style="width:100px">显示</th>
                <th style="width:64px;text-align:right">排序</th>
                <th style="width:100px">标签</th>
                <th style="min-width:100px">创建时间</th>
                <th style="min-width:100px">更新时间</th>
                <th class="col-action" style="width:100px;text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 4" :key="i"><td colspan="14"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td colspan="14"><div class="ul-empty"><div style="font-size:14px;color:var(--text-secondary)">暂无任务</div></div></td></tr>
              </template>
              <template v-else>
                <tr v-for="row in list" :key="row.id" class="ul-row">
                  <td><input type="checkbox" class="ul-checkbox" :checked="selectedIds.has(row.id)" @change="toggleRow(row.id)"></td>
                  <td><span class="ul-mono">{{ row.id }}</span></td>
                  <td>
                    <div class="cover-thumb" :style="{ backgroundImage: row.coverUrl ? `url(${row.coverUrl})` : undefined }">
                      <span v-if="!row.coverUrl" class="cover-ph">无</span>
                    </div>
                  </td>
                  <td><strong>{{ row.taskName }}</strong></td>
                  <td><span class="ul-mono" style="font-size:11px">{{ row.externalTaskId }}</span></td>
                  <td><button type="button" class="action-btn view" @click="openSummary(row)">查看</button></td>
                  <td><button type="button" class="action-btn view" @click="openChapters(row)">{{ row.taskChapters.length }} 章</button></td>
                  <td>{{ row.projectName }}</td>
                  <td>
                    <label class="sw-inline">
                      <input type="checkbox" :checked="row.isVisible" @change="toggleRowVisible(row, ($event.target as HTMLInputElement).checked)">
                      <span class="badge" :class="row.isVisible ? 'badge-success' : 'badge-gray'">{{ row.isVisible ? '显示' : '隐藏' }}</span>
                    </label>
                  </td>
                  <td style="text-align:right"><span class="ul-mono">{{ row.sortWeight }}</span></td>
                  <td>
                    <span v-if="row.tags.includes('new')" class="tag tag-amber" style="font-size:10px;margin-right:4px">上新</span>
                    <span v-if="row.tags.includes('hot')" class="tag tag-red" style="font-size:10px">爆款</span>
                    <span v-if="!row.tags.length" style="color:var(--text-muted);font-size:12px">—</span>
                  </td>
                  <td><span class="ul-mono" style="font-size:11px">{{ row.createTime }}</span></td>
                  <td><span class="ul-mono" style="font-size:11px">{{ row.updateTime }}</span></td>
                  <td class="col-action">
                    <div class="action-btns">
                      <button type="button" class="action-btn edit" title="编辑" @click="openEdit(row)">编辑</button>
                      <button type="button" class="action-btn delete" title="删除" @click="confirmDelete(row)">删除</button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ total }}</strong> 条，第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
          <div class="ot-pg">
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(1)">«</button>
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(page - 1)">‹</button>
            <button v-for="pn in pageButtons" :key="pn" type="button" class="ul-pg-btn" :class="{ active: pn === page }" @click="goPage(pn)">{{ pn }}</button>
            <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(page + 1)">›</button>
            <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(totalPages)">»</button>
          </div>
          <div class="ot-pg-size">
            每页
            <select v-model.number="pageSize" class="ul-pg-size" @change="page = 1">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
            条
          </div>
        </div>
      </div>
    </div>

    <!-- 简介弹窗 -->
    <div class="ul-overlay" :class="{ show: summaryVisible }" @click="summaryVisible = false"></div>
    <div class="ul-modal flex-col ul-modal--glass ot-modal-md" :class="{ show: summaryVisible }" role="dialog" aria-modal="true">
      <div class="ul-modal-header">
        <div class="ul-modal-title">任务简介</div>
        <button class="ul-icon-btn" type="button" @click="summaryVisible = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="ul-modal-body">
        <textarea v-model="summaryDraft" class="ul-input ul-textarea" rows="8"></textarea>
      </div>
      <div class="ul-modal-footer">
        <button class="btn btn-default" type="button" @click="summaryVisible = false">关闭</button>
        <button class="btn btn-primary" type="button" @click="saveSummary">保存</button>
      </div>
    </div>

    <!-- 章节弹窗（只读） -->
    <div class="ul-overlay" :class="{ show: chapterVisible }" @click="chapterVisible = false"></div>
    <div class="ul-modal flex-col ul-modal--glass ot-modal-md" :class="{ show: chapterVisible }" role="dialog" aria-modal="true">
      <div class="ul-modal-header">
        <div class="ul-modal-title">章节列表（只读）</div>
        <button class="ul-icon-btn" type="button" @click="chapterVisible = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="ul-modal-body">
        <div class="ch-list">
          <div v-for="c in chapterViewList" :key="c.idx" class="ch-row">
            <span class="ul-mono ch-idx">#{{ c.idx }}</span>
            <div class="ch-body">{{ c.content }}</div>
          </div>
        </div>
      </div>
      <div class="ul-modal-footer">
        <button class="btn btn-default" type="button" @click="chapterVisible = false">关闭</button>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <div class="ul-overlay" :class="{ show: formVisible }" @click="formVisible = false"></div>
    <div class="ul-modal flex-col ul-modal--glass ot-modal-md" :class="{ show: formVisible }" role="dialog" aria-modal="true">
      <div class="ul-modal-header">
        <div class="ul-modal-title">编辑任务</div>
        <button class="ul-icon-btn" type="button" @click="formVisible = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="ul-modal-body" style="display:flex;flex-direction:column;gap:12px">
        <div class="ul-form-group">
          <label class="ul-label">封面 URL</label>
          <input v-model="form.coverUrl" type="text" class="ul-input" placeholder="https://…">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">任务名称</label>
          <input v-model="form.taskName" type="text" class="ul-input">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">是否显示</label>
          <label class="sw-inline"><input v-model="form.isVisible" type="checkbox"> 前台展示该任务</label>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">排序权重</label>
          <input v-model.number="form.sortWeight" type="number" class="ul-input" min="0" step="1">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">标签（可多选）</label>
          <div class="tag-pick">
            <label><input type="checkbox" :checked="(form.tags || []).includes('new')" @change="flipTag('new', ($event.target as HTMLInputElement).checked)"> 上新</label>
            <label><input type="checkbox" :checked="(form.tags || []).includes('hot')" @change="flipTag('hot', ($event.target as HTMLInputElement).checked)"> 爆款</label>
          </div>
        </div>
      </div>
      <div class="ul-modal-footer">
        <button class="btn btn-default" type="button" @click="formVisible = false">取消</button>
        <button class="btn btn-primary" type="button" @click="submitEdit">保存</button>
      </div>
    </div>

    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type"><span style="flex:1">{{ t.msg }}</span><button type="button" class="tx" @click="removeToast(t.id)">✕</button></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive } from 'vue'

type TagKey = 'new' | 'hot'
export interface TaskRow {
  id: number
  coverUrl: string
  taskName: string
  externalTaskId: string
  taskSummary: string
  taskChapters: { idx: number; content: string }[]
  projectName: string
  isVisible: boolean
  sortWeight: number
  tags: TagKey[]
  createTime: string
  updateTime: string
}

const PROJECTS = ['reelshort', 'plot novel', 'novelgo']

function buildTasks(n: number): TaskRow[] {
  return Array.from({ length: n }, (_, i) => {
    const id = i + 1
    const chapterCount = i % 11 === 0 ? 0 : (i % 14) + 1
    const chapters = Array.from({ length: chapterCount }, (_, j) => ({
      idx: j + 1,
      content: `第${j + 1}章内容摘要（任务 ${id}）…`,
    }))
    const tags: TagKey[] = []
    if (i % 5 === 0) tags.push('new')
    if (i % 7 === 0) tags.push('hot')
    return {
      id,
      coverUrl: i % 4 === 0 ? '' : `https://picsum.photos/seed/ot${id}/80/100`,
      taskName: `书籍/剧集任务-${id}`,
      externalTaskId: `EXT-${10000 + id}`,
      taskSummary: i % 6 === 0 ? '' : `这是任务 ${id} 的简介摘要，用于海外文娱前台展示。`,
      taskChapters: chapters,
      projectName: PROJECTS[i % 3],
      isVisible: i % 9 !== 0,
      sortWeight: Math.max(0, 220 - i * 2),
      tags,
      createTime: `2026-04-${String((i % 25) + 1).padStart(2, '0')} ${String(10 + (i % 8)).padStart(2, '0')}:00:00`,
      updateTime: `2026-04-28 ${String((i * 3) % 24).padStart(2, '0')}:30:00`,
    }
  })
}

const loading = ref(false)
const allRows = ref<TaskRow[]>(buildTasks(32))
const page = ref(1)
const pageSize = ref(20)
const filters = ref({ keyword: '', projectName: '', isVisible: '', tag: '', createStart: '', createEnd: '' })
const selectedIds = reactive(new Set<number>())
const summaryVisible = ref(false)
const summaryDraft = ref('')
const summaryRowId = ref<number | null>(null)
const chapterVisible = ref(false)
const chapterViewList = ref<{ idx: number; content: string }[]>([])
const formVisible = ref(false)
const form = ref<Partial<TaskRow>>({ tags: [] })
const toasts = ref<{ id: number; msg: string; type: 'success' | 'error' | 'info' }[]>([])
let toastId = 0

const filteredAll = computed(() => {
  let data = [...allRows.value]
  const k = filters.value.keyword.trim()
  if (k) data = data.filter((d) => d.taskName.includes(k) || d.externalTaskId.includes(k))
  if (filters.value.projectName) data = data.filter((d) => d.projectName === filters.value.projectName)
  if (filters.value.isVisible === '1') data = data.filter((d) => d.isVisible)
  if (filters.value.isVisible === '0') data = data.filter((d) => !d.isVisible)
  if (filters.value.tag === 'new') data = data.filter((d) => d.tags.includes('new'))
  if (filters.value.tag === 'hot') data = data.filter((d) => d.tags.includes('hot'))
  if (filters.value.createStart) data = data.filter((d) => d.createTime.slice(0, 10) >= filters.value.createStart)
  if (filters.value.createEnd) data = data.filter((d) => d.createTime.slice(0, 10) <= filters.value.createEnd)
  return data
})

const total = computed(() => filteredAll.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const list = computed(() => {
  const s = (page.value - 1) * pageSize.value
  return filteredAll.value.slice(s, s + pageSize.value)
})
const pageButtons = computed(() => {
  const t = totalPages.value
  const c = page.value
  const arr: number[] = []
  for (let i = Math.max(1, c - 2); i <= Math.min(t, c + 2); i++) arr.push(i)
  return arr
})

watch([total, pageSize], () => {
  const tp = Math.max(1, Math.ceil(total.value / pageSize.value))
  if (page.value > tp) page.value = tp
})

const allChecked = computed(() => list.value.length > 0 && list.value.every((r) => selectedIds.has(r.id)))

function toggleAll(e: Event) {
  const on = (e.target as HTMLInputElement).checked
  list.value.forEach((r) => {
    if (on) selectedIds.add(r.id)
    else selectedIds.delete(r.id)
  })
}

function toggleRow(id: number) {
  if (selectedIds.has(id)) selectedIds.delete(id)
  else selectedIds.add(id)
}

function showToast(msg: string, type: 'success' | 'error' | 'info' = 'info') {
  const id = ++toastId
  toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 2600)
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

async function fetchList(p = 1) {
  loading.value = true
  const tp = Math.max(1, Math.ceil(filteredAll.value.length / pageSize.value))
  page.value = Math.min(Math.max(1, p), tp)
  await new Promise((r) => setTimeout(r, 100))
  selectedIds.clear()
  loading.value = false
}

function goPage(p: number) {
  const tp = Math.max(1, Math.ceil(filteredAll.value.length / pageSize.value))
  page.value = Math.min(Math.max(1, p), tp)
}

function resetFilter() {
  filters.value = { keyword: '', projectName: '', isVisible: '', tag: '', createStart: '', createEnd: '' }
  fetchList(1)
}

function openSummary(row: TaskRow) {
  summaryRowId.value = row.id
  summaryDraft.value = row.taskSummary
  summaryVisible.value = true
}

function saveSummary() {
  const id = summaryRowId.value
  if (id == null) return
  const row = allRows.value.find((r) => r.id === id)
  if (row) {
    row.taskSummary = summaryDraft.value
    row.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  summaryVisible.value = false
  showToast('简介已保存', 'success')
}

function openChapters(row: TaskRow) {
  chapterViewList.value = row.taskChapters
  chapterVisible.value = true
}

function openEdit(row: TaskRow) {
  form.value = { ...row, tags: [...row.tags] }
  formVisible.value = true
}

function flipTag(tag: TagKey, on: boolean) {
  const tags = new Set(form.value.tags || [])
  if (on) tags.add(tag)
  else tags.delete(tag)
  form.value.tags = [...tags] as TagKey[]
}

function submitEdit() {
  const id = form.value.id
  if (id == null) return
  const row = allRows.value.find((r) => r.id === id)
  if (row) {
    Object.assign(row, {
      coverUrl: form.value.coverUrl || '',
      taskName: form.value.taskName,
      isVisible: form.value.isVisible,
      sortWeight: form.value.sortWeight ?? 0,
      tags: [...(form.value.tags || [])] as TagKey[],
      updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    })
  }
  formVisible.value = false
  showToast('已保存', 'success')
}

function toggleRowVisible(row: TaskRow, v: boolean) {
  row.isVisible = v
  row.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
  showToast(v ? '已设为显示' : '已设为隐藏', 'success')
}

function bulkVisible(v: boolean) {
  allRows.value.filter((r) => selectedIds.has(r.id)).forEach((r) => {
    r.isVisible = v
    r.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
  })
  showToast(`已批量${v ? '显示' : '隐藏'}`, 'success')
  fetchList(page.value)
}

function bulkTag(tag: TagKey) {
  allRows.value.filter((r) => selectedIds.has(r.id)).forEach((r) => {
    if (!r.tags.includes(tag)) r.tags.push(tag)
    r.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
  })
  showToast(tag === 'new' ? '已批量打上新' : '已批量打爆款', 'success')
  fetchList(page.value)
}

function confirmDelete(row: TaskRow) {
  if (!confirm(`确定删除任务「${row.taskName}」？`)) return
  const i = allRows.value.findIndex((r) => r.id === row.id)
  if (i >= 0) allRows.value.splice(i, 1)
  showToast('已删除', 'success')
  fetchList(page.value)
}

onMounted(() => fetchList(1))
</script>

<style scoped>
.ot-wrap { min-height: 100%; }
.ot-filter { padding: 16px 18px 14px; margin-bottom: 14px; }
.ot-modal-md { width: 560px !important; max-width: calc(100vw - 32px) !important; }
.ot-pg { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.ot-pg-size { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
.bulk-bar { display: none; align-items: center; gap: 8px; flex-wrap: wrap; }
.bulk-bar.show { display: flex; }
.bulk-count { font-size: 13px; color: var(--text-secondary); margin-right: 8px; }
.cover-thumb { width: 48px; height: 60px; border-radius: 6px; background: var(--border) center/cover no-repeat; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.cover-ph { font-size: 10px; color: var(--text-muted); }
.link-btn { background: none; border: none; color: var(--primary); cursor: pointer; font-size: 13px; padding: 0; text-decoration: underline; }
.sw-inline { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; }
.tag-pick { display: flex; gap: 16px; font-size: 13px; }
.ch-list { max-height: min(360px, 48vh); overflow: auto; }
.ch-row { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
.ch-idx { flex-shrink: 0; color: var(--text-muted); }
.ch-body { color: var(--text-secondary); line-height: 1.45; }
.badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.badge-success { background: var(--success-bg); color: var(--success); }
.badge-gray { background: var(--border); color: var(--text-muted); }
.tag-red { background: #fef2f2; color: #b91c1c; }
.tx { background: none; border: none; cursor: pointer; color: var(--text-muted); }
[data-theme="dark"] .tag-red { background: rgba(185,28,28,0.2); color: #fca5a5; }
</style>
