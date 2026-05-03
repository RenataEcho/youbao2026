<template>
  <div class="ul-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">运营</span>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">运营配置</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">Banner管理</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">Banner管理</h1>
          </div>
          <p class="page-desc">各展示位 Banner 与跳转配置；prd-admin §7.1.2（Mock，全量 ≥20 条，默认每页 10 条）。</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" @click="openDrawer()">新增 Banner</button>
      </div>

      <PrdTipMarker
        :anchor-el="prdTipAnchorRef"
        :tip-id="1"
        module-name="Banner管理（页头汇总）"
        :markdown="OPS_TIP_BANNER"
      />

      <div ref="prdTipFilterRef" class="glass-card ul-filter-card">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">标题</label>
            <input v-model="filters.title" type="text" class="ul-input" placeholder="关键字" />
          </div>
          <div class="ul-form-group">
            <label class="ul-label">展示页</label>
            <select v-model="filters.page" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="首页">首页</option>
              <option value="变现页">变现页</option>
              <option value="项目详情页">某品牌项目详情页</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">状态</label>
            <select v-model="filters.status" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="显示">显示</option>
              <option value="隐藏">隐藏</option>
              <option value="已删除">已删除</option>
            </select>
          </div>
        </div>
        <div class="ul-filter-footer">
          <span class="ul-hint">筛选结果 {{ filtered.length }} 条 / 全量 {{ data.length }} 条</span>
          <div style="display: flex; gap: 8px">
            <button type="button" class="btn btn-default btn-sm" @click="resetFilter">重置</button>
            <button type="button" class="btn btn-primary btn-sm" @click="page = 1">查询</button>
          </div>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">Banner列表<span class="table-count">本页 {{ pageRows.length }} 条</span></div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <colgroup>
              <col style="width: 64px" />
              <col style="width: 18%" />
              <col style="width: 72px" />
              <col style="width: 14%" />
              <col style="width: 72px" />
              <col style="width: 88px" />
              <col style="width: 16%" />
              <col style="width: 80px" />
              <col style="width: 80px" />
              <col style="width: 130px" />
              <col style="width: 100px" />
            </colgroup>
            <thead>
              <tr>
                <th>ID</th>
                <th>标题</th>
                <th>封面</th>
                <th>展示页</th>
                <th class="th-num">排序</th>
                <th>跳转类型</th>
                <th>跳转地址</th>
                <th>状态</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th ref="prdTipOpsRef" class="col-action" style="text-align: center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in pageRows" :key="r.id" class="ul-row">
                <td class="ul-mono">{{ r.id }}</td>
                <td style="font-weight: 600">{{ r.title }}</td>
                <td class="ul-muted" style="font-size: 12px">图</td>
                <td class="ul-muted" style="font-size: 12px">{{ r.pages }}</td>
                <td class="td-num">{{ r.sort }}</td>
                <td><span class="tag tag-purple">{{ r.jumpType }}</span></td>
                <td class="ul-muted" style="font-size: 12px">{{ r.jumpLabel }}</td>
                <td>
                  <span
                    class="badge"
                    :class="
                      r.status === '显示' ? 'badge-success' : r.status === '已删除' ? 'badge-warning' : 'badge-gray'
                    "
                    >{{ r.status }}</span
                  >
                </td>
                <td>{{ r.creator }}</td>
                <td class="ul-muted" style="font-size: 12px">{{ r.createdAt }}</td>
                <td class="col-action">
                  <div class="action-btns" style="justify-content: center">
                    <button type="button" class="action-btn edit" title="编辑" @click="openDrawer(r)">编辑</button>
                    <button type="button" class="action-btn delete" title="删除" @click="confirmDel(r)">删除</button>
                  </div>
                </td>
              </tr>
              <tr v-if="pageRows.length === 0">
                <td colspan="11">
                  <div class="ul-empty">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <div class="ul-empty-title">暂无数据</div>
                    <p class="ul-empty-desc">请调整筛选条件。</p>
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
          <div style="display: flex; gap: 4px">
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(1)">«</button>
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(page - 1)">‹</button>
            <button v-for="p in pageNums" :key="p" type="button" class="ul-pg-btn" :class="{ active: p === page }" @click="goPage(p)">{{ p }}</button>
            <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(page + 1)">›</button>
            <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(totalPages)">»</button>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted)">
            <span>每页</span>
            <select v-model.number="pageSize" class="ul-pg-size" @change="page = 1">
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
            <span>跳至</span>
            <input v-model="jumpInput" type="text" class="ul-input" style="width: 52px; height: 30px; padding: 0 8px; font-size: 12px" @keyup.enter="applyJump" />
            <button type="button" class="btn btn-default btn-sm" @click="applyJump">跳转</button>
          </div>
        </div>
      </div>

      <PrdTipMarker
        variant="filterCard"
        :anchor-el="prdTipFilterRef"
        :tip-id="2"
        module-name="Banner管理 · 筛选区"
        :markdown="OPS_TIP_BANNER_FILTER"
      />
      <PrdTipMarker
        variant="opsHeader"
        :anchor-el="prdTipOpsRef"
        :tip-id="3"
        module-name="Banner管理 · 操作列"
        :markdown="OPS_TIP_BANNER_OPS"
      />
    </div>

    <div class="ul-overlay" :class="{ show: dw }" @click.self="dw = false" />
    <aside class="ul-drawer" :class="{ show: dw }" style="width: min(520px, 96vw)" @click.stop>
      <div class="ul-drawer-header">
        <div class="ul-drawer-title">{{ form.id ? '编辑 Banner' : '新增 Banner' }}</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="dw = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-drawer-body" style="display: flex; flex-direction: column; gap: 12px">
        <div class="ul-form-group">
          <label class="ul-label">标题 <span style="color: var(--danger)">*</span></label>
          <input v-model="form.title" type="text" class="ul-input" />
        </div>
        <div class="ul-form-group">
          <label class="ul-label">跳转类型</label>
          <select v-model="form.jumpType" class="ul-input ul-select">
            <option value="公告">公告</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <div v-if="form.jumpType === '公告'" class="ul-form-group">
          <label class="ul-label">关联公告</label>
          <select v-model="form.linkAnn" class="ul-input ul-select">
            <option value="8001">五一活动总公告</option>
            <option value="8002">系统维护通知</option>
          </select>
        </div>
        <div v-else class="ul-form-group">
          <label class="ul-label">跳转 URL</label>
          <input v-model="form.url" type="text" class="ul-input" />
        </div>
        <div class="ul-form-group">
          <label class="ul-label">携带用户 ID</label>
          <select v-model="form.carry" class="ul-input ul-select">
            <option value="否">否</option>
            <option value="是">是</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">可见用户组（多选）</label>
          <div style="display: flex; flex-wrap: wrap; gap: 8px">
            <label v-for="x in visOptions" :key="x" class="ul-check-line">
              <input type="checkbox" :checked="visSet.has(x)" @change="toggleVis(x, $event)" />
              <span>{{ x }}</span>
            </label>
          </div>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">指定用户 ID</label>
          <textarea v-model="form.uids" class="ul-input" rows="2" placeholder="逗号分隔"></textarea>
        </div>
      </div>
      <div class="ul-drawer-footer">
        <button type="button" class="btn btn-default" @click="dw = false">取消</button>
        <button type="button" class="btn btn-primary" @click="save">保存</button>
      </div>
    </aside>

    <div class="ul-overlay" :class="{ show: delOpen }" @click.self="delOpen = false" />
    <div class="ul-modal flex-col" :class="{ show: delOpen }" style="width: 420px">
      <div class="ul-modal-header">
        <div class="ul-modal-title">确认删除</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="delOpen = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-modal-body">
        <p class="page-desc" style="margin: 0">将删除 Banner「{{ delTarget?.title }}」？（Mock）</p>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="delOpen = false">取消</button>
        <button type="button" class="btn btn-danger" @click="doDel">确认</button>
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
import PrdTipMarker from '@/components/prd/PrdTipMarker.vue'
import { useEscCloseStack } from '@/composables/useEscCloseStack'
import {
  OPS_TIP_BANNER,
  OPS_TIP_BANNER_FILTER,
  OPS_TIP_BANNER_OPS,
} from '@/prd-tips/opsDomainTips'
import { computed, ref, watch } from 'vue'
import { useSimpleToast } from './useOpsToast'

interface Row {
  id: string
  title: string
  pages: string
  sort: number
  jumpType: string
  jumpLabel: string
  status: string
  creator: string
  createdAt: string
}

function genBanners(n: number): Row[] {
  const pages = ['首页', '变现页', '首页、变现页', '项目详情页', '首页、项目详情页']
  const jt = ['公告', '其他']
  const st = ['显示', '隐藏', '显示', '显示', '已删除']
  return Array.from({ length: n }, (_, i) => ({
    id: `B${500 + i}`,
    title: `Banner位-${String(i + 1).padStart(2, '0')}-${(i * 3) % 50} 投放`,
    pages: pages[i % pages.length],
    sort: 20 - (i % 15),
    jumpType: jt[i % 2],
    jumpLabel: i % 2 === 0 ? `关联公告-${(i % 5) + 1}` : `https://m.example.com/u/${i}`,
    status: st[i % st.length],
    creator: ['运营A', '运营B'][i % 2],
    createdAt: `2026-04-${String((i % 27) + 1).padStart(2, '0')} 10:${String(i % 60).padStart(2, '0')}`,
  }))
}

const { toasts, toast, removeToast } = useSimpleToast()
const filters = ref({ title: '', page: '', status: '' })
const prdTipAnchorRef = ref<HTMLElement | null>(null)
const prdTipFilterRef = ref<HTMLElement | null>(null)
const prdTipOpsRef = ref<HTMLElement | null>(null)
const data = ref(genBanners(22))

const filtered = computed(() =>
  data.value.filter((r) => {
    if (filters.value.title && !r.title.includes(filters.value.title)) return false
    if (filters.value.page && !r.pages.includes(filters.value.page)) return false
    if (filters.value.status && r.status !== filters.value.status) return false
    return true
  })
)

const page = ref(1)
const pageSize = ref(10)
const jumpInput = ref('1')
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const pageRows = computed(() => {
  const s = (page.value - 1) * pageSize.value
  return filtered.value.slice(s, s + pageSize.value)
})
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

const dw = ref(false)
const delOpen = ref(false)
const delTarget = ref<Row | null>(null)

useEscCloseStack([
  { isOpen: () => delOpen.value, close: () => (delOpen.value = false) },
  { isOpen: () => dw.value, close: () => (dw.value = false) },
])

function resetFilter() {
  filters.value = { title: '', page: '', status: '' }
  page.value = 1
  jumpInput.value = '1'
}

function confirmDel(r: Row) {
  delTarget.value = r
  delOpen.value = true
}
function doDel() {
  if (delTarget.value) data.value = data.value.filter((x) => x.id !== delTarget.value!.id)
  delOpen.value = false
  toast('已删除（Mock）', 'success')
}

function goPage(p: number) {
  page.value = Math.min(Math.max(1, p), totalPages.value)
  jumpInput.value = String(page.value)
}
function applyJump() {
  const n = parseInt(jumpInput.value.trim(), 10)
  if (Number.isNaN(n) || n < 1) {
    toast('请输入有效页码', 'error')
    return
  }
  goPage(Math.min(n, totalPages.value))
}

const visOptions = ['全部', 'LV1', 'LV2', '高级会员']
const visSet = ref(new Set<string>(['LV1']))

function toggleVis(x: string, e: Event) {
  const on = (e.target as HTMLInputElement).checked
  const s = new Set(visSet.value)
  if (on) s.add(x)
  else s.delete(x)
  visSet.value = s
}

const form = ref({
  id: '' as string,
  title: '',
  jumpType: '公告' as '公告' | '其他',
  linkAnn: '8001',
  url: '',
  carry: '否',
  uids: '',
})

function openDrawer(r?: Row) {
  visSet.value = r ? new Set(['LV1', '高级会员']) : new Set(['LV1'])
  form.value = {
    id: r?.id ?? '',
    title: r?.title ?? '',
    jumpType: (r?.jumpType as '公告' | '其他') ?? '公告',
    linkAnn: '8001',
    url: 'https://',
    carry: '否',
    uids: '',
  }
  dw.value = true
}
function save() {
  toast('已保存（Mock）', 'success')
  dw.value = false
}
</script>
