<template>
  <div class="ul-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">系统</span>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">财务管理</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">项目打款</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">项目打款</h1>
          <p class="page-desc">
            按项目聚合展示打款概况；仅处理已审核未打款订单。交互见 prd-admin §8.1.1（Mock，列表每业务线 ≥20 条，默认每页 10 条）。
          </p>
        </div>
      </div>

      <div class="glass-card tab-nav-shell" role="tablist" aria-label="项目打款业务线">
        <div class="tab-nav">
          <button
            id="pp-tab-brand"
            type="button"
            class="tab-item"
            role="tab"
            :class="{ active: line === 'brand' }"
            :aria-selected="line === 'brand'"
            :tabindex="line === 'brand' ? 0 : -1"
            @click="switchLine('brand')"
          >
            品牌打款
          </button>
          <button
            id="pp-tab-overseas"
            type="button"
            class="tab-item"
            role="tab"
            :class="{ active: line === 'overseas' }"
            :aria-selected="line === 'overseas'"
            :tabindex="line === 'overseas' ? 0 : -1"
            @click="switchLine('overseas')"
          >
            海外打款
          </button>
        </div>
      </div>

      <div class="glass-card ul-filter-card pp-filter-card">
        <p class="page-desc pp-filter-hint" style="margin: 0 0 12px">
          项目 ID、项目名称为<strong>精确匹配</strong>；点击「查询」后生效。「查询全部」清空条件并展示当前业务线全量。
        </p>
        <div class="ul-filter-grid pp-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">项目 ID</label>
            <input v-model="filters.projectId" type="text" class="ul-input ul-mono" placeholder="如 100001" inputmode="numeric" />
          </div>
          <div class="ul-form-group">
            <label class="ul-label">项目名称</label>
            <input v-model="filters.projectName" type="text" class="ul-input" placeholder="须与列表名称完全一致" />
          </div>
          <div class="ul-form-group ul-form-group--checkbox">
            <label class="ul-label">快捷筛选</label>
            <label class="ul-check-line">
              <input v-model="filters.onlyPending" type="checkbox" />
              <span>仅展示存在「已审核、未打款」订单的项目</span>
            </label>
          </div>
        </div>
        <div class="ul-filter-footer">
          <span></span>
          <div style="display: flex; gap: 8px">
            <button type="button" class="btn btn-default btn-sm" @click="resetFilters">重置</button>
            <button type="button" class="btn btn-default btn-sm" @click="loadAll">查询全部</button>
            <button type="button" class="btn btn-primary btn-sm" @click="query">查询</button>
          </div>
        </div>
      </div>

      <div class="glass-card table-card" role="tabpanel" :aria-labelledby="line === 'brand' ? 'pp-tab-brand' : 'pp-tab-overseas'">
        <div class="table-header">
          <div class="table-title">项目列表<span class="table-count">共 {{ filtered.length }} 个项目</span></div>
          <div class="table-header-right">
            <button type="button" class="btn btn-primary btn-sm" :disabled="batchModalRows.length === 0" @click="openBatch">
              批量打款
            </button>
          </div>
        </div>
        <div v-if="selectedIds.length > 0" class="bulk-bar show" style="margin: 0 16px 12px">
          <span class="bulk-count">已选 <strong>{{ selectedIds.length }}</strong> 项</span>
          <button type="button" class="btn btn-primary btn-sm" :disabled="batchModalRows.length === 0" @click="openBatch">批量打款（已选）</button>
          <button type="button" class="btn btn-default btn-sm" @click="clearSelection">清空勾选</button>
        </div>
        <div class="ul-table-wrap" style="min-width: 1120px">
          <table class="ul-table ul-table--fixed ul-table--no-text-wrap ul-table--auto-row-h">
            <colgroup>
              <col style="width: 40px" />
              <col style="width: 9%" />
              <col style="width: 20%" />
              <col style="width: 9%" />
              <col style="width: 12%" />
              <col style="width: 12%" />
              <col style="width: 12%" />
              <col style="width: 12%" />
              <col class="col-action" style="width: 108px" />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    class="ul-checkbox"
                    :checked="pageAllChecked"
                    :disabled="pageSelectableIds.length === 0"
                    @change="togglePageAll($event)"
                  />
                </th>
                <th>项目 ID</th>
                <th>项目名称</th>
                <th>类型</th>
                <th class="th-num">累计已打款订单/笔</th>
                <th class="th-num">累计已打款金额/元</th>
                <th class="th-num">已审核未打款订单/笔</th>
                <th class="th-num">已审核未打款金额/元</th>
                <th class="col-action" style="text-align: center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pageRows" :key="row.id" class="ul-row">
                <td>
                  <input
                    type="checkbox"
                    class="ul-checkbox"
                    :disabled="row.pendingOrders === 0"
                    :checked="selectedIds.includes(row.id)"
                    @change="toggleRow(row.id)"
                  />
                </td>
                <td><span class="ul-mono">{{ row.projectId }}</span></td>
                <td style="font-weight: 600">{{ row.name }}</td>
                <td><span class="tag tag-blue">{{ row.kind }}</span></td>
                <td class="td-num">{{ row.paidOrders }}</td>
                <td class="td-num">{{ row.paidAmount.toFixed(2) }}</td>
                <td class="td-num">{{ row.pendingOrders }}</td>
                <td class="td-num">{{ row.pendingAmount.toFixed(2) }}</td>
                <td class="col-action">
                  <div class="action-btns" style="justify-content: center">
                    <button
                      type="button"
                      class="action-btn edit"
                      title="立即打款"
                      :disabled="row.pendingOrders === 0"
                      @click="openSingle(row)"
                    >
                      打款
                    </button>
                    <button type="button" class="action-btn view" title="打款日志" @click="openLog(row)">日志</button>
                  </div>
                </td>
              </tr>
              <tr v-if="pageRows.length === 0">
                <td colspan="9">
                  <div class="ul-empty">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                      <ellipse cx="12" cy="6" rx="8" ry="3" />
                      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
                      <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3V12" />
                    </svg>
                    <div style="font-size: 14px; font-weight: 600; color: var(--text-primary)">暂无数据</div>
                    <p class="page-desc" style="margin: 6px 0 0">请调整筛选条件或切换业务线后重试。</p>
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
            <input v-model="jumpInput" type="text" class="ul-input" style="width: 52px; height: 30px; padding: 0 8px; font-size: 12px" @keyup.enter="applyJump" />
            <button type="button" class="btn btn-default btn-sm" @click="applyJump">跳转</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 批量打款 -->
    <div class="ul-overlay" :class="{ show: batchOpen }" @click.self="batchOpen = false" />
    <div class="ul-modal flex-col" :class="{ show: batchOpen }" style="width: min(720px, 96vw)">
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
          仅针对列表中已勾选、且存在「已审核未打款」订单的项目；提交后不可撤销，请谨慎操作。
        </p>
        <p v-if="batchModalRows.length > 0" class="page-desc" style="margin: 0">
          本次共 <strong>{{ batchModalRows.length }}</strong> 个项目，涉及未打款订单 <strong>{{ batchTotalOrders }}</strong> 笔，待打款金额合计
          <strong class="td-num">{{ batchTotalAmount.toFixed(2) }}</strong> 元。
        </p>
        <div class="ul-table-wrap" style="max-height: 260px; overflow: auto; border: 1px solid var(--border); border-radius: 8px">
          <table class="ul-table ul-table--fixed ul-table--no-text-wrap">
            <colgroup>
              <col style="width: 22%" />
              <col />
              <col style="width: 18%" />
              <col style="width: 18%" />
            </colgroup>
            <thead>
              <tr>
                <th>项目 ID</th>
                <th>项目名称</th>
                <th class="th-num">已审核未打款订单/笔</th>
                <th class="th-num">已审核未打款金额/元</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in batchModalRows" :key="r.id" class="ul-row">
                <td class="ul-mono">{{ r.projectId }}</td>
                <td>{{ r.name }}</td>
                <td class="td-num">{{ r.pendingOrders }}</td>
                <td class="td-num">{{ r.pendingAmount.toFixed(2) }}</td>
              </tr>
              <tr v-if="batchModalRows.length === 0">
                <td colspan="4">
                  <div class="ul-empty">
                    <div style="font-size: 14px; font-weight: 600">请先在列表中勾选待打款项目</div>
                    <p class="page-desc" style="margin: 6px 0 0">仅「已审核未打款订单 &gt; 0」的项目可参与批量打款。</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <label class="ul-check-line" style="margin: 0">
          <input v-model="batchAckIrreversible" type="checkbox" />
          <span>我已阅读并确认：打款提交后<strong>不可撤销</strong>，且仅针对已审核未打款订单。</span>
        </label>
        <div class="ul-form-group">
          <label class="ul-label">打款密码 <span style="color: var(--danger)">*</span></label>
          <input v-model="batchPwd" type="password" class="ul-input" placeholder="密文传输，不落本地" autocomplete="off" />
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="batchOpen = false">取消</button>
        <button type="button" class="btn btn-primary" :disabled="!canSubmitBatch" @click="submitBatch">确定打款</button>
      </div>
    </div>

    <!-- 立即打款 -->
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
      <div v-if="singleRow" class="ul-modal-body fin-pay-body">
        <div class="fin-pay-summary glass-card">
          <div class="fin-pay-summary-title">打款摘要</div>
          <dl class="fin-pay-dl">
            <dt>项目 ID</dt>
            <dd class="ul-mono">{{ singleRow.projectId }}</dd>
            <dt>项目名称</dt>
            <dd>{{ singleRow.name }}</dd>
            <dt>订单日期</dt>
            <dd class="ul-mono">{{ singleOrderDate }}</dd>
            <dt>待打款笔数</dt>
            <dd class="td-num">{{ singleRow.pendingOrders }} 笔</dd>
            <dt>待打款金额</dt>
            <dd class="td-num">{{ singleRow.pendingAmount.toFixed(2) }} 元</dd>
          </dl>
        </div>
        <div class="ul-form-group" style="margin: 0">
          <label class="ul-label">订单日期</label>
          <input v-model="singleOrderDate" type="date" class="ul-input" />
        </div>
        <p class="fin-pay-warn">打款后不可撤销，请核对后再提交。</p>
        <label class="ul-check-line fin-pay-ack" style="margin: 0">
          <input v-model="singleAckIrreversible" type="checkbox" />
          <span>我确认上述金额与笔数无误，并知晓打款<strong>不可撤销</strong>。</span>
        </label>
        <div class="ul-form-group">
          <label class="ul-label">打款密码 <span style="color: var(--danger)">*</span></label>
          <input v-model="singlePwd" type="password" class="ul-input" autocomplete="off" />
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="singleOpen = false">取消</button>
        <button type="button" class="btn btn-primary" :disabled="!canSubmitSingle" @click="submitSingle">确定打款</button>
      </div>
    </div>

    <!-- 打款日志 -->
    <div class="ul-overlay" :class="{ show: logOpen }" @click.self="logOpen = false" />
    <div class="ul-modal flex-col" :class="{ show: logOpen }" style="width: min(960px, 98vw)">
      <div class="ul-modal-header">
        <div class="ul-modal-title">打款日志 — {{ logRow?.name }}</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="logOpen = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-modal-body">
        <p class="page-desc" style="margin: 0 0 12px">
          若存在失败订单，可重新选择订单日期后发起打款，仅失败订单参与再次打款。
        </p>
        <div class="ul-table-wrap pp-log-wide">
          <table class="ul-table ul-table--fixed ul-table--no-text-wrap">
            <colgroup>
              <col style="width: 11%" />
              <col style="width: 9%" />
              <col style="width: 9%" />
              <col style="width: 11%" />
              <col style="width: 11%" />
              <col style="width: 10%" />
              <col style="width: 39%" />
            </colgroup>
            <thead>
              <tr>
                <th>订单日期</th>
                <th class="th-num">成功笔数</th>
                <th class="th-num">失败笔数</th>
                <th class="th-num">成功金额</th>
                <th class="th-num">失败金额</th>
                <th>操作人</th>
                <th>操作时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(lg, i) in logPageRows" :key="i" class="ul-row">
                <td class="ul-mono">{{ lg.date }}</td>
                <td class="td-num">{{ lg.successCount }}</td>
                <td class="td-num">{{ lg.failCount }}</td>
                <td class="td-num">{{ lg.successAmount.toFixed(2) }}</td>
                <td class="td-num">{{ lg.failAmount.toFixed(2) }}</td>
                <td>{{ lg.operator }}</td>
                <td class="ul-muted ul-mono">{{ lg.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ul-pagination" style="margin-top: 12px">
          <span class="ul-page-info"
            >共 <strong>{{ logEntries.length }}</strong> 条，第 <strong>{{ logPage }}</strong> / <strong>{{ logTotalPages }}</strong> 页</span
          >
          <div style="display: flex; gap: 4px">
            <button type="button" class="ul-pg-btn" :disabled="logPage <= 1" @click="logPage--">‹</button>
            <button type="button" class="ul-pg-btn" :disabled="logPage >= logTotalPages" @click="logPage++">›</button>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted)">
            <span>每页</span>
            <select v-model.number="logPageSize" class="ul-pg-size" @change="logPage = 1">
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
            <span>跳至</span>
            <input v-model="logJumpInput" type="text" class="ul-input" style="width: 52px; height: 30px; padding: 0 8px; font-size: 12px" @keyup.enter="applyLogJump" />
            <button type="button" class="btn btn-default btn-sm" @click="applyLogJump">跳转</button>
          </div>
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="logOpen = false">关闭</button>
      </div>
    </div>

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

interface PayProj {
  id: string
  projectId: number
  name: string
  kind: string
  paidOrders: number
  paidAmount: number
  pendingOrders: number
  pendingAmount: number
}

interface LogRow {
  date: string
  successCount: number
  failCount: number
  successAmount: number
  failAmount: number
  operator: string
  time: string
}

const KINDS = ['推文', '短剧', '网盘', '游戏', '综合']
const PREFIX = ['番茄', '剪映', '夸克', '网易', '米哈游', '爱奇艺', '优酷', '腾讯']

function genProjects(kind: 'brand' | 'overseas', n: number): PayProj[] {
  return Array.from({ length: n }, (_, i) => {
    const pendingOrders = i % 5 === 0 ? 0 : (i % 6) + 1
    return {
      id: `${kind}-${i}`,
      projectId: kind === 'brand' ? 100001 + i : 200001 + i,
      name:
        kind === 'brand'
          ? `品牌-${String(i + 1).padStart(2, '0')} ${PREFIX[i % PREFIX.length]}联运`
          : `海外-${String(i + 1).padStart(2, '0')} ${PREFIX[(i + 2) % PREFIX.length]}区域`,
      kind: KINDS[i % KINDS.length],
      paidOrders: 12 + (i * 5) % 240,
      paidAmount: 8000 + i * 771.35,
      pendingOrders,
      pendingAmount: pendingOrders === 0 ? 0 : (i % 8) * 130.25 + 50,
    }
  })
}

const line = ref<'brand' | 'overseas'>('brand')
const applied = ref(false)
const filters = ref({ projectId: '', projectName: '', onlyPending: false })
const querySnapshot = ref({ ...filters.value })
const allBrand = ref(genProjects('brand', 22))
const allOverseas = ref(genProjects('overseas', 22))
const page = ref(1)
const pageSize = ref(10)
const jumpInput = ref('')
const selectedIds = ref<string[]>([])

const batchOpen = ref(false)
const batchPwd = ref('')
const batchAckIrreversible = ref(false)

const singleOpen = ref(false)
const singleRow = ref<PayProj | null>(null)
const singleOrderDate = ref('2026-04-28')
const singlePwd = ref('')
const singleAckIrreversible = ref(false)

const logOpen = ref(false)
const logRow = ref<PayProj | null>(null)
const logEntries = ref<LogRow[]>([])
const logPage = ref(1)
const logPageSize = ref(10)
const logJumpInput = ref('')

useEscCloseStack([
  { isOpen: () => logOpen.value, close: () => (logOpen.value = false) },
  { isOpen: () => singleOpen.value, close: () => (singleOpen.value = false) },
  { isOpen: () => batchOpen.value, close: () => (batchOpen.value = false) },
])

watch(batchOpen, (v) => {
  if (!v) {
    batchAckIrreversible.value = false
    batchPwd.value = ''
  }
})
watch(singleOpen, (v) => {
  if (!v) {
    singleAckIrreversible.value = false
    singlePwd.value = ''
  }
})

const sourceList = computed(() => (line.value === 'brand' ? allBrand.value : allOverseas.value))

const filtered = computed(() => {
  const src = sourceList.value
  if (!applied.value) return src
  const f = querySnapshot.value
  let rows = src
  if (f.projectId.trim()) rows = rows.filter((r) => String(r.projectId) === f.projectId.trim())
  if (f.projectName.trim()) rows = rows.filter((r) => r.name === f.projectName.trim())
  if (f.onlyPending) rows = rows.filter((r) => r.pendingOrders > 0)
  return rows
})

const batchModalRows = computed(() =>
  filtered.value.filter((r) => selectedIds.value.includes(r.id) && r.pendingOrders > 0)
)

const batchTotalOrders = computed(() => batchModalRows.value.reduce((s, r) => s + r.pendingOrders, 0))
const batchTotalAmount = computed(() => batchModalRows.value.reduce((s, r) => s + r.pendingAmount, 0))

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const pageRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

const pageSelectableIds = computed(() => pageRows.value.filter((r) => r.pendingOrders > 0).map((r) => r.id))

const pageAllChecked = computed(
  () => pageSelectableIds.value.length > 0 && pageSelectableIds.value.every((id) => selectedIds.value.includes(id))
)

const pageNums = computed(() => {
  const out: number[] = []
  const s = Math.max(1, page.value - 2)
  const e = Math.min(totalPages.value, page.value + 2)
  for (let i = s; i <= e; i++) out.push(i)
  return out
})

watch([filtered, pageSize], () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})

watch(page, (p) => {
  jumpInput.value = String(p)
})

function switchLine(v: 'brand' | 'overseas') {
  line.value = v
  page.value = 1
  jumpInput.value = '1'
  selectedIds.value = []
}

function resetFilters() {
  filters.value = { projectId: '', projectName: '', onlyPending: false }
  querySnapshot.value = { ...filters.value }
  applied.value = false
  page.value = 1
  selectedIds.value = []
}

function loadAll() {
  filters.value = { projectId: '', projectName: '', onlyPending: false }
  querySnapshot.value = { ...filters.value }
  applied.value = false
  page.value = 1
  selectedIds.value = []
  toast('已展示当前业务线全量列表', 'info')
}

function query() {
  querySnapshot.value = { ...filters.value }
  applied.value = true
  page.value = 1
  selectedIds.value = []
  toast(`查询完成，共 ${filtered.value.length} 个项目`, 'info')
}

function goPage(p: number) {
  page.value = Math.min(Math.max(1, p), totalPages.value)
  jumpInput.value = String(page.value)
}

function applyJump() {
  const n = parseInt(jumpInput.value.trim(), 10)
  if (Number.isNaN(n) || n < 1) {
    toast('请输入有效页码', 'warning')
    return
  }
  goPage(Math.min(n, totalPages.value))
}

function togglePageAll(e: Event) {
  const on = (e.target as HTMLInputElement).checked
  const ids = pageSelectableIds.value
  if (on) {
    const set = new Set([...selectedIds.value, ...ids])
    selectedIds.value = [...set]
  } else {
    selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id))
  }
}

function toggleRow(id: string) {
  const i = selectedIds.value.indexOf(id)
  if (i >= 0) selectedIds.value = selectedIds.value.filter((x) => x !== id)
  else selectedIds.value = [...selectedIds.value, id]
}

function clearSelection() {
  selectedIds.value = []
}

function openBatch() {
  if (batchModalRows.value.length === 0) {
    toast('请勾选至少一个存在「已审核未打款」订单的项目', 'warning')
    return
  }
  batchPwd.value = ''
  batchAckIrreversible.value = false
  batchOpen.value = true
}

const canSubmitBatch = computed(
  () =>
    batchModalRows.value.length > 0 &&
    batchPwd.value.trim().length > 0 &&
    batchAckIrreversible.value
)

function submitBatch() {
  toast('Mock：批量打款请求已提交（打款密码已随请求体发送）', 'success')
  batchOpen.value = false
  selectedIds.value = []
}

function openSingle(row: PayProj) {
  singleRow.value = row
  singleOrderDate.value = '2026-04-28'
  singlePwd.value = ''
  singleAckIrreversible.value = false
  singleOpen.value = true
}

const canSubmitSingle = computed(
  () => !!singlePwd.value.trim() && singleAckIrreversible.value && !!singleRow.value
)

function submitSingle() {
  toast(`Mock：已对「${singleRow.value?.name}」发起单笔打款`, 'success')
  singleOpen.value = false
}

function genLogRows(n: number): LogRow[] {
  const ops = ['财务A', '财务B', '财务C', '系统自动']
  return Array.from({ length: n }, (_, i) => {
    const ok = i % 6 !== 0
    const successCount = ok ? 8 + (i % 5) : 2 + (i % 3)
    const failCount = ok ? 0 : 1
    const successAmount = ok ? 1200 + i * 33 : 400 + i * 10
    const failAmount = ok ? 0 : 88 + i
    return {
      date: `2026-04-${String(28 - (i % 20)).padStart(2, '0')}`,
      successCount,
      failCount,
      successAmount,
      failAmount,
      operator: ops[i % ops.length],
      time: `2026.4.${28 - (i % 20)} ${10 + (i % 12)}:${String(i % 60).padStart(2, '0')}:00`,
    }
  })
}

function openLog(row: PayProj) {
  logRow.value = row
  logPage.value = 1
  logJumpInput.value = '1'
  logEntries.value = genLogRows(22)
  logOpen.value = true
}

const logTotalPages = computed(() => Math.max(1, Math.ceil(logEntries.value.length / logPageSize.value)))
const logPageRows = computed(() => {
  const s = (logPage.value - 1) * logPageSize.value
  return logEntries.value.slice(s, s + logPageSize.value)
})

watch(logPage, (p) => {
  logJumpInput.value = String(p)
})

function applyLogJump() {
  const n = parseInt(logJumpInput.value.trim(), 10)
  if (Number.isNaN(n) || n < 1) {
    toast('请输入有效页码', 'warning')
    return
  }
  logPage.value = Math.min(n, logTotalPages.value)
}

interface ToastItem {
  id: number
  msg: string
  type: 'info' | 'success' | 'error' | 'warning'
}
const toasts = ref<ToastItem[]>([])
let tid = 0
function toast(msg: string, type: ToastItem['type'] = 'info') {
  const id = ++tid
  toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 2800)
}
function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

jumpInput.value = '1'
</script>

<style scoped>
.pp-filter-card {
  border: 1px solid var(--border);
}
.pp-filter-grid {
  gap: 14px 18px;
}
.pp-filter-hint strong {
  color: var(--text-primary);
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
.pp-log-wide {
  min-width: 720px;
  overflow-x: auto;
}
.ul-form-group--checkbox {
  grid-column: span 2;
}
.ul-check-line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  line-height: 1.5;
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
