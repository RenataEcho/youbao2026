<template>
  <div class="ul-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">运营</span>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">社区管理</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">社区管理</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">社区管理（分类）</h1>
          </div>
          <p class="page-desc">社区大类；prd-admin §7.2.1（Mock，≥20 条，默认每页 10 条）。</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" @click="openModal()">新增分类</button>
      </div>

      <PrdTipMarker
        :anchor-el="prdTipAnchorRef"
        :tip-id="1"
        module-name="社区管理（页头汇总）"
        :markdown="OPS_TIP_COMMUNITY"
      />

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">分类列表<span class="table-count">本页 {{ listPg.pageRows.length }} 条</span></div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <thead>
              <tr>
                <th>ID</th>
                <th>图标</th>
                <th>社区名称</th>
                <th>社区描述</th>
                <th>角标</th>
                <th class="th-num">社群数量</th>
                <th class="th-num">成员数量</th>
                <th class="th-num">排序</th>
                <th>状态</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th ref="prdTipOpsRef" class="col-action" style="text-align: center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in listPg.pageRows" :key="r.id" class="ul-row">
                <td class="ul-mono">{{ r.id }}</td>
                <td class="ul-muted" style="font-size: 12px">图</td>
                <td style="font-weight: 600">{{ r.name }}</td>
                <td class="ul-muted" style="font-size: 12px">{{ r.desc }}</td>
                <td>{{ r.badge || '—' }}</td>
                <td class="td-num">{{ r.groupCount }}</td>
                <td class="td-num">{{ r.memberCount }}</td>
                <td class="td-num">{{ r.sort }}</td>
                <td>
                  <span class="badge" :class="r.status === '显示' ? 'badge-success' : 'badge-gray'">{{ r.status }}</span>
                </td>
                <td>{{ r.creator }}</td>
                <td class="ul-muted" style="font-size: 12px">{{ r.createdAt }}</td>
                <td class="col-action">
                  <div class="action-btns" style="justify-content: center">
                    <button type="button" class="action-btn edit" title="编辑" @click="openModal(r)">编辑</button>
                    <button type="button" class="action-btn delete" title="删除" @click="confirmDel(r)">删除</button>
                  </div>
                </td>
              </tr>
              <tr v-if="listPg.pageRows.length === 0">
                <td colspan="12">
                  <div class="ul-empty">
                    <div class="ul-empty-title">暂无分类</div>
                    <p class="ul-empty-desc">暂无数据。</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="rows.length > 0" class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ rows.length }}</strong> 条，第 <strong>{{ listPg.page }}</strong> / <strong>{{ listPg.totalPages }}</strong> 页</span>
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
            <select v-model.number="pageSize" class="ul-pg-size" @change="listPg.resetPage()">
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
        variant="opsHeader"
        :anchor-el="prdTipOpsRef"
        :tip-id="2"
        module-name="社区管理（分类）· 操作列"
        :markdown="OPS_TIP_COMMUNITY_OPS"
      />
    </div>

    <div class="ul-overlay" :class="{ show: modal }" @click.self="modal = false" />
    <div class="ul-modal flex-col" :class="{ show: modal }" style="width: 440px">
      <div class="ul-modal-header">
        <div class="ul-modal-title">{{ form.id ? '编辑分类' : '新增分类' }}</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="modal = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-modal-body" style="display: flex; flex-direction: column; gap: 12px">
        <div class="ul-form-group">
          <label class="ul-label">社区名称 <span style="color: var(--danger)">*</span></label>
          <input v-model="form.name" type="text" class="ul-input" />
        </div>
        <div class="ul-form-group">
          <label class="ul-label">社区描述</label>
          <textarea v-model="form.desc" class="ul-input" rows="2" placeholder="摘要描述"></textarea>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">角标</label>
          <input v-model="form.badge" type="text" class="ul-input" />
        </div>
        <div class="ul-form-group">
          <label class="ul-label">排序</label>
          <input v-model.number="form.sort" type="number" class="ul-input" />
        </div>
        <div class="ul-form-group">
          <label class="ul-label">状态</label>
          <select v-model="form.status" class="ul-input ul-select">
            <option value="显示">显示</option>
            <option value="隐藏">隐藏</option>
          </select>
        </div>
        <p class="page-desc" style="margin: 0">图标上传为 Mock，对接后替换。</p>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="modal = false">取消</button>
        <button type="button" class="btn btn-primary" @click="save">保存</button>
      </div>
    </div>

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
        <p class="page-desc" style="margin: 0">将删除社区分类「{{ delTarget?.name }}」？（Mock）</p>
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
import { useOpsListPagination } from '@/composables/useOpsListPagination'
import { OPS_TIP_COMMUNITY, OPS_TIP_COMMUNITY_OPS } from '@/prd-tips/opsDomainTips'
import { ref } from 'vue'
import { useSimpleToast } from './useOpsToast'

interface Row {
  id: string
  name: string
  desc: string
  badge: string
  groupCount: number
  memberCount: number
  sort: number
  status: string
  creator: string
  createdAt: string
}

function genRows(n: number): Row[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `CM${String(i + 1).padStart(2, '0')}`,
    name: `社区分类-${String(i + 1).padStart(2, '0')}`,
    desc: `摘要描述 ${(i * 3) % 20}`,
    badge: i % 4 === 0 ? '热' : '',
    groupCount: 2 + (i % 12),
    memberCount: 1000 + i * 500,
    sort: 20 - (i % 15),
    status: i % 8 === 0 ? '隐藏' : '显示',
    creator: ['运营A', '运营B'][i % 2],
    createdAt: `2026-03-${String((i % 28) + 1).padStart(2, '0')}`,
  }))
}

const { toasts, toast, removeToast } = useSimpleToast()
const prdTipAnchorRef = ref<HTMLElement | null>(null)
const prdTipOpsRef = ref<HTMLElement | null>(null)
const rows = ref(genRows(22))
const pageSize = ref(10)
const listPg = useOpsListPagination(rows, pageSize, (msg) => toast(msg, 'error'))

const modal = ref(false)
const delOpen = ref(false)
const delTarget = ref<Row | null>(null)

useEscCloseStack([
  { isOpen: () => delOpen.value, close: () => (delOpen.value = false) },
  { isOpen: () => modal.value, close: () => (modal.value = false) },
])

const form = ref({ id: '', name: '', desc: '', badge: '', sort: 0, status: '显示' })

function openModal(r?: Row) {
  form.value = r
    ? { id: r.id, name: r.name, desc: r.desc, badge: r.badge, sort: r.sort, status: r.status }
    : { id: '', name: '', desc: '', badge: '', sort: 0, status: '显示' }
  modal.value = true
}

function save() {
  if (!form.value.name.trim()) {
    toast('请填写社区名称', 'error')
    return
  }
  toast('已保存（Mock）', 'success')
  modal.value = false
}

function confirmDel(r: Row) {
  delTarget.value = r
  delOpen.value = true
}
function doDel() {
  if (delTarget.value) rows.value = rows.value.filter((x) => x.id !== delTarget.value!.id)
  delOpen.value = false
  toast('已删除（Mock）', 'success')
}
</script>
