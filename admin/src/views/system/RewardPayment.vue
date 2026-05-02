<template>
  <div class="ul-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">系统</span>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">财务管理</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">奖励打款</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">奖励打款</h1>
          <p class="page-desc">
            统一对奖励模块打款，仅已审核数据进入本列表。交互见 prd-admin §8.1.3（Mock ≥24 条，默认每页 10 条）。
          </p>
        </div>
      </div>

      <div class="glass-card oo-stat-strip">
        <div class="oo-stat-slot">
          <span class="oo-stat-dot is-warn"></span>
          <span class="oo-stat-lab">已审核未打款订单</span>
          <span class="rp-stat-count">{{ headerStats.unpaidOrders }} 笔</span>
        </div>
        <div class="oo-stat-slot">
          <span class="oo-stat-dot is-ok"></span>
          <span class="oo-stat-lab">已审核已打款金额</span>
          <span class="badge oo-stat-money badge-success">¥{{ fmtMoney(headerStats.paidAmount) }}</span>
        </div>
      </div>

      <div class="glass-card ul-filter-card rp-filter-card">
        <div class="ul-filter-grid rp-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">订单日期起</label>
            <input v-model="filters.orderStart" type="date" class="ul-input" />
          </div>
          <div class="ul-form-group">
            <label class="ul-label">订单日期止</label>
            <input v-model="filters.orderEnd" type="date" class="ul-input" />
          </div>
          <div class="ul-form-group">
            <label class="ul-label">打款日期起</label>
            <input v-model="filters.payoutStart" type="date" class="ul-input" />
          </div>
          <div class="ul-form-group">
            <label class="ul-label">打款日期止</label>
            <input v-model="filters.payoutEnd" type="date" class="ul-input" />
          </div>
          <div class="ul-form-group">
            <label class="ul-label">打款状态</label>
            <select v-model="filters.payoutStatus" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="unpaid">未打款</option>
              <option value="paying">打款中</option>
              <option value="paid">已打款</option>
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
            奖励打款列表<span class="table-count">共 {{ filtered.length }} 条</span>
          </div>
          <div class="table-header-right">
            <button type="button" class="btn btn-primary btn-sm" @click="openBatch">批量打款</button>
          </div>
        </div>
        <div v-if="selectedIds.length > 0" class="bulk-bar show" style="margin: 0 16px 12px">
          <span class="bulk-count">已选 <strong>{{ selectedIds.length }}</strong></span>
          <button type="button" class="btn btn-primary btn-sm" @click="openBatch">批量打款（已选）</button>
          <button type="button" class="btn btn-default btn-sm" @click="clearSelection">取消</button>
        </div>
        <div class="ul-table-wrap" style="min-width: 1180px">
          <table class="ul-table ul-table--fixed ul-table--no-text-wrap ul-table--auto-row-h">
            <colgroup>
              <col style="width: 40px" />
              <col style="width: 5%" />
              <col style="width: 8%" />
              <col style="width: 7%" />
              <col style="width: 12%" />
              <col style="width: 8%" />
              <col style="width: 9%" />
              <col style="width: 9%" />
              <col style="width: 8%" />
              <col style="width: 11%" />
              <col style="width: 11%" />
              <col class="col-action" style="width: 108px" />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" class="ul-checkbox" :checked="allChecked" @change="toggleAll" />
                </th>
                <th>ID</th>
                <th>订单日期</th>
                <th>奖励类型</th>
                <th>项目名称</th>
                <th class="th-num">已审核未打款订单</th>
                <th class="th-num">已审核未打款金额</th>
                <th class="th-num">已审核已打款订单</th>
                <th class="th-num">已审核已打款金额</th>
                <th>打款时间</th>
                <th>创建时间</th>
                <th class="col-action" style="text-align: center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pageRows.length === 0">
                <td colspan="12">
                  <div class="ul-empty">
                    <div style="font-size: 14px; font-weight: 600; color: var(--text-primary)">暂无数据</div>
                    <p class="page-desc" style="margin: 6px 0 0">请调整筛选后重试。</p>
                  </div>
                </td>
              </tr>
              <tr v-for="row in pageRows" :key="row.id" class="ul-row">
                <td>
                  <input type="checkbox" class="ul-checkbox" :checked="selectedIds.includes(row.id)" @change="toggleRow(row.id)" />
                </td>
                <td><span class="ul-mono">{{ row.id }}</span></td>
                <td class="ul-mono">{{ row.orderDate }}</td>
                <td>
                  <span class="tag" :class="rewardTypeTag(row.rewardType)">{{ rewardTypeLabel(row.rewardType) }}</span>
                </td>
                <td>{{ projectCell(row) }}</td>
                <td class="td-num">{{ row.auditedUnpaidOrderCount }}</td>
                <td class="td-num">{{ row.auditedUnpaidAmount.toFixed(2) }}</td>
                <td class="td-num">{{ row.auditedPaidOrderCount }}</td>
                <td class="td-num">{{ row.auditedPaidAmount.toFixed(2) }}</td>
                <td class="ul-mono">{{ row.payoutTime || '—' }}</td>
                <td class="ul-mono">{{ row.createTime }}</td>
                <td class="col-action">
                  <div class="action-btns" style="justify-content: center">
                    <button
                      type="button"
                      class="action-btn edit"
                      title="立即打款"
                      :disabled="row.payoutStatus !== 'unpaid' && row.payoutStatus !== 'paying'"
                      @click="openSingle(row)"
                    >
                      打款
                    </button>
                    <button type="button" class="action-btn view" title="打款日志" @click="openLog(row)">日志</button>
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

    <div class="ul-overlay" :class="{ show: batchOpen }" @click.self="batchOpen = false" />
    <div class="ul-modal flex-col" :class="{ show: batchOpen }" style="width: min(640px, 96vw)">
      <div class="ul-modal-header">
        <div class="ul-modal-title">批量打款</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="batchOpen = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-modal-body" style="display: flex; flex-direction: column; gap: 14px">
        <p class="page-desc" style="margin: 0; color: var(--danger); font-weight: 600">
          仅针对已审核未打款部分；提交后不可撤销，请核对后再操作。
        </p>
        <p class="page-desc" style="margin: 0">
          已选 <strong>{{ batchTargets.length }}</strong> 条，涉及未打款订单
          <strong>{{ batchTotalOrders }}</strong> 笔，待打款金额合计
          <strong class="td-num">{{ batchTotalAmount.toFixed(2) }}</strong> 元。
        </p>
        <div v-if="batchTargets.length > 0" class="ul-table-wrap" style="max-height: 220px; overflow: auto; margin-top: 4px">
          <table class="ul-table ul-table--fixed ul-table--no-text-wrap">
            <colgroup>
              <col style="width: 72px" />
              <col style="width: 100px" />
              <col style="width: 28%" />
              <col style="width: 12%" />
              <col style="width: 14%" />
            </colgroup>
            <thead>
              <tr>
                <th>ID</th>
                <th>订单日期</th>
                <th>项目名称</th>
                <th class="th-num">未打款笔数</th>
                <th class="th-num">待打款金额</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in batchTargets" :key="r.id" class="ul-row">
                <td class="ul-mono">{{ r.id }}</td>
                <td class="ul-mono">{{ r.orderDate }}</td>
                <td>{{ projectCell(r) }}</td>
                <td class="td-num">{{ r.auditedUnpaidOrderCount }}</td>
                <td class="td-num">{{ r.auditedUnpaidAmount.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <label class="ul-check-line" style="margin: 0">
          <input v-model="batchAck" type="checkbox" />
          <span>我确认上述汇总无误，并知晓打款<strong>不可撤销</strong>。</span>
        </label>
        <div class="ul-form-group">
          <label class="ul-label">打款密码 <span style="color: var(--danger)">*</span></label>
          <input v-model="batchPwd" type="password" class="ul-input" autocomplete="off" placeholder="请输入打款密码" />
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="batchOpen = false">取消</button>
        <button type="button" class="btn btn-primary" :disabled="!canSubmitBatch" @click="submitBatch">确定打款</button>
      </div>
    </div>

    <div class="ul-overlay" :class="{ show: singleOpen }" @click.self="singleOpen = false" />
    <div class="ul-modal flex-col fin-pay-modal" :class="{ show: singleOpen }" style="width: min(520px, 96vw)">
      <div class="ul-modal-header">
        <div class="ul-modal-title">立即打款</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="singleOpen = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-modal-body fin-pay-body">
        <div class="fin-pay-summary glass-card">
          <div class="fin-pay-summary-title">打款摘要</div>
          <dl class="fin-pay-dl">
            <dt>订单日期</dt>
            <dd class="ul-mono">{{ singleRow?.orderDate }}</dd>
            <dt>奖励类型</dt>
            <dd>{{ singleRow ? rewardTypeLabel(singleRow.rewardType) : '—' }}</dd>
            <dt>已审核未打款订单</dt>
            <dd class="td-num">{{ singleRow?.auditedUnpaidOrderCount ?? 0 }} 笔</dd>
            <dt>待打款金额</dt>
            <dd class="td-num">{{ singleRow ? singleRow.auditedUnpaidAmount.toFixed(2) : '0.00' }} 元</dd>
          </dl>
        </div>
        <p class="fin-pay-warn">打款后不可撤销，请核对后再提交。</p>
        <label class="ul-check-line fin-pay-ack">
          <input v-model="singleAck" type="checkbox" />
          <span>我确认上述信息无误，并知晓打款<strong>不可撤销</strong>。</span>
        </label>
        <div class="ul-form-group">
          <label class="ul-label">打款密码 <span style="color: var(--danger)">*</span></label>
          <input v-model="singlePwd" type="password" class="ul-input" autocomplete="off" placeholder="请输入打款密码" />
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="singleOpen = false">取消</button>
        <button type="button" class="btn btn-primary" :disabled="!canSubmitSingle" @click="submitSingle">确定打款</button>
      </div>
    </div>

    <div class="ul-overlay" :class="{ show: logOpen }" @click.self="logOpen = false" />
    <div class="ul-modal flex-col" :class="{ show: logOpen }" style="width: min(960px, 98vw)">
      <div class="ul-modal-header">
        <div class="ul-modal-title">打款日志 — ID {{ logRow?.id }}</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="logOpen = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-modal-body">
        <div class="ul-table-wrap fin-log-wide">
          <table class="ul-table ul-table--fixed ul-table--no-text-wrap">
            <colgroup>
              <col style="width: 150px" />
              <col style="width: 100px" />
              <col style="width: 88px" />
              <col style="width: 88px" />
              <col style="width: 110px" />
              <col style="width: 110px" />
              <col style="width: 72px" />
            </colgroup>
            <thead>
              <tr>
                <th>操作时间</th>
                <th>操作人</th>
                <th class="th-num">成功笔数</th>
                <th class="th-num">失败笔数</th>
                <th class="th-num">成功金额</th>
                <th class="th-num">失败金额</th>
                <th>结果</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(lg, i) in logEntries" :key="i" class="ul-row">
                <td class="ul-mono">{{ lg.time }}</td>
                <td>{{ lg.operator }}</td>
                <td class="td-num">{{ lg.successCount }}</td>
                <td class="td-num">{{ lg.failCount }}</td>
                <td class="td-num">{{ lg.successAmount.toFixed(2) }}</td>
                <td class="td-num">{{ lg.failAmount.toFixed(2) }}</td>
                <td><span class="badge" :class="lg.ok ? 'badge-success' : 'badge-danger'">{{ lg.ok ? '成功' : '失败' }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="logOpen = false">关闭</button>
      </div>
    </div>

    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type">
        <span style="flex: 1">{{ t.msg }}</span>
        <button type="button" class="ul-toast-close" aria-label="关闭" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEscCloseStack } from '@/composables/useEscCloseStack'
import { computed, ref, watch } from 'vue'

export type RewardType = 'brand' | 'overseas' | 'other'
export type RewardPayoutStatus = 'unpaid' | 'paying' | 'paid'

export interface RewardPaymentRow {
  id: number
  orderDate: string
  rewardType: RewardType
  projectName: string | null
  auditedUnpaidOrderCount: number
  auditedUnpaidAmount: number
  auditedPaidOrderCount: number
  auditedPaidAmount: number
  payoutTime: string | null
  createTime: string
  payoutStatus: RewardPayoutStatus
}

const brands = ['番茄小说', '剪映模板', '夸克网盘']

function buildRows(n: number): RewardPaymentRow[] {
  const rows: RewardPaymentRow[] = []
  const st: RewardPayoutStatus[] = ['unpaid', 'paying', 'paid']
  for (let i = 1; i <= n; i++) {
    const day = ((i % 26) + 1).toString().padStart(2, '0')
    const orderDate = `2026-04-${day}`
    const rewardType: RewardType = i % 5 === 0 ? 'other' : i % 2 === 0 ? 'brand' : 'overseas'
    const payoutStatus = st[i % 3]
    const unpaid = payoutStatus === 'paid' ? 0 : (i % 6) + 2
    const auditedUnpaidAmount =
      unpaid === 0 ? 0 : Math.round(unpaid * (38.5 + (i % 7) * 6.25 + (i % 3)) * 100) / 100
    const paidAmt = payoutStatus === 'unpaid' ? 0 : payoutStatus === 'paying' ? Math.round((200 + i * 17) * 0.4 * 100) / 100 : Math.round((200 + i * 17) * 100) / 100
    const paidOrd =
      payoutStatus === 'unpaid' ? 0 : payoutStatus === 'paying' ? Math.floor((i % 4) + 1) : Math.floor((i % 9) + 3)
    rows.push({
      id: 9900 + i,
      orderDate,
      rewardType,
      projectName: rewardType === 'other' ? null : brands[i % brands.length],
      auditedUnpaidOrderCount: unpaid,
      auditedUnpaidAmount,
      auditedPaidOrderCount: paidOrd,
      auditedPaidAmount: paidAmt,
      payoutTime: payoutStatus === 'paid' ? `2026-04-${String(Math.min(29, Number(day) + 1)).padStart(2, '0')} 10:${String((i * 7) % 60).padStart(2, '0')}:00` : null,
      createTime: `2026-04-${day} 08:00:00`,
      payoutStatus,
    })
  }
  return rows
}

const source = ref(buildRows(28))
const applied = ref(false)
const filters = ref({
  orderStart: '',
  orderEnd: '',
  payoutStart: '',
  payoutEnd: '',
  payoutStatus: '' as '' | RewardPayoutStatus,
})
const querySnapshot = ref({ ...filters.value })

const page = ref(1)
const pageSize = ref(10)
const jumpInput = ref('')
const selectedIds = ref<number[]>([])

const filtered = computed(() => {
  if (!applied.value) return source.value
  const f = querySnapshot.value
  return source.value.filter((r) => {
    if (f.payoutStatus && r.payoutStatus !== f.payoutStatus) return false
    if (f.orderStart && r.orderDate < f.orderStart) return false
    if (f.orderEnd && r.orderDate > f.orderEnd) return false
    if (f.payoutStart && (!r.payoutTime || r.payoutTime.slice(0, 10) < f.payoutStart)) return false
    if (f.payoutEnd && (!r.payoutTime || r.payoutTime.slice(0, 10) > f.payoutEnd)) return false
    return true
  })
})

const headerStats = computed(() => {
  let unpaidOrders = 0
  let paidAmount = 0
  for (const r of filtered.value) {
    unpaidOrders += r.auditedUnpaidOrderCount
    paidAmount += r.auditedPaidAmount
  }
  return { unpaidOrders, paidAmount }
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

const allChecked = computed(
  () => pageRows.value.length > 0 && pageRows.value.every((r) => selectedIds.value.includes(r.id))
)

function toggleAll(e: Event) {
  const on = (e.target as HTMLInputElement).checked
  const ids = pageRows.value.map((r) => r.id)
  if (on) {
    const set = new Set(selectedIds.value)
    ids.forEach((id) => set.add(id))
    selectedIds.value = [...set]
  } else {
    selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id))
  }
}

function toggleRow(id: number) {
  const i = selectedIds.value.indexOf(id)
  if (i >= 0) selectedIds.value = selectedIds.value.filter((_, j) => j !== i)
  else selectedIds.value = [...selectedIds.value, id]
}

function clearSelection() {
  selectedIds.value = []
}

const batchOpen = ref(false)
const batchPwd = ref('')
const batchAck = ref(false)
const singleOpen = ref(false)
const singleRow = ref<RewardPaymentRow | null>(null)
const singlePwd = ref('')
const singleAck = ref(false)
const logOpen = ref(false)
const logRow = ref<RewardPaymentRow | null>(null)
const logEntries = ref<
  {
    time: string
    operator: string
    successCount: number
    failCount: number
    successAmount: number
    failAmount: number
    ok: boolean
  }[]
>([])

const toasts = ref<{ id: number; msg: string; type: 'success' | 'error' | 'info' }[]>([])
let toastId = 0

useEscCloseStack([
  { isOpen: () => logOpen.value, close: () => (logOpen.value = false) },
  { isOpen: () => singleOpen.value, close: () => (singleOpen.value = false) },
  { isOpen: () => batchOpen.value, close: () => (batchOpen.value = false) },
])

watch(batchOpen, (v) => {
  if (!v) {
    batchAck.value = false
    batchPwd.value = ''
  }
})
watch(singleOpen, (v) => {
  if (!v) {
    singleAck.value = false
    singlePwd.value = ''
  }
})

const batchTargets = computed(() => filtered.value.filter((r) => selectedIds.value.includes(r.id)))

const batchTotalOrders = computed(() => batchTargets.value.reduce((s, r) => s + r.auditedUnpaidOrderCount, 0))
const batchTotalAmount = computed(() => batchTargets.value.reduce((s, r) => s + r.auditedUnpaidAmount, 0))

const canSubmitBatch = computed(
  () =>
    batchAck.value &&
    batchPwd.value.trim().length >= 4 &&
    batchTargets.value.length > 0 &&
    batchTotalOrders.value > 0
)
const canSubmitSingle = computed(() => singleAck.value && singlePwd.value.trim().length >= 4 && !!singleRow.value)

function fmtMoney(n: number) {
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function rewardTypeLabel(t: RewardType) {
  return { brand: '品牌', overseas: '海外', other: '其他' }[t]
}

function rewardTypeTag(t: RewardType) {
  return { brand: 'tag-blue', overseas: 'tag-purple', other: 'tag-gray' }[t]
}

function projectCell(row: RewardPaymentRow) {
  if (row.rewardType === 'other') return '—'
  return row.projectName || '—'
}

function runQuery() {
  querySnapshot.value = { ...filters.value }
  applied.value = true
  page.value = 1
  selectedIds.value = []
}

function resetFilters() {
  filters.value = { orderStart: '', orderEnd: '', payoutStart: '', payoutEnd: '', payoutStatus: '' }
  querySnapshot.value = { ...filters.value }
  applied.value = false
  page.value = 1
  selectedIds.value = []
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

function openBatch() {
  if (selectedIds.value.length === 0) {
    showToast('请先勾选需要批量打款的记录', 'error')
    return
  }
  const payable = batchTargets.value.filter(
    (r) => (r.payoutStatus === 'unpaid' || r.payoutStatus === 'paying') && r.auditedUnpaidOrderCount > 0
  )
  if (payable.length === 0) {
    showToast('所选记录中没有待打款订单', 'error')
    return
  }
  batchOpen.value = true
}

function submitBatch() {
  showToast('已提交批量打款（Mock）', 'success')
  batchOpen.value = false
  selectedIds.value = []
}

function openSingle(row: RewardPaymentRow) {
  singleRow.value = row
  singleOpen.value = true
}

function submitSingle() {
  showToast('已提交单笔打款（Mock）', 'success')
  singleOpen.value = false
}

function openLog(row: RewardPaymentRow) {
  logRow.value = row
  logEntries.value = [
    { time: '2026-04-28 09:12:33', operator: '财务-002', successCount: 12, failCount: 1, successAmount: 1888, failAmount: 120, ok: false },
    { time: '2026-04-27 16:00:01', operator: '系统自动', successCount: 5, failCount: 0, successAmount: 620, failAmount: 0, ok: true },
  ]
  logOpen.value = true
}

function showToast(msg: string, type: 'success' | 'error' | 'info' = 'info') {
  const id = ++toastId
  toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 2600)
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
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
.rp-stat-count {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}
.bulk-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.rp-filter-card {
  border: 1px solid var(--border);
}
.rp-filter-grid {
  gap: 14px 18px;
}
.fin-pay-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.fin-pay-summary {
  padding: 14px 16px;
  border-radius: var(--radius-md, 10px);
}
.fin-pay-summary-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
}
.fin-pay-dl {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 8px 12px;
  margin: 0;
  font-size: 13px;
}
.fin-pay-dl dt {
  color: var(--text-muted);
  margin: 0;
}
.fin-pay-dl dd {
  margin: 0;
  font-weight: 600;
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
.fin-log-wide {
  min-width: 720px;
  overflow-x: auto;
}
</style>
