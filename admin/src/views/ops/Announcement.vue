<template>
  <div class="ul-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">运营</span>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">运营配置</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">公告管理</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">公告管理</h1>
          </div>
          <p class="page-desc">维护平台公告与触达规则；prd-admin §7.1.1（Mock，全量 ≥20 条，默认每页 10 条）。</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" @click="openDrawer()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          新增公告
        </button>
      </div>

      <PrdTipMarker
        :anchor-el="prdTipAnchorRef"
        :tip-id="1"
        module-name="公告管理（页头汇总）"
        :markdown="OPS_TIP_ANNOUNCEMENT"
      />

      <div ref="prdTipFilterRef" class="glass-card ul-filter-card">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">标题</label>
            <input v-model="filters.title" type="text" class="ul-input" placeholder="关键字模糊匹配" />
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
          <span class="ul-hint">筛选结果 {{ filteredRows.length }} 条 / 全量 {{ raw.length }} 条</span>
          <div style="display: flex; gap: 8px">
            <button type="button" class="btn btn-default btn-sm" @click="resetFilter">重置</button>
            <button type="button" class="btn btn-primary btn-sm" @click="applyFilter">查询</button>
          </div>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">公告列表<span class="table-count">本页 {{ pageRows.length }} 条</span></div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <colgroup>
              <col style="width: 72px" />
              <col style="width: 18%" />
              <col style="width: 88px" />
              <col style="width: 16%" />
              <col style="width: 100px" />
              <col style="width: 14%" />
              <col style="width: 88px" />
              <col style="width: 88px" />
              <col style="width: 140px" />
              <col style="width: 120px" />
            </colgroup>
            <thead>
              <tr>
                <th>ID</th>
                <th>标题</th>
                <th>封面</th>
                <th>展示页</th>
                <th>公告类型</th>
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
                <td>
                  <span class="ul-muted" style="font-size: 12px">{{ r.coverHint }}</span>
                </td>
                <td class="ul-muted" style="font-size: 12px">{{ r.pages }}</td>
                <td><span class="tag tag-blue">{{ r.annType }}</span></td>
                <td class="ul-muted" style="font-size: 12px; max-width: 180px" :title="r.jump || undefined">{{ r.jump || '—' }}</td>
                <td>
                  <span
                    class="badge"
                    :class="
                      r.status === '显示' ? 'badge-success' : r.status === '隐藏' ? 'badge-gray' : 'badge-warning'
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
                <td colspan="10">
                  <div class="ul-empty">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                      <rect x="3" y="4" width="18" height="16" rx="2" />
                      <path d="M7 8h10M7 12h6" />
                    </svg>
                    <div class="ul-empty-title">暂无数据</div>
                    <p class="ul-empty-desc">请调整筛选条件后重试。</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="filteredRows.length > 0" class="ul-pagination">
          <span class="ul-page-info"
            >共 <strong>{{ filteredRows.length }}</strong> 条，第 <strong>{{ page }}</strong> / <strong>{{ totalPages }}</strong> 页</span
          >
          <div style="display: flex; align-items: center; gap: 4px">
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(1)">«</button>
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(page - 1)">‹</button>
            <button v-for="p in pageNums" :key="p" type="button" class="ul-pg-btn" :class="{ active: p === page }" @click="goPage(p)">
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
        module-name="公告管理 · 筛选区"
        :markdown="OPS_TIP_ANNOUNCEMENT_FILTER"
      />
      <PrdTipMarker
        variant="opsHeader"
        :anchor-el="prdTipOpsRef"
        :tip-id="3"
        module-name="公告管理 · 操作列"
        :markdown="OPS_TIP_ANNOUNCEMENT_OPS"
      />
    </div>

    <div class="ul-overlay" :class="{ show: drawerOpen }" @click.self="drawerOpen = false" />
    <aside class="ul-drawer" :class="{ show: drawerOpen }" style="width: min(560px, 96vw)" @click.stop>
      <div class="ul-drawer-header">
        <div class="ul-drawer-title">{{ editId ? '编辑公告' : '新增公告' }}</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="drawerOpen = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-drawer-body" style="display: flex; flex-direction: column; gap: 14px">
        <div class="ul-form-group">
          <label class="ul-label">标题 <span style="color: var(--danger)">*</span></label>
          <input v-model="form.title" type="text" class="ul-input" />
        </div>
        <div class="ul-form-group">
          <label class="ul-label">公告类型</label>
          <select v-model="form.annType" class="ul-input ul-select">
            <option value="海报公告">海报公告</option>
            <option value="文字公告">文字公告</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">展示页（多选 Mock）</label>
          <div style="display: flex; flex-wrap: wrap; gap: 8px">
            <label v-for="p in pageOpts" :key="p" class="ul-check-line" style="margin: 0">
              <input type="checkbox" :checked="form.pageSet.has(p)" @change="togglePage(p, $event)" />
              <span>{{ p }}</span>
            </label>
          </div>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">跳转地址</label>
          <input v-model="form.jump" type="text" class="ul-input" placeholder="可选" />
        </div>
        <div class="ul-form-group">
          <label class="ul-label">携带用户 ID</label>
          <select v-model="form.carryUid" class="ul-input ul-select">
            <option value="否">否</option>
            <option value="是">是</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">可见用户组（来源：用户等级表，多选）</label>
          <div style="display: flex; flex-wrap: wrap; gap: 8px">
            <label v-for="lv in levelOpts" :key="lv" class="ul-check-line" style="margin: 0">
              <input type="checkbox" :checked="form.levelSet.has(lv)" @change="toggleLv(lv, $event)" />
              <span>{{ lv }}</span>
            </label>
          </div>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">指定用户 ID</label>
          <textarea v-model="form.userIds" class="ul-input" rows="2" placeholder="英文逗号分隔用户 ID，单次最多 500 个"></textarea>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">弹窗文案（富文本 Mock）</label>
          <textarea v-model="form.richPopup" class="ul-input" rows="3"></textarea>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">详情页内容（富文本 Mock）</label>
          <textarea v-model="form.richDetail" class="ul-input" rows="3"></textarea>
        </div>
      </div>
      <div class="ul-drawer-footer">
        <button type="button" class="btn btn-default" @click="drawerOpen = false">取消</button>
        <button type="button" class="btn btn-primary" @click="saveDrawer">保存</button>
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
        <p class="page-desc" style="margin: 0">将逻辑删除公告「{{ delTarget?.title }}」？（Mock）</p>
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
  OPS_TIP_ANNOUNCEMENT,
  OPS_TIP_ANNOUNCEMENT_FILTER,
  OPS_TIP_ANNOUNCEMENT_OPS,
} from '@/prd-tips/opsDomainTips'
import { computed, ref, watch } from 'vue'
import { useSimpleToast } from './useOpsToast'

interface AnnRow {
  id: string
  title: string
  coverHint: string
  pages: string
  annType: string
  jump: string
  status: string
  creator: string
  createdAt: string
}

function genAnnouncements(n: number): AnnRow[] {
  const st = ['显示', '隐藏', '显示', '显示', '已删除']
  const types: ('海报公告' | '文字公告')[] = ['海报公告', '文字公告']
  const pageVariants = ['首页', '变现页', '首页、变现页', '首页、项目详情页', '变现页']
  return Array.from({ length: n }, (_, i) => ({
    id: String(8000 + i),
    title: `平台公告-${String(i + 1).padStart(2, '0')}-${(i * 11) % 97} 活动说明`,
    coverHint: i % 3 === 0 ? '图' : '—',
    pages: pageVariants[i % pageVariants.length],
    annType: types[i % 2],
    jump: i % 4 === 0 ? '' : `https://example.com/a/${i}`,
    status: st[i % st.length],
    creator: ['运营A', '运营B', '运营C'][i % 3],
    createdAt: `2026-04-${String((i % 28) + 1).padStart(2, '0')} ${String(8 + (i % 10)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
  }))
}

const { toasts, toast, removeToast } = useSimpleToast()

const filters = ref({ title: '', page: '', status: '' })
const prdTipAnchorRef = ref<HTMLElement | null>(null)
const prdTipFilterRef = ref<HTMLElement | null>(null)
const prdTipOpsRef = ref<HTMLElement | null>(null)
const raw = ref(genAnnouncements(22))

const filteredRows = computed(() =>
  raw.value.filter((r) => {
    if (filters.value.title && !r.title.includes(filters.value.title)) return false
    if (filters.value.page && !r.pages.includes(filters.value.page)) return false
    if (filters.value.status && r.status !== filters.value.status) return false
    return true
  })
)

const page = ref(1)
const pageSize = ref(10)
const jumpInput = ref('1')
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)))
const pageRows = computed(() => {
  const s = (page.value - 1) * pageSize.value
  return filteredRows.value.slice(s, s + pageSize.value)
})
const pageNums = computed(() => {
  const out: number[] = []
  const s = Math.max(1, page.value - 2)
  const e = Math.min(totalPages.value, page.value + 2)
  for (let i = s; i <= e; i++) out.push(i)
  return out
})

watch([filteredRows, pageSize], () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})
watch(page, (p) => {
  jumpInput.value = String(p)
})

const delOpen = ref(false)
const drawerOpen = ref(false)
const delTarget = ref<AnnRow | null>(null)
const editId = ref<string | null>(null)

useEscCloseStack([
  { isOpen: () => delOpen.value, close: () => (delOpen.value = false) },
  { isOpen: () => drawerOpen.value, close: () => (drawerOpen.value = false) },
])

function resetFilter() {
  filters.value = { title: '', page: '', status: '' }
  page.value = 1
}
function applyFilter() {
  page.value = 1
  toast('已应用筛选', 'info')
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

const pageOpts = ['首页', '变现页', '项目详情页']
const levelOpts = ['LV1', 'LV2', 'LV3', 'LV4', '高级会员']

const form = ref({
  title: '',
  annType: '文字公告' as '海报公告' | '文字公告',
  pageSet: new Set<string>(),
  jump: '',
  carryUid: '否',
  levelSet: new Set<string>(),
  userIds: '',
  richPopup: '',
  richDetail: '',
})

function openDrawer(row?: AnnRow) {
  editId.value = row?.id ?? null
  if (row) {
    form.value = {
      title: row.title,
      annType: row.annType as '海报公告' | '文字公告',
      pageSet: new Set(['首页']),
      jump: row.jump,
      carryUid: '否',
      levelSet: new Set(['LV2', 'LV3']),
      userIds: '',
      richPopup: '弹窗文案示例',
      richDetail: '详情页内容示例',
    }
  } else {
    form.value = {
      title: '',
      annType: '文字公告',
      pageSet: new Set(['首页']),
      jump: '',
      carryUid: '否',
      levelSet: new Set(),
      userIds: '',
      richPopup: '',
      richDetail: '',
    }
  }
  drawerOpen.value = true
}

function togglePage(p: string, e: Event) {
  const on = (e.target as HTMLInputElement).checked
  const s = new Set(form.value.pageSet)
  if (on) s.add(p)
  else s.delete(p)
  form.value.pageSet = s
}
function toggleLv(lv: string, e: Event) {
  const on = (e.target as HTMLInputElement).checked
  const s = new Set(form.value.levelSet)
  if (on) s.add(lv)
  else s.delete(lv)
  form.value.levelSet = s
}

function saveDrawer() {
  if (!form.value.title.trim()) {
    toast('请填写标题', 'error')
    return
  }
  toast(editId.value ? '已保存（Mock）' : '已新增（Mock）', 'success')
  drawerOpen.value = false
}

function confirmDel(r: AnnRow) {
  delTarget.value = r
  delOpen.value = true
}
function doDel() {
  if (delTarget.value) raw.value = raw.value.filter((x) => x.id !== delTarget.value!.id)
  delOpen.value = false
  toast('已删除（Mock）', 'success')
}
</script>

