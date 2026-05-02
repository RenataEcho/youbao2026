<template>
  <div class="ul-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">系统</span>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">财务管理</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">分红打款</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">分红打款</h1>
          <p class="page-desc">
            统计分销相关打款记录；表头统计随当前筛选刷新。交互与字段见 prd-admin §8.1.2（Mock ≥24 条，默认每页 10 条）。
          </p>
        </div>
      </div>

      <div class="glass-card oo-stat-strip">
        <div class="oo-stat-slot">
          <span class="oo-stat-dot is-ok"></span>
          <span class="oo-stat-lab">已打款订单数</span>
          <span class="dp-stat-em">{{ headerStats.paidOrderCount }} 笔</span>
        </div>
        <div class="oo-stat-slot">
          <span class="oo-stat-dot is-warn"></span>
          <span class="oo-stat-lab">已打款总额</span>
          <span class="badge oo-stat-money badge-success">¥{{ fmtMoney(headerStats.paidAmount) }}</span>
        </div>
      </div>

      <div class="glass-card ul-filter-card">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">订单日期起</label>
            <input v-model="filters.orderStart" type="date" class="ul-input" />
          </div>
          <div class="ul-form-group">
            <label class="ul-label">订单日期止</label>
            <input v-model="filters.orderEnd" type="date" class="ul-input" />
          </div>
          <div class="ul-form-group">
            <label class="ul-label">结算日期起</label>
            <input v-model="filters.settleStart" type="date" class="ul-input" />
          </div>
          <div class="ul-form-group">
            <label class="ul-label">结算日期止</label>
            <input v-model="filters.settleEnd" type="date" class="ul-input" />
          </div>
          <div class="ul-form-group">
            <label class="ul-label">打款状态</label>
            <select v-model="filters.payoutStatus" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="none">未打款</option>
              <option value="running">自动执行中</option>
              <option value="full">全部已打款</option>
              <option value="partial">部分打款成功</option>
            </select>
          </div>
        </div>
        <div class="ul-filter-footer">
          <span></span>
          <div style="display: flex; gap: 8px">
            <button type="button" class="btn btn-default btn-sm" @click="resetFilters">重置</button>
            <button type="button" class="btn btn-primary btn-sm" @click="runQuery">查询</button>
          </div>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">
            分红打款列表<span class="table-count">共 {{ filtered.length }} 条</span>
          </div>
        </div>
        <div class="ul-table-wrap" style="min-width: 1100px">
          <table class="ul-table ul-table--fixed ul-table--no-text-wrap ul-table--auto-row-h">
            <colgroup>
              <col style="width: 6%" />
              <col style="width: 9%" />
              <col style="width: 9%" />
              <col style="width: 7%" />
              <col style="width: 9%" />
              <col style="width: 7%" />
              <col style="width: 9%" />
              <col style="width: 10%" />
              <col style="width: 26%" />
              <col class="col-action" style="width: 108px" />
            </colgroup>
            <thead>
              <tr>
                <th>ID</th>
                <th>订单日期</th>
                <th class="th-num">邀请分红金额</th>
                <th class="th-num">邀请分红订单</th>
                <th class="th-num">团队分红金额</th>
                <th class="th-num">团队分红订单</th>
                <th>应打款日期</th>
                <th>打款状态</th>
                <th>打款进度</th>
                <th class="col-action" style="text-align: center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pageRows.length === 0">
                <td colspan="10">
                  <div class="ul-empty">
                    <div style="font-size: 14px; font-weight: 600; color: var(--text-primary)">暂无数据</div>
                    <p class="page-desc" style="margin: 6px 0 0">请调整筛选后重试。</p>
                  </div>
                </td>
              </tr>
              <tr v-for="row in pageRows" :key="row.id" class="ul-row">
                <td><span class="ul-mono">{{ row.id }}</span></td>
                <td class="ul-mono">{{ row.orderDate }}</td>
                <td class="td-num">{{ row.inviteDividendAmount.toFixed(2) }}</td>
                <td class="td-num">{{ row.inviteDividendOrderCount }}</td>
                <td class="td-num">{{ row.teamDividendAmount.toFixed(2) }}</td>
                <td class="td-num">{{ row.teamDividendOrderCount }}</td>
                <td class="ul-mono">{{ row.duePayoutDate }}</td>
                <td><span class="badge" :class="statusBadge(row.status)">{{ statusLabel(row.status) }}</span></td>
                <td class="td-wrap">
                  <div class="dp-prog">
                    <div class="dp-prog-track" role="progressbar" :aria-valuenow="progressPct(row)" aria-valuemin="0" aria-valuemax="100">
                      <div class="dp-prog-fill" :style="{ width: `${progressPct(row)}%` }"></div>
                    </div>
                    <div class="dp-prog-cap">{{ progressPct(row).toFixed(2) }}%</div>
                    <div class="dp-prog-lines">
                      邀请关系分红：{{ row.invitePaid.toFixed(2) }} / {{ row.inviteDue.toFixed(2) }}（{{ row.inviteOrdDone }}/{{ row.inviteOrdTotal }}）<br />
                      团队关系分红：{{ row.teamPaid.toFixed(2) }} / {{ row.teamDue.toFixed(2) }}（{{ row.teamOrdDone }}/{{ row.teamOrdTotal }}）
                    </div>
                  </div>
                </td>
                <td class="col-action">
                  <div class="action-btns action-btns--stack">
                    <button
                      type="button"
                      class="action-btn reject"
                      :disabled="row.status !== 'partial'"
                      :title="row.status === 'partial' ? '对失败打款记录二次确认后重试' : '仅「部分打款成功」可用'"
                      @click="row.status === 'partial' && openRetry(row)"
                    >
                      失败重试
                    </button>
                    <button type="button" class="action-btn view" title="操作日志" @click="openLog(row)">操作日志</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="filtered.length > 0" class="ul-pagination">
          <span class="ul-page-info"
            >共 <strong>{{ filtered.length }}</strong> 条，第 <strong>{{ page }}</strong> / <strong>{{ totalPages }}</strong> 页</span
          >
          <div style="display: flex; align-items: center; gap: 4px">
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(1)">«</button>
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(page - 1)">‹</button>
            <button
              v-for="p in pageNums"
              :key="p"
              type="button"
              class="ul-pg-btn"
              :class="{ active: p === page }"
              @click="goPage(p)"
            >
              {{ p }}
            </button>
            <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(page + 1)">›</button>
            <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(totalPages)">»</button>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted)">
            <span>每页</span>
            <select v-model.number="pageSize" class="ul-pg-size" @change="page = 1">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
            <span>条</span>
            <span style="margin-left: 8px">跳至</span>
            <input
              v-model="jumpInput"
              type="text"
              class="ul-input"
              style="width: 52px; height: 30px; padding: 0 8px; font-size: 12px"
              @keyup.enter="applyJump"
            />
            <button type="button" class="btn btn-default btn-sm" @click="applyJump">跳转</button>
          </div>
        </div>
      </div>
    </div>

    <div class="ul-overlay" :class="{ show: retryOpen }" @click.self="retryOpen = false" />
    <div class="ul-modal flex-col fin-pay-modal" :class="{ show: retryOpen }" style="width: min(640px, 96vw)">
      <div class="ul-modal-header">
        <div class="ul-modal-title">失败重试 — 订单日期 {{ retryRow?.orderDate }}</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="retryOpen = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-modal-body fin-pay-body">
        <p class="fin-pay-warn" style="margin: 0">
          将对下列未成功打款的分销子项重新发起打款（Mock）。重试不可自动撤销，请核对失败原因后再操作。
        </p>
        <div class="ul-table-wrap" style="max-height: 240px; overflow: auto; border: 1px solid var(--border); border-radius: var(--radius-md, 10px)">
          <table class="ul-table ul-table--fixed ul-table--no-text-wrap">
            <colgroup>
              <col style="width: 28%" />
              <col style="width: 14%" />
              <col style="width: 18%" />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>子项 ID</th>
                <th>链路</th>
                <th class="th-num">金额</th>
                <th>失败原因</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in failItems" :key="f.id" class="ul-row">
                <td class="ul-mono">{{ f.id }}</td>
                <td>{{ f.link }}</td>
                <td class="td-num">{{ f.amount.toFixed(2) }}</td>
                <td class="ul-muted">{{ f.reason }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <label class="ul-check-line fin-pay-ack" style="margin: 0">
          <input v-model="retryAck" type="checkbox" />
          <span>我已核对失败明细，确认发起<strong>失败重试</strong>且知晓操作风险。</span>
        </label>
        <div class="ul-form-group">
          <label class="ul-label">打款密码 <span style="color: var(--danger)">*</span></label>
          <input v-model="retryPwd" type="password" class="ul-input" autocomplete="off" placeholder="请输入打款密码" />
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="retryOpen = false">取消</button>
        <button type="button" class="btn btn-primary" :disabled="!canSubmitRetry" @click="submitRetry">确认重试</button>
      </div>
    </div>

    <div class="ul-overlay" :class="{ show: logOpen }" @click.self="logOpen = false" />
    <aside class="ul-drawer" :class="{ show: logOpen }" style="width: min(960px, 98vw)" @click.stop>
      <div class="ul-drawer-header">
        <div class="ul-drawer-title">操作日志 — {{ logRow?.orderDate }}</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="logOpen = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-drawer-body">
        <div class="ul-table-wrap dp-log-wide">
          <table class="ul-table ul-table--fixed ul-table--no-text-wrap ul-table--auto-row-h">
            <colgroup>
              <col style="width: 10%" />
              <col style="width: 11%" />
              <col style="width: 8%" />
              <col style="width: 11%" />
              <col style="width: 8%" />
              <col style="width: 12%" />
              <col style="width: 40%" />
            </colgroup>
            <thead>
              <tr>
                <th>订单日期</th>
                <th class="th-num">邀请分红金额</th>
                <th class="th-num">邀请分红订单</th>
                <th class="th-num">团队分红金额</th>
                <th class="th-num">团队分红订单</th>
                <th>执行人</th>
                <th>执行时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(lg, i) in logEntries" :key="i" class="ul-row">
                <td class="ul-mono">{{ lg.orderDate }}</td>
                <td class="td-num">{{ lg.inviteAmt.toFixed(2) }}</td>
                <td class="td-num">{{ lg.inviteOrd }}</td>
                <td class="td-num">{{ lg.teamAmt.toFixed(2) }}</td>
                <td class="td-num">{{ lg.teamOrd }}</td>
                <td>{{ lg.operator }}</td>
                <td class="ul-mono">{{ lg.executedAt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </aside>

    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type">
        <span style="flex: 1">{{ t.msg }}</span>
        <button type="button" class="ul-toast-close" aria-label="关闭通知" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEscCloseStack } from '@/composables/useEscCloseStack'
import { computed, ref, watch } from 'vue'

export type DividendPayoutStatus = 'none' | 'running' | 'full' | 'partial'

export interface DividendPaymentRow {
  id: number
  orderDate: string
  settlementDate: string
  inviteDividendAmount: number
  inviteDividendOrderCount: number
  teamDividendAmount: number
  teamDividendOrderCount: number
  duePayoutDate: string
  status: DividendPayoutStatus
  invitePaid: number
  inviteDue: number
  inviteOrdDone: number
  inviteOrdTotal: number
  teamPaid: number
  teamDue: number
  teamOrdDone: number
  teamOrdTotal: number
  settledOrderCount: number
  settledAmount: number
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + 'T12:00:00')
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function buildRows(n: number): DividendPaymentRow[] {
  const rows: DividendPaymentRow[] = []
  const statusCycle: DividendPayoutStatus[] = ['none', 'running', 'full', 'partial']
  for (let i = 1; i <= n; i++) {
    const day = ((i % 26) + 1).toString().padStart(2, '0')
    const orderDate = `2026-04-${day}`
    const status = statusCycle[i % 4]
    const inviteDue = Math.round((400 + (i % 9) * 55.12) * 100) / 100
    const teamDue = Math.round((300 + (i % 7) * 44.08) * 100) / 100
    const inviteOrdTotal = 20 + (i % 11)
    const teamOrdTotal = 15 + (i % 9)
    let invitePaid = 0
    let teamPaid = 0
    let inviteOrdDone = 0
    let teamOrdDone = 0
    if (status === 'full') {
      invitePaid = inviteDue
      teamPaid = teamDue
      inviteOrdDone = inviteOrdTotal
      teamOrdDone = teamOrdTotal
    } else if (status === 'running') {
      invitePaid = Math.round(inviteDue * 0.45 * 100) / 100
      teamPaid = Math.round(teamDue * 0.3 * 100) / 100
      inviteOrdDone = Math.floor(inviteOrdTotal * 0.4)
      teamOrdDone = Math.floor(teamOrdTotal * 0.25)
    } else if (status === 'partial') {
      invitePaid = Math.round(inviteDue * 0.72 * 100) / 100
      teamPaid = Math.round(teamDue * 0.5 * 100) / 100
      inviteOrdDone = Math.floor(inviteOrdTotal * 0.8)
      teamOrdDone = Math.floor(teamOrdTotal * 0.4)
    }
    const settledOrderCount =
      status === 'none' ? 0 : status === 'full' ? inviteOrdTotal + teamOrdTotal : inviteOrdDone + teamOrdDone
    const settledAmount = status === 'none' ? 0 : invitePaid + teamPaid
    rows.push({
      id: 8800 + i,
      orderDate,
      settlementDate: addDays(orderDate, 2),
      inviteDividendAmount: inviteDue,
      inviteDividendOrderCount: inviteOrdTotal,
      teamDividendAmount: teamDue,
      teamDividendOrderCount: teamOrdTotal,
      duePayoutDate: addDays(orderDate, 30),
      status,
      invitePaid,
      inviteDue,
      inviteOrdDone,
      inviteOrdTotal,
      teamPaid,
      teamDue,
      teamOrdDone,
      teamOrdTotal,
      settledOrderCount,
      settledAmount,
    })
  }
  return rows
}

const source = ref(buildRows(28))
const applied = ref(false)
const filters = ref({
  orderStart: '',
  orderEnd: '',
  settleStart: '',
  settleEnd: '',
  payoutStatus: '' as '' | DividendPayoutStatus,
})
const querySnapshot = ref({ ...filters.value })

const page = ref(1)
const pageSize = ref(10)
const jumpInput = ref('')

const filtered = computed(() => {
  if (!applied.value) return source.value
  const f = querySnapshot.value
  let out = source.value.filter((r) => {
    if (f.payoutStatus && r.status !== f.payoutStatus) return false
    if (f.orderStart && r.orderDate < f.orderStart) return false
    if (f.orderEnd && r.orderDate > f.orderEnd) return false
    if (f.settleStart && r.settlementDate < f.settleStart) return false
    if (f.settleEnd && r.settlementDate > f.settleEnd) return false
    return true
  })
  return out
})

const headerStats = computed(() => {
  let paidOrderCount = 0
  let paidAmount = 0
  for (const r of filtered.value) {
    if (r.status !== 'full' && r.status !== 'partial') continue
    paidOrderCount += r.settledOrderCount
    paidAmount += r.settledAmount
  }
  return { paidOrderCount, paidAmount }
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const pageRows = computed(() => {
  const s = (page.value - 1) * pageSize.value
  return filtered.value.slice(s, s + pageSize.value)
})
const pageNums = computed(() => {
  const t = totalPages.value
  const c = page.value
  const arr: number[] = []
  for (let i = Math.max(1, c - 2); i <= Math.min(t, c + 2); i++) arr.push(i)
  return arr
})

const retryOpen = ref(false)
const retryRow = ref<DividendPaymentRow | null>(null)
const failItems = ref<{ id: string; link: string; amount: number; reason: string }[]>([])
const retryPwd = ref('')
const retryAck = ref(false)

const logOpen = ref(false)
const logRow = ref<DividendPaymentRow | null>(null)
const logEntries = ref<
  { orderDate: string; inviteAmt: number; inviteOrd: number; teamAmt: number; teamOrd: number; operator: string; executedAt: string }[]
>([])

useEscCloseStack([
  { isOpen: () => retryOpen.value, close: () => (retryOpen.value = false) },
  { isOpen: () => logOpen.value, close: () => (logOpen.value = false) },
])

watch(retryOpen, (v) => {
  if (!v) {
    retryPwd.value = ''
    retryAck.value = false
  }
})

const canSubmitRetry = computed(
  () => retryPwd.value.trim().length > 0 && retryAck.value && failItems.value.length > 0
)

const toasts = ref<{ id: number; msg: string; type: 'success' | 'error' | 'info' }[]>([])
let toastId = 0
function showToast(msg: string, type: 'success' | 'error' | 'info' = 'info') {
  const id = ++toastId
  toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 2600)
}
function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

function fmtMoney(n: number) {
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function statusLabel(s: DividendPayoutStatus) {
  return { none: '未打款', running: '自动执行中', full: '全部已打款', partial: '部分打款成功' }[s]
}

function statusBadge(s: DividendPayoutStatus) {
  return { none: 'badge-gray', running: 'badge-warning', full: 'badge-success', partial: 'badge-warning' }[s]
}

function progressPct(row: DividendPaymentRow) {
  const denom = row.inviteDue + row.teamDue
  if (denom <= 0) return 0
  return Math.min(100, ((row.invitePaid + row.teamPaid) / denom) * 100)
}

function runQuery() {
  querySnapshot.value = { ...filters.value }
  applied.value = true
  page.value = 1
}

function resetFilters() {
  filters.value = { orderStart: '', orderEnd: '', settleStart: '', settleEnd: '', payoutStatus: '' }
  querySnapshot.value = { ...filters.value }
  applied.value = false
  page.value = 1
}

function goPage(p: number) {
  page.value = Math.min(Math.max(1, p), totalPages.value)
}

function applyJump() {
  const n = parseInt(String(jumpInput.value).trim(), 10)
  if (!Number.isFinite(n) || n < 1) {
    jumpInput.value = ''
    return
  }
  goPage(n)
  jumpInput.value = ''
}

function openRetry(row: DividendPaymentRow) {
  retryRow.value = row
  failItems.value = [
    { id: `F-${row.id}-1`, link: '邀请', amount: row.inviteDue - row.invitePaid, reason: '通道超时' },
    { id: `F-${row.id}-2`, link: '团队', amount: row.teamDue - row.teamPaid, reason: '余额校验失败' },
  ].filter((x) => x.amount > 0.009)
  retryPwd.value = ''
  retryAck.value = false
  retryOpen.value = true
}

function submitRetry() {
  if (!canSubmitRetry.value) return
  showToast('已提交失败重试（Mock）', 'success')
  retryOpen.value = false
}

function openLog(row: DividendPaymentRow) {
  logRow.value = row
  logEntries.value = [
    {
      orderDate: row.orderDate,
      inviteAmt: row.inviteDue - row.invitePaid,
      inviteOrd: row.inviteOrdTotal - row.inviteOrdDone,
      teamAmt: row.teamDue - row.teamPaid,
      teamOrd: row.teamOrdTotal - row.teamOrdDone,
      operator: row.status === 'running' ? '系统自动' : '财务-001',
      executedAt: '2026-04-29 18:32:05',
    },
    {
      orderDate: row.orderDate,
      inviteAmt: 0,
      inviteOrd: 0,
      teamAmt: 12.5,
      teamOrd: 1,
      operator: '系统自动',
      executedAt: '2026-04-29 18:40:00',
    },
  ]
  logOpen.value = true
}
</script>

<style scoped>
.oo-stat-strip {
  padding: 14px 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px 28px;
  align-items: center;
}
.oo-stat-slot {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.oo-stat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
  flex-shrink: 0;
}
.oo-stat-dot.is-warn {
  background: var(--warning);
}
.oo-stat-dot.is-ok {
  background: var(--success);
}
.oo-stat-lab {
  font-size: 12px;
  color: var(--text-muted);
}
.oo-stat-money {
  font-size: 12px;
  font-weight: 700;
  padding: 2px 10px;
}
.dp-stat-em {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}
.dp-prog {
  min-width: 0;
}
.dp-prog-track {
  height: 6px;
  border-radius: 4px;
  background: var(--border);
  overflow: hidden;
}
.dp-prog-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--primary), #60a5fa);
  transition: width 0.2s ease;
}
.dp-prog-cap {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}
.dp-prog-lines {
  margin-top: 6px;
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.45;
}
.fin-pay-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.fin-pay-warn {
  margin: 0;
  font-size: 13px;
  color: var(--danger);
  font-weight: 600;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(220, 38, 38, 0.08);
}
.fin-pay-ack {
  margin: 0;
}
.dp-log-wide {
  min-width: 0;
  overflow-x: auto;
}
.ul-toast-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px 8px;
  border-radius: 4px;
}
.ul-toast-close:hover {
  color: var(--text-primary);
  background: var(--surface-hover);
}
</style>
