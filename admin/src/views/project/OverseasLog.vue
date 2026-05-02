<template>
  <div class="ol-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">海外文娱</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">推广日志</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">推广日志</h1>
          <p class="page-desc">口令码与推广链接生成记录（只读）</p>
        </div>
      </div>

      <div class="glass-card ol-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">用户 ID</label>
            <input v-model="filters.userId" type="text" class="ul-input" placeholder="精确或模糊">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">手机号</label>
            <input v-model="filters.phone" type="text" class="ul-input" placeholder="模糊">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">项目名称</label>
            <select v-model="filters.projectName" class="ul-input ul-select">
              <option value="">全部</option>
              <option v-for="p in PROJECTS" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">任务 ID</label>
            <input v-model="filters.taskId" type="text" class="ul-input" placeholder="业务任务 ID">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">类型</label>
            <select v-model="filters.contentType" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="小说">小说</option>
              <option value="短剧">短剧</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">创建起</label>
            <input v-model="filters.timeStart" type="date" class="ul-input">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">创建止</label>
            <input v-model="filters.timeEnd" type="date" class="ul-input">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            推广日志
            <span class="table-count">共 {{ total }} 条</span>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table" style="min-width:1240px">
            <thead>
              <tr>
                <th style="width:48px">#</th>
                <th style="min-width:120px">用户信息</th>
                <th style="min-width:100px">项目名称</th>
                <th style="width:72px">类型</th>
                <th style="min-width:88px">任务 ID</th>
                <th style="min-width:120px">任务名称</th>
                <th style="min-width:100px">口令码</th>
                <th style="min-width:100px">推广 ID</th>
                <th style="min-width:200px">推广链接</th>
                <th style="min-width:100px">推广平台</th>
                <th style="min-width:140px">创建时间</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 4" :key="i"><td colspan="11"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td colspan="11"><div class="ul-empty"><div style="font-size:14px;color:var(--text-secondary)">暂无日志</div></div></td></tr>
              </template>
              <template v-else>
                <tr v-for="(row, idx) in list" :key="row.id" class="ul-row">
                  <td><span class="ul-mono">{{ (page - 1) * pageSize + idx + 1 }}</span></td>
                  <td>
                    <div class="ul-mono" style="font-size:12px">{{ row.userId }}</div>
                    <div style="font-size:12px;color:var(--text-secondary)">{{ row.phone }}</div>
                  </td>
                  <td>{{ row.projectName }}</td>
                  <td><span class="tag" :class="row.contentType === '小说' ? 'tag-blue' : 'tag-purple'" style="font-size:10.5px">{{ row.contentType }}</span></td>
                  <td><span class="ul-mono" style="font-size:11px">{{ row.taskId }}</span></td>
                  <td>{{ row.taskName }}</td>
                  <td><span class="ul-mono" style="font-size:11px">{{ row.promoCode || '—' }}</span></td>
                  <td><span class="ul-mono" style="font-size:11px">{{ row.promoId }}</span></td>
                  <td>
                    <div class="url-cell">
                      <span class="url-txt" :title="row.promoUrl">{{ ellipsize(row.promoUrl) }}</span>
                      <button v-if="row.promoUrl" type="button" class="copy-btn" @click="copy(row.promoUrl)">⎘</button>
                    </div>
                  </td>
                  <td>{{ row.promoPlatform }}</td>
                  <td><span class="ul-mono" style="font-size:11px">{{ row.createTime }}</span></td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ total }}</strong> 条，第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
          <div class="ol-pg">
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(1)">«</button>
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(page - 1)">‹</button>
            <button v-for="pn in pageButtons" :key="pn" type="button" class="ul-pg-btn" :class="{ active: pn === page }" @click="goPage(pn)">{{ pn }}</button>
            <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(page + 1)">›</button>
            <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(totalPages)">»</button>
          </div>
          <div class="ol-pg-size">
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

    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type"><span style="flex:1">{{ t.msg }}</span><button type="button" class="tx" @click="removeToast(t.id)">✕</button></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

export interface PromoLogRow {
  id: number
  userId: string
  phone: string
  projectName: string
  contentType: '小说' | '短剧'
  taskId: string
  taskName: string
  promoCode: string
  promoId: string
  promoUrl: string
  promoPlatform: string
  createTime: string
}

const PROJECTS = ['reelshort', 'plot novel', 'novelgo']

function buildLogs(n: number): PromoLogRow[] {
  const platforms = ['TikTok', 'Twitter', 'Facebook', '站内', 'Instagram']
  return Array.from({ length: n }, (_, i) => {
    const id = i + 1
    const ct: '小说' | '短剧' = i % 2 === 0 ? '短剧' : '小说'
    const hasCode = i % 3 !== 0
    return {
      id,
      userId: `U${10000 + id}`,
      phone: `138****${String(1000 + (id % 9000)).slice(-4)}`,
      projectName: PROJECTS[i % 3],
      contentType: ct,
      taskId: `TK-${3000 + id}`,
      taskName: `书籍/剧集-${id}`,
      promoCode: hasCode ? `CODE${String(id).padStart(4, '0')}` : '',
      promoId: `PR-${80000 + id}`,
      promoUrl: hasCode && i % 4 === 0 ? '' : `https://promo.example.com/p/${id}?ref=ovs&track=os`,
      promoPlatform: platforms[i % platforms.length],
      createTime: `2026-04-${String((i % 27) + 1).padStart(2, '0')} ${String(8 + (i % 10)).padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}:00`,
    }
  })
}

const loading = ref(false)
const allLogs = ref<PromoLogRow[]>(buildLogs(36))
const page = ref(1)
const pageSize = ref(20)
const filters = ref({ userId: '', phone: '', projectName: '', taskId: '', contentType: '', timeStart: '', timeEnd: '' })
const toasts = ref<{ id: number; msg: string; type: 'success' | 'error' | 'info' }[]>([])
let toastId = 0

const filteredAll = computed(() => {
  let data = [...allLogs.value]
  if (filters.value.userId.trim()) data = data.filter((d) => d.userId.includes(filters.value.userId.trim()))
  if (filters.value.phone.trim()) data = data.filter((d) => d.phone.includes(filters.value.phone.trim()))
  if (filters.value.projectName) data = data.filter((d) => d.projectName === filters.value.projectName)
  if (filters.value.taskId.trim()) data = data.filter((d) => d.taskId.includes(filters.value.taskId.trim()))
  if (filters.value.contentType) data = data.filter((d) => d.contentType === filters.value.contentType)
  if (filters.value.timeStart) data = data.filter((d) => d.createTime.slice(0, 10) >= filters.value.timeStart)
  if (filters.value.timeEnd) data = data.filter((d) => d.createTime.slice(0, 10) <= filters.value.timeEnd)
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

function ellipsize(s: string, max = 40) {
  if (!s) return '—'
  if (s.length <= max) return s
  const a = 16
  return `${s.slice(0, a)}…${s.slice(-12)}`
}

async function copy(s: string) {
  try {
    await navigator.clipboard.writeText(s)
    showToast('已复制链接', 'success')
  } catch {
    showToast('复制失败', 'error')
  }
}

function showToast(msg: string, type: 'success' | 'error' | 'info' = 'info') {
  const id = ++toastId
  toasts.value.push({ id, msg, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, 2500)
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

async function fetchList(p = 1) {
  loading.value = true
  const tp = Math.max(1, Math.ceil(filteredAll.value.length / pageSize.value))
  page.value = Math.min(Math.max(1, p), tp)
  await new Promise((r) => setTimeout(r, 70))
  loading.value = false
}

function goPage(p: number) {
  const tp = Math.max(1, Math.ceil(filteredAll.value.length / pageSize.value))
  page.value = Math.min(Math.max(1, p), tp)
}

watch([total, pageSize], () => {
  const tp = Math.max(1, Math.ceil(total.value / pageSize.value))
  if (page.value > tp) page.value = tp
})

function resetFilter() {
  filters.value = { userId: '', phone: '', projectName: '', taskId: '', contentType: '', timeStart: '', timeEnd: '' }
  fetchList(1)
}

onMounted(() => fetchList(1))
</script>

<style scoped>
.ol-wrap { min-height: 100%; }
.ol-pg { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.ol-pg-size { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
.ol-filter { padding: 16px 18px 14px; margin-bottom: 14px; }
.url-cell { display: flex; align-items: center; gap: 6px; max-width: 280px; }
.url-txt { font-size: 11.5px; color: var(--text-secondary); word-break: break-all; flex: 1; min-width: 0; }
.copy-btn { flex-shrink: 0; border: none; background: var(--border); border-radius: 6px; width: 28px; height: 28px; cursor: pointer; }
.tx { background: none; border: none; cursor: pointer; color: var(--text-muted); }
.tag-purple { background: #ede9fe; color: #6d28d9; }
[data-theme="dark"] .tag-purple { background: rgba(109,40,217,0.2); color: #c4b5fd; }
</style>
