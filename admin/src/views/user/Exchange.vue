<template>
  <div class="exc-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户管理</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">兑换记录</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">兑换记录</h1>
          </div>
          <p class="page-desc">记录用户使用兑换码的操作历史</p>
        </div>
        <button class="btn btn-default btn-sm" @click="showToast('正在导出 Excel…','info')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          导出 Excel
        </button>
      </div>

      <!-- 筛选 -->
      <div ref="prdTipFilterRef" class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">用户ID</label>
            <input v-model="f.userId" class="ul-input" placeholder="请输入用户ID">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">兑换码</label>
            <input v-model="f.redeemCode" class="ul-input" placeholder="请输入兑换码">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">兑换码类型</label>
            <select v-model="f.codeType" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="D1G会员">D1G会员</option>
              <option value="超萌会员">超萌会员</option>
              <option value="素人KOC">素人KOC</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">用户身份</label>
            <select v-model="f.userRole" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="创作者">创作者</option>
            </select>
          </div>
          <template v-if="filterExpanded">
            <div class="ul-form-group">
              <label class="ul-label">兑换开始时间</label>
              <input v-model="f.timeStart" type="date" class="ul-input">
            </div>
            <div class="ul-form-group">
              <label class="ul-label">兑换结束时间</label>
              <input v-model="f.timeEnd" type="date" class="ul-input">
            </div>
          </template>
        </div>
        <div class="ul-filter-footer">
          <button class="ul-expand-btn" :class="{ expanded: filterExpanded }" @click="filterExpanded = !filterExpanded">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            {{ filterExpanded ? '收起筛选' : '展开更多筛选' }}
          </button>
          <div style="display:flex;gap:8px">
            <button class="btn btn-default btn-sm" @click="resetFilter">重置</button>
            <button class="btn btn-primary btn-sm" @click="fetchList(1)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              查询
            </button>
          </div>
        </div>
      </div>

      <!-- 数据表 -->
      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">兑换记录<span class="table-count">共 {{ total.toLocaleString() }} 条</span></div>
        </div>
        <div class="exc-table-wrap">
          <table class="exc-table">
            <colgroup>
              <col style="width:70px">
              <col style="min-width:120px">
              <col style="min-width:100px">
              <col style="min-width:110px">
              <col style="min-width:120px">
              <col style="min-width:160px">
            </colgroup>
            <thead>
              <tr>
                <th>序号</th>
                <th>用户ID</th>
                <th>用户身份</th>
                <th>兑换码</th>
                <th>兑换码类型</th>
                <th>兑换时间</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 8" :key="i"><td colspan="6"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td colspan="6">
                  <div class="ul-empty">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="0.9"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                    <div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin:8px 0 4px">暂无兑换记录</div>
                    <div style="font-size:12px;color:var(--text-muted)">尝试调整筛选条件</div>
                  </div>
                </td></tr>
              </template>
              <template v-else>
                <tr v-for="row in list" :key="row.id" class="ul-row">
                  <td class="ul-muted" style="font-size:12px">{{ row.id }}</td>
                  <td><span class="ul-mono" style="font-size:12px">{{ row.userId }}</span></td>
                  <td>
                    <span class="tag tag-blue">{{ row.userRole }}</span>
                  </td>
                  <td><span class="ul-mono" style="font-size:12px;letter-spacing:1px">{{ row.redeemCode }}</span></td>
                  <td>
                    <span class="tag" :class="codeTypeClass(row.codeType)">{{ row.codeType }}</span>
                  </td>
                  <td class="ul-muted">{{ row.redeemTime }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ total.toLocaleString() }}</strong> 条，第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
          <div style="display:flex;align-items:center;gap:4px">
            <button class="ul-pg-btn" :disabled="page<=1" @click="fetchList(1)">«</button>
            <button class="ul-pg-btn" :disabled="page<=1" @click="fetchList(page-1)">‹</button>
            <template v-for="p in paginationPages" :key="p">
              <button v-if="p !== '...'" class="ul-pg-btn" :class="{ active: p === page }" @click="fetchList(Number(p))">{{ p }}</button>
              <span v-else style="padding:0 4px;color:var(--text-muted);font-size:13px">...</span>
            </template>
            <button class="ul-pg-btn" :disabled="page>=totalPages" @click="fetchList(page+1)">›</button>
            <button class="ul-pg-btn" :disabled="page>=totalPages" @click="fetchList(totalPages)">»</button>
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)">
            每页
            <select class="ul-pg-size" @change="(e) => { pageSize = Number((e.target as HTMLSelectElement).value); fetchList(1) }">
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

interface ExchangeItem {
  id: number; userId: string; userRole: string
  redeemCode: string; codeType: string; redeemTime: string
}
interface Toast { id: number; msg: string; type: string }

const loading = ref(false)
const list = ref<ExchangeItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const filterExpanded = ref(false)
const toasts = ref<Toast[]>([])
let toastId = 0

const f = ref({ userId: '', redeemCode: '', codeType: '', userRole: '', timeStart: '', timeEnd: '' })

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginationPages = computed(() => {
  const t = totalPages.value, c = page.value
  const pages: (number | string)[] = []
  if (t <= 7) { for (let i = 1; i <= t; i++) pages.push(i); return pages }
  pages.push(1)
  if (c > 3) pages.push('...')
  for (let i = Math.max(2, c - 1); i <= Math.min(t - 1, c + 1); i++) pages.push(i)
  if (c < t - 2) pages.push('...')
  pages.push(t)
  return pages
})

const CODE_TYPES = ['D1G会员', '超萌会员', '素人KOC']
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function genCode(seed: number) {
  let r = ''
  for (let i = 0; i < 8; i++) r += CODE_CHARS[(seed * 31 + i * 17 + 7) % CODE_CHARS.length]
  return r
}

function mockList(n = 20): ExchangeItem[] {
  return Array.from({ length: n }, (_, i) => {
    const idx = (page.value - 1) * pageSize.value + i + 1
    return {
      id: idx,
      userId: `U${10024 + ((idx * 37) % 800)}`,
      userRole: '创作者',
      redeemCode: genCode(idx * 13 + 7),
      codeType: CODE_TYPES[idx % 3],
      redeemTime: `2026-0${(idx % 3) + 1}-${String((idx % 28) + 1).padStart(2, '0')} ${String(8 + (idx % 12)).padStart(2, '0')}:${String(idx % 60).padStart(2, '0')}:${String((idx * 7) % 60).padStart(2, '0')}`,
    }
  })
}

function codeTypeClass(t: string) {
  return { 'D1G会员': 'tag-purple', '超萌会员': 'tag-pink', '素人KOC': 'tag-amber' }[t] || 'tag-gray'
}

async function fetchList(p = 1) {
  loading.value = true; page.value = p
  await new Promise(r => setTimeout(r, 180))
  list.value = mockList(pageSize.value); total.value = 3256
  loading.value = false
}
function resetFilter() {
  f.value = { userId: '', redeemCode: '', codeType: '', userRole: '', timeStart: '', timeEnd: '' }
  fetchList(1)
}
function showToast(msg: string, type = 'info') { const id = ++toastId; toasts.value.push({ id, msg, type }); setTimeout(() => removeToast(id), 3000) }
function removeToast(id: number) { toasts.value = toasts.value.filter(t => t.id !== id) }
onMounted(() => fetchList())
</script>

<style>
.exc-wrap { min-height: 100%; }
.exc-table-wrap { overflow-x: auto; }
.exc-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.exc-table th { padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text-muted); background: var(--surface-hover); border-bottom: 1px solid var(--border); white-space: nowrap; }
.exc-table td { padding: 10px 12px; border-bottom: 1px solid var(--border); color: var(--text-primary); vertical-align: middle; }
.exc-table tr:last-child td { border-bottom: none; }
.exc-table .ul-row:hover td { background: rgba(37,99,235,.03); }
</style>
