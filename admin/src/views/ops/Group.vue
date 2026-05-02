<template>
  <div class="ul-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">运营</span>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">社区管理</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">社群管理</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">社群管理</h1>
          <p class="page-desc">隶属社区分类下的社群；prd-admin §7.2.2（Mock，≥20 条，默认每页 10 条）。</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" @click="openDw()">新增社群</button>
      </div>

      <div class="glass-card ul-filter-card">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">所属分类</label>
            <select v-model="filters.catId" class="ul-input ul-select">
              <option value="">全部</option>
              <option v-for="c in catOptions" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">社群名称</label>
            <input v-model="filters.name" type="text" class="ul-input" placeholder="关键字" />
          </div>
        </div>
        <div class="ul-filter-footer">
          <span class="ul-hint">筛选结果 {{ filtered.length }} 条 / 全量 {{ all.length }} 条</span>
          <div style="display: flex; gap: 8px">
            <button type="button" class="btn btn-default btn-sm" @click="resetFilter">重置</button>
            <button type="button" class="btn btn-primary btn-sm" @click="applyFilter">查询</button>
          </div>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">社群列表<span class="table-count">本页 {{ pageRows.length }} 条</span></div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <colgroup>
              <col style="width: 56px" />
              <col style="width: 56px" />
              <col style="width: 12%" />
              <col style="width: 14%" />
              <col style="width: 16%" />
              <col style="width: 12%" />
              <col style="width: 72px" />
              <col style="width: 88px" />
              <col style="width: 72px" />
              <col style="width: 72px" />
              <col style="width: 64px" />
              <col style="width: 72px" />
              <col style="width: 80px" />
              <col style="width: 130px" />
              <col style="width: 100px" />
            </colgroup>
            <thead>
              <tr>
                <th>ID</th>
                <th>图标</th>
                <th>所属社区</th>
                <th>社群名称</th>
                <th>社群描述</th>
                <th>社群标签</th>
                <th>角标</th>
                <th>负责人</th>
                <th class="th-num">成员数量</th>
                <th class="th-num">收藏人数</th>
                <th class="th-num">排序</th>
                <th>状态</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th class="col-action" style="text-align: center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in pageRows" :key="r.id" class="ul-row">
                <td class="ul-mono">{{ r.id }}</td>
                <td class="ul-muted" style="font-size: 11px">图</td>
                <td>{{ r.catName }}</td>
                <td style="font-weight: 600">{{ r.name }}</td>
                <td class="ul-muted" style="font-size: 12px">{{ r.desc }}</td>
                <td class="ul-muted" style="font-size: 11px">{{ r.tags }}</td>
                <td>{{ r.badge || '—' }}</td>
                <td>{{ r.owner }}</td>
                <td class="td-num">{{ r.members }}</td>
                <td class="td-num">{{ r.favs }}</td>
                <td class="td-num">{{ r.sort }}</td>
                <td>
                  <span class="badge" :class="r.status === '显示' ? 'badge-success' : 'badge-gray'">{{ r.status }}</span>
                </td>
                <td>{{ r.creator }}</td>
                <td class="ul-muted" style="font-size: 12px">{{ r.createdAt }}</td>
                <td class="col-action">
                  <div class="action-btns" style="justify-content: center">
                    <button type="button" class="action-btn edit" title="编辑" @click="openDw(r)">编辑</button>
                    <button type="button" class="action-btn delete" title="删除" @click="confirmDel(r)">删除</button>
                  </div>
                </td>
              </tr>
              <tr v-if="pageRows.length === 0">
                <td colspan="15">
                  <div class="ul-empty">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    <div class="ul-empty-title">暂无社群</div>
                    <p class="ul-empty-desc">请调整筛选条件。</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="filtered.length > 0" class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ filtered.length }}</strong> 条，第 <strong>{{ page }}</strong> / <strong>{{ totalPages }}</strong> 页</span>
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

    <div class="ul-overlay" :class="{ show: dw }" @click.self="dw = false" />
    <aside class="ul-drawer" :class="{ show: dw }" style="width: min(560px, 96vw)" @click.stop>
      <div class="ul-drawer-header">
        <div class="ul-drawer-title">{{ form.id ? '编辑社群' : '新增社群' }}</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="dw = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-drawer-body">
        <div class="ul-drawer-section">
          <div class="ul-section-title"><span class="ul-section-dot"></span>基础信息</div>
          <div style="display: flex; flex-direction: column; gap: 12px">
            <div class="ul-form-group">
              <label class="ul-label">所属社区</label>
              <select v-model="form.catId" class="ul-input ul-select">
                <option v-for="c in catOptions" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div class="ul-form-group">
              <label class="ul-label">社群名称 <span style="color: var(--danger)">*</span></label>
              <input v-model="form.name" type="text" class="ul-input" />
            </div>
            <div class="ul-form-group">
              <label class="ul-label">社群描述</label>
              <input v-model="form.desc" type="text" class="ul-input" />
            </div>
            <div class="ul-form-group">
              <label class="ul-label">社群标签（逗号分隔）</label>
              <input v-model="form.tags" type="text" class="ul-input" />
            </div>
            <div class="ul-form-group">
              <label class="ul-label">角标</label>
              <input v-model="form.badge" type="text" class="ul-input" />
            </div>
            <div class="ul-form-group">
              <label class="ul-label">状态</label>
              <select v-model="form.status" class="ul-input ul-select">
                <option value="显示">显示</option>
                <option value="隐藏">隐藏</option>
              </select>
            </div>
            <p class="page-desc" style="margin: 0">图标、社群二维码上传为 Mock。</p>
          </div>
        </div>
        <div class="ul-drawer-section">
          <div class="ul-section-title"><span class="ul-section-dot"></span>负责人信息</div>
          <div style="display: flex; flex-direction: column; gap: 12px">
            <div class="ul-form-group">
              <label class="ul-label">名称</label>
              <input v-model="form.ownerName" type="text" class="ul-input" />
            </div>
            <div class="ul-form-group">
              <label class="ul-label">右豹 ID</label>
              <input v-model="form.ownerUid" type="text" class="ul-input" />
            </div>
            <div class="ul-form-group">
              <label class="ul-label">微信号 / 飞书号</label>
              <input v-model="form.wx" type="text" class="ul-input" placeholder="微信号" />
              <input v-model="form.fs" type="text" class="ul-input" placeholder="飞书号" style="margin-top: 8px" />
            </div>
          </div>
        </div>
        <div class="ul-drawer-section">
          <div class="ul-section-title"><span class="ul-section-dot"></span>社群详情（富文本 Mock）</div>
          <textarea v-model="form.detail" class="ul-input" rows="4"></textarea>
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
        <p class="page-desc" style="margin: 0">将删除社群「{{ delTarget?.name }}」？（Mock）</p>
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
import { useEscCloseStack } from '@/composables/useEscCloseStack'
import { computed, ref, watch } from 'vue'
import { useSimpleToast } from './useOpsToast'

interface G {
  id: string
  catId: string
  catName: string
  name: string
  desc: string
  tags: string
  badge: string
  owner: string
  members: number
  favs: number
  sort: number
  status: string
  creator: string
  createdAt: string
}

const catOptions = [
  { id: 'CM01', name: '官方社群' },
  { id: 'CM02', name: '项目交流' },
  { id: 'CM03', name: '导师专区' },
]

function genGroups(n: number): G[] {
  return Array.from({ length: n }, (_, i) => {
    const c = catOptions[i % catOptions.length]
    return {
      id: `G${200 + i}`,
      catId: c.id,
      catName: c.name,
      name: `社群-${String(i + 1).padStart(2, '0')}-${(i * 5) % 40}`,
      desc: `简介 ${i % 7}`,
      tags: `标签${i % 3},交流`,
      badge: i % 6 === 0 ? '荐' : '',
      owner: ['小豹', '老王', '阿狸'][i % 3],
      members: 200 + i * 80,
      favs: 10 + (i % 50),
      sort: 15 - (i % 10),
      status: i % 7 === 0 ? '隐藏' : '显示',
      creator: ['运营A', '运营B'][i % 2],
      createdAt: `2026-04-${String((i % 27) + 1).padStart(2, '0')}`,
    }
  })
}

const { toasts, toast, removeToast } = useSimpleToast()
const all = ref(genGroups(22))
const filters = ref({ catId: '', name: '' })

const filtered = computed(() =>
  all.value.filter((r) => {
    if (filters.value.catId && r.catId !== filters.value.catId) return false
    if (filters.value.name && !r.name.includes(filters.value.name)) return false
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

function resetFilter() {
  filters.value = { catId: '', name: '' }
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

const dw = ref(false)
const delOpen = ref(false)
const delTarget = ref<G | null>(null)

useEscCloseStack([
  { isOpen: () => delOpen.value, close: () => (delOpen.value = false) },
  { isOpen: () => dw.value, close: () => (dw.value = false) },
])

function confirmDel(r: G) {
  delTarget.value = r
  delOpen.value = true
}
function doDel() {
  if (delTarget.value) all.value = all.value.filter((x) => x.id !== delTarget.value!.id)
  delOpen.value = false
  toast('已删除（Mock）', 'success')
}

const form = ref({
  id: '',
  catId: 'CM01',
  name: '',
  desc: '',
  tags: '',
  badge: '',
  status: '显示',
  ownerName: '',
  ownerUid: '',
  wx: '',
  fs: '',
  detail: '',
})

function openDw(r?: G) {
  form.value = r
    ? {
        id: r.id,
        catId: r.catId,
        name: r.name,
        desc: r.desc,
        tags: r.tags,
        badge: r.badge,
        status: r.status,
        ownerName: r.owner,
        ownerUid: 'U10001',
        wx: 'wx_mock',
        fs: '',
        detail: '社群详情示例…',
      }
    : {
        id: '',
        catId: 'CM01',
        name: '',
        desc: '',
        tags: '',
        badge: '',
        status: '显示',
        ownerName: '',
        ownerUid: '',
        wx: '',
        fs: '',
        detail: '',
      }
  dw.value = true
}

function save() {
  if (!form.value.name.trim()) {
    toast('请填写社群名称', 'error')
    return
  }
  toast('已保存（Mock）', 'success')
  dw.value = false
}
</script>

