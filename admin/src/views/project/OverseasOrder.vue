<template>
  <div class="oo-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">海外文娱</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">订单管理</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">订单管理</h1>
          <p class="page-desc">审核状态为待审核/已审核；退款时按 PRD 规则修正打款状态展示</p>
        </div>
      </div>

      <!-- 统计条（样式对齐奖励明细：标签 + 色点 + 金额徽章） -->
      <div class="glass-card oo-stat-strip">
        <div v-for="s in headerStats" :key="s.key" class="oo-stat-slot">
          <span class="oo-stat-dot" :class="s.dotClass"></span>
          <span class="oo-stat-lab">{{ s.label }}</span>
          <span class="badge oo-stat-money" :class="s.badgeClass">¥{{ s.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
          <span class="oo-stat-count">{{ s.count }} 笔</span>
        </div>
      </div>

      <div class="glass-card oo-filter">
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
            <label class="ul-label">项目</label>
            <select v-model="filters.projectName" class="ul-input ul-select">
              <option value="">全部</option>
              <option v-for="p in PROJECTS" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">任务</label>
            <input v-model="filters.taskKeyword" type="text" class="ul-input" placeholder="任务 ID 或名称">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">审核状态</label>
            <select v-model="filters.auditStatus" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="pending">待审核</option>
              <option value="approved">已审核</option>
              <option value="rejected">已驳回</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">打款状态</label>
            <select v-model="filters.payoutFilter" class="ul-input ul-select">
              <option value="">全部（展示值）</option>
              <option value="pending">待打款</option>
              <option value="paid">已打款</option>
              <option value="invalid">已失效</option>
              <option value="clawback">已扣回</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">付款状态</label>
            <select v-model="filters.payStatus" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="paid">已付款</option>
              <option value="refunded">已退款</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">创建起</label>
            <input v-model="filters.timeStart" type="datetime-local" class="ul-input">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">创建止</label>
            <input v-model="filters.timeEnd" type="datetime-local" class="ul-input">
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
            订单列表
            <span class="table-count">共 {{ total }} 条</span>
          </div>
          <div v-if="selectedIds.size > 0" class="bulk-bar show">
            <span class="bulk-count">已选 <strong>{{ selectedIds.size }}</strong></span>
            <button class="btn btn-danger btn-sm" type="button" @click="openBulkReject">批量审核驳回</button>
            <button class="btn btn-danger btn-sm" type="button" @click="bulkDelete">批量删除</button>
            <button class="btn btn-default btn-sm" type="button" @click="selectedIds.clear()">取消</button>
          </div>
          <div v-else class="table-header-right">
            <button class="btn btn-default btn-sm" type="button" @click="exportMock">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              批量导出
            </button>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table" style="min-width:1320px">
            <thead>
              <tr>
                <th style="width:36px"><input type="checkbox" class="ul-checkbox" :checked="allChecked" @change="toggleAll"></th>
                <th style="width:48px">ID</th>
                <th style="min-width:120px">用户信息</th>
                <th style="width:72px">等级</th>
                <th style="min-width:100px">项目</th>
                <th style="min-width:140px">任务信息</th>
                <th style="width:80px">推广类型</th>
                <th style="min-width:160px">推广信息</th>
                <th style="width:80px;text-align:right">金额</th>
                <th style="width:72px;text-align:right">分佣%</th>
                <th style="min-width:100px">创建时间</th>
                <th style="min-width:120px">原始信息</th>
                <th style="min-width:100px">外部单号</th>
                <th style="width:80px">打款</th>
                <th style="width:80px">审核</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 4" :key="i"><td colspan="15"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="pagedRows.length === 0">
                <tr><td colspan="15"><div class="ul-empty"><div style="font-size:14px;color:var(--text-secondary)">暂无订单</div></div></td></tr>
              </template>
              <template v-else>
                <tr v-for="row in pagedRows" :key="row.id" class="ul-row">
                  <td><input type="checkbox" class="ul-checkbox" :checked="selectedIds.has(row.id)" @change="toggleRow(row.id)"></td>
                  <td><span class="ul-mono">{{ row.id }}</span></td>
                  <td>
                    <div class="ul-mono" style="font-size:12px">ID {{ row.userId }}</div>
                    <div style="font-size:12px;color:var(--text-secondary)">{{ row.phone }}</div>
                  </td>
                  <td><span class="tag tag-blue" style="font-size:10px">{{ row.userLevel }}</span></td>
                  <td>{{ row.projectName }}</td>
                  <td><span class="ul-mono" style="font-size:11px">{{ row.taskId }}</span><div style="font-size:12px">{{ row.taskName }}</div></td>
                  <td><span class="tag tag-gray" style="font-size:10px">{{ row.promoType === 'code' ? '口令码' : '推广链接' }}</span></td>
                  <td>
                    <div class="promo-cell">
                      <span class="promo-text" :title="row.promoValue">{{ ellipsize(row.promoValue) }}</span>
                      <button type="button" class="copy-ic" title="复制" @click="copyTxt(row.promoValue)">⎘</button>
                    </div>
                  </td>
                  <td style="text-align:right"><span class="ul-mono">{{ row.orderAmount.toFixed(2) }}</span></td>
                  <td style="text-align:right"><span class="ul-mono">{{ row.commissionRatioPct.toFixed(1) }}</span></td>
                  <td><span class="ul-mono" style="font-size:11px">{{ row.orderCreateTime }}</span></td>
                  <td>
                    <div :class="row.payStatus === 'paid' ? 'pay-ok' : 'pay-bad'">{{ row.payStatus === 'paid' ? '已付款' : '已退款' }}</div>
                    <div class="ul-mono" style="font-size:11px;color:var(--text-secondary)">{{ row.orderEventTime }}</div>
                  </td>
                  <td><span class="ul-mono" style="font-size:11px">{{ row.externalOrderNo }}</span></td>
                  <td><span class="badge" :class="payoutBadgeClass(effectivePayout(row))">{{ payoutLabel(effectivePayout(row)) }}</span></td>
                  <td><span class="badge" :class="auditBadgeClass(row)">{{ auditLabel(row) }}</span></td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ total }}</strong> 条，第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
          <div class="oo-pg">
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(1)">«</button>
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(page - 1)">‹</button>
            <button v-for="pn in pageButtons" :key="pn" type="button" class="ul-pg-btn" :class="{ active: pn === page }" @click="goPage(pn)">{{ pn }}</button>
            <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(page + 1)">›</button>
            <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(totalPages)">»</button>
          </div>
          <div class="oo-pg-size">
            每页
            <select class="ul-pg-size" @change="onPageSizeChange">
              <option :value="10">10</option>
              <option :value="20" selected>20</option>
              <option :value="50">50</option>
            </select>
            条
          </div>
        </div>
      </div>
    </div>

    <!-- 批量审核驳回：危险操作，遮罩不可点击关闭（UIUX §11 / §23.6） -->
    <div class="ul-overlay" :class="{ show: rejectVisible }"></div>
    <div class="ul-modal flex-col ul-modal--glass oo-modal-sm" :class="{ show: rejectVisible }" role="dialog" aria-modal="true">
      <div class="ul-modal-header">
        <div class="ul-modal-title" style="color:var(--danger)">批量审核驳回</div>
        <button class="ul-icon-btn" type="button" @click="rejectVisible = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="ul-modal-body">
        <div class="ul-form-group">
          <label class="ul-label">驳回原因 <span class="req">*</span></label>
          <textarea v-model="rejectReason" class="ul-input ul-textarea" rows="3" maxlength="200" placeholder="将应用于所选待审核订单"></textarea>
        </div>
      </div>
      <div class="ul-modal-footer">
        <button class="btn btn-default" type="button" @click="rejectVisible = false">取消</button>
        <button class="btn btn-danger" type="button" @click="submitBulkReject">确认驳回</button>
      </div>
    </div>

    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type"><span style="flex:1">{{ t.msg }}</span><button type="button" class="tx" @click="removeToast(t.id)">✕</button></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

export type PayoutRaw = 'pending' | 'paid'
export type PayoutEffective = 'pending' | 'paid' | 'invalid' | 'clawback'

export interface OverseasOrderRow {
  id: number
  userId: string
  phone: string
  userLevel: string
  projectName: string
  taskId: string
  taskName: string
  promoType: 'code' | 'link'
  promoValue: string
  orderAmount: number
  commissionRatioPct: number
  orderCreateTime: string
  payStatus: 'paid' | 'refunded'
  orderEventTime: string
  externalOrderNo: string
  payoutRaw: PayoutRaw
  auditStatus: 'pending' | 'approved' | 'rejected'
}

const PROJECTS = ['reelshort', 'plot novel', 'novelgo']

function buildOrders(n: number): OverseasOrderRow[] {
  const projects = ['reelshort', 'plot novel', 'novelgo']
  const rows: OverseasOrderRow[] = []
  for (let i = 1; i <= n; i++) {
    const audit: OverseasOrderRow['auditStatus'] = i % 10 === 0 ? 'rejected' : i % 3 === 0 ? 'pending' : 'approved'
    const payStatus: 'paid' | 'refunded' = i % 12 === 0 ? 'refunded' : 'paid'
    const payoutRaw: PayoutRaw = i % 5 === 0 ? 'paid' : 'pending'
    rows.push({
      id: i,
      userId: `U${10000 + i}`,
      phone: `138****${String(1000 + (i % 9000)).slice(-4)}`,
      userLevel: `V${(i % 5) + 1}`,
      projectName: projects[i % 3],
      taskId: `TK-${2000 + i}`,
      taskName: `推广任务-${i}`,
      promoType: i % 2 === 0 ? 'code' : 'link',
      promoValue: i % 2 === 0 ? `READ${String(i).padStart(4, '0')}` : `https://promo.example.com/o/${i}?ref=ovs&x=1`,
      orderAmount: Math.round((40 + (i % 18) * 7.35) * 100) / 100,
      commissionRatioPct: i % 2 === 0 ? 30 : 50,
      orderCreateTime: `2026-04-${String((i % 27) + 1).padStart(2, '0')} ${String(8 + (i % 10)).padStart(2, '0')}:${String((i * 3) % 60).padStart(2, '0')}:00`,
      payStatus,
      orderEventTime: payStatus === 'refunded' ? '2026-04-29 12:00 退款' : '2026-04-28 09:05 付款',
      externalOrderNo: `EXT-${10000 + i}`,
      payoutRaw,
      auditStatus: audit,
    })
  }
  return rows
}

const route = useRoute()
const loading = ref(false)
const source = ref<OverseasOrderRow[]>([])
const page = ref(1)
const pageSize = ref(20)
const selectedIds = reactive(new Set<number>())
const filters = ref({
  userId: '',
  phone: '',
  projectName: '',
  taskKeyword: '',
  auditStatus: '',
  payoutFilter: '' as '' | PayoutEffective,
  payStatus: '',
  timeStart: '',
  timeEnd: '',
})
const rejectVisible = ref(false)
const rejectReason = ref('')
const toasts = ref<{ id: number; msg: string; type: 'success' | 'error' | 'info' }[]>([])
let toastId = 0

const filteredRows = computed(() => filterRows(source.value))
const total = computed(() => filteredRows.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const pagedRows = computed(() => {
  const s = (page.value - 1) * pageSize.value
  return filteredRows.value.slice(s, s + pageSize.value)
})
const pageButtons = computed(() => {
  const t = totalPages.value
  const c = page.value
  const arr: number[] = []
  for (let i = Math.max(1, c - 2); i <= Math.min(t, c + 2); i++) arr.push(i)
  return arr
})

function effectivePayout(row: OverseasOrderRow): PayoutEffective {
  if (row.payStatus !== 'refunded') return row.payoutRaw
  if (row.payoutRaw === 'paid') return 'clawback'
  return 'invalid'
}

function payoutLabel(p: PayoutEffective) {
  return { pending: '待打款', paid: '已打款', invalid: '已失效', clawback: '已扣回' }[p]
}

function payoutBadgeClass(p: PayoutEffective) {
  return { pending: 'badge-warning', paid: 'badge-success', invalid: 'badge-gray', clawback: 'badge-danger' }[p]
}

function auditLabel(row: OverseasOrderRow) {
  if (row.auditStatus === 'pending') return '待审核'
  if (row.auditStatus === 'rejected') return '已驳回'
  return '已审核'
}

function auditBadgeClass(row: OverseasOrderRow) {
  if (row.auditStatus === 'pending') return 'badge-warning'
  if (row.auditStatus === 'rejected') return 'badge-gray'
  return 'badge-success'
}

function ellipsize(s: string, max = 36) {
  if (s.length <= max) return s
  const a = Math.floor(max / 2) - 2
  const b = s.length - (max - a - 3)
  return `${s.slice(0, a)}…${s.slice(b)}`
}

async function copyTxt(s: string) {
  try {
    await navigator.clipboard.writeText(s)
    showToast('已复制', 'success')
  } catch {
    showToast('复制失败', 'error')
  }
}

const headerStats = computed(() => {
  const rows = filteredRows.value
  const sum = (pred: (r: OverseasOrderRow) => boolean) => {
    let c = 0
    let a = 0
    for (const r of rows) {
      if (!pred(r)) continue
      c += 1
      a += r.orderAmount
    }
    return { count: c, amount: a }
  }
  const eff = (r: OverseasOrderRow) => effectivePayout(r)
  const m1 = sum((r) => r.auditStatus === 'pending' && r.payStatus === 'paid' && eff(r) === 'pending')
  const m2 = sum((r) => r.auditStatus === 'pending' && r.payStatus === 'paid' && eff(r) === 'paid')
  const m3 = sum((r) => r.auditStatus === 'approved' && r.payStatus === 'paid' && eff(r) === 'pending')
  const m4 = sum((r) => r.auditStatus === 'approved' && r.payStatus === 'paid' && eff(r) === 'paid')
  const m5 = sum((r) => eff(r) === 'clawback')
  return [
    { key: 'm1', label: '未审核未打款', ...m1, dotClass: 'is-warn', badgeClass: 'badge-warning' },
    { key: 'm2', label: '未审核已打款', ...m2, dotClass: 'is-ok', badgeClass: 'badge-success' },
    { key: 'm3', label: '已审核未打款', ...m3, dotClass: 'is-warn', badgeClass: 'badge-warning' },
    { key: 'm4', label: '已审核已打款', ...m4, dotClass: 'is-ok', badgeClass: 'badge-success' },
    { key: 'm5', label: '已扣回', ...m5, dotClass: 'is-danger', badgeClass: 'badge-danger' },
  ]
})

const allChecked = computed(() => pagedRows.value.length > 0 && pagedRows.value.every((r) => selectedIds.has(r.id)))

function toggleAll(e: Event) {
  const on = (e.target as HTMLInputElement).checked
  if (on) pagedRows.value.forEach((r) => selectedIds.add(r.id))
  else selectedIds.clear()
}

function toggleRow(id: number) {
  if (selectedIds.has(id)) selectedIds.delete(id)
  else selectedIds.add(id)
}

function applyQueryFromRoute() {
  const q = route.query
  if (q.audit === 'pending') filters.value.auditStatus = 'pending'
  if (q.payout === 'pending') filters.value.payoutFilter = 'pending'
}

function filterRows(data: OverseasOrderRow[]) {
  let out = [...data]
  const f = filters.value
  if (f.userId.trim()) out = out.filter((r) => r.userId.includes(f.userId.trim()))
  if (f.phone.trim()) out = out.filter((r) => r.phone.includes(f.phone.trim()))
  if (f.projectName) out = out.filter((r) => r.projectName === f.projectName)
  if (f.taskKeyword.trim()) {
    const q = f.taskKeyword.trim()
    out = out.filter((r) => r.taskId.includes(q) || r.taskName.includes(q))
  }
  if (f.auditStatus) out = out.filter((r) => r.auditStatus === f.auditStatus)
  if (f.payStatus) out = out.filter((r) => r.payStatus === f.payStatus)
  if (f.payoutFilter) out = out.filter((r) => effectivePayout(r) === f.payoutFilter)
  if (f.timeStart) {
    const t = f.timeStart.replace('T', ' ')
    out = out.filter((r) => r.orderCreateTime >= t)
  }
  if (f.timeEnd) {
    const t = f.timeEnd.replace('T', ' ')
    out = out.filter((r) => r.orderCreateTime <= t)
  }
  return out
}

async function fetchList(p = 1) {
  loading.value = true
  await new Promise((r) => setTimeout(r, 60))
  const tp = Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value))
  page.value = Math.min(Math.max(1, p), tp)
  selectedIds.clear()
  loading.value = false
}

function goPage(p: number) {
  const tp = Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value))
  page.value = Math.min(Math.max(1, p), tp)
}

function onPageSizeChange(e: Event) {
  pageSize.value = Number((e.target as HTMLSelectElement).value)
  page.value = 1
}

function resetFilter() {
  filters.value = { userId: '', phone: '', projectName: '', taskKeyword: '', auditStatus: '', payoutFilter: '', payStatus: '', timeStart: '', timeEnd: '' }
  fetchList(1)
}

function openBulkReject() {
  const ids = [...selectedIds]
  const pending = ids.filter((id) => source.value.find((r) => r.id === id)?.auditStatus === 'pending')
  if (!pending.length) {
    showToast('请选择待审核订单', 'error')
    return
  }
  rejectReason.value = ''
  rejectVisible.value = true
}

function submitBulkReject() {
  if (!rejectReason.value.trim()) {
    showToast('请填写驳回原因', 'error')
    return
  }
  for (const id of selectedIds) {
    const r = source.value.find((x) => x.id === id)
    if (r && r.auditStatus === 'pending') r.auditStatus = 'rejected'
  }
  rejectVisible.value = false
  showToast('已批量驳回', 'success')
  fetchList(1)
}

function bulkDelete() {
  if (!selectedIds.size) return
  if (!confirm(`确定删除 ${selectedIds.size} 条？`)) return
  source.value = source.value.filter((r) => !selectedIds.has(r.id))
  showToast('已删除', 'success')
  fetchList(1)
}

function exportMock() {
  showToast(`已导出 ${filteredRows.value.length} 条（Mock）`, 'success')
}

function showToast(msg: string, type: 'success' | 'error' | 'info' = 'info') {
  const id = ++toastId
  toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 2800)
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

onMounted(() => {
  source.value = buildOrders(48)
  applyQueryFromRoute()
  fetchList(1)
})
</script>

<style scoped>
.oo-wrap { min-height: 100%; }
.oo-stat-strip {
  padding: 14px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 18px 28px;
  align-items: center;
  margin-bottom: 14px;
}
.oo-stat-slot {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.oo-stat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.oo-stat-dot.is-warn { background: var(--warning); }
.oo-stat-dot.is-ok { background: var(--success); }
.oo-stat-dot.is-danger { background: var(--danger); }
.oo-stat-lab { font-size: 12px; color: var(--text-muted); }
.oo-stat-money { font-size: 12px; font-weight: 700; padding: 2px 10px; }
.oo-stat-count { font-size: 11px; color: var(--text-muted); }
.oo-pg { display: flex; align-items: center; gap: 4px; }
.oo-pg-size { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
.oo-filter { padding: 16px 18px 14px; margin-bottom: 14px; }
.oo-modal-sm { width: 480px !important; max-width: calc(100vw - 32px) !important; }
.bulk-bar { display: none; align-items: center; gap: 8px; flex-wrap: wrap; }
.bulk-bar.show { display: flex; }
.bulk-count { font-size: 13px; color: var(--text-secondary); margin-right: 6px; }
.promo-cell { display: flex; align-items: center; gap: 6px; max-width: 220px; }
.promo-text { font-size: 11.5px; color: var(--text-secondary); word-break: break-all; flex: 1; min-width: 0; }
.copy-ic { flex-shrink: 0; border: none; background: var(--border); border-radius: 6px; width: 28px; height: 28px; cursor: pointer; font-size: 14px; }
.pay-ok { color: var(--success); font-size: 12px; font-weight: 600; }
.pay-bad { color: var(--danger); font-size: 12px; font-weight: 600; }
.badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.req { color: var(--danger); }
.tx { background: none; border: none; cursor: pointer; color: var(--text-muted); }
</style>
