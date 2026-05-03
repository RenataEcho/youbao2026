<template>
  <div class="ul-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">运营</span>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">运营配置</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">兑换码管理</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">兑换码管理</h1>
          </div>
          <p class="page-desc">批次列表与单码明细；prd-admin §7.1.5（Mock，批次 ≥20 条，默认每页 10 条；抽屉内明细 ≥20 条）。</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" @click="createOpen = true">新增批次</button>
      </div>

      <PrdTipMarker
        :anchor-el="prdTipAnchorRef"
        :tip-id="1"
        module-name="兑换码管理（页头汇总）"
        :markdown="OPS_TIP_COUPON"
      />

      <div ref="prdTipFilterRef" class="glass-card ul-filter-card">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">标题 / 备注</label>
            <input v-model="f.kw" type="text" class="ul-input" placeholder="匹配批次标题、备注或 ID" />
          </div>
          <div class="ul-form-group">
            <label class="ul-label">状态</label>
            <select v-model="f.status" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="进行中">进行中</option>
              <option value="已结束">已结束</option>
            </select>
          </div>
        </div>
        <div class="ul-filter-footer">
          <span class="ul-hint">筛选结果 {{ filteredBatches.length }} 条 / 全量 {{ batches.length }} 条</span>
          <div style="display: flex; gap: 8px">
            <button type="button" class="btn btn-default btn-sm" @click="resetBatchFilter">重置</button>
            <button type="button" class="btn btn-primary btn-sm" @click="listPg.resetPage()">查询</button>
          </div>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">批次列表<span class="table-count">本页 {{ listPg.pageRows.length }} 条</span></div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <thead>
              <tr>
                <th>ID</th>
                <th>批次标题</th>
                <th class="th-num">兑换码数量</th>
                <th class="th-num">已兑换数量</th>
                <th>兑换码类型</th>
                <th>备注</th>
                <th>批次状态</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th ref="prdTipOpsRef" class="col-action" style="text-align: center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in listPg.pageRows" :key="b.id" class="ul-row">
                <td class="ul-mono">{{ b.id }}</td>
                <td style="font-weight: 600">{{ b.title }}</td>
                <td class="td-num">{{ b.total }}</td>
                <td class="td-num">{{ b.used }}</td>
                <td><span class="tag tag-amber">{{ b.type }}</span></td>
                <td class="ul-muted" style="font-size: 12px">{{ b.remark }}</td>
                <td>
                  <span class="badge" :class="b.batchStatus === '进行中' ? 'badge-success' : 'badge-gray'">{{ b.batchStatus }}</span>
                </td>
                <td>{{ b.creator }}</td>
                <td class="ul-muted" style="font-size: 12px">{{ b.createdAt }}</td>
                <td class="col-action">
                  <div class="action-btns" style="justify-content: center">
                    <button type="button" class="action-btn view" title="查看" @click="openCodes(b)">查看</button>
                  </div>
                </td>
              </tr>
              <tr v-if="listPg.pageRows.length === 0">
                <td colspan="10">
                  <div class="ul-empty">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="2" y="6" width="20" height="12" rx="2" /></svg>
                    <div class="ul-empty-title">暂无批次</div>
                    <p class="ul-empty-desc">请调整筛选条件。</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="filteredBatches.length > 0" class="ul-pagination">
          <span class="ul-page-info"
            >共 <strong>{{ filteredBatches.length }}</strong> 条，第 <strong>{{ listPg.page }}</strong> / <strong>{{ listPg.totalPages }}</strong> 页</span
          >
          <div style="display: flex; gap: 4px">
            <button type="button" class="ul-pg-btn" :disabled="listPg.page <= 1" @click="listPg.goPage(1)">«</button>
            <button type="button" class="ul-pg-btn" :disabled="listPg.page <= 1" @click="listPg.goPage(listPg.page - 1)">‹</button>
            <button
              v-for="p in listPg.pageNums"
              :key="p"
              type="button"
              class="ul-pg-btn"
              :class="{ active: p === listPg.page }"
              @click="listPg.goPage(p)"
            >
              {{ p }}
            </button>
            <button type="button" class="ul-pg-btn" :disabled="listPg.page >= listPg.totalPages" @click="listPg.goPage(listPg.page + 1)">›</button>
            <button type="button" class="ul-pg-btn" :disabled="listPg.page >= listPg.totalPages" @click="listPg.goPage(listPg.totalPages)">»</button>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted)">
            <span>每页</span>
            <select v-model.number="listPageSize" class="ul-pg-size" @change="listPg.resetPage()">
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
            <span>跳至</span>
            <input
              v-model="listPg.jumpInput"
              type="text"
              class="ul-input"
              style="width: 52px; height: 30px; padding: 0 8px; font-size: 12px"
              @keyup.enter="listPg.applyJump"
            />
            <button type="button" class="btn btn-default btn-sm" @click="listPg.applyJump">跳转</button>
          </div>
        </div>
      </div>

      <PrdTipMarker
        variant="filterCard"
        :anchor-el="prdTipFilterRef"
        :tip-id="2"
        module-name="兑换码管理 · 筛选区"
        :markdown="OPS_TIP_COUPON_FILTER"
      />
      <PrdTipMarker
        variant="opsHeader"
        :anchor-el="prdTipOpsRef"
        :tip-id="3"
        module-name="兑换码管理 · 操作列"
        :markdown="OPS_TIP_COUPON_OPS"
      />
    </div>

    <div class="ul-overlay" :class="{ show: createOpen }" @click.self="createOpen = false" />
    <div class="ul-modal flex-col" :class="{ show: createOpen }" style="width: 420px">
      <div class="ul-modal-header">
        <div class="ul-modal-title">新增兑换码批次</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="createOpen = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-modal-body" style="display: flex; flex-direction: column; gap: 12px">
        <div class="ul-form-group">
          <label class="ul-label">选择兑换类型</label>
          <select v-model="create.type" class="ul-input ul-select">
            <option value="D1G 会员">D1G 会员</option>
            <option value="素人 KOC">素人 KOC</option>
            <option value="超萌">超萌</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">设置生成总数</label>
          <input v-model.number="create.n" type="number" min="1" class="ul-input" />
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="createOpen = false">取消</button>
        <button type="button" class="btn btn-primary" @click="doCreate">生成</button>
      </div>
    </div>

    <div class="ul-overlay" :class="{ show: codeDw }" @click.self="codeDw = false" />
    <aside class="ul-drawer" :class="{ show: codeDw }" style="width: min(640px, 96vw)" @click.stop>
      <div class="ul-drawer-header">
        <div class="ul-drawer-title">批次明细 — {{ curBatch?.id }}</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="codeDw = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-drawer-body">
        <div class="table-header table-header--drawer-toolbar">
          <div class="table-title">兑换码<span class="table-count">本页 {{ codePg.pageRows.length }} 条 / 共 {{ codeRows.length }} 条</span></div>
          <div class="table-header-right">
            <button type="button" class="btn btn-default btn-sm" @click="batchDisableSelected">批量禁用</button>
            <button type="button" class="btn btn-default btn-sm" @click="toast('批量下载 Mock', 'info')">批量下载</button>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <thead>
              <tr>
                <th style="width: 44px">
                  <input
                    type="checkbox"
                    :checked="codeAllChecked"
                    :indeterminate="codeIndeterminate"
                    :disabled="codeRows.length === 0"
                    @change="toggleCodeAll"
                  />
                </th>
                <th>兑换码</th>
                <th>是否兑换</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in codePg.pageRows" :key="c.code" class="ul-row">
                <td><input type="checkbox" :checked="codeSel.has(c.code)" :disabled="c.redeemed" @change="(ev) => toggleCodeOne(c.code, ev)" /></td>
                <td class="ul-mono">{{ c.code }}</td>
                <td>{{ c.redeemed ? '是' : '否' }}</td>
                <td>
                  <span class="badge" :class="c.state === '正常' ? 'badge-success' : 'badge-gray'">{{ c.state }}</span>
                </td>
              </tr>
              <tr v-if="codePg.pageRows.length === 0 && codeRows.length === 0">
                <td colspan="4">
                  <div class="ul-empty">
                    <div class="ul-empty-title">暂无兑换码</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="codeRows.length > 0" class="ul-pagination">
          <span class="ul-page-info"
            >共 <strong>{{ codeRows.length }}</strong> 条，第 <strong>{{ codePg.page }}</strong> / <strong>{{ codePg.totalPages }}</strong> 页</span
          >
          <div style="display: flex; gap: 4px">
            <button type="button" class="ul-pg-btn" :disabled="codePg.page <= 1" @click="codePg.goPage(1)">«</button>
            <button type="button" class="ul-pg-btn" :disabled="codePg.page <= 1" @click="codePg.goPage(codePg.page - 1)">‹</button>
            <button
              v-for="p in codePg.pageNums"
              :key="p"
              type="button"
              class="ul-pg-btn"
              :class="{ active: p === codePg.page }"
              @click="codePg.goPage(p)"
            >
              {{ p }}
            </button>
            <button type="button" class="ul-pg-btn" :disabled="codePg.page >= codePg.totalPages" @click="codePg.goPage(codePg.page + 1)">›</button>
            <button type="button" class="ul-pg-btn" :disabled="codePg.page >= codePg.totalPages" @click="codePg.goPage(codePg.totalPages)">»</button>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted)">
            <span>每页</span>
            <select v-model.number="codePageSize" class="ul-pg-size" @change="codePg.resetPage()">
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
            <span>跳至</span>
            <input
              v-model="codePg.jumpInput"
              type="text"
              class="ul-input"
              style="width: 52px; height: 30px; padding: 0 8px; font-size: 12px"
              @keyup.enter="codePg.applyJump"
            />
            <button type="button" class="btn btn-default btn-sm" @click="codePg.applyJump">跳转</button>
          </div>
        </div>
      </div>
      <div class="ul-drawer-footer">
        <button type="button" class="btn btn-default" @click="codeDw = false">关闭</button>
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
import PrdTipMarker from '@/components/prd/PrdTipMarker.vue'
import { useEscCloseStack } from '@/composables/useEscCloseStack'
import { useOpsListPagination } from '@/composables/useOpsListPagination'
import {
  OPS_TIP_COUPON,
  OPS_TIP_COUPON_FILTER,
  OPS_TIP_COUPON_OPS,
} from '@/prd-tips/opsDomainTips'
import { computed, ref } from 'vue'
import { useSimpleToast } from './useOpsToast'

interface Batch {
  id: string
  title: string
  total: number
  used: number
  type: string
  remark: string
  batchStatus: string
  creator: string
  createdAt: string
}

function genBatches(n: number): Batch[] {
  const types = ['D1G 会员', '素人 KOC', '超萌']
  return Array.from({ length: n }, (_, i) => ({
    id: `CP${200 + i}`,
    title: `权益批次-${String(i + 1).padStart(2, '0')}-${(i * 11) % 50}`,
    total: 50 + (i % 10) * 20,
    used: (i * 7) % 45,
    type: types[i % 3],
    remark: `批次备注-${i + 1}-${(i * 13) % 100}`,
    batchStatus: i % 9 === 0 ? '已结束' : '进行中',
    creator: ['运营A', '运营B'][i % 2],
    createdAt: `2026-04-${String((i % 28) + 1).padStart(2, '0')} 09:00`,
  }))
}

const { toasts, toast, removeToast } = useSimpleToast()
const prdTipAnchorRef = ref<HTMLElement | null>(null)
const prdTipFilterRef = ref<HTMLElement | null>(null)
const prdTipOpsRef = ref<HTMLElement | null>(null)
const f = ref({ kw: '', status: '' })
const batches = ref(genBatches(22))

const filteredBatches = computed(() =>
  batches.value.filter((b) => {
    const hay = `${b.title}${b.remark}${b.id}`
    if (f.value.kw && !hay.includes(f.value.kw)) return false
    if (f.value.status && b.batchStatus !== f.value.status) return false
    return true
  })
)

const listPageSize = ref(10)
const listPg = useOpsListPagination(filteredBatches, listPageSize, (msg) => toast(msg, 'error'))

function resetBatchFilter() {
  f.value = { kw: '', status: '' }
  listPg.resetPage()
}

const createOpen = ref(false)
const create = ref({ type: 'D1G 会员', n: 100 })
const codeDw = ref(false)
const curBatch = ref<Batch | null>(null)

useEscCloseStack([
  { isOpen: () => codeDw.value, close: () => (codeDw.value = false) },
  { isOpen: () => createOpen.value, close: () => (createOpen.value = false) },
])

function doCreate() {
  toast(`Mock：已创建批次，类型 ${create.value.type}，数量 ${create.value.n}`, 'success')
  createOpen.value = false
}

interface CodeRow {
  code: string
  redeemed: boolean
  state: string
}

const codeRows = ref<CodeRow[]>([])
const codeSel = ref(new Set<string>())
const codePageSize = ref(10)
const codePg = useOpsListPagination(codeRows, codePageSize, (msg) => toast(msg, 'error'))

function genCodes(batchId: string, n: number): CodeRow[] {
  return Array.from({ length: n }, (_, i) => ({
    code: `RHS-${batchId}-${1000 + i}-K7M2`,
    redeemed: i % 5 === 0,
    state: i % 11 === 0 ? '禁用' : '正常',
  }))
}

function openCodes(b: Batch) {
  curBatch.value = b
  codeRows.value = genCodes(b.id, 22)
  codeSel.value = new Set()
  codePg.resetPage()
  codeDw.value = true
}

const selectableCodes = computed(() => codeRows.value.filter((c) => !c.redeemed).map((c) => c.code))
const codeAllChecked = computed(
  () => selectableCodes.value.length > 0 && selectableCodes.value.every((c) => codeSel.value.has(c))
)
const codeIndeterminate = computed(() => {
  const n = selectableCodes.value.filter((c) => codeSel.value.has(c)).length
  return n > 0 && n < selectableCodes.value.length
})

function toggleCodeAll(e: Event) {
  const on = (e.target as HTMLInputElement).checked
  codeSel.value = on ? new Set(selectableCodes.value) : new Set()
}

function toggleCodeOne(code: string, ev: Event) {
  const on = (ev.target as HTMLInputElement).checked
  const next = new Set(codeSel.value)
  if (on) next.add(code)
  else next.delete(code)
  codeSel.value = next
}

function batchDisableSelected() {
  if (!codeSel.value.size) {
    toast('请先勾选未兑换的兑换码', 'warning')
    return
  }
  toast(`Mock：已对 ${codeSel.value.size} 条执行批量禁用`, 'success')
  codeRows.value = codeRows.value.map((r) => (codeSel.value.has(r.code) ? { ...r, state: '禁用' } : r))
  codeSel.value = new Set()
}
</script>
